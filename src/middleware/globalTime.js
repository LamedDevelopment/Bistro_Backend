    const { response } = require('express');
const { DateTime, Settings, Info, Zone,Interval,Duration  } = require("luxon");
const servicesParameter = require('../apiServices/serviceParameter/model/serviceParameter');
const appointment = require('../apiServices/appointment/model/appointment');
const business = require('../apiServices/business/model/business');
const { VerifyTheServiceIsInTheBranchDAO, ValidateStartAndEndTimeOfBusinessServicesDAO } = require('../apiServices/business/dao/businessDAO');
const { KnowTheYear, KnowTheMonth, KnowTheDay, KnowTheDayOfTheWeek, DateToMilisegundos } = require('../apiServices/helper/global/times');
const { ValidateDateAndTimeOfTheAppointmentDoesNotOverlapForTheStaffDAO } = require('../apiServices/appointment/dao/appointmentDAO');
const { ValidateTheServiceParameterDAO } = require('../apiServices/serviceParameter/dao/serviceParameterDAO');

let date = DateTime.local();
let nowLuxon = DateTime.local().setZone('America/Bogota').setLocale('es-ES');
let now = nowLuxon.toMillis();


//TODO: Valida que la hora de agenda no sea menor que la fecha actual
const validationAndTimeControl = async (req, res = response, next) => {
    try {
        // Obtenemos la hora actual
        const Fechanow = DateTime.now().setZone('America/Bogota');
        const now = DateTime.now().setZone('America/Bogota').toMillis();

        // console.log('Fecha Now: ', Fechanow)
        // console.log('Fecha Cita: ', req.body.dateService)
        // console.log('Hora Cita: ', req.body.timeService)
        
        // Convertimos la fecha de agendamiento a milisegundos
        const fec = DateTime.fromFormat(req.body.dateService + " " + req.body.timeService, "dd/MM/yyyy HH:mm:ss", {
            zone: 'America/Bogota'
        }).toMillis();
        // console.log('Datos de Milisegundos Original: ', fec)
        // console.log('Datos de Milisegundos Version Now: ', now)
        // console.log('Validacion del Tiempo: ', now > fec)

        if (now > fec) {
            return res.status(418).json({
                ok: false,
                msg: 'La Hora de Agendamiento es Inferior a la Hora Actual MW-GT01'
            });
        } else {
            next();
        }
    } catch (error) {
        console.error('Error en validationAndTimeControl:', error);
        return res.status(500).json({
            ok: false,
            msg: 'Error interno en el servidor'
        });
    }
};

// TODO: Valida que la hora de agenda este en el rango de horas laborales
const validationAndTimeControlBusiness = async(req, res = response, next) => {
    const bus = req.body.business;
    const tradename = req.body.tradename
    const dateService = req.body.dateService
    const timeService = req.body.timeService
    let Yar = KnowTheYear(dateService,timeService)
    let Mes = KnowTheMonth(dateService,timeService)
    let Dai = KnowTheDay(dateService,timeService)
    let DiaSem = KnowTheDayOfTheWeek(Yar, Mes, Dai)
    
    const validateTimeStartAndEndTime = await ValidateStartAndEndTimeOfBusinessServicesDAO(bus, tradename,
        DiaSem, dateService, timeService)

    if (validateTimeStartAndEndTime.ok !== true) {        
        return res.status(418).json({
            ok: false,
            msg: validateTimeStartAndEndTime.msg
        })
    } else {
      next()
    }     
};
// TODO: Validar Servicio En Sucursal Negocio
const validationServiceInBrachBusiness = async(req, res = response, next) => {
    const bus = req.body.business;
    const tradename = req.body.tradename
    const services = req.body.service
    
    const validateTimeStartAndEndTime = await VerifyTheServiceIsInTheBranchDAO(bus, tradename, services)

    if (!validateTimeStartAndEndTime) {        
        return res.status(418).json({
            ok: false,
            msg: 'There is no service at Branch MW-GT03'
        })
    } else {
      next()
    }     
};

//TODO: validamos el Staff tenga disponible el rango de tiempo de la cita
const ValidateTheStaffHasTheTimeRangeOfTheAppointmentAvailable = async(req, res = response, next) => {
    const staff = req.body.staff;
    const dateAppoinment = req.body.dateService;
    const timeAppoinment = req.body.timeService;

    // Validamos que en el rango de un Colaborador no tengamos agendado previamente
    const StaffValidationTime = await ValidateDateAndTimeOfTheAppointmentDoesNotOverlapForTheStaffDAO(staff, dateAppoinment, timeAppoinment)

    if (StaffValidationTime.ok !== true) {
        return res.status(418).json({
            ok: false,
            msg: 'this time is already reserved MW-GT04'
        });  
    } else {
        next()
    }
};





const validateTimeBefore = async(req, res = response, next) => {
    const bus = req.body.business;
    const Staffservice = req.body.staffService;
    const TypeServices = req.body.typeServices;
    const dateAppoinment = req.body.dateService;
    const timeAppoinment = req.body.timeService;

    const TypeServicesDB = await ValidateTheServiceParameterDAO(bus, TypeServices)

    const Time = TypeServicesDB.msg[0]
    const serviceTime = Time.serviceTime
    const biocleaning = Time.biocleaning

        // Obtener la fecha y hora de inicio y fin de la nueva cita
        
        // Buscar todas las citas previas programadas para la misma fecha
    // const existingAppointments = await appointment.find({
    //     'appointmentDate.dateService': dateAppoinment,
    // });
    
        // const newStartTime = DateTime.fromISO(timeAppoinment);
        // const newEndTime = newStartTime.plus({ minutes: 30 });

        // // Verificar si hay una cita previa que se solapa con la nueva cita
        // const overlap = existingAppointments.some((appointment) => {
        //     const startTime = DateTime.fromISO(appointment.appointmentDate[0].timeService);
        //     const endTime = DateTime.fromISO(appointment.appointmentDate[0].endOfService);
        //     return newStartTime >= startTime && newStartTime < endTime ||
        //             newEndTime > startTime && newEndTime <= endTime ||
        //             newStartTime <= startTime && newEndTime >= endTime;
        // });

    // if (overlap) {
    //         return res.status(418).json({
    //         ok: false,
    //         msg: 'this time is already reserved MW-GT05'
    //     }); 
    //     console.log('La nueva cita se solapa con una cita existente');
    //     } else {
    //     next();
    //     console.log('La nueva cita se puede programar sin problemas');
    // }
    

    

    
    // // console.log(TimeServicesDB[0]);
    // // Validamos que en el rango de un Colaborador no tengamos agendado previamente
    // // const collaValidation = await appointment.find({
    // //     'staffServices.staff': Staffservice,
    // //     'appointmentDate.status': true,
    // //     'appointmentDate.dateService': dateAppoinment,
    // // $nor: [
    // //     { 'appointmentDate.timeService': { $gte: timeAppoinment } },
    // //     { 'appointmentDate.endTimeService': { $lte: timeAppoinment } },
    // // ]
    // // }).sort({ 'appointmentDate.timeService': 1 });

    // // if (collaValidation.length > 0) {
    // //     return res.status(418).json({
    // //         ok: false,
    // //         msg: 'this time is already reserved MW-GT02'
    // //     });  
    // // }
    // // next();    
};



module.exports = {
    validationAndTimeControl,
    validationAndTimeControlBusiness,
    validateTimeBefore,
    validationServiceInBrachBusiness,
    ValidateTheStaffHasTheTimeRangeOfTheAppointmentAvailable,
};