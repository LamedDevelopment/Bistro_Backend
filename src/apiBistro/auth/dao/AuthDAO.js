const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const { generarJWTUser, generarJWTColla, generarJWTStaff } = require('../../helper/token/jwt');

const { OAuth2Client } = require('google-auth-library');

const applogger = require('../../../utils/logger');
const { URL_BACKEND, GIUDLGN, GIUDKEY } = require('../../../utils/config');
const staff = require('../../staff/model/staff');
const { StaffActivityOnlineDAO, StaffForActivityDAO } = require('../../staff/dao/ValidateStaffTokenDAO');



// const client = new OAuth2Client('171572853823-9iiq4tr1ffe40814bgbhfpothau7qbli.apps.googleusercontent.com');
const client = new OAuth2Client(GIUDLGN);



const loginDAO = async (email, pass) => {  
    
    
    try {
        // verificar Email
        const staffDB = await staff.findOne({ email });
        if (!staffDB) {
            return 'Email ó Contraseña No Valida 2'
        }
        // Verificar Pass
        const validpass = bcrypt.compareSync(pass, staffDB.pass);
    
        if (!validpass) {
            return 'Email ó Contraseña No Valida 3'
        }
    
        const token = await generarJWTStaff(staffDB.id, staffDB.role);
        
        return token
    } catch (error) {
        applogger.error(`Error en AuthDAO: loginDAO: userMail: ${email} error: ${error}`);
        return {
            ok: false,
            msg: 'AUTHDAO-01: ' + error
        }
    }
}

module.exports = {
    loginDAO,
};