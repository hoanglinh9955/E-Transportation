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
   hotline NVARCHAR(250)
);
go
create table route(
   id INT PRIMARY KEY NOT NULL identity(1,1),
   company_id INT FOREIGN KEY REFERENCES company(id),
   depart NVARCHAR(100),
   destination NVARCHAR(100),
   status INT
);
go 
create table route_name(
   route_id INT FOREIGN KEY REFERENCES route(id),
   company_id INT,
   route_name NVARCHAR(50),
   status INT
);
go
create table trip(
   id INT PRIMARY KEY NOT NULL identity(1,1),
   route_id INT FOREIGN KEY REFERENCES route(id),
   begin_time NVARCHAR(50),
   end_time NVARCHAR(50),
   time NVARCHAR(50),
   distance int,
   price int,
   depart_date NVARCHAR(50),
   status INT
);
go
create table user_(
   id INT PRIMARY KEY NOT NULL identity(1,1),
   name NVARCHAR(50),
   email NVARCHAR(50),
   password NVARCHAR(250),
   phone_number NVARCHAR(250),
   role NVARCHAR(20),
   status int
);
go
create table transportation(
   id INT PRIMARY KEY NOT NULL identity(1,1),
   trip_id INT FOREIGN KEY REFERENCES trip(id),
   type int,
   image_path NVARCHAR(Max),
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
create table total_amount(
   trip_id INT,
   company_id INT,
   total_amount INT,
   quantity INT,
   year_month NVARCHAR(200)
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
   image_path NVARCHAR(max),
   type INT,
   user_name NVARCHAR(100),
   sit_number INT,
   company_address NVARCHAR(max)
);
go
create table cell(
   transportation_id INT FOREIGN KEY REFERENCES transportation(id),
   user_id INT,
   sit_number INT
);
go
INSERT INTO  user_(name, email, password, phone_number, role, status)
VALUES ('admin', 'admin@gmail.com', '123456','123456789', 'ADMIN', 1)