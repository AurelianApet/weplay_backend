const _ = require('lodash');

exports.findFromArray = (srcArray, path, type, value) => {
    let found = null;
    _.map(srcArray, (item, index) => {
        if ( !path ) {
            if ( item === value ) {
                found = item;
            }
        } else {
            if ( type === '_id' ) {
                if (_.get(item, path).toString() === value.toString()) {
                    found = item;
                }
            } else {
                if (_.get(item, path) === value) {
                    found = item;
                }
            }
        }
    })
    return found;
}

exports.findItemsFromArray = (srcArray, path, type, values) => {
    let result = [];
    _.map(srcArray, (item) => {
        _.map(values, (value) => {
            if ( !path ) {
                if ( item === value ) {
                    result.push(item);
                }
            } else {
                if ( type === '_id' ) {
                    if ( _.get(item, path).toString() === value.toString() ) {
                        result.push(item);
                    }
                } else {
                    if ( _.get(item, path) === value ) {
                        result.push(item);
                    }
                }
            }
        });
    });

    return result;
}