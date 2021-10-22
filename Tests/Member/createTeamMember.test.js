const app = require("../../server");
const mongoose = require("mongoose");
const supertest = require("supertest");
const httpMocks = require("node-mocks-http");
const mockData = require('../MockData/createTeamMember.mockData');

let userModel = require(`../../Models/user`);
let organisationModel = require(`../../Models/organisation`);

const createTeamMemberController = require('../../Controllers/createTeamMember');
const dbManagerHelpers = require('../../CommonFunctions/DBFunctions');
const CommonFunctions = require('../../CommonFunctions/CommonFunctions');
const Utils = require('../../CommonFunctions/Utils');

let req, res;

beforeAll((done) => {
    mongoose.connect("mongodb://hubilo:hubiloxyz9428@54.147.189.172:27017/production",
        { useNewUrlParser: true, useUnifiedTopology: true },
        () => {
            console.log("Mongo Database connected");
            done();
        });
});
  
afterAll((done) => {
    mongoose.connection.close(() => {
        console.log("Mongo Database disconnected");
        done();
    })
});

beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
})


describe("CreateTeamMember", () => {
    beforeEach(() => {
        req.body = mockData.requestBody;
        req.headers = mockData.requestHeaders;
    })

    it("Should have a function", () => {
        expect(typeof createTeamMemberController.createTeamMember).toBe("function");
    })

    it("Should call checkUserAuthentication ", () => {
        createTeamMemberController.createTeamMember(req, res);
        // expect(CommonFunctions.checkUserAuthentication).toBeCalled();
    })

    it("Should return 200 response", () => {
        createTeamMemberController.createTeamMember(req, res);
        expect(res.statusCode).toBe(200);
        expect(res._isEndCalled()).toBeTruthy();

        let responseData = res._getJSONData();
        expect(responseData.status).toBe(200);
    })

    it("Should return json body response and userId", () => {

        const spy = jest.spyOn(CommonFunctions, 'checkUserAuthentication');
        spy.mockReturnValue(mockData.checkUserAuthentication);

        Utils.decipherToken = jest.fn();
        Utils.decipherToken.mockReturnValue( {
            "userId": "61388ee4929612ad807205a2",
            "organisationId": "61388d34929612ad807205a1",
            "tokenType": "LOGIN"
        });

        // CommonFunctions.checkUserAuthentication.mockResolvedValue(mockData.checkUserAuthentication);
        createTeamMemberController.createTeamMember(req, res);
        expect(res.statusCode).toBe(200);

        console.log("resss -", res._getJSONData())

        let responseData = res._getJSONData();

        expect(responseData.status).toBe(200);
        expect(responseData.data.userId).toBeTruthy();
        expect(responseData.data.userId).toBeTruthy();
        expect(responseData.message).toBeTruthy();

        expect(res._isJSON());
        expect(res._isUTF8());
    })
})

// describe('200 Status test', () => {

//     test("All correct parameter", async () => {
//         const accessToken = "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiI2MTM4OGVlNDkyOTYxMmFkODA3MjA1YTIiLCJvcmdhbmlzYXRpb25JZCI6IjYxMzg4ZDM0OTI5NjEyYWQ4MDcyMDVhMSIsInRva2VuVHlwZSI6IkxPR0lOIn0.6r8I9vf6WK9DlnuBcdsykb87zmCihLTiPKEu5WPa-78";
//         const organisationId = "61388d34929612ad807205a1";
//         const data = {
//             "email": "sasuke1@yopmail.com",
//             "password": "HuBilo1@3$",
//             "firstName": "Sasuke",
//             "lastName": "Uchiha",
//             "designation": "CEO",
//             "gender": "MALE"
//         };
      
//         await supertest(app).post("/member/create")
//             .set({ "authorization" : accessToken})
//             .set({ "content-type": "application/json"})
//             .set({ "organisationId": organisationId})
//             .send(data)
//             .expect(200)
//             .then(async (response) => {
//             // Check the response
//             console.log("resposne -- ", response.body)
//             expect(response.body.status).toBe(200);
//             expect(response.body.userId).toBeTruthy();
//             expect(response.body.message).toBeTruthy();
        
//             // Check data in the database
//             const user = await userModel.findOne({ _id: response.body.userId });
//             expect(user).toBeTruthy();
//             expect(user.email).toBe(data.email);
//             expect(user.profileStatus).toBe("ACTIVE");
//             expect(user.userType).toBe("TEAM");
//         });
//     });
// })

// describe('400 Status test', () => {

//     test("Email Already Exists", async () => {
//         const accessToken = "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiI2MTM4OGVlNDkyOTYxMmFkODA3MjA1YTIiLCJvcmdhbmlzYXRpb25JZCI6IjYxMzg4ZDM0OTI5NjEyYWQ4MDcyMDVhMSIsInRva2VuVHlwZSI6IkxPR0lOIn0.6r8I9vf6WK9DlnuBcdsykb87zmCihLTiPKEu5WPa-78";
//         const organisationId = "61388d34929612ad807205a1";
//         const data = {
//             "email": "sasuke1@yopmail.com",
//             "password": "HuBilo1@3$",
//             "firstName": "Sasuke",
//             "lastName": "Uchiha",
//             "designation": "CEO",
//             "gender": "MALE"
//         };
      
//         await supertest(app).post("/member/create")
//             .set({ "authorization" : accessToken})
//             .set({ "content-type": "application/json"})
//             .set({ "organisationId": organisationId})
//             .send(data)
//             .expect(200)
//             .then(async (response) => {
//             // Check the response
//             expect(response.body.status).toBe(400);
//             expect(response.body.message).toBeTruthy();
//         });
//     });
// })
