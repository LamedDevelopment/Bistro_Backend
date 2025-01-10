const { response } = require('express');
const businessUsers = require('../models/businessUsers');
const staffDB = require('../models/staff');



const createBusinessUser = async(dato, next) => {

    const email = dato.email;

    const validateBS = await businessUsers.find({ email: email });

    //console.log(validateBS.length);

    if (validateBS.length === 0) {
        try {
            return await dato.save();
            //console.log("Tenemos Datos " + mailPropi);

        } catch (error) {
            return console.log("The User is already Created in the Base", error);
        }
    }
};
const createStaff = async(dato, next) => {

    const staff = dato.uniqueStaff;

    const validateStaff = await staffDB.find({ uniqueStaff: staff });

    //console.log(validateStaff.length);

    if (validateStaff.length === 0) {
        try {
            return await dato.save();
            //console.log("Tenemos Datos " + mailPropi);

        } catch (error) {
            return console.log("The Staff is already Created in the Base", error);
        }
    }
};

module.exports = {
    createBusinessUser,
    createStaff,
};