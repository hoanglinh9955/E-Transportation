const Trips = require('../models/trip');
const { validationResult } = require('express-validator/check');

exports.getTrips = async (req, res, next) => {
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Lỗi Nhập.');
      error.statusCode = 200;
      error.message = errors.errors;
      error.data = false;
      next(error);
      return
    }
  const depart = req.body.depart;
  const destination = req.body.destination;
  const depart_date = req.body.depart_date;

  const trips = new Trips();

  const result = await trips.getTrips(depart, destination, depart_date)
    .then(result => { return result })
    .catch(err => console.log(err))

  console.log(result);
  if (result.recordset.length == 0) {
    res.status(200).json({
      message: "Không Có Chuyến Xe Nào Trong Cơ Sở Dữ Liệu.",
      data: false
    })
    return
  }

  if (result.recordset) {
    res.status(200).json({
      message: "Lấy chuyến Xe Thành Công",
      data: true,
      result: result.recordset
    })
    return
  }
}

exports.getRoutes = async (req, res, next) => {
  const trips = new Trips();

  const result = await trips.getRoutes()
    .then(result => { return result })
    .catch(err => console.log(err))

  console.log(result)
  if (result.recordset.length == 0) {
    res.status(200).json({
      message: "Không Có Tuyến Đường Nào Để Hiển Thị",
      data: false
    })
    return
  }

  if (result.recordset) {
    res.status(200).json({
      message: 'Hiển Thị Điểm Đến Thành Công.',
      data: true,
      result: result.recordset
    })
  }
}


exports.getAllTrips = async (req, res, next) => {
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

  const result = await trips.getTrip()
    .then(result => { return result })
    .catch(err => console.log(err))

  console.log(result);
  if (result.recordset.length == 0) {
    res.status(200).json({
      message: "Không Có Chuyến Xe Nào Để Hiển Thị.",
      data: false
    })
    return
  }

  if (result.recordset) {
    res.status(200).json({
      message: "Hiển Chuyến Xe Thành Công",
      data: true,
      result: result.recordset
    })
    return
  }
}
exports.getAllTripByType = async (req, res, next) => {
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
  const {depart, destination, depart_date, type} = req.body
  const result = await trips.getTripByType(depart, destination, depart_date, type)
    .then(result => { return result })
    .catch(err => console.log(err))

  console.log(result);
  if (result.recordset.length == 0) {
    res.status(200).json({
      message: "Không Có Chuyến Xe Nào Để Hiển Thị",
      data: false
    })
    return
  }

  if (result.recordset) {
    res.status(200).json({
      message: "Hiển Thị Chuyến Xe Thành Công",
      data: true,
      result: result.recordset
    })
    return
  }
}

