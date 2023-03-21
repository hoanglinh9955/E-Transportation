const mssql = require('mssql');
const config = require('../config');
class Ticket {
  constructor(ticket_id) {
    this.ticket_id = ticket_id
  }

  async orderTicket(transport_id, user_id, quantity, array_sit_number) {
    try {
      // Connect to the database
      const pool = await mssql.connect(config.sql);

      let myString = JSON.stringify(array_sit_number);
      var ticket_id_array = []
      var trip_id;
      var price;
      var company_id;
      //check cell
      for (let i = 0; i < quantity; i++) {

        const cell = await pool.request()
          .input('transportation_id', mssql.INT, transport_id)
          .query(`SELECT COUNT(*) as row_count FROM cell
                    WHERE transportation_id = @transportation_id;`);
        console.log(cell)
        //get type of transport
        const getType = await pool.request()
          .input('transportation_id', mssql.INT, transport_id)
          .query(`SELECT type FROM transportation
            WHERE transportation.id = @transportation_id;`);
        console.log(getType)
        var r;
        var seat_remain = getType.recordset[0].type - cell.recordset[0].row_count
        if (quantity > seat_remain) {
          r = 'sitting_is_full';
          return r;
        }

        const ticket = await pool.request()
          .input('transportation_id', mssql.INT, transport_id)
          .input('user_id', mssql.INT, user_id)
          .input('quantity', mssql.INT, quantity)
          .input('status', mssql.INT, 1)
          .query(`INSERT INTO ticket (transportation_id, user_id, quantity, status)
                    VALUES (@transportation_id, @user_id, @quantity, @status);
                    SELECT SCOPE_IDENTITY() AS ticket_id;
            `);
        //get ticket detail
        console.log(ticket);

        ticket_id_array.push(new Ticket(ticket.recordset[0].ticket_id))

        const getTicketDetail = await pool.request()
          .input('transportation_id', mssql.INT, transport_id)
          .input('ticket_id', mssql.INT, ticket.recordset[0].ticket_id)
          .query(`
            SELECT 
                t.type, user_.name as user_name, user_.id as user_id , t.image_path, t.name AS transportName, 
                r.depart AS depart, r.destination AS destination, 
                tr.begin_time AS beginTime, tr.end_time AS endTime, 
                tr.distance AS distance, tr.price AS price, tr.depart_date AS departDate,
                c.name AS companyName, t.trip_id, c.id as company_id
                    FROM transportation t
                        JOIN trip tr ON t.trip_id = tr.id
                        JOIN route r ON tr.route_id = r.id
                        JOIN company c ON r.company_id = c.id
						JOIN ticket ON ticket.id = @ticket_id
						JOIN user_ ON user_.id = ticket.user_id
                WHERE t.id = @transportation_id;`)

        console.log(getTicketDetail)

        const ticketDetail = await pool.request()
          .input('type', mssql.INT, getTicketDetail.recordset[0].type)
          .input('ticket_id', mssql.INT, ticket.recordset[0].ticket_id)
          .input('image_path', mssql.NVarChar, getTicketDetail.recordset[0].image_path)
          .input('tranportName', mssql.NVarChar, getTicketDetail.recordset[0].transportName)
          .input('depart', mssql.NVarChar, getTicketDetail.recordset[0].depart)
          .input('destination', mssql.NVarChar, getTicketDetail.recordset[0].destination)
          .input('beginTime', mssql.NVarChar, getTicketDetail.recordset[0].beginTime)
          .input('endTime', mssql.NVarChar, getTicketDetail.recordset[0].endTime)
          .input('distance', mssql.INT, getTicketDetail.recordset[0].distance)
          .input('price', mssql.INT, getTicketDetail.recordset[0].price)
          .input('departDate', mssql.NVarChar, getTicketDetail.recordset[0].departDate)
          .input('companyName', mssql.NVarChar, getTicketDetail.recordset[0].companyName)
          .input('user_name', mssql.NVarChar, getTicketDetail.recordset[0].user_name)
          .input('order_date', mssql.Date, (new Date()))
          .input('sit_number', mssql.Int, array_sit_number[i])
          .query(`
                    INSERT INTO ticket_detail (ticket_id, order_date, company_name, depart, destination, depart_date, distance, price, end_time, begin_time, transport_name, image_path, type, user_name, sit_number)
                    VALUES (@ticket_id, @order_date, @companyName, @depart, @destination, @departDate, @distance, @price, @endTime, @beginTime, @tranportName, @image_path, @type, @user_name, @sit_number);    
                    `);
          trip_id = getTicketDetail.recordset[0].trip_id
          price = getTicketDetail.recordset[0].price
          company_id = getTicketDetail.recordset[0].company_id
      }
      const total_amount = await pool.request()
      .input('trip_id', mssql.INT, trip_id)
      .input('total_amount', mssql.INT, quantity*price)
      .input('company_id', mssql.INT, company_id)
      .input('quantity', mssql.INT, quantity)
      .query(`INSERT INTO total_amount (trip_id, company_id, total_amount, quantity)
              VALUES (@trip_id ,@company_id, @total_amount, @quantity)   
                          `);

      const createCell = await pool.request()
        .input('transportation_id', mssql.INT, transport_id)
        .input('user_id', mssql.INT, user_id)
        .input('array_sit_number', mssql.NVarChar, myString)
        .query(`DECLARE @sit_numbers NVARCHAR(MAX) = @array_sit_number;
                                INSERT INTO cell (transportation_id,user_id, sit_number)
                                SELECT @transportation_id,@user_id, CAST(value AS INT)
                                FROM OPENJSON(@sit_numbers);
                            `);


      return ticket_id_array;

    } catch (err) {
      console.log(err)
    }
  }
  async getCellByTranId(tran_id) {
    try {

      // create connection pool
      const pool = await mssql.connect(config.sql);
      const query = `SELECT cell.sit_number from cell
                         where cell.transportation_id = @tran_id`;

      // create a new request object
      const result = await pool.request()
        .input('tran_id', mssql.INT, tran_id)
        .query(query)

      console.log(result.recordset)
      // return the result
      return result;
    } catch (err) {
      console.error('Error:', err);
    }
  }
  async getTicketByUserId(userId) {
    try {

      // create connection pool
      const pool = await mssql.connect(config.sql);
      const query = ` SELECT * from ticket_detail
                            JOIN ticket ON ticket.id = ticket_detail.ticket_id
                          where user_id = @user_id and ticket.status = '1'`;

      // create a new request object
      const result = await pool.request()
        .input('user_id', mssql.INT, userId)
        .query(query)

      console.log(result.recordset)
      // return the result
      return result.recordset;
    } catch (err) {
      console.error('Error:', err);
    }
  }
  async cancelTicket(ticket_id, user_id, sit_number) {
    try {

      // create connection pool
      const pool = await mssql.connect(config.sql);
      //check cancel data if < 24 h
      
      const query = ` 
          select trip.begin_time 
          from trip	
            join transportation ON trip.id = transportation.id
            join ticket ON ticket.transportation_id = transportation.id
          where ticket.id = @ticket_id`;

      // create a new request object
      const check_date = await pool.request()
        .input('ticket_id', mssql.INT, ticket_id)
        .query(query)

         const date1 = new Date();
         const date2 = new Date(check_date.recordset[0].begin_time);

        
        
        const diffInMs = date2.getTime() - date1.getTime();
        const diffInHours = diffInMs / (1000 * 60 * 60);
        var check
        console.log(diffInHours)
        if(diffInHours < 24){
          check = 'cannotCancel'
          return check;
        }


      const query1 = ` 
                          UPDATE ticket
                          SET status = '0'
                          WHERE ticket.id = @ticket_id; `;

      // create a new request object
      const result = await pool.request()
        .input('ticket_id', mssql.INT, ticket_id)
        .query(query1)
      //delete cell
      const query2 = ` 
            DELETE FROM Cell WHERE sit_number = @sit_number and user_id = @user_id`;

      // create a new request object
      const delete_cell = await pool.request()
        .input('user_id', mssql.INT, user_id)
        .input('sit_number', mssql.INT, sit_number)
        .query(query2)


      console.log(result)
      console.log(delete_cell)
      // return the result
      return result
    } catch (err) {
      console.error('Error:', err);
    }
  }
  async getTicketDetail(tran_id, ticket_id) {
    try {

      // create connection pool
      const result = await pool.request()
          .input('transportation_id', mssql.INT, tran_id)
          .input('ticket_id', mssql.INT, ticket_id)
          .query(`
            SELECT 
                t.type, user_.name as user_name, user_.id as user_id , t.image_path, t.name AS transportName, 
                r.depart AS depart, r.destination AS destination, 
                tr.begin_time AS beginTime, tr.end_time AS endTime, 
                tr.distance AS distance, tr.price AS price, tr.depart_date AS departDate,
                c.name AS companyName, t.trip_id, c.id as company_id
                    FROM transportation t
                        JOIN trip tr ON t.trip_id = tr.id
                        JOIN route r ON tr.route_id = r.id
                        JOIN company c ON r.company_id = c.id
						JOIN ticket ON ticket.id = @ticket_id
						JOIN user_ ON user_.id = ticket.user_id
                WHERE t.id = @transportation_id;`)

        console.log(getTicketDetail)
      // return the result
      return result;
    } catch (err) {
      console.error('Error:', err);
    }
  }

}

module.exports = Ticket;


