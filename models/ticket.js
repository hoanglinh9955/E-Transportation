const mssql = require('mssql');
const config = require('../config');
class Ticket {
    constructor(trip_id, route_id ,user_id, transport_id, companyName, depart, destination, beginTime, endTime, distance, price, departDate, type, imagePath, transportName, quantity, userName, orderDate) {
      this.transport_id = transport_id;
      this.trip_id = trip_id;
      this.route_id = route_id;
      this.user_id = user_id;
      this.companyName = companyName;
      this.depart = depart;
      this.destination = destination;
      this.beginTime = beginTime;
      this.endTime = endTime;
      this.distance = distance;
      this.price = price;
      this.departDate = departDate;
      this.type = type;
      this.imagePath = imagePath;
      this.transportName = transportName;
      this.quantity = quantity;
      this.userName = userName;
      this.orderDate = orderDate;
    }

    async orderTicket(transport_id, user_id, quantity, array_sit_number) {
        try {
            // Connect to the database
            const pool = await mssql.connect(config.sql);
           
            //check cell
            const cell = await pool.request()
            .input('transportation_id', mssql.INT, transport_id)
            .query(`SELECT COUNT(*) as row_count FROM cell
                    WHERE transportation_id = @transportation_id;`);
        
            //get type of transport
            const getType = await pool.request()
            .input('transportation_id', mssql.INT, transport_id)
            .query(`SELECT type FROM transportation
            WHERE transportation.id = @transportation_id;`);
         
            var r;
            if(cell.recordset[0].row_count > getType.recordset[0].type){
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
         
            const getTicketDetail = await pool.request()
            .input('transportation_id', mssql.INT, transport_id)
            .input('ticket_id', mssql.INT, ticket.recordset[0].ticket_id)
            .query(`
            SELECT 
                t.type, user_.name as user_name, user_.id as user_id , t.image_path, t.name AS transportName, 
                r.depart AS depart, r.destination AS destination, 
                tr.begin_time AS beginTime, tr.end_time AS endTime, 
                tr.distance AS distance, tr.price AS price, tr.depart_date AS departDate,
                c.name AS companyName
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
            .query(`
                    INSERT INTO ticket_detail (ticket_id, order_date, company_name, depart, destination, depart_date, distance, price, end_time, begin_time, transport_name, image_path, type, user_name)
                    VALUES (@ticket_id, @order_date, @companyName, @depart, @destination, @departDate, @distance, @price, @endTime, @beginTime, @tranportName, @image_path, @type, @user_name );    
                    `);
                    
                    const createCell = await pool.request()
                    .input('type', mssql.INT, getTicketDetail.recordset[0].type)
                    .input('transportation_id', mssql.INT, transport_id)
                    .input('array_sit_number', mssql.NVarChar, array_sit_number)
                    .query(`DECLARE @sit_numbers NVARCHAR(MAX) = @array_sit_number;
                                INSERT INTO cell (transportation_id, sit_number)
                                SELECT @transportation_id, CAST(value AS INT)
                                FROM OPENJSON(@sit_numbers);
                            `);
            

            return ticket;
            
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
  }
  
module.exports = Ticket;


