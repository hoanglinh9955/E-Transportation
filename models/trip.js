const mssql = require('mssql');
const config = require('../config');

class Trip {
  constructor(depart, destination, company_name, address, hotline, depart_date, distance, price, end_time, begin_time, transport_name, image_path, type) {
    this.depart = depart;
    this.destination = destination;
    this.company_name = company_name;
    this.address = address;
    this.hotline = hotline;
    this.depart_date = depart_date;
    this.distance = distance;
    this.price = price;
    this.end_time = end_time;
    this.begin_time = begin_time;
    this.transport_name = transport_name;
    this.image_path = image_path;
    this.type = type;
  }

  async getTrips(depart, destination, depart_date) {
    try {

      // create connection pool
      const pool = await mssql.connect(config.sql);
      const query = `
      SELECT tr.id as transport_id, t.begin_time, t.end_time, t.distance, t.price, 
          tr.name as transport_name, tr.image_path, tr.type,
          r.depart, r.destination, t.depart_date,
        c.name as company_name, c.address, c.hotline, c.email, c.status, c.role
      FROM trip t 
          JOIN route r ON t.route_id = r.id
          JOIN company c ON r.company_id = c.id
          JOIN transportation tr ON tr.trip_id = t.id
      WHERE r.depart = @depart AND r.destination = @destination AND t.depart_date = @depart_date `;

      // create a new request object
      const result = await pool.request()
        .input('depart', mssql.NVarChar, depart)
        .input('destination', mssql.NVarChar, destination)
        .input('depart_date', mssql.NVarChar, depart_date)
        .query(query)

      console.log(result.recordset)
      // return the result
      return result;
    } catch (err) {
      console.error('Error:', err);
    }
  }

  async getRoutes() {
    try {
      const pool = await mssql.connect(config.sql);
      let query = `select route.depart, route.destination from route`;
      const result = await pool.request()
        .query(query)

      console.log(result)
      return result
    } catch (err) {
      console.error('Error:', err);
    }
  }

  async getRoutesByComId(com_id) {
    try {
      const pool = await mssql.connect(config.sql);
      let query = `select route.depart, route.destination, route.id as route_id
                    from route join company on (route.company_id = company.id)
                    where company.id = @company_id `;
      const result = await pool.request()
        .input('company_id', mssql.Int, com_id)
        .query(query)

      console.log(result)
      return result
    } catch (err) {
      console.error('Error:', err);
    }
  }
  async createUpdateTripByCompany(depart, destination, company_id, depart_date, distance, price, end_time, begin_time, transport_name, image_path, type, route_id, trip_id, tran_id) {
    try {
      // Connect to the database
      const pool = await mssql.connect(config.sql);
    if(trip_id ===undefined){
        //create trip 
        //check route if it exist.
      let query1 = `select route.id AS route_id from route where route.company_id = @company_id and route.depart= @depart and route.destination = @destination`;
      const checkRouteExist = await pool.request()
        .input('company_id', mssql.Int, parseInt(company_id))
        .input('depart', mssql.NVarChar, depart)
        .input('destination', mssql.NVarChar, destination)
        .query(query1)
      console.log(checkRouteExist)
      //Insert a new route
      // define route 
      var route;
      if (checkRouteExist.rowsAffected[0] == 0) {
        let query2 = `INSERT INTO route (company_id, depart, destination) VALUES 
          (@company_id, @depart, @destination);
          SELECT SCOPE_IDENTITY() AS route_id;`
        route = await pool.request()
          .input('company_id', mssql.Int, company_id)
          .input('depart', mssql.NVarChar, depart)
          .input('destination', mssql.NVarChar, destination)
          .query(query2)
        console.log(route)
        
        //create new Route_Name 
        const route_name = depart + ' - ' + destination
        let query5 = `INSERT INTO route_name (route_id, company_id ,route_name) 
                      VALUES (@route_id, @company_id, @route_name);`
        const create_route_name = await pool.request()
          .input('route_id', mssql.Int, route.recordset[0].route_id)
          .input('company_id', mssql.Int, company_id)
          .input('route_name', mssql.NVarChar, route_name)
          .query(query5)
        console.log(create_route_name)

      }


      // Insert a new trip
      let query3 = `INSERT INTO trip (route_id, begin_time, end_time, distance, price, depart_date) 
                    VALUES (@route_id, @begin_time, @end_time, @distance, @price, @depart_date);
                    SELECT SCOPE_IDENTITY() AS trip_id;`

      const trip = await pool.request()
        .input('route_id', mssql.Int, route === undefined ? checkRouteExist.recordset[0].route_id : route.recordset[0].route_id)
        .input('begin_time', mssql.NVarChar, begin_time)
        .input('end_time', mssql.NVarChar, end_time)
        .input('distance', mssql.Int, distance)
        .input('price', mssql.Int, price)
        .input('depart_date', mssql.NVarChar, depart_date)
        .query(query3)

      console.log(trip)

      // Insert a new transportation
      let query4 = `INSERT INTO transportation (trip_id, type, image_path, name) 
                    VALUES (@trip_id, @type, @image_path, @name);
                    SELECT SCOPE_IDENTITY() AS transportation_id; `

      const transportation = await pool.request()
        .input('trip_id', mssql.Int, trip.recordset[0].trip_id)
        .input('type', mssql.Int, type)
        .input('image_path', mssql.NVarChar, image_path)
        .input('name', mssql.NVarChar, transport_name)
        .query(query4)
      console.log(transportation)


      if (checkRouteExist.rowsAffected[0] == 0) {
        return {
          route, trip, transportation
        }
      } else {
        return {
          checkRouteExist, trip, transportation
        }
      }
    }else{
      //update trip by trip_id

      //update route by route_id
      let query1 = `UPDATE route 
                    SET depart = @depart, destination = @destination
                    WHERE id = @route_id`
        route = await pool.request()
          .input('route_id', mssql.Int, route_id)
          .input('depart', mssql.NVarChar, depart)
          .input('destination', mssql.NVarChar, destination)
          .query(query1)
        console.log(route)


      // update trip by trip_id
      let query2 = `UPDATE trip 
                    SET begin_time = @begin_time, end_time = @end_time, distance = @distance, price = @price, depart_date = @depart_date
                    WHERE id = @trip_id`

      const trip = await pool.request()
        .input('trip_id', mssql.Int, trip_id)
        .input('begin_time', mssql.NVarChar, begin_time)
        .input('end_time', mssql.NVarChar, end_time)
        .input('distance', mssql.Int, distance)
        .input('price', mssql.Int, price)
        .input('depart_date', mssql.NVarChar, depart_date)
        .query(query2)

      console.log(trip)

      // Insert a new transportation
      let query3 = `UPDATE transportation
                    SET type = @type, image_path = @image_path, name = @name
                    WHERE id = @tran_id `

      const transportation = await pool.request()
        .input('tran_id', mssql.Int, tran_id)
        .input('type', mssql.Int, type)
        .input('image_path', mssql.NVarChar, image_path)
        .input('name', mssql.NVarChar, transport_name)
        .query(query3)
      console.log(transportation)

      if(route.rowsAffected[0] === 0 || trip.rowsAffected[0] === 0 || transportation.rowsAffected[0] === 0){
        const r = 'update_false'
        return r;
      }else{
        return { route, trip, transportation}
      }

      }
      


    } catch (err) {
      console.error(err);
    }
  }

  async createUpdateRoutesByComId(com_id, depart, destination, route_id) {
    try {
      const pool = await mssql.connect(config.sql);
      if (route_id === undefined) {
        //created new route
        //check route exist
        let query1 = `select route.depart, route.destination, route.id
                      from route join company on (route.company_id = company.id)
                      where company.id = @company_id and depart = @depart and destination = @destination`;
        const checkRoute = await pool.request()
          .input('company_id', mssql.Int, com_id)
          .input('depart', mssql.NVarChar, depart)
          .input('destination', mssql.NVarChar, destination)
          .query(query1)

        var r;
        if (checkRoute.rowsAffected[0] > 0) {
          r = 'route_exist'
          return r;
        }
        //create route by comid
        let query2 = `INSERT INTO [dbo].[route] (company_id, depart, destination)
                      VALUES (@company_id, @depart, @destination);
                      SELECT SCOPE_IDENTITY() AS route_id; `;
        const result = await pool.request()
          .input('company_id', mssql.Int, com_id)
          .input('depart', mssql.NVarChar, depart)
          .input('destination', mssql.NVarChar, destination)
          .query(query2)

          //create new Route_Name 
        const route_name = depart + ' - ' + destination
        let query5 = `INSERT INTO route_name (route_id, company_id, route_name) 
                      VALUES (@route_id, @company_id, @route_name);`
        const create_route_name = await pool.request()
          .input('route_id', mssql.Int, result.recordset[0].route_id)
          .input('company_id', mssql.Int, com_id)
          .input('route_name', mssql.NVarChar, route_name)
          .query(query5)
        console.log(create_route_name)

        console.log(result)
        return result
      }else{
        //update exist route
        //check route exist
        let query1 = `select route.depart, route.destination, route.id
                      from route join company on (route.company_id = company.id)
                      where company.id = @company_id and depart = @depart and destination = @destination`;
        const checkRoute = await pool.request()
          .input('company_id', mssql.Int, com_id)
          .input('depart', mssql.NVarChar, depart)
          .input('destination', mssql.NVarChar, destination)
          .query(query1)

        console.log(checkRoute.rowsAffected[0])
        var r;
        if (checkRoute.rowsAffected[0] > 0) {
          r = 'route_exist'
          return r;
        }
        //update route by comid
        let query2 = `UPDATE route
                      SET depart = @depart, destination = @destination
                      WHERE id = @route_id; `;
        const result = await pool.request()
          .input('route_id', mssql.Int, route_id)
          .input('depart', mssql.NVarChar, depart)
          .input('destination', mssql.NVarChar, destination)
          .query(query2)

        console.log(result)
        return result
      }

    } catch (err) {
      console.error('Error:', err);
    }
  }

  async getTripsByComId(com_id) {
    try {
      const pool = await mssql.connect(config.sql);
      let query = ` select route.depart, route.destination, trip.depart_date, trip.distance, trip.price,
                          trip.end_time, trip.begin_time, transportation.name, transportation.image_path,
                          transportation.type, route.id as route_id, trip.id as trip_id, transportation.id as tran_id
                    from route  join company on (route.company_id = company.id)
                                join trip on (route.id = trip.route_id)
                                join transportation on (trip.id = transportation.trip_id)
                    where company.id = @company_id `;
      const result = await pool.request()
        .input('company_id', mssql.Int, com_id)
        .query(query)

      console.log(result)
      return result
    } catch (err) {
      console.error('Error:', err);
    }
  }

  async getRouteNameByComId(com_id) {
    try {
      const pool = await mssql.connect(config.sql);
      let query = ` select * from route_name where company_id = @company_id `;
      const result = await pool.request()
        .input('company_id', mssql.Int, com_id)
        .query(query)

      console.log(result)
      return result
    } catch (err) {
      console.error('Error:', err);
    }
  }
}
module.exports = Trip;