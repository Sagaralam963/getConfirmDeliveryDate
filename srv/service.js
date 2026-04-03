const cds = require('@sap/cds');

module.exports = async (srv) => {

  const BP = await cds.connect.to("API_BUSINESS_PARTNER");
  const S4SO = await cds.connect.to("API_SALES_ORDER_SRV");

  const { BusinessPartner, SalesOrder, SalesOrderScheduleLine } = srv.entities;

  function isCustomerNumber(input) {
    // safest: only digits => number
    return typeof input === 'string' && /^[0-9]+$/.test(input.trim());
  }

  async function getCustomerId(req, customerName) {

    const name = customerName.trim();
    let rows = await BP.tx(req).run(
      SELECT.from('A_BusinessPartner')
        .columns('BusinessPartner', 'BusinessPartnerName', 'Customer')
        .where({ BusinessPartnerName: name })
        .limit(5)
    );
    if (!rows || rows.length === 0) {
      const pattern = `%${name}%`;
      rows = await BP.tx(req).run(
        SELECT.from('A_BusinessPartner')
          .columns('BusinessPartner', 'BusinessPartnerFullName', 'OrganizationBPName1', 'Customer')
          .where({ OrganizationBPName1: { like: pattern } })
          .limit(5)
      );
    }
    if (!rows || rows.length === 0) return null;
    return rows[0].BusinessPartner;
  }

  srv.on('READ', 'SalesOrder', async (req) => {
    return S4SO.run(req.query);
  })

  srv.on('getOpenSalesOrder', async (req) => {
    const {bp} = req.data;
    let customerId = bp;
    if (!isCustomerNumber(bp)) {
      customerId = await getCustomerId(req, bp);
      if (!customerId) return [];
    }

    const q = SELECT.from('A_SalesOrder').columns('SalesOrder', 'SoldToParty', 'SalesGroup', 'SalesOrderDate', 'TotalNetAmount', 'TransactionCurrency', 'OverallDeliveryStatus').where`SoldToParty = ${customerId} and OverallDeliveryStatus != 'C' and OverallDeliveryStatus != ''`
    const orders = await S4SO.tx(req).run(q);

    return orders || [];
  })

  srv.on('READ', 'BusinessPartner', async (req) => {
    return BP.run(req.query);
  })



  srv.on('READ', 'SalesOrderScheduleLine', async (req) => {
    return S4SO.run(req.query);
  })

  srv.on('getConfirmDeliveryDate', async (req) => {

    const {bp} = req.data;
    let customerId = bp;
    if (!isCustomerNumber(bp)) {
      customerId = await getCustomerId(req, bp);
      if (!customerId) return [];
    }

    // Step 1: get open sales orders first
    const openOrders = await S4SO.tx(req).run(
      SELECT.from('A_SalesOrder')
        .columns('SalesOrder')
        .where({
          SoldToParty: customerId,
          OverallDeliveryStatus: { '!=': 'C' }
        })
    );

    const salesOrders = openOrders.map(o => o.SalesOrder);

    if (salesOrders.length === 0) return [];

    // Step 2: get confirmed delivery dates
    const q = SELECT.from('SalesOrderScheduleLine')
      .columns(
        'SalesOrder',
        'SalesOrderItem',
        'ScheduleLine',
        'ConfirmedDeliveryDate'
      )
      .where({
        SalesOrder: { in: salesOrders }
      });

    return await S4SO.tx(req).run(q);
  });


}