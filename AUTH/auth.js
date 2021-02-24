const express = require('express');
const app =express();
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const router = require('./routes/router');
const port = 8084;


var corsOptions = {
  origin: 'http://127.0.0.1:8080',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));
//set ejs
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'../ejs/views'));
//app.engine('html',require('ejs').renderFile); //html file rendering

//bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));


//set cors
let corsOption = {
  origin: 'http://localhost:8080',
  optionsSuccessStatus:200
};

app.use(cors());

app.use('/',router);

app.listen(port,()=> {
  console.log(`now auth server is running at http://localhost:${port}`);
});
