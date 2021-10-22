'use strict';
const DBFuntions = require(`../CommonFunctions/DBFunctions`);
const SendResponse = require(`../CommonFunctions/SendResponse`);
const Message = require(`../CommonFunctions/message`);
const CommonFunctions = require(`../CommonFunctions/CommonFunctions`);
const Joi = require(`@hapi/joi`);
const mongoose = require(`mongoose`);

const StrengthRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!=@+#\$%\^&\*.\[\]{}()?\-"\/\\,><':;`|_~])(.{8,})/;
const options = { lean: true };
const project = {};

let userModel = require(`../Models/user`);
let organisationModel = require(`../Models/organisation`);

exports.createTeamMember = async (req, res) => {
    try {
        console.log(`[URL: ${req.body}] [START: ${Date.now()}]`);
        
        let accessToken = req.headers.Authorization || req.headers.authorization || "";
        let organisationId = req.headers.organisationId || req.headers.organisationid || "";
        let body = req.body || {};

        if (!body) return SendResponse.sendErrorMessage(res, Message.INVAILD_PARAMETER);
        if (!accessToken) return SendResponse.sendErrorMessage(res, Message.INVALID_ACCESS_TOKEN);

        let email = (body.email || "").trim(),
            password = (body.password || "").trim(),
            firstName = (body.firstName || "").trim(),
            lastName = (body.lastName || "").trim(),
            designation = (body.designation || "").trim(),
            gender = (body.gender || "").trim(),
            userType = (body.userType || "TEAM").trim();

        const dataToValidate = { organisationId, accessToken, email, password, firstName, lastName, designation, gender, userType };
        const validateSchema = Joi.object({
            accessToken: Joi.string().required(),
            organisationId: Joi.string().required(),
            email: Joi.string().email().lowercase().required(),
            password: Joi.string().pattern(StrengthRegex).required(),
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
            designation: Joi.string().allow("").optional(),
            gender: Joi.string().allow("").optional(),
            userType: Joi.string().required(),
        });
    
        const validate = validateSchema.validate(dataToValidate);
        if (!validate || validate.hasOwnProperty("error")) {
            console.error(`[ERROR:${JSON.stringify(validate.error.details)}]`);
            return SendResponse.sendErrorMessage(res, Message.PARAMETER_MISSING);
        }

        let checkUserAuthenticationPayload = { accessToken, userModel, organisationModel, organisationId };
        const checkUserAuthentication = await CommonFunctions.checkUserAuthentication(checkUserAuthenticationPayload);

        let userData = checkUserAuthentication.userData;
        let organisationData = checkUserAuthentication.organisationData;

        if(userData.userType == "BLOCKED") return SendResponse.sendErrorMessage(res, Message.USER_BLOCKED);
        if(organisationData.oganisationStatus == "BLOCKED") return SendResponse.sendErrorMessage(res, "Your organisation blocked, please contact administrator");
        if(organisationData.usedUsersLimit >= organisationData.totalUsersLimit) return SendResponse.sendErrorMessage(res, "Your user quota is over, please contact administrator");
        if(userData.userType != "ADMIN") return SendResponse.sendErrorMessage(res, Message.PERMISSION_ERROR);

        let checkEmailQuery = { email, organisationId };
        let checkEmailResult = await DBFuntions.findOnePromisify(userModel, checkEmailQuery, project, options);
        if(checkEmailResult && checkEmailResult.profileStatus == "ACTIVE") return SendResponse.sendErrorMessage(res, Message.EMAIL_ALREADY_EXISTS);

        let createTeamMember = { 
            organisationId, email, password, firstName, lastName, 
            profileStatus: "ACTIVE", 
            userType: "TEAM", 
            createdAt: Date.now()
        };

        if(designation) createTeamMember["designation"] = designation;
        if(gender) createTeamMember["gender"] = gender;

        let newUserData;

        if(!checkEmailResult) {
            newUserData = await DBFuntions.saveDataPromisify(userModel, createTeamMember);
        } else if(checkEmailResult && checkEmailResult.profileStatus == "DELETED") {
            const updateTeamQuery = { _id: mongoose.Types.ObjectId(checkEmailResult._id) };
            await DBFuntions.updateOnePromisify(userModel, updateTeamQuery, createTeamMember, options);
        } else {
            return SendResponse.somethingWentWrongError(res);
        }

        let updateOrgQuery = { _id: organisationId };
        let updateOrgPayload = { $inc: { usedUsersLimit: 1 }};
        await DBFuntions.updateOnePromisify(organisationModel, updateOrgQuery, updateOrgPayload, options);
        
        let response = {
            userId: checkEmailResult && checkEmailResult._id ? checkEmailResult._id : newUserData._id
        };
        let message = Message.CREATE_SUCCESS;
        return SendResponse.sendSuccessData(res, response, message);

    } catch (error) {
        console.error(`[ERROR:${error}]`);

        if (error.status == 401) return SendResponse.invalidAccessToken(res);
        if (error.type == "CUSTOM" && error.status) {
            return SendResponse.sendCustomResponse(res, error.message || "", error.data || {}, error.flag || 0);
        }
        if (typeof (error) == "string") return SendResponse.sendErrorMessage(res, error);
        return SendResponse.somethingWentWrongError(res);
    }
}