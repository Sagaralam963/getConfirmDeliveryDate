const cds = require('@sap/cds');
const { SELECT } = require('@sap/cds/lib/ql/cds-ql');

module.exports = async (srv) => {

  const BP = await cds.connect.to("API_BUSINESS_PARTNER");

  srv.on('READ', 'BusinessPartner', (req) => {
    return BP.run(req.query);
  });

  srv.on('getConfirmDeliveryDate', async (req) => {
    const { bp } = req.data;

    const result = await BP.run(
      SELECT.from('A_BusinessPartner').where({ BusinessPartner: bp })
    );

    return "OK";

  });
};