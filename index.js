// Importing Node modules and initializing Express
const express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  logger = require('morgan'),
  path = require('path');
  router = require('./router');
  mongoose = require('mongoose'),
  config = require('./config/main');
  cors = require('cors');
  
const fileUpload = require('express-fileupload');
const upload = require('./utils/upload');
const UserCtrl = require('./controllers/account/UserCtrl');

// Database Setup
mongoose.connect(config.db_url, config.db_options)
  .then(ret => {
    // create admin if not exist
    UserCtrl.createAdmin(); 
    console.log('MongoDB Connected! MainAPI!!!')
  })
  .catch(ret => {
    console.log('MongoDB failed!', ret);
  });

// prepare upload folder
upload.create_upload();

// Start the server
let server;
if (process.env.NODE_ENV != config.test_env) {
  server = app.listen(config.port);
  console.log(`Your server is running on port ${config.port}.`);
} else{
  server = app.listen(config.test_port);
}

// Enable CORS from client-side
app.use((req, res, next) => {
  let origin = req.headers.origin;
  if(config.allowed_origin.indexOf(origin) >= 0) {
    // res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

// Setting up basic middleware for all Express requests
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false })); // Parses urlencoded bodies
app.use(bodyParser.json()); // Send JSON responses
app.use(fileUpload());
app.use(logger('dev')); // Log requests to API using morgan
app.use(express.static(config.upload.substr(1) + '/' + config.upload_public ));

// Import routes to be served
router(app);

// necessary for testing
module.exports = server;
