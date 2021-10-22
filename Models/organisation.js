'use strict';
const mongoose = require(`mongoose`);
const Schema = mongoose.Schema;

const oganisationStatus = [
    "ACTIVE",
    "BLOCKED",
    "DELETED"
]

let organisations = new Schema({
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    totalUsersLimit: { type: Number },
    usedUsersLimit: { type: Number },
    oganisationStatus: { type: String, enum: oganisationStatus },
});

let organisation = mongoose.model('jest_organisations', organisations);
module.exports = organisation;