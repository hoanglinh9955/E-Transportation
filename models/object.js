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
module.exports = { Object, Object_id };