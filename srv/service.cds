using API_SALES_ORDER_SRV as SO from './external/API_SALES_ORDER_SRV';

using API_BUSINESS_PARTNER as S4 from './external/API_BUSINESS_PARTNER';

service SalesOrderService {

  entity A_SalesOrder             as
    projection on SO.A_SalesOrder {
      key SalesOrder,
          SalesOrderDate,
          SalesGroup,
          SoldToParty,
          TotalNetAmount,
          TransactionCurrency,
          OverallDeliveryStatus
    }

  function getOpenSalesOrder(bp: String)      returns many A_SalesOrder;


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

    function getConfirmDeliveryDate(bp: String) returns many SalesOrderScheduleLine;

}


service BusinessParnerService {

  entity BusinessPartner as
    projection on S4.A_BusinessPartner {
      key BusinessPartner,
          Customer,
          BusinessPartnerName
    }


  

}
