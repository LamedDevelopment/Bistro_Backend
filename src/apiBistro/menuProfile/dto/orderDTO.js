class CreateOrderDTO {
    constructor(business, client, orderDetails, delivery) {
      this.business = business;      
      this.client = client;         
      this.orderDetails = orderDetails; 
      this.delivery = delivery;
      // this.payment = payment;
    }
  }



  module.exports = { 
    CreateOrderDTO,
  };