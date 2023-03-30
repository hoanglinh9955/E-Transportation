const Company = require('../models/company');
const Trips = require('../models/trip');
const { Object, Object_id, Object_month} = require('../models/object');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator/check');
const moment = require('moment')


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
    
    const depart_date = moment(begin_time).format('YYYY-MM-DD');

  

    const date1 = new Date(begin_time);
    const date2 = new Date(end_time);
    const diffInMs = date1 - date2;
    const diffInMins = Math.floor(diffInMs / 1000 / 60); // convert milliseconds to minutes
    const hours = Math.floor(diffInMins / 60);
    const minutes = diffInMins % 60;
    const time= `${hours.toString().padStart(2, '0')}h${minutes.toString().padStart(2, '0')}m`;
    console.log(time);

    const result = await trips.createUpdateTripByCompany(depart, destination, company_id, depart_date, distance, price, end_time, begin_time, time, transport_name, image_path, type, route_id, trip_id, tran_id)
      .then(result => { return result })
      .catch(err => console.log(err))
    array_result.push(result);
  }
  


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
    var total_cost_array = [];
    var {company_id, year} = req.body;

    for(let i=1; i <=12; i++){
      if(i < 10){
        //month < 10
        const year_month = year+'-0'+i.toString();
        const result = await company.getOutComeByComId(company_id, year_month)
    .then(result => { return result })
    .catch(err => console.log(err))


  if (result.recordset.length == 0) {
      // thang ko ban dc ve nao
      total_cost_array.push(new Object_month(i, 0, 0 )) 
  }else{
    // thang co ban ve
  const array = result.recordset
  var total_amount = 0;
  var total_tickets_sold = 0;

  array.map(e => {
    total_amount = total_amount + e.total_amount
    total_tickets_sold = total_tickets_sold + e.quantity
  })
      total_cost_array.push(new Object_month(i, total_amount , total_tickets_sold)) 
  }


      }else{
        //month > 10
        const year_month = year+'-'+i.toString();
        const result = await company.getOutComeByComId(company_id, year_month)
    .then(result => { return result })
    .catch(err => console.log(err))


             if (result.recordset.length == 0) {
               // thang ko ban dc ve nao
              total_cost_array.push(new Object_month(i, 0, 0 )) 
              }else{
             // thang co ban ve
              const array = result.recordset
              var total_amount = 0;
              var total_tickets_sold = 0;

  array.map(e => {
    total_amount = total_amount + e.total_amount
    total_tickets_sold = total_tickets_sold + e.quantity
  })
      total_cost_array.push(new Object_month(i, total_amount , total_tickets_sold)) 
      }
    }
  }
  return res.status(200).json({total_cost_array});
}

exports.fetchRoutes = async (req, res, next) => {
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


  const result = await company.fetchRoutes()
    .then(result => { return result })
    .catch(err => console.log(err))


  if (result.recordset.length <= 0 ) {
    res.status(200).json({
      message: "Nạp Dữ Liệu Thất Bại !!!",
      data: false
    })
    return
  }
 
  if (result.recordset) {
    res.status(200).json({
      message: 'Lấy Dữ Liệu Tuyến Đường Thành Công !!!',
      data: true,
      result: result.recordset
    })
    return
  }
}

