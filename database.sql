Create database transportation;
go
use transportation;
go
create table company(
   id INT PRIMARY KEY NOT NULL identity(1,1),
   name NVARCHAR(50),
   email NVARCHAR(50),
   password NVARCHAR(250),
   role NVARCHAR(50),
   status INT,
   address NVARCHAR(100),
   hotline INT
);
go
create table route(
   id INT PRIMARY KEY NOT NULL identity(1,1),
   company_id INT FOREIGN KEY REFERENCES company(id),
   depart NVARCHAR(100),
   destination NVARCHAR(100)
);
go 
create table route_name(
   route_id INT FOREIGN KEY REFERENCES route(id),
   company_id INT,
   route_name NVARCHAR(50)
);
go
create table trip(
   id INT PRIMARY KEY NOT NULL identity(1,1),
   route_id INT FOREIGN KEY REFERENCES route(id),
   begin_time NVARCHAR(50),
   end_time NVARCHAR(50),
   distance int,
   price int,
   depart_date NVARCHAR(50)
);
go
create table user_(
   id INT PRIMARY KEY NOT NULL identity(1,1),
   name NVARCHAR(50),
   email NVARCHAR(50),
   password NVARCHAR(250),
   phone_number int,
   role NVARCHAR(20),
   status int
);
go
create table transportation(
   id INT PRIMARY KEY NOT NULL identity(1,1),
   trip_id INT FOREIGN KEY REFERENCES trip(id),
   type int,
   image_path NVARCHAR(50),
   name NVARCHAR(50)
);
go
create table ticket(
   id INT PRIMARY KEY NOT NULL identity(1,1),
   transportation_id INT FOREIGN KEY REFERENCES transportation(id),
   user_id INT FOREIGN KEY REFERENCES user_(id),
   quantity INT,
   status INT
);
go
create table ticket_detail(
   ticket_id INT FOREIGN KEY REFERENCES ticket(id),
   order_date DATE,
   company_name NVARCHAR(50),
   depart NVARCHAR(100),
   destination NVARCHAR(100),
   depart_date NVARCHAR(250),
   distance INT,
   price INT,
   end_time NVARCHAR(50),
   begin_time NVARCHAR(50),
   transport_name NVARCHAR(100),
   image_path NVARCHAR(250),
   type INT,
   user_name NVARCHAR(100)
);
go
create table cell(
   transportation_id INT FOREIGN KEY REFERENCES transportation(id),
   sit_number INT
);
go
INSERT INTO company(name, address, hotline, email, role, status, password)
VALUES ('thanh buoi', 'ha noi', '1234567890', 'thanhbuoi@gmail.com', 'COMPANY', 1, '123456');
go
INSERT INTO company(name, address, hotline, email, role, status, password)
VALUES ('phuong trang', 'ha noi', '1234567890', 'phuongtrang@gmail.com', 'COMPANY', 1, '123456');
go
INSERT INTO company(name, address, hotline, email, role, status, password)
VALUES ('khang dien', 'ha noi', '1234567890', 'khangdien@gmail.com', 'COMPANY', 1, '123456');
go
INSERT INTO route(company_id, depart, destination)
VALUES ('1', 'dalat', 'tphcm')
go
INSERT INTO route(company_id, depart, destination)
VALUES ('2', 'tphcm', 'dalat')
go
INSERT INTO route(company_id, depart, destination)
VALUES ('3', 'tphcm', 'nhatrang')
go
INSERT INTO route_name(route_id, company_id , route_name)
VALUES ('1', '1', 'dalat - tphcm')
go
INSERT INTO route_name(route_id, company_id , route_name)
VALUES ('2', '2', 'tphcm - dalat')
go
INSERT INTO route_name(route_id, company_id ,route_name)
VALUES ('3', '3', 'tphcm - nhatrang')
go
INSERT INTO trip(route_id, distance, price, begin_time, end_time, depart_date)
VALUES ('1', '556','123','10:00', '11:00', '2022-01-01')
go
INSERT INTO trip(route_id, distance, price, begin_time, end_time, depart_date)
VALUES ('2', '666', '333', '05:30' , '07:30', '2022-02-01')
go
INSERT INTO trip(route_id, distance, price, begin_time, end_time, depart_date)
VALUES ('2', '666', '333', '05:30' , '07:30', '2022-04-01')
go
INSERT INTO trip(route_id, distance, price, begin_time, end_time, depart_date)
VALUES ('3', '66', '333', '05:30' , '07:30', '2022-04-01')
go
INSERT INTO  transportation(trip_id, image_path, name, type)
VALUES ('1', 'example/path', 'limo','16')
go
INSERT INTO  transportation(trip_id, image_path, name, type)
VALUES ('2', 'example/path', 'limo','16')
go
INSERT INTO  transportation(trip_id, image_path, name, type)
VALUES ('3', 'example/path', 'xe giuong nam','45')
go
INSERT INTO  transportation(trip_id, image_path, name, type)
VALUES ('4', 'example/path', 'xe giuong nam','45')
go
INSERT INTO  user_(name, email, password, phone_number, role, status)
VALUES ('user1', 'user1@gmail.com', '123456','123456789', 'USER', 1)
go
INSERT INTO  user_(name, email, password, phone_number, role, status)
VALUES ('user2', 'user2@gmail.com', '123456','123456789', 'USER', 1)
go
INSERT INTO  user_(name, email, password, phone_number, role, status)
VALUES ('user3', 'user3@gmail.com', '123456','123456789', 'USER', 1)
go
INSERT INTO  user_(name, email, password, phone_number, role, status)
VALUES ('user4', 'user4@gmail.com', '123456','123456789', 'USER', 1)
go
INSERT INTO  user_(name, email, password, phone_number, role, status)
VALUES ('user5', 'user5@gmail.com', '123456','123456789', 'USER', 1)
go
INSERT INTO  user_(name, email, password, phone_number, role, status)
VALUES ('admin', 'admin@gmail.com', '123456','123456789', 'ADMIN', 1)

