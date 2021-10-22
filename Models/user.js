'use strict';
const mongoose = require(`mongoose`);
const Schema = mongoose.Schema;

const profileStatus = [
    "ACTIVE",
    "BLOCKED",
    "DELETED"
]

const userType = [
    "ADMIN",
    "TEAM"
]

let users = new Schema({
    organisationId: { type: Schema.Types.ObjectId, ref: 'organisations', required: true },
    email: { type: String, required: true, lowercase: true },
    password: { type: String},

    firstName: { type: String, required: true },
    lastName: { type: String },
    designation: { type: String },
    gender: { type: String },
    phone: { type: String, trim: true },
    phoneCode: { type: String },

    accessToken: { type: String },
    tokenCreatedAt: { type: Number },
    lastLoginAt: { type: Number },

    profileStatus: { type: String, enum: profileStatus },
    userType: { type: String, enum: userType },
    createdAt: { type: Number },
});

// users.index({ email: 1 }, { sparse: true });
// users.index({ organisationId: 1 }, { sparse: true });

let user = mongoose.model('jest_users', users);
// user.createIndexes();
// user.on('index', (err) => err ? console.log(err) : "");
module.exports = user;