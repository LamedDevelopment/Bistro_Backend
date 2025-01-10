const { createTransporterKalosEmail } = require("./nodemailer")
const { generarJWTSendEmailRemember } = require("../token/jwt");
const { milisegundosSendEmail, getDayOfWeekFromDate } = require("../global/times");
const { applogger } = require("../../../utils/logger");
const { SendEmailCreateAppointment } = require("../../class/CreateAppointmentEmail");


async function appointmentEmailCreation(appointmentID, tradename, nomUser, apeUser, emailUser,
        service, typeService, dateService, timeService) {

    try {
        const time = milisegundosSendEmail(dateService, timeService)
        const fromAppointment = 'Email de Creacion'
        const Token = await generarJWTSendEmailRemember(appointmentID, fromAppointment, time)
    
        const htmlToSend = SendEmailCreateAppointment(tradename, nomUser, apeUser, service, typeService, dateService, timeService, Token);
    
        const transporter = await createTransporterKalosEmail();
        if (transporter.ok === false ) {
            return {
                ok: false,
                msg: transporter.msg
            }
        } else {
            async function enviarCorreo() {
                const info = await transporter.sendMail({
                    from: "<serviceskalos@gmail.com>",
                    to: emailUser,
                    cco: 'lamed.saenz@hotmail.com',
                    subject: `[KALOS]: Tu Cita ha sido Creada en ${tradename}`,
                    html: htmlToSend,
                });
                return info.envelope;
            };
        
            const SendEmail = await enviarCorreo()
            return {
                ok: true
            }
        }        
    } catch (error) {
        applogger.error(`VAEM41L > appointmentEmailCreation:  Error en el Procesamiento Interno del Email : ${emailUser}, error: ${error}`);
        return {
            ok: false,
            msg: 'VAEM41L > appointmentEmailCreation:  Error en el Procesamiento Interno del Email : ' + emailUser
        }
    }
}


module.exports = {
    appointmentEmailCreation,
};
