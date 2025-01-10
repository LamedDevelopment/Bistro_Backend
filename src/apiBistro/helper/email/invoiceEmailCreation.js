const { createTransporterKalosEmail } = require("./nodemailer")
const { milisegundosSendEmail } = require("../global/times");
const { applogger } = require("../../../utils/logger");
const { GenerateCustomerInvoice } = require("../../class/CreateInvoiceEmail");
const { generateInvoicePDF } = require("../../class/CreateInvoicePDF");


async function invoiceEmailCreation(invoiceDTO) {

    const { appointmentID, tradename, nit, nameBusiness, fullNameManager, movil, fullNameUser, emailUser, dateService,
        timeService, services, additionalServices, paymentMethod, product_sales, tax_Items, sumTotalProduct,
        tax_value_produt, sumtotal_product_tax, discount, taxes, grandTotal, paymentDate
    } = invoiceDTO;

    
    try {
        const htmlToSend = GenerateCustomerInvoice(appointmentID, nit, nameBusiness, fullNameManager, movil, fullNameUser, emailUser, dateService,
            timeService, services, additionalServices, paymentMethod, product_sales, tax_Items, sumTotalProduct,
            tax_value_produt, sumtotal_product_tax, discount, taxes, grandTotal, paymentDate);
        // console.log('htmlToSend: ', htmlToSend)
        // const invoicePDF = await generateInvoicePDF(invoiceDTO)
    
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
                    cco: 'lamed.saenz@gmail.com',
                    subject: `[KALOS]: Tu Comprobante de Pago fue Creado por ${tradename}`,
                    html: htmlToSend,
                    // attachments: [{
                    //     filename: `Factura_${nameBusiness}_${dateService}_${timeService}.pdf`,
                    //     path: invoicePDF
                    // }]
                });
                return info.envelope;
            };
        
            const SendEmail = await enviarCorreo()
            return {
                ok: true,
                msg: SendEmail
            }
        }            
    } catch (error) {
        applogger.error(`VAEM41L > invoiceEmailCreation:  Error en el Procesamiento Interno del Email : ${emailUser}, error: ${error}`);
        return {
            ok: false,
            msg: 'VAEM41L > invoiceEmailCreation:  Error en el Procesamiento de la Factura Email.'
        }
    }
}


module.exports = {
    invoiceEmailCreation,
};
