const { createTransporterKalosEmail } = require("./nodemailer")
const { generarJWTSendEmailRemember } = require("../token/jwt");
const { milisegundosSendEmail, getDayOfWeekFromDate } = require("../global/times");
const { applogger } = require("../../../utils/logger");
const { createHTMLCustomerRemember } = require("../../class/rememberAppointmentEmail");
const { getUpdateAppointmentFollowUpTwoHourDAO } = require("../../appointmentFollowUp/dao/appointmentFollowUpDAO");


async function SendMailsTwoHour(GetDataSendMailsDto) {

    const { appointmentID, tradename, nomUser, apeUser, emailUser,
        service, typeService, dateService, timeService } = GetDataSendMailsDto
    const fechaHoraString = dateService + ' ' + timeService
       

    const horaActual = await getDayOfWeekFromDate(fechaHoraString)
    try {
        const time = milisegundosSendEmail()
        const fromAppointment = 'Email de 2 Horas'
        const Token = await generarJWTSendEmailRemember(appointmentID, fromAppointment, time)
        
        const GetAppointmentFollowUpTwoHourDao = await getUpdateAppointmentFollowUpTwoHourDAO(appointmentID, dateService, timeService, horaActual)
    
        const htmlToSend = createHTMLCustomerRemember(tradename, nomUser, apeUser, service, typeService, dateService, timeService, Token);
    
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
                    subject: `[KALOS]: Te Recuerda tu Cita en ${tradename}`,
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
        applogger.error(`VAEM41L > SendMailsTwoHour:  Error en el Procesamiento Interno del Email : ${email}, error: ${error}`);
        return {
            ok: false,
            msg: 'VAEM41L > SendMailsTwoHour:  Error en el Procesamiento Interno del Email : ' + email
        }
    }
}


module.exports = {
    SendMailsTwoHour,
};
