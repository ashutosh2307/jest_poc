/**
* @file Contains the commonfunctions of the dashboard.
*/

const mongoose = require("mongoose");
const DBFuntions = require(`./DBFunctions`);
const Message = require(`./Message`);
const Utils = require(`./Utils`);
const options = { lean: true };
const project = {};


/**
* @summary Function that validate the user & it's organisation with the help of client access token and return user + organisation data.
* @author Ashutosh Sharma
*
* @param {String} accessToken The client access token
* @param {String} userModel The mongo user collection
* @param {String} organisationModel The mongo organisation collection
* @param {String} organisationId The client organisationId
*
* @requires accessToken
* 
* @todo
* - Remove the Bearer from the client access token.
* - Decode the client access token.
* - Compare access token organisationId with client organisationId (In headers). If not same return 401 error.
* - Get user data and organisation data with the help of decoded data. If data not exists return 401 error.
* - Check token is expired or not. Token created time should be less than 24hours
* - Validate organisation - should not blocked.
*
* @return {Object} The token user data and it's organisation data.
*
* @improvements
* - Will remove loop from inside the loop.
* - Will use logger instead of console.
*/

module.exports.checkUserAuthentication = async (payload) => {
    try {
        let { accessToken, userModel, organisationModel, organisationId } = payload;

        if (!accessToken) return Promise.reject(Message.INVALID_ACCESS_TOKEN);
        if (accessToken.startsWith("Bearer ")) accessToken = accessToken.substring(7, accessToken.length);

        const decodedData = Utils.decipherToken({ token: accessToken });
        if (!decodedData || !decodedData.auth) return Promise.reject(Message.INVALID_ACCESS_TOKEN);
        if (decodedData.data.tokenType != "LOGIN") return Promise.reject(Message.INVALID_ACCESS_TOKEN);

        const userId = decodedData.data.userId;
        const tokenOrganisationId = decodedData.data.organisationId;

        if(organisationId!= tokenOrganisationId) return Promise.reject(Message.INVALID_ACCESS_TOKEN);

        let dddddddd = await DBFuntions.findOnePromisify(userModel, {}, project, options);

        console.log("dddd ---- ", dddddddd)

        let getUserQuery = { _id: mongoose.Types.ObjectId(userId), profileStatus: { $ne: "DELETED" } };
        let organisationQuery = { _id: tokenOrganisationId, oganisationStatus: { $ne: "DELETED" } };

        let userDataPromise = DBFuntions.findOnePromisify(userModel, getUserQuery, project, options);
        let organisationDataPromise = DBFuntions.findOnePromisify(organisationModel, organisationQuery, project, options);
        let [userData, organisationData] = await Promise.all([userDataPromise, organisationDataPromise]);
       
        console.log("userData", userData, organisationData, getUserQuery, organisationQuery)

        if(!userData || !organisationData) return Promise.reject(Message.USER_NOT_EXISTS);
        if(userData.accessToken != accessToken) return Promise.reject(Message.INVALID_ACCESS_TOKEN);
        // if(parseInt(userData.tokenCreatedAt)  + 24 * 60 * 60 * 1000 < Date.now()) return Promise.reject(Message.INVALID_ACCESS_TOKEN);
        if(organisationData.oganisationStatus == "BLOCKED") return Promise.reject(Message.ORGANISATION_BLOCKED);
        
        let details = {
            userData, organisationData
        };
        return details;
    } catch (error) {
        console.error(`[FUNCTION: checkUserAuthentication] [ERROR: ${error}]`);
        return Promise.reject(error);
    }
}

exports.checkEmailExists = (payload) => {
    let { model, email } = payload;
    let query = { email };
    return DBFuntions.findOnePromisify(model, query, project, options);
}

exports.getOrganisationDetails = (payload) => {
    let { model, organisationId } = payload;
    let query = { _id: organisationId };
    return DBFuntions.findOnePromisify(model, query, project, options);
}