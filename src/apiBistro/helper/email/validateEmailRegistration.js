const { createTransporterKalosEmail } = require("./nodemailer")
const { generarJWTEmail, generarJWTEmailForgotPass } = require("../token/jwt");
const { crearHTMLCustomer, crearHTMLCustomerForgotPass, BusinessMemberRegistrationHTML, crearHTMLCustomerWhatsapp } = require("../../class/validationEmailStructure");
const { milisegundos, marcaDeTiempo } = require("../global/times");
const { validateUserTokenDAO, validateUserTokenForgotPassDAO } = require("../../users/DAO/ValidateUserTokenDAO");
const { ValidateUserTokenDTO, ValidateUserTokenForgotPassDTO } = require("../../users/DTO/ValidateUserTokenDTO");
const { applogger } = require("../../../utils/logger")


async function SendMails(name, lastName, email) {

    try {
        const time = milisegundos()
        const Token = await generarJWTEmail(email,time)
    
        const validateUserToken = new ValidateUserTokenDTO (email, time, Token, marcaDeTiempo)
        
        const validateDB = await validateUserTokenDAO(validateUserToken)
    
        const htmlToSend = crearHTMLCustomer(name,lastName,email,Token);
    
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
                    to: email,
                    cco: 'lamed.saenz@hotmail.com',
                    subject: '[KALOS] Validacion de Correo Electronico.',
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
        applogger.error(`VAEM41L > SendMails:  Error en el Procesamiento Interno del Email : ${email}, error: ${error}`);
        return {
            ok: false,
            msg: 'VAEM41L > SendMails:  Error en el Procesamiento Interno del Email : ' + email 
        }
    }
}

async function SendMailsWhatsapp(name, lastName, email, movil, wsPass) {

    try {
        const time = milisegundos()
        const Token = await generarJWTEmail(email,time)
    
        const validateUserToken = new ValidateUserTokenDTO (email, time, Token, marcaDeTiempo)
        
        const validateDB = await validateUserTokenDAO(validateUserToken)
    
        const htmlToSend = crearHTMLCustomerWhatsapp(name, lastName, email, Token, movil, wsPass);
    
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
                    to: email,
                    cco: 'lamed.saenz@hotmail.com',
                    subject: '[KALOS] Validacion de usaurio para el Correo Electronico Creado desde WhatsApp',
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
        applogger.error(`VAEM41L > SendMails:  Error en el Procesamiento Interno del Email : ${email}, error: ${error}`);
        return {
            ok: false,
            msg: 'VAEM41L > SendMails:  Error en el Procesamiento Interno del Email : ' + email 
        }
    }
}

async function SendMailsForgotPass(name, lastName, email, codValidateUser) {

    try { 
        const time = milisegundos()
        const Token = await generarJWTEmailForgotPass(email,time,codValidateUser)

        const validateUserToken = new ValidateUserTokenForgotPassDTO(email, time, Token, codValidateUser, marcaDeTiempo)
        
        // Alamcena en DB, los datos para validar el email, para restablecer el password
        const validateDB = await validateUserTokenForgotPassDAO(validateUserToken)

        const htmlToSend = crearHTMLCustomerForgotPass(name,lastName,email,Token, codValidateUser);

        async function enviarCorreo() {
            const transporter = await createTransporterKalosEmail();
            const info = await transporter.sendMail({
                from: "<serviceskalos@gmail.com>",
                to: email,
                cc: 'lamed.saenz@hotmail.com',
                subject: '[KALOS] Recuperación de contraseña',
                html: htmlToSend,
            });
            return info.envelope;
        };

        const SendEmail = await enviarCorreo()
        return {
            ok: true
        }  

    } catch (error) {
        applogger.error(`VAEM41L > SendMailsForgotPass: Error al enviar el Email al user: ${email}, para actualizar la Contraseña error: ${error}`);
        return {
            ok: false,
            msg: 'VAEM41L > SendMails: Error al enviar el Email al user: ' + email + ' Para Actualizar la Contraseña Error: ' + error
        }
    }
    
}

async function SendMailsBusinessMember(busname, userName, email) {

    try { 
        const htmlToSend = BusinessMemberRegistrationHTML(busname, userName);
    
        async function enviarCorreo() {
            const transporter = await createTransporterKalosEmail();
            const info = await transporter.sendMail({
                from: "<serviceskalos@gmail.com>",
                to: email,
                cc: 'lamed.saenz@hotmail.com',
                subject: `[KALOS] ¡Ahora eres parte de nuestro exclusivo club! ${busname}`,
                html: htmlToSend,
            });
            return info.envelope;
        };
    
        const SendEmail = await enviarCorreo()
        return {
            ok: true
        }  


    } catch (error) {
        applogger.error(`VAEM41L > SendMailsBusinessMember: Error al enviar el Email al user: ${email}, para actualizar la Contraseña error: ${error}`);
        return {
            ok: false,
            msg: 'VAEM41L > SendMails: Error al enviar el Email al user: ' + email + ' Para Actualizar la Contraseña Error: ' + error
        }
    }
    
}

module.exports = {
    SendMails,
    SendMailsForgotPass,
    SendMailsBusinessMember,
    SendMailsWhatsapp,
};
