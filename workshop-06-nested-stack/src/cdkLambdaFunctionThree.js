'use strict';

let handler = (event, context, callback, awsSdk, allCachedData) => {


    console.log('function awsSdk, allCachedData value1 =', JSON.stringify(event));
    console.log('value2 =', event.key2);
    console.log('value3 =', event.key3);
    callback(null, event.key1);
};


module.exports = {
    handler: handler
};