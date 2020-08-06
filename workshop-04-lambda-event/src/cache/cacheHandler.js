const awsSdk = require('aws-sdk');
const REGION = process.env.AWS_REGION ? process.env.AWS_REGION : 'us-east-1';

/**
 * 
 * @param {*} handlerFn 
 */
function createCache(handlerFn) {

    //update AWS config once with clockSkew correction
    //https://docs.amazonaws.cn/AWSJavaScriptSDK/latest/AWS/Config.html#correctClockSkew-property
    awsSdk.config.update({ region: REGION, correctClockSkew: true });
    console.log(`coming inside cache`)
    let allCachePromise = Promise.resolve({ cachedObject: true });
    return function (event, context, callback, ...args) {
        return allCachePromise.then(
            (allCacheData) => {
                // Call the underlying handlerFn with the extra dependency arguments
                return handlerFn(event, context, callback, awsSdk, allCacheData, ...args);
            }
        );
    };
}

module.exports = {
    createCache
};