'use strict';
const message = require('./Message');

exports.invalidAccessToken = (res, flag = {}, language) => {
    let msg = language || message.INVALID_ACCESS_TOKEN[0];
    let errMgs = { status: 401, message: msg, flag: 0 };
    Object.assign(errMgs, flag);
    sendData(errMgs, res);
};

exports.parameterMissingError = (res, flag = {}, language) => {
    let msg = language || message.PARAMETER_MISSING[0];
    let errMgs = { status: 400, message: msg, flag: 0 };
    Object.assign(errMgs, flag);
    sendData(errMgs, res);
};

exports.parameterInvalidError = (res, flag = {}, language) => {
    let msg = language || message.PARAMETER_INVALID[0];
    let errMgs = { status: 400, message: msg, flag: 0 };
    Object.assign(errMgs, flag);
    sendData(errMgs, res);
};

exports.sendErrorMessage = (res, err, flag = {}) => {
    let errMgs = {
        status: 400,
        message: err,
        flag: 0,
    };
    Object.assign(errMgs, flag);
    sendData(errMgs, res);
};

exports.wrongPassword = (res, flag = {}) => {
    let msg = message.WORNG_CREDENTIALS[language] || message.WORNG_CREDENTIALS[0];
    let errMgs = {
        status: 400,
        message: msg,
        flag: 0
    }
    Object.assign(errMgs, flag);
    sendData(errMgs, res);
};

exports.somethingWentWrongError = (res, flag = {}, language) => {
    let msg = message.SOMETHING_WENT_WRONG[language] || message.SOMETHING_WENT_WRONG[0];
    let errMgs = {
        status: 400,
        message: msg,
        flag: 0
    }
    Object.assign(errMgs, flag);
    sendData(errMgs, res);
};

exports.sendCustomError = (res, status, message, flag = {}) => {
    let msg = { status: status, message: message, flag: flag };
    sendData(msg, res);
};

exports.sendCustomErrorWithData = (res, status, message, errorData = {}, flag = {}) => {
    let msg = { status: status, message: message, errorData: errorData, flag: flag };
    sendData(msg, res);
};

exports.sendSuccessMessage = (res, message = "", flag = {}) => {
    let successData = { status: 200, message: message || "", flag: 0 };
    //Object.assign(successData, flag);
    sendData(successData, res);
};

exports.sendSuccessData = (res, data, message = "", flag = {}) => {
    var successData = { status: 200, data: data, message: message };
    Object.assign(successData, flag);
    sendData(successData, res);
};

exports.sendSuccessDataAndMessage = (res, data, message, flag = {}) => {
    var successData = { status: 200, data: data, message: message, flag: 0 };
    Object.assign(successData, flag);
    sendData(successData, res);
}

exports.sendCustomResponse = (res, message, data, status, flag = {}) => {
    let respData = { status: status, message: message, data: data, flag: flag, };
    Object.assign(respData, flag);
    sendData(respData, res);
}

function sendData(data, res) {
    res.type('json');
    res.jsonp(data);
}

exports.sendData = function (data, res) {
    res.type('json');
    res.jsonp(data);
};