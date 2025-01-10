const nodemailer = require('nodemailer');
const { applogger } = require('../../../utils/logger');

function createTransporterKalosEmail() {

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'serviceskalos@gmail.com',
        // pass: 'Santiago23*'
        pass: 'game khsh xycg jqdw'
      }
    });

     if (!transporter) {
      return {
        ok: false,
        msg: 'N0_D3_M4_1L > Error en el Procesamiento Interno del Email '
      }
     } else {
       return transporter       
     }
    
  } catch (error) {
    applogger.error(`N0D3M41L > SendMails: Error al enviar el Email al user: ${email}, error: ${error}`);
    return {
        ok: false,
        msg: 'N0D3M41L > createTransporterKalosEmail: Error en el Procesamiento del Email ' + email + ' Error: ' + error
    }
  }
}

module.exports = {
  createTransporterKalosEmail,
};