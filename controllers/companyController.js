const Company = require('../models/company');
const Trips = require('../models/trip');
const { Object, Object_id } = require('../models/object');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator/check');


exports.getRouteByComId = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Invalid Input.');
    error.statusCode = 200;
    error.message = errors.errors;
    error.data = false;
    next(error);
    return
  }
    const trips = new Trips();
    const company_id = req.body.company_id;

  const result = await trips.getRoutesByComId(company_id)
    .then(result => { return result })
    .catch(err => console.log(err))

  console.log(result.recordset)
  if (result.recordset.length == 0) {
    res.status(200).json({
      message: "Don't Have Route To Show",
      data: false
    })
    return
  }

  if (result.recordset) {
    res.status(200).json({
      message: 'Get All Route Success',
      data: true,
      result: result.recordset
    })
    return
  }
}

exports.createUpdateTripByCompany = async (req, res, next) => {
    
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Invalid Input.');
      error.statusCode = 200;
      error.message = errors.errors;
      error.data = false;
      next(error);
      return
    }
  const trips = new Trips();
  const quantity_line = req.body.length
  const array_result = [];
  for(i = 0;i < quantity_line; i++){
    const {company_id, depart, destination, depart_date, distance, price, end_time, begin_time, transport_name, image_path, type, route_id, trip_id, tran_id } = req.body[i]
    const result = await trips.createUpdateTripByCompany(depart, destination, company_id, depart_date, distance, price, end_time, begin_time, transport_name, image_path, type, route_id, trip_id, tran_id)
      .then(result => { return result })
      .catch(err => console.log(err))
    array_result.push(result);
  }
  

console.log(array_result)
const array_object = []
var count = 0
array_result.map(e => {
  if(e === undefined){
    if(req.body[count].route_id === undefined || 
       req.body[count].trip_id  === undefined || 
       req.body[count].tran_id  === undefined   ){
      array_object.push(new Object_id('Update Trip False', false, [], [], []))
    }else{
      array_object.push(new Object_id('Create Trip False', false, [], [], []))
    }
  }
  if (e) {
    if(req.body[count].route_id === undefined || 
       req.body[count].trip_id  === undefined || 
       req.body[count].tran_id  === undefined   ){
        
        array_object.push(new Object_id('Create Trip Success', true, 
          e.checkRouteExist === undefined ? e.route.recordset[0].route_id: e.checkRouteExist.recordset[0].route_id, 
          e.trip.recordset[0].trip_id, 
          e.transportation.recordset[0].transportation_id  
          ))
    }else{
      if(e === 'update_false'){
        array_object.push(new Object('Update Trip False', false, []))
      }else{
        array_object.push(new Object('Update Trip Success', true, []))
      } 
    }
  }
  console.log(array_object)
  count++;
})
  return res.status(200).json({array_object});
}

exports.createUpdateRouteByComId = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Invalid Input.');
    error.statusCode = 200;
    error.message = errors.errors;
    error.data = false;
    next(error);
    return
  }
  const trips = new Trips();
  const quantity_line = req.body.length
  const array_result = [];
  for(i = 0; i < quantity_line; i++){
    const {company_id, depart, destination, route_id} = req.body[i];
    const result = await trips.createUpdateRoutesByComId(company_id, depart, destination, route_id)
      .then(result => { return result })
      .catch(err => console.log(err))
    array_result.push(result)
  }

console.log(array_result)
const array_object = [];

var count = 0;
array_result.map(e => {
  if(e === 'route_exist'){
    array_object.push(new Object('Route Is Exist !!!', false, []))
  }
  if(e === undefined){
    if(req.body[count].route_id === undefined){
      array_object.push(new Object('Create Route False', false, []))
    }else{
      array_object.push(new Object('Update Route False', false, []))
    }
  }
  if (e && e != 'route_exist') {
    if(req.body[count].route_id === undefined){
      array_object.push(new Object('Create Route Success', true, [{route_id: e.recordset[0].route_id}]))
    }else{
      array_object.push(new Object('Update Route Success', true, []))
      }
    }
    console.log(array_object)
    count++;
})
  return res.status(200).json({array_object});
}
exports.getTripsByComId = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Invalid Input.');
    error.statusCode = 200;
    error.message = errors.errors;
    error.data = false;
    next(error);
    return
  }
    const trips = new Trips();
    const company_id = req.body.company_id;

  const result = await trips.getTripsByComId(company_id)
    .then(result => { return result })
    .catch(err => console.log(err))

  console.log(result.recordset)
  if (result.recordset.length == 0) {
    res.status(200).json({
      message: "Don't Have Trip To Show",
      data: false
    })
    return
  }

  if (result.recordset) {
    res.status(200).json({
      message: 'Get All trips Success',
      data: true,
      result: result.recordset
    })
    return
  }
}


exports.getRouteNameByComId = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Invalid Input.');
    error.statusCode = 200;
    error.message = errors.errors;
    error.data = false;
    next(error);
    return
  }
    const trips = new Trips();
    const company_id = req.body.company_id;

  const result = await trips.getRouteNameByComId(company_id)
    .then(result => { return result })
    .catch(err => console.log(err))

  console.log(result.recordset)
  if (result.recordset.length == 0) {
    res.status(200).json({
      message: "Don't Have Route Name To Show",
      data: false
    })
    return
  }

  if (result.recordset) {
    res.status(200).json({
      message: 'Get All Route Name Success',
      data: true,
      result: result.recordset
    })
    return
  }
}