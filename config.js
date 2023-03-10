const assert = require('assert');
//If an expression evaluates to 0 or false, an error is thrown and the program is terminated
const dotenv = require('dotenv'); 

dotenv.config() 
//automatically loads environment variables from a .env file into the process.env object

const {
    PORT,
    HOST,
    HOST_URL,
    SQL_USER,
    SQL_PASSWORD,
    SQL_DATABASE,
    SQL_SERVER

} = process.env;

//const sqlEncrypt = process.env.ENCRYPT === 'true';

assert(PORT, 'PORT is required');
assert(HOST, 'HOST is required');

module.exports = {
    JWT_SECRET: "this is seret",
    port: PORT,
    host: HOST,
    url: HOST_URL,
    sql: {
        server: SQL_SERVER,
        database: SQL_DATABASE,
        user: SQL_USER,
        password: SQL_PASSWORD,
        trustServerCertificate: true,
        options: {
            //encrypt: sqlEncrypt,
            
            enableArithAbort: true
            // /Ends a query when an overflow or divide-by-zero error occurs during query execution.
        }
    }
}