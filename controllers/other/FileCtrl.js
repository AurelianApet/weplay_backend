// --- Library ---
const _                     = require('lodash');
const async                 = require('async');
const path                  = require('path');
const contentDisposition    = require('content-disposition');

// --- Model ---
const File                  = require('../../models/other/FileModel');

// --- Controller ---

// --- Utils ---
const upload                = require('../../utils/upload');
const validation            = require('../../utils/validation');
const helpers               = require('../../utils/helpers');
const response              = require('../../utils/response');
const lang                  = require('../../config/lang');

const getFileExtension = ( aStr ) => {
    if (!aStr) {
      return 'xxx';
    }
    const ext = aStr.substr(aStr.lastIndexOf('.') + 1, aStr.length);
    if (!ext) return 'xxx';
    return ext;
}

exports.downloadFile = function (req, res, next) {
    const id = req.params.id;
    const isPublic = !!req.query.isPublic;
    // validation
    if (!validation.validate_id(res, id, lang('invalid_userID'))) {
        return;
    }

    File
    .findOne({_id: id})
    .exec(function(err, file) {
        let check = false, send_file = null;
        send_file = file;
        if (err) {
            res.status(400).json({ error: lang('fail_fetchall') });
            return next(err);
        }

        if(file.isPublic == true ) {
            check = true;
        } else {
            _.map(file.allowedUsers, (item) => {
                if(item.uid == req.user._id) {
                    check = true;
                }
            });
        }

        if(check){
            let fileName = send_file._id;
            if (isPublic) {
                // append file extension
                fileName += '.' + getFileExtension(send_file.name);
            }
            upload.get_uploaded_attachment(fileName, isPublic, (err, data) => {
                if (err) {
                    return res.status(400).send({
                        error: lang('fail_fetchall')
                    });
                } else {
                    // console.log('file.name', file.name);
                    res.writeHead(200, {
                        'Content-Type': send_file.mime + '***' + encodeURIComponent(send_file.name),
                        'Content-Encoding': 'utf8',
                        'Cache-Control': 'private, no-transform, no-store, must-revalidate',
                        'Content-Disposition': contentDisposition(send_file.name),
                        'Expires': 0,
                        'Content-Transfer-Encoding': 'binary',
                        'Content-Length': send_file.filesize
                        // 'Cache-Control': 'private, no-transform, no-store, must-revalidate'
                    });
                    res.end(data, 'binary');
                }
            });
        } else {
            res.status(403).send({
                error: lang('res_403')
            });
        }
    })
}

exports.uploadFiles = function (req, res, next) {  
    const files = req.files;

    if (!files) {
        return res.status(200).json({
            success: true,
            files: []
        });
    }

    let keys = Object.keys(files);

    // async call
    let pos = 0, successedFiles = [];
    async.whilst(
        function test() {
            return pos < keys.length;
        },
        function(next) {
            const file = files[keys[pos]];
            async.waterfall([
                function(callback) {
                    // push to database
                    const mFile = new File({
                        name: file.name,
                        mime: file.mimetype,
                        md5: file.md5,
                        filesize: file.data ? file.data.length : 0
                    });
                    mFile.save((err1, created) => {
                        if (err1) {
                            callback(err1);
                        } else {
                            callback(null, created);
                        }
                    })
                },
                function(createdFile, callback) {
                    upload.move_to_upload(file, createdFile, callback);
                }
            ], function(err, result){
                if(err) {
                    console.log('file upload error', err, file.name);
                } else {
                    successedFiles.push(result);
                }
                pos++;
                next();
            })
        },
        function (err) {
        // done
            if (err) {
                return next(err);
            } else {
                return res.status(200).json({
                    uploaded: successedFiles
                });
            }
        }
    )
};

exports.uploadPublicFiles = function (req, res, next) {  
    const files = req.files;

    if (!files) {
        return res.status(200).json({
            success: true,
            files: []
        });
    }

    let keys = Object.keys(files);

    // async call
    let pos = 0, successedFiles = [];
    async.whilst(
        function test() {
         return pos < keys.length;
        },
        function(next) {
            const file = files[keys[pos]];
            async.waterfall([
                function(callback) {
                    // push to database
                    const mFile = new File({
                        name: file.name,
                        mime: file.mimetype,
                        md5: file.md5,
                        filesize: file.data ? file.data.length : 0
                    });
                    mFile.save((err1, created) => {
                        if (err1) {
                            callback(err1);
                        } else {
                         callback(null, created);
                        }
                    })
                },
                function(createdFile, callback) {
                    upload.move_to_upload_public(file, createdFile, callback);
                }
            ], function(err, result){
                if(err) {
                    console.log('file upload error', err, file.name);
                } else {
                    successedFiles.push(result);
                }
                pos++;
                next();
            })
        },
        function (err) {
            // done
            if (err) {
                return next(err);
            } else {
                return res.status(200).json({
                    uploaded: successedFiles
                });
            }
        }
    )
};

exports.deleteOne = function (req, res, next) {
    const id = req.params.id;
    
    // validation
    if (!validation.validate_id(res, id, '잘못된 ID가 들어왔습니다.')) { return; }

    File.deleteOne(
        { _id: id }, 
        (err, doc) => {
            if (err) { return next(err); }
            response.delete_response(res, doc);
        }
    );
};

exports.decodeCSV = function(req, res, next) {
    try{
        const csvfile = Object.keys(req.files)[0];
        const strCSV = req.files[csvfile].data.toString();
        const decode = helpers.csv_decode(strCSV);
        const objectArr = helpers.makeObjectArray(decode);
        res.status(200).send({uploaded: objectArr});
    } catch(err) {
        return res.status(422).send({ error: '해석오유입니다.' });
    }
}

