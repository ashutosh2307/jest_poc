'use strict';
process.env.NODE_ENV = 'demo';
process.env.NODE_CONFIG_DIR = 'Config/';
global.config = require('config');

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

require('./CommonFunctions/MongoConnection').connect();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true, parameterLimit: 50000 }));
app.use(bodyParser.json({ limit: '10mb' }));

app.post('/member/create', require('./Controllers/createTeamMember').createTeamMember);

app.listen(3005, () => {
    console.log("LISTEINING PORT 3005")
})

module.exports = app;