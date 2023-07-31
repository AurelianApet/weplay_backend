const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseApiQuery = require('mongoose-api-query');
const config = require('../../config/main');

const LogSchema = new Schema(
  {
    ip: {
      type: String
    },
    uid: {
      type: String,
    },
    url: {
      type: String
    },
    action: {
      type: String
    },
    did:{
      type: String //document id ( for update, delete )
    }
  },
  {
    timestamps: true
  }
);
LogSchema.plugin(mongooseApiQuery);
module.exports = mongoose.model(config.db_collection_prefix + 'logs', LogSchema);