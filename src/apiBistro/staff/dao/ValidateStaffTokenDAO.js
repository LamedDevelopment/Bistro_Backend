
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require('../../../utils/config');

const forgotPass = require('../model/forgotPass');
const { applogger } = require("../../../utils/logger");
const { milisegundos, obtenerMilisegundos } = require("../../helper/global/times");
const staffActivity = require("../model/staffActivity");

const currentDate = new Date();

const validateStaffTokenDAO = async (userToken) => { 
    try {
        const UserTokenDB = new validateStaff({
            email: userToken.email,
            datetimeMilliseconds: userToken.datetimeMilliseconds,
            token: userToken.token,
            dateCreate: userToken.dateCreate
        })
        await UserTokenDB.save()
        return
    } catch (error) {
        applogger.error(`Error en VALUSTKNDAO: validateUserTokenDAO: error: ${error}`);
        return {
            ok: false,
            msg: 'VALUSTKND4O-01: ' + error.code
        }
    }
}

const validateStaffTokenForgotPassDAO = async (userToken) => { 
    try {
        const UserTokenDB = new forgotPass({
            email: userToken.email,
            datetimeMilliseconds: userToken.datetimeMilliseconds,
            token: userToken.token,
            codValidateUser: userToken.codValidateUser,
            dateCreate: userToken.dateCreate
        })
        await UserTokenDB.save()
        return
    } catch (error) {
        applogger.error(`Error en VALUSTKNDAO: validateUserTokenForgotPassDAO: error: ${error}`);
        return {
            ok: false,
            msg: 'VALUSTKND4O-07: ' + error.code
        }
    }
}

const validateTokenDAO = async (userToken) => { 
    
    const email  = userToken.email
    const time = userToken.datetimeMilliseconds
    
    try {
        const validateDB = await validateUser.find({ email: email, datetimeMilliseconds: time },
            { email: 1,datetimeMilliseconds:1, _id: 1 }).where("status").equals(false)
        
        return validateDB

    } catch (error) {
        applogger.error(`Error en VALUSTKNDAO: validateTokenDAO: error: ${error}`);
        return {
            ok: false,
            msg: 'VALUSTKND4O-02: ' + error.code
        }
    }
}

const activateTokenAndStaffDAO = async (validateDB) => {
    try {
        const email = validateDB[0].email
        const time = validateDB[0].datetimeMilliseconds
        const idToken = validateDB[0]._id
    
        const activateTokenDB = await validateUser.findByIdAndUpdate(
            idToken,
            { $set: { status: true } },
            { new: true }
        );
    
        const activateUser = await users.find({ email: email }, { _id: 1 })
            .where("emailVerificationToken").equals(false)
            .where("status").equals(true)
        
        const updateUserVerification = await users.findByIdAndUpdate(
            activateUser,
            { $set: { emailVerificationToken: true } },
            { new: true }
        )
        
        return 
        
    } catch (error) {
        applogger.error(`Error en VALUSTKNDAO: activateTokenAndUsersDAO: error: ${error}`);
        return {
            ok: false,
            msg: 'VALUSTKND4O-03: ' + error.code
        }
    }
}

const StaffActivityOnlineDAO = async (UserId) => {
    try {
        const milliseconds = obtenerMilisegundos();
        const userActivityDB = new staffActivity();
        userActivityDB.userId = UserId; // Asegúrate de que UserId sea un ObjectId válido
        userActivityDB.timestamp = milliseconds;
        userActivityDB.status = "online";
        
        await userActivityDB.save();        
    } catch (error) {
        applogger.error(`Error en VALUSTKNDAO: UserActivityOnlineDAO: UserId: ${UserId} error: ${error}`);
        return {
            ok: false,
            msg: 'CREUSD4O-04: ' + error.code
        }
    }    
}

const StaffActivityOfflineDAO = async (UserId) => {
    try {
        const milliseconds = milisegundos();
        const userActivityDB = new userActivity()
        userActivityDB.userId = UserId
        userActivityDB.timestamp = milliseconds
        userActivityDB.status = "offline"
    
        await userActivityDB.save();        
    } catch (error) {
        applogger.error(`Error en VALUSTKNDAO: UserActivityOfflineDAO: UserId: ${UserId} error: ${error}`);
        return {
            ok: false,
            msg: 'CREUSD4O-05: ' + error.code
        }
    }   
}

const StaffForActivityDAO = async (email) => { 
    try {
        const userId = await users.find({ email: email }, { _id: 1 })
        return userId[0]._id        
    } catch (error) {
        applogger.error(`Error en VALUSTKNDAO: UserForActivityDAO: UserId: ${UserId} error: ${error}`);
        return {
            ok: false,
            msg: 'VAUSTKD4O-06: ' + error.code
        }
    }
}

const ShowTokenInComponentsDAO = async (token) => {
    // LEER EL TOKEN
    const decodedToken = jwt.verify(token, JWT_SECRET);
    try {    
        return {
            ok: true,
            msg: decodedToken,
        };        
    } catch (error) {
        applogger.error(`Error en VALUSTKNDAO > ShowTokenInComponentsDAO: UserId: ${decodedToken.uid} error: ${error}`);
        return {
            ok: false,
            msg: 'CREUSD4O-07: ' + error.code
        }
    }
}



module.exports = {
    validateStaffTokenDAO,
    validateTokenDAO,
    activateTokenAndStaffDAO,
    StaffActivityOnlineDAO,
    StaffActivityOfflineDAO,
    StaffForActivityDAO,
    validateStaffTokenForgotPassDAO,
    ShowTokenInComponentsDAO,
}