const fs = require('fs');
const path = require('path');
const config = require('../config/main');

exports.create_upload = function create_upload() {
  let rootPath = path.join(__dirname, '..', config.upload);
  if (!fs.existsSync(rootPath)) {
    console.log('upload folder created');
    fs.mkdirSync(rootPath);
  }
  let photo = path.join(rootPath, config.upload_photo);
  if (!fs.existsSync(photo)) {
    console.log('upload photo folder created');
    fs.mkdirSync(photo);
  }
  let attachment = path.join(rootPath, config.upload_attachment);
  if (!fs.existsSync(attachment)) {
    console.log('upload attachment folder created');
    fs.mkdirSync(attachment);
  }
  let public = path.join(rootPath, config.upload_public);
  if (!fs.existsSync(public)) {
    console.log('upload public folder created');
    fs.mkdirSync(public);
  }
}

exports.move_to_upload = function move_to_upload(fileObj, mFile, callback) {
  let folderPath = path.join(__dirname, '..', config.upload, config.upload_attachment);
  if(!fileObj || !fileObj.mv) {
    callback('invalid file id = ' + id);
    return;
  }
  fileObj.mv(folderPath + '/' + mFile._id, function(err) {
    if (err) {
      callback('file move failed = ', err);
    } else {
      callback(null, mFile);
    }
  });
}

exports.move_to_upload_public = function move_to_upload(fileObj, mFile, callback) {
  let folderPath = path.join(__dirname, '..', config.upload, config.upload_public);
  if(!fileObj || !fileObj.mv) {
    callback('invalid file id = ' + id);
    return;
  }

  const filename = mFile._id + '.' + mFile.name.split('.')[mFile.name.split('.').length - 1];

  fileObj.mv(folderPath + '/' + filename, function(err) {
    if (err) {
      callback('file move failed = ', err);
    } else {
      callback(null, mFile);
    }
  });
}

exports.get_uploaded_attachment = function get_uploaded_attachment(fid, isPublic, callback) {
  const uploadPath = !isPublic ? config.upload_attachment : config.upload_public;
  let attachmentPath = path.join(__dirname, '..', config.upload, uploadPath);
  fs.readFile(attachmentPath + '/' + fid, (err, content) => {
    callback(err, content);
  })
}