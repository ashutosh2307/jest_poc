'use strict';
const mongoose = require('mongoose');
const DB_URL = config.get("MONGO_CONNECTION_URL");


const options = {
    db: {
        native_parser: true
    },
    replset: {
        auto_reconnect:false,
        poolSize: 50,
        socketOptions: {
            keepAlive: 1000,
            connectTimeoutMS: 30000
        }
    },
    server: {
        poolSize: 50,
        socketOptions: {
            keepAlive: 1000,
            connectTimeoutMS: 30000
        }
    }
};


let isConnected;

module.exports.connect = () => new Promise((resolve, reject) => {
  if (isConnected) {
    return resolve();
  }

  return mongoose.connect(DB_URL, options)
    .then((db) => {
        isConnected = db.connections[0].readyState;
        console.log('MONGO: MONGO PRIMARY CONNECTED!!\n');
        resolve();
    }).catch((error) => {
        console.log('MONGO: MONGO PRIMARY ERROR!!\n', error);
        reject(error);
    });
});
