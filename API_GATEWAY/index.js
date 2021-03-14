const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const redis = require('redis');
let redis_client = redis.createClient();
const session = require('express-session');
let RedisStore = require('connect-redis')(session);
const port = 8080;
const router = require('./routes/router.js');

//session
app.use(session({
  secret: 'alternative',
  resave: false,
  saveUninitialized: true,
  store:new RedisStore({client:redis_client})
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

app.listen(port,()=>{
  console.log(`now api gateway is listeng on ${port}`);
});
