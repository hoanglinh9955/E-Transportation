const mssql = require('mssql');
const config = require('../config');
class User {
    constructor(name, email, password, phone_number, role, status) {

        this.name = name;
        this.email = email;
        this.password = password;
        this.phone_number = phone_number;
        this.role = role;
        this.status = status;
    }

     async save() {
        try {
            // Connect to the database
            const pool = await mssql.connect(config.sql);

            // Insert the user into the database
            const result = await pool.request()
                .input('name', mssql.NVarChar, this.name)
                .input('email', mssql.NVarChar, this.email)
                .input('password', mssql.NVarChar, this.password)
                .input('phone_number', mssql.Int, parseInt(this.phone_number))
                .input('role', mssql.NVarChar, this.role)
                .input('status', mssql.Int, this.status)
                .query('INSERT INTO user_ (name, email, password, phone_number, role, status) VALUES (@name, @email, @password, @phone_number, @role, @status)');

              console.dir(result)
            // Return success
            return result;
        } catch (error) {
            console.log(error)
            
        }
    }
    async findOne(email) {
        try {
            // Connect to the database
            const pool = await mssql.connect(config.sql);
    
            // Get the user from the database
            const result = await pool.request()
            .input('email', mssql.NVarChar, email)
            .query('SELECT * FROM user_ WHERE email = @email');
            
            return result;
            
        } catch (err) {
            console.log(err)
        }

        }
        async getAllUser() {
            try {
                // Connect to the database
                const pool = await mssql.connect(config.sql);
        
                // Get the user from the database
                const result = await pool.request()
                .query('SELECT * FROM user_');
                
                return result;
                
            } catch (err) {
                console.log(err)
            }
        } 
        async banUserByEmail(email) {
            try {
                // Connect to the database
                const pool = await mssql.connect(config.sql);
        
                // Get the user from the database
                const result = await pool.request()
                .input('email', mssql.NVarChar, email)
                .query(`UPDATE user_
                SET status = CASE status
                              WHEN 0 THEN 1
                              WHEN 1 THEN 0
                            END
                WHERE email = @email;
              `);
                
                
                return result;
                
            } catch (err) {
                console.log(err)
            }
        }
        async unBanUserByEmail(email) {
            try {
                // Connect to the database
                const pool = await mssql.connect(config.sql);
        
                // Get the user from the database
                const result = await pool.request()
                .input('email', mssql.NVarChar, email)
                .query('UPDATE user_ SET status = 1 WHERE email = @email');
                
                return result;
                
            } catch (err) {
                console.log(err)
            }
        }
    }

module.exports = User;
