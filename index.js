const { createPool } = require("mysql2");
const express = require("express");
//const cors = require("cors");

const bodyParser = require("body-parser");
const res = require("express/lib/response");

const app = express();
app.use(express.static("./style"));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine','pug');
const pool = createPool({
  host: "localhost",
  user: "root",
  password: "password",
  database: "test",
  connectionLimit: 10,
});

// pool.query("INSERT INTO users VALUES (2,'rajput','yash')",(err,result,fields)=>{
//     if(err){
//         return console.log(err);
//     }
//     return console.log(result);
// })

// pool.query("SELECT * FROM users",(err,result,fields)=>{
//     if(err){
//         return console.log(err);
//     }
//     return console.log(result);
// })

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
    "INSERT INTO users (firstName,lastName,userName,password,confirmPassword,email,mobile) VALUES (?,?,?,?,?,?,?)",
    [firstName, lastName, userName, passWord, conPassWord, eMail, mobileNumber],
    (err, result) => {
      if (err) console.log(err);
      else {
        console.log(result);
        res.render('signup',{title:'Logged in', user:userName});
      }
    }
  );
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
    (err, row,fields) => {
      if (err) console.log(err);
      else {
        console.log(row);
        res.render('login',{title:'Logged in', user:UserName});
      }
    }
  );
  // if (req.session.user) {
  //   res.send({ loggedIn: true, user: req.session.user });
  // } else {
  //   res.send({ loggedIn: false });
  // }
});

// app.post("/submit", (req, res) => {
//   const username = req.body.username;
//   const password = req.body.password;

//   db.query(
//     "SELECT * FROM users WHERE username = ?;",
//     username,
//     (err, result) => {
//       if (err) {
//         res.send({ err: err });
//       }

//       if (result.length > 0) {
//         bcrypt.compare(password, result[0].password, (error, response) => {
//           if (response) {
//             req.session.user = result;
//             console.log(req.session.user);
//             res.send(result);
//           } else {
//             res.send({ message: "Wrong username/password combination!" });
//           }
//         });
//       } else {
//         res.send({ message: "User doesn't exist" });
//       }
//     }
//   );
// });

app.listen(3000, () => {
  console.log("running server");
});
