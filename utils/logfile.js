const fs = require('fs');
const path = require('path');
const util = require('util')
const config = require('../config/main');

exports.saveLogFile = (type, msg) => {
    try{
        msg = ConvertToCSV(msg);
                    
        let dir = path.join(__dirname, '..',config.logpath);
        if(!fs.existsSync(dir)){
            fs.mkdirSync(dir)
        }
        let filepath = dir + '/' + getTimestamp() + '.log';
        let wstream = fs.createWriteStream(filepath, {flags : 'a+'});
        msg = type + "," + msg;
        wstream.write(msg + '\n');
        wstream.end();
    } catch (err) {
        console.log(err);
    }
}

function getTimestamp(){
	function format_d2(n) {
		if(n < 9) return "0" + n;
		return n;
	}
	const today = new Date();
    return today.getFullYear() + format_d2(parseInt(today.getMonth()+1)) + format_d2(today.getDate());// + "_" + d2(today.getHours())// + d2(today.getMinutes())	
}

function ConvertToCSV(msg) {
    let str = '';
    if(typeof msg == 'object') {
        str += msg.ip + ',';
        str += msg.url + ',';
        str += msg.uid + ',';
        str += msg.action + ',';
        str += msg.did;
    } else {
        str = msg;
    }
    
    
    return str;
/*
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';
    console.log("length = ", array.length);
    console.log("length = ", array);
    for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
            if (line != '') line += ','

            line += array[i][index];
        }

        str += line + '\r\n';
    }
*/
    return "str";
}