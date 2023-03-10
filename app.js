const express = require('express');
const bodyParser = require('body-parser');
const mssql = require('mssql');
const config = require('./config');
const app = express();
const cors = require('cors');

//instantiate a connection pool
const Pool = new mssql.ConnectionPool(config.sql);

app.use(bodyParser.json()); // application/json
app.use(cors()); //Access-Control-Allow-Origin



app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


//Router
const userRoutes = require("./routes/userRoutes");
const tripRoutes = require('./routes/tripRoutes');
const adminRoutes = require('./routes/adminRoutes');
const companyRoutes = require('./routes/companyRoutes');

app.use('/api', userRoutes);
app.use('/api', tripRoutes);
app.use('/api/admin', adminRoutes)
app.use('/api/company', companyRoutes)

//error handle for app
app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
  });

  
// mssql.connect(config.sql)
//   .then(app.listen(process.env.port, () => {
//     console.log(`Server is running on port ${process.env.port}`)
// }))
//   .catch(err => console.log(err))
  
//connect the pool and start the web server when done
Pool.connect().then(() => {
  
  app.listen(process.env.port, () => {
    console.log('Example app listening at http://%s:%s', process.env.host, process.env.port)
  })
}).catch((err)=> {
  console.error('Error creating connection pool', err)
});