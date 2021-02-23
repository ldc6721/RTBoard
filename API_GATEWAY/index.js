const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const port = 8080;
const router = require('./routes/router.js');

//session
app.use(session({
  secret: 'alternative',
  resave: false,
  saveUninitialized: true
}));

//bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(cors());

//public
app.use(express.static(path.join(__dirname,'../ejs/public')));

//router
app.use('/',router);


//cors setting
// app.get('/',cors(corsOptions),(req,res,next)=>{
//   console.log("fail!");
//   res.send("fail!");
// });


app.listen(port, '0.0.0.0');
