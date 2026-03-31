using CE_SALESORDER_0001 as so from './external/CE_SALESORDER_0001';

using API_SALES_ORDER_SRV as SO from './external/API_SALES_ORDER_SRV';

using API_BUSINESS_PARTNER as S4 from './external/API_BUSINESS_PARTNER';

service SalesOrderService {

  entity SalesOrder             as
    projection on SO.A_SalesOrder {
      key SalesOrder,
          SalesOrderDate,
          SalesGroup,
          SoldToParty,
          TotalNetAmount,
          TransactionCurrency,
          OverallDeliveryStatus
    }

  function getOpenSalesOrder(bp: String)      returns many SalesOrder;


  entity SalesOrderScheduleLine as
    projection on SO.A_SalesOrderScheduleLine {

      key SalesOrder,
      key SalesOrderItem,
      key ScheduleLine,
          RequestedDeliveryDate,
          ConfirmedDeliveryDate,
          OrderQuantityUnit,
          OrderQuantitySAPUnit,
          OrderQuantityISOUnit,
          ScheduleLineOrderQuantity,
          ConfdOrderQtyByMatlAvailCheck,
          DeliveredQtyInOrderQtyUnit,
          OpenConfdDelivQtyInOrdQtyUnit,
          CorrectedQtyInOrderQtyUnit,
          DelivBlockReasonForSchedLine

    }

    function getConfirmDeliveryDate(bp: String) returns many SalesOrder;

}


service BusinessParnerService {

  entity BusinessPartner as
    projection on S4.A_BusinessPartner {
      key BusinessPartner,
          Customer,
          BusinessPartnerName
    }


  

}
