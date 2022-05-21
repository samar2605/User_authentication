const { createPool } = require("mysql2");
const express = require("express");

const bodyParser = require("body-parser");
const res = require("express/lib/response");

const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();
app.use(express.static("./style"));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'pug');

const pool = createPool({
  host: "localhost",
  user: "root",
  password: "password",
  database: "test",
  connectionLimit: 10,
});

app.get("/", function (req, res) {
  res.sendFile("index.html", { root: __dirname });
});

app.post("/register", (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const userName = req.body.userName;
  const passWord = req.body.passWord;
  const conPassWord = req.body.conPassWord;
  const eMail = req.body.eMail;
  const mobileNumber = req.body.mobileNumber;

  console.log(req.body);
  console.log("successful");
  pool.query(
    "SELECT * FROM users WHERE userName = ?",
    [userName],
    (err, rows, fields) => {
      if (err) console.log(err);
      else {
        if (rows.length > 0) {
          res.send({ message: "username already exist" });
        }
        else {
          pool.query(
            "SELECT * FROM users WHERE email = ?",
            [eMail],
            (err, rows, fields) => {
              if (err) console.log(err);
              else {
                if (rows.length > 0) {
                  res.send({ message: "email already exist" });
                } else {
                  const same = passWord.localeCompare(conPassWord);
                  if (same == 0) {
                    bcrypt.hash(passWord, saltRounds, (err, hash) => {
                      if (err) {
                        console.log(err);
                      }
                      pool.query(
                        "INSERT INTO users (firstName,lastName,userName,password,confirmPassword,email,mobile) VALUES (?,?,?,?,?,?,?)",
                        [firstName, lastName, userName, hash, hash, eMail, mobileNumber],
                        (err, result) => {
                          if (err) console.log(err);
                          else {
                            console.log(result);
                            res.render('signup', { title: 'Logged in', user: userName, first: firstName, last: lastName, email: eMail, mobile: mobileNumber });
                          }
                        }
                      );
                    });
                  }
                  else {
                    res.send({ message: "Password and Confirm Password are not same" });
                  }
                }
              }
            });
        }
      }
    });
});

app.get("/login", (req, res) => {
  if (req.session.user) {
    res.send({ loggedIn: true, user: req.session.user });
  } else {
    res.send({ loggedIn: false });
  }
});

app.post("/login", (req, res) => {
  const UserName = req.body.UserName;
  const PassWord = req.body.PassWord;
  console.log("success");
  console.log(UserName);
  console.log(PassWord);

  pool.query(
    "SELECT * FROM users WHERE userName = ?",
    [UserName],
    (err, row, fields) => {
      if (err) console.log(err);
      else {
        if (row.length > 0) {
          bcrypt.compare(PassWord, row[0].password, (error, response) => {
            if (response) {
              res.render('login', { title: 'Logged in', user: UserName, first: row[0].firstName, last: row[0].lastName, email: row[0].email, mobile: row[0].mobile });
            } else {
              res.send({ message: "Wrong username/password combination!" });
            }
          });
        } else {
          res.send({ message: "User doesn't exist" });
        }
      }
    }
  );
});

app.listen(3000, () => {
  console.log("running server");
});
