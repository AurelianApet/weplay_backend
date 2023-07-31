const mongoose = require('mongoose');
const config = require('../../config/main');

const Schema = mongoose.Schema;

const LoginUserSchema = new Schema(
  {
    userID: String,
    realName: String,
    ip: String,
    lastAccess: Date,
    expire: Date
  },
  {
    timestamps: true
  }
);
module.exports = mongoose.model(config.db_collection_prefix + 'login_user', LoginUserSchema);
