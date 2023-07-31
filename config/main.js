module.exports = {
  // Secret key for JWT signing and encryption
  secret: 'super secret passphrase',
  
  // Database connection information
  db_url: 'mongodb://localhost:27017/weplay',
  db_options: {
    db: {native_parser: true},
    server: {poolSize: 5, reconnectTries: 100, reconnectInterval: 60000},
    auth: {
      authdb: 'admin'
    },
    user: 'admin',
    pass: ''
  },
  db_collection_prefix: 'weplay_',

  // Admin default username and password
  admin: {
    user: 'admin',
    pass: '123456',
    realName: '관리자'
  },

  // CORS setting
  allowed_origin: ['http://localhost:3000'],

  // Setting port for server
  expiresIn: 36000, // 1 hr
  port: 3001,
  test_port: 3002,
  test_db: 'mern-starter-test',
  test_env: 'test',

  // file upload path
  upload: '/upload',
  upload_photo: '/photo',
  upload_attachment: '/attachment',
  upload_public: '/public',

  // log 
  logpath: '/logs',
  
  //language setting
  lang: 'ko'
};
