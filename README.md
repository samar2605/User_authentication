# User_authentication

## It is a simple user signup and login page, which authenticate the existing user and adds new user to the database

### To preview this in your system, download or clone the repository then install all the node_modules using 
``` npm install```

### After installing, just run command 
``` npm start``` 
### to run the server and go to http://localhost:3000/ 

#### You will have to set up the mySQL data base with the given configuration 
  ```
  host: "localhost",
  user: "root",
  password: "password",
  database: "test",
  ```
#### Run these queries in the mySQL 
```
CREATE DATABASE test;
USE test;

CREATE TABLE users (
    UserUno int PRIMARY KEY auto_increment,
    firstName varchar(100),
    lastName varchar(100),
    userName varchar(100) unique,
    password varchar(100),
    confirmPassword varchar(100),
    email varchar(100) unique,
    mobile bigint
);
```
