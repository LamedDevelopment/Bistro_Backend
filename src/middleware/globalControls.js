const { response } = require('express');
const { DateTime, Settings, Info, Zone } = require("luxon");
const business = require('../apiServices/business/model/business');
const staff = require('../apiServices/staff/model/staff');
const businessUsers = require('../apiServices/businessUsers/model/businessUsers');
const users = require('../apiServices/users/model/users');
const appointment = require('../apiServices/appointment/model/appointment');
const servicesParameter = require('../apiServices/serviceParameter/model/serviceParameter');
const { CreateStaffDAO, ExistStaffForIdDAO } = require('../apiServices/staff/dao/staffDAO');
const { ExistBusinessForIdToStaffDAO, ExistsBusinessToIdToServiceToTypeServiceDAO, ExistsBusinessToIdDAO } = require('../apiServices/business/dao/businessDAO');
const { ExistsUserForId } = require('../apiServices/users/DAO/CreateUserDAO');
const { applogger } = require('../utils/logger');

// Creating a date time object
let date = DateTime.local();
let now = DateTime.local().toMillis();
let currentTime = DateTime.now().toFormat('H');
let moment = DateTime.now().toFormat('D TT'); // tenemos el formato completo de la hora 19/12/2022 19:08:53

const ExistsUser = async(req, res = response, next) => {
    const uid = req.uid;
    let cont = 0;

    // console.log(uid);
    const UserDB = await ExistsUserForId(uid)
    const staffDB = await ExistStaffForIdDAO(uid)
    
    try {
        if (UserDB !== true) {
            cont = 1;        
        }else if (staffDB !== true) {
            cont = 2;
        } 
        
        if (cont <= 3) {
            next();
        } else {
            return res.status(418).json({
                ok: false,
                msg: 'Requiere Permisos para esta Operación MW-GC01'
            });
        }        
    } catch (error) {
        // console.log(error);
        return res.status(418).json({
            ok: false,
            msg: 'Requiere Permisos para esta Operación MW-GC02'
        });
    }
}

const ExistsBusiness = async(req, res = response, next) => {
    const bus = req.body.business;
    try {
        const BusinessDB = await ExistsBusinessToIdDAO(bus)
        
        if (BusinessDB) {
            next();            
        }else {
            return res.status(418).json({
                ok: false,
                //dat: uid,
                msg: 'Requires Permissions for this Operation MW-GC02'
            });
        }
    } catch (error) {
        // console.log(error);
        return res.status(418).json({
            ok: false,
            msg: 'the business does not have that service MW-GC03'
        });
    }
}

const ExistsStaffInBusiness = async(req, res = response, next) => {
    const bus = req.body.business;
    const staff = req.body.staff;

    try {        
        const businessDB = await ExistBusinessForIdToStaffDAO(bus, staff)
        
        if (businessDB === false) {
            res.status(418).json({
                ok: false,
                msg: 'Inactive Business MW-GC04'
            });
        } else {
            next()
        }
    } catch (error) {
        // console.log(error);
        res.status(418).json({
            ok: false,
            // dat: uid,
            msg: 'Require Permissions for this Operation MW-GC05'
        });
    }
}

const UserSameDate = async(req, res = response, next) => {
    const uid = req.uid;
    const Staffservice = req.body.staffService;
    const typeServices = req.body.typeServices;
    const dateAppoinment = req.body.dateService;
    const timeAppoinment = req.body.timeService;
    const h = DateTime.fromISO(timeAppoinment);

    // console.log(uid);
    try {
        // TODO: Validamos que el usuario No tenga asignado una cita en esa fecha y hora
        const AppointmentDB = await appointment.find({'user.userID': uid})
            .where('appointmentDate.status').equals(true)                                            
            .where('appointmentDate.dateService').equals(dateAppoinment)
            .where('appointmentDate.timeService').equals(timeAppoinment);
        // validamos que el colaborador no tenga en un rango de tiempo una cita previa
        const appCollaborator = await servicesParameter.find({'typeServices':typeServices},
                                {business:1,typeServices:1,staffType:1,serviceTime:1,biocleaning:1,servicePrice:1,_id:0})
                                .where('status').equals(true);
        //TODO: validar que el Colaborador No tenga esa hora asignada
        const collaValidation = await appointment.find({'staffServices.staff': Staffservice})
            .where('appointmentDate.status').equals(true)
            .where('appointmentDate.dateService').equals(dateAppoinment)
            .where('appointmentDate.timeService').equals(timeAppoinment);
        //TODO: se debe cambiar el === por != para que funcione la logica del if
        
        const hi = DateTime.fromISO(timeAppoinment).plus({minute: (appCollaborator[0].serviceTime + appCollaborator[0].biocleaning)}).toFormat('T');

        // console.log(collaValidation.length);

        if(collaValidation.length != 0 ){
            if(collaValidation[0].appointmentDate[0].timeService >= timeAppoinment && timeAppoinment <= hi){
                return res.status(418).json({
                    ok: false,
                    msg: 'Time Range Reserved MW-GC06'
                });
            }
        } 
        
        if(collaValidation.length != 0 ){        
            
            return res.status(418).json({
                ok: false,
                msg: 'Cant book this space MW-GC07'
            });            

        }

        //TODO: Ademas que en el rango de tiempo no tenga igualmente una cita, para no pisar una cita previa

        
        // console.log(collaValidation.length);
        // console.log(collaValidation[0].appointmentDate.timeService);
        if(AppointmentDB.length ===  0){
                next();  
            }else{
            return res.status(418).json({
                ok: false,
                //dat: uid,
                msg: 'Cant book this space MW-GC08'
            });            
        }
        
        // if (BusinessDB) {
        // }else {
        //     res.status(418).json({
        //         ok: false,
        //         //dat: uid,
        //         msg: 'Require Permissions for this Operation MW12'
        //     });
        // }
    } catch (error) {
        // console.log(error);
        res.status(418).json({
            ok: false,
            msg: 'Require Permissions for this Operation MW-GC09'
        });
    }
};

const isCollaboratorToken = async (req, res = response, next) => {

    const uid = req.uid
    try {    
        const isCollaDb = await businessUsers.findById(
            { _id: uid, status: true }, { _id: 1 })
        if (isCollaDb) {
            next()        
        } else {
             return res.status(418).json({
                ok: false,
                msg: 'No cuenta con el permiso para realizar esta actividad.'
            });
        }        
    } catch (error) {
        applogger.error('MWGC: isCollaboratorToken > Error al Validar el Token del Usuario: ', uid);
        return res.status(418).json({
            ok: false,
            msg: 'Error al Validar el Token del Usuario'
        });
    }
}

module.exports = {
    ExistsUser,
    ExistsBusiness,
    ExistsStaffInBusiness,
    UserSameDate,
    isCollaboratorToken,
};