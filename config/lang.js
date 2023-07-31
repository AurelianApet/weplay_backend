const _ = require('lodash');
const config = require('./main');

module.exports = function(key) {
    let languages = {};
    
    switch (config.lang) {
      case 'ko':
          languages = require('./languages/ko');
          break;
      default:
          languages = {};
    }
    return _.get(languages, key) || '';
}
