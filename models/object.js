class Object {
    constructor(message, data, result) {
      this.message = message;
      this.data = data;
      this.result = result
    }
  }
  class Object_id {
    constructor(message, data, route_id, trip_id, tran_id) {
      this.message = message;
      this.data = data;
      this.route_id = route_id;
      this.trip_id = trip_id;
      this.tran_id = tran_id;
    }
  }
  class Object_month {
    constructor(message, total_amount, total_ticket_sold) {
      this.message = message;
      this.total_amount = total_amount;
      this.total_ticket_sold = total_ticket_sold;
    }
  }
module.exports = { Object, Object_id, Object_month };