'use strict';


exports.handler = (event, context, callback) => {
    console.log(event.path);
    callback(null, event);
}
