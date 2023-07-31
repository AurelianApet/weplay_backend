const mongoose = require('mongoose');
const _ = require('lodash');
const lang = require('../config/lang');

exports.validate_id = (res, id, errorMsg = lang('invalid_id')) => {
  try {
    let objID = mongoose.Types.ObjectId(id);
    if (objID != id) {
      console.log('validate_id1', id);
      res.status(422).send({
        error: errorMsg
      });
      return false;
    }
  } catch(ex) {
    console.log('validate_id2', id);
    res.status(422).send({
      error: errorMsg
    });
    return false;
  }
  return true;
}

exports.validate_string = (res, value, errorMsg = lang('invalid_string')) => {
  if (!value || value.trim().length === 0) {
    console.log('validate_string', value);
    res.status(422).send({
      error: errorMsg
    }); 
    return false;
  }
  return true;
}

exports.validate_password = (res, value, errorMsg = lang('invalid_password')) => {
  if (!value || value.trim().length < 6) {
    res.status(422).send({
      error: errorMsg
    });
    return false;
  }
  return true;
}

exports.validate_array = (res, value, errorMsg = lang('invalid_array')) => {
  if (!value || value.length === 0) {
    console.log('validate_array', value);
    res.status(422).send({
      error: errorMsg
    });
    return false;
  }
  return true;
}

exports.validate_exist = (res, value, errorMsg = 'Invalid Param') => {
  if ((typeof (value) === 'undefined') || (value === null)) {
    console.log('validate_exist', value);
    res.status(422).send({
      error: errorMsg
    });
    return false;
  }
  return true;
}

exports.validate = (res, object, fields, types) => {
  let errorMsg = [];
  let check = false;
  for(let i=0; i< fields.length; i++){
    const value = object[fields[i]];
    const type = types[i];
    if( (typeof (value) === 'undefined') || (value === null) ) {
      errorMsg.push(fields[i] + ' : ' + lang('require_param')); check = true;
    } else {
      switch(type){
        case 'id':
          if( !value.match(/^[0-9a-fA-F]{24}$/)) {
            errorMsg.push(fields[i] + ' : ' + lang('invalid_id')); check = true;
          }          
          break;
        case 'string': 
          if (value.trim().length == 0) {
            errorMsg.push(fields[i] + ' : ' + lang('invalid_string')); check = true;
          }
          break;
        case 'number': 
          if (typeof(value) !== 'number') {
            errorMsg.push(fields[i] + ' : ' + lang('invalid_number')); check = true;
          }
          break;
        case 'boolean':
          if (typeof(value) !== 'boolean') {
            errorMsg.push(fields[i] + ' : ' + lang('invalid_boolean')); check = true;
          }
          break;
        case 'date': 
          let splits = value.trim().split('-');
          let checkFlag = true;
          const letters = /^[0-9]+$/;
          _.map(splits, ( item ) => {
            if ( item && item.match(letters) ) {
              checkFlag = true;
            } else {
              checkFlag = false;
            }
          });
          if (value.trim().length != 10 || value.trim().split('-').length != 3 || !checkFlag) {
            errorMsg.push(fields[i] + ' : ' + lang('invalid_date')); check = true;
          }
          break;
        case 'array': 
          if ( typeof(value) === 'object' && value.length == 0) {
            errorMsg.push(fields[i] + ' : ' + lang('require_array')); check = true;
          }
          break;
        default: break;
      }
    }    
  }
  if(check) {
    console.log(errorMsg);
    res.status(422).send({
      error: errorMsg
    });
    return false;
  } else {
    return true;
  }

}