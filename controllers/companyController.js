const Company = require('../models/company');
const Trips = require('../models/trip');
const { Object, Object_id } = require('../models/object');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator/check');


exports.getRouteByComId = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Lỗi.');
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
      message: "Không Có Tuyến Đường Nào Để Hiển Thị.",
      data: false
    })
    return
  }

  if (result.recordset) {
    res.status(200).json({
      message: 'Hiển Thị Tất Cả Các Tuyến Đường Thành Công.',
      data: true,
      result: result.recordset
    })
    return
  }
}

exports.createUpdateTripByCompany = async (req, res, next) => {
    
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Lỗi.');
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
    const {company_id, depart, destination, distance, price, end_time, begin_time, transport_name, image_path, type, route_id, trip_id, tran_id } = req.body[i]
    
    const input = begin_time;
    const dateObj = new Date(input);
    const isoString = dateObj.toISOString();
    const depart_date = isoString.slice(0, 10);

    const date1 = new Date(begin_time);
    const date2 = new Date(end_time);
    const diffInMs = date1 - date2;
    const diffInMins = Math.floor(diffInMs / 1000 / 60); // convert milliseconds to minutes
    const hours = Math.floor(diffInMins / 60);
    const minutes = diffInMins % 60;
    const time= `${hours.toString().padStart(2, '0')}h${minutes.toString().padStart(2, '0')}m`;

    const result = await trips.createUpdateTripByCompany(depart, destination, company_id, depart_date, distance, price, end_time, begin_time, time, transport_name, image_path, type, route_id, trip_id, tran_id)
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
      array_object.push(new Object_id('Tạo chuyến Xe Thất Bại.', false, [], [], []))
    }else{
      array_object.push(new Object_id('Cập Nhật Chuyến Xe Thất Bại', false, [], [], []))
    }
  }
  if (e) {
    if(req.body[count].route_id === undefined || 
       req.body[count].trip_id  === undefined || 
       req.body[count].tran_id  === undefined   ){
        
        array_object.push(new Object_id('Tạo Chuyến Xe Thành Công.', true, 
          e.checkRouteExist === undefined ? e.route.recordset[0].route_id: e.checkRouteExist.recordset[0].route_id, 
          e.trip.recordset[0].trip_id, 
          e.transportation.recordset[0].transportation_id  
          ))
    }else{
      if(e === 'update_false'){
        array_object.push(new Object('Cập Nhật Chuyến Xe Thất Bại', false, []))
      }else{
        array_object.push(new Object('Cập Nhật Chuyến Xe Thành Công', true, []))
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
    const error = new Error('Lỗi.');
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
    array_object.push(new Object('Tuyến Đường Đã Tồn Tại.', false, []))
  }
  if(e === undefined){
    if(req.body[count].route_id === undefined){
      array_object.push(new Object('Tạo Tuyến Đường Thành Công', false, []))
    }else{
      array_object.push(new Object('Cập Nhật Tuyến Đường Thất Bại', false, []))
    }
  }
  if (e && e != 'route_exist') {
    if(req.body[count].route_id === undefined){
      array_object.push(new Object('Tạo Tuyến Đường Thành Công', true, [{route_id: e.recordset[0].route_id}]))
    }else{
      array_object.push(new Object('Cập Nhật Tuyến Đường Thất Bại', true, []))
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
    const error = new Error('Lỗi.');
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
      message: "Không Có Chuyến Xe Nào Để Hiển Thị.",
      data: false
    })
    return
  }

  if (result.recordset) {
    res.status(200).json({
      message: 'Hiện Thị Tất Cả Các Tuyến Đường Thành Công',
      data: true,
      result: result.recordset
    })
    return
  }
}


exports.getRouteNameByComId = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Lỗi.');
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

  console.log(result)
  if (result.recordset.length == 0 || result === undefined) {
    res.status(200).json({
      message: "Không Có Tên Tuyến Đường Để Hiển Thị",
      data: false
    })
    return
  }

  if (result.recordset) {
    res.status(200).json({
      message: 'Hiển Thị Tất Cả Các Tuyến Đường Thành Công',
      data: true,
      result: result.recordset
    })
    return
  }
}

exports.deleteRouteByRouteIdAndComId = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Lỗi.');
    error.statusCode = 200;
    error.message = errors.errors;
    error.data = false;
    next(error);
    return
  }
    const trips = new Trips();
    const {company_id, route_id} = req.body;

  const result = await trips.deleteRouteByRouteIdAndComId(company_id, route_id)
    .then(result => { return result })
    .catch(err => console.log(err))

  console.log(result)

  

  if (result) {
    res.status(200).json({
      message: 'Xóa Tuyến Đường Thành Công.',
      data: true,
      transportation: result.rowsAffected[3],
      trip: result.rowsAffected[5],
      route: result.rowsAffected[6]
    })
    return
  }
  
}
exports.getOutComeByComId = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Lỗi.');
    error.statusCode = 200;
    error.message = errors.errors[0].msg;
    error.data = false;
    next(error);
    return
  }
    const company = new Company();
    const company_id = req.body.company_id;

  const result = await company.getOutComeByComId(company_id)
    .then(result => { return result })
    .catch(err => console.log(err))

  console.log(result.recordset)
  if (result.recordset.length == 0) {
    res.status(200).json({
      message: "Không Có Vé Nào được bán",
      data: false
    })
    return
  }
  const array = result.recordset
  var total_amount = 0;
  var total_tickets_sold = 0;

  array.map(e => {
    total_amount = total_amount + e.total_amount
    total_tickets_sold = total_tickets_sold + e.quantity
  })
  if (result.recordset) {
    res.status(200).json({
      message: 'lấy Doanh Thu Của Công Ty Thành Công',
      data: true,
      total_amount: total_amount,
      total_tickets_sold: total_tickets_sold 
    })
    return
  }
}
