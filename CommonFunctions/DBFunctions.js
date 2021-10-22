'use strict';

module.exports.aggregateDataPromisify = (model, group) => {
    return new Promise((resolve, reject) => {
        return model.aggregate(group, (err, result) => err ? reject(err) : resolve(result));
    });
}

module.exports.findOnePromisify = (model, conditions, project, options) => {
    return new Promise((resolve, reject) => {
        return model.findOne(conditions, project, options, (err, result) => err ? reject(err) : resolve(result));
    });
}

module.exports.findManyPromisify = (model, conditions, project, options) => {
    return new Promise((resolve, reject) => {
        return model.find(conditions, project, options, (err, result) => err ? reject(err) : resolve(result));
    });
}

module.exports.updateManyPromisify = (model, conditions, update, options) => {
    return new Promise((resolve, reject) => {
        return model.updateMany(conditions, update, options, (err, result) => err ? reject(err) : resolve(result));
    });
}

module.exports.countPromisify = (model, conditions) => {
    return new Promise((resolve, reject) => {
        return model.countDocuments(conditions, (err, result) => err ? reject(err) : resolve(result));
    });
}

module.exports.saveDataPromisify = (model, data) => {
    return new Promise((resolve, reject) => {
        return new model(data).save((err, result) => err ? reject(err) : resolve(result));
    });
}

module.exports.updateOnePromisify = (model, conditions, update, options) => {
    options["useFindAndModify"] = false;
    return new Promise((resolve, reject) => {
        return model.findOneAndUpdate(conditions, update, options, (err, result) => err ? reject(err) : resolve(result));
    });
}