const express = require('express');
const app = express();
const port = 8085;
const path = require('path');
const cors = require('cors');
require('date-utils');
const ejs = require('ejs');
const router = require('./routes/router');
const bodyParser = require('body-parser');

var corsOptions = {
  origin: 'http://127.0.0.1:8080',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

//cross origin resource sharing
app.use(cors(corsOptions));

//set ejs
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'../ejs/views'));
//app.engine('html',require('ejs').renderFile); //html file rendering

//body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended:true
}));

app.use('/',router);

app.listen(port,()=>{
  console.log(`board service is listening now port at ${port}`);
});
