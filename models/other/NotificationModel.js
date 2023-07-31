const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseApiQuery = require('mongoose-api-query');
const config = require('../../config/main');

const NotificationSchema = new Schema(
  {
    uid: {                // user _id
      type: String,
      required: true,
    },        
    content: String,      // notification content
    
    // additional info
    realName: String,     // user realname 
    tableName: String,    // linked table
    objectId: String,     // linked table's _id
    note1: String,        // reserved
  },
  {
      timestamps: true
  }
);
NotificationSchema.plugin(mongooseApiQuery);
module.exports = mongoose.model(config.db_collection_prefix + 'notifications', NotificationSchema);
