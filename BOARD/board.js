const express = require('express');
const app = express();
const port = 8085;
const path = require('path');
const cors = require('cors');
require('date-utils');
const ejs = require('ejs');
const router = require('./routes/router');
const bodyParser = require('body-parser');

//set ejs
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'../ejs/views'));
//app.engine('html',require('ejs').renderFile); //html file rendering

//body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended:true
}));

//cross origin resource sharing
app.use(cors());

app.use('/',router);

app.listen(port,()=>{
  console.log(`board service is listening now port at ${port}`);
});
