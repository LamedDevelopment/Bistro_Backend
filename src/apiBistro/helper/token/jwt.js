const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../../../utils/config');

const generarJWTStaff = ( uid, role, establishments, tradeName ) => {
    return new Promise((resolve, reject) => {

        const payload = {
            uid,
            role,
            tradeName,
            establishments
        };

        jwt.sign(payload, JWT_SECRET, {
            expiresIn: '12h'
        }, (err, token) => {
            if (err) {
                console.log(err);
                reject('No se puede Generar el JWT');
            } else {
                resolve(token);
            }
        });
    });
};


const generarJWTEmail = (email, time) => {
    return new Promise((resolve, reject) => {
        const payload = {
            email,
            time
        };
        jwt.sign(payload, JWT_SECRET, {
            expiresIn: '8h' //Cambiar expiresIn a 5 segundos
        }, (err, token) => {
            if (err) {
                console.log(err);
                reject('No se puede Generar el JWT');
            } else {
                resolve(token);
            }
        });
    });
};
const generarJWTSendEmailRemember = (appointmentID, dateAppointment, time) => {
    return new Promise((resolve, reject) => {
        const payload = {
            appointmentID,
            dateAppointment,
            time
        };
        jwt.sign(payload, JWT_SECRET, {
            expiresIn: '8h' //Cambiar expiresIn a 5 segundos
        }, (err, token) => {
            if (err) {
                console.log(err);
                reject('No se puede Generar el JWT');
            } else {
                resolve(token);
            }
        });
    });
};


const generarJWTEmailForgotPass = (email, time,codValidateUser) => {
    return new Promise((resolve, reject) => {
        const payload = {
            email,
            time,
            codValidateUser
        };
        jwt.sign(payload, JWT_SECRET, {
            expiresIn: '12h'
        }, (err, token) => {
            if (err) {
                console.log(err);
                reject('No se puede Generar el JWT');
            } else {
                resolve(token);
            }
        });
    });
};

const validateTokenStaff = (token) => { 
    return new Promise((resolve) => { 
        // Validamos el token contra el Paikki-Rest
        const { uid, bus } = jwt.verify(token, JWT_SECRET);
    
        userTkn = { uid: uid, bus: bus }
    
        resolve(userTkn)
    })    
};

const validateEmailToken = (token) => {
    return new Promise((resolve, reject) => {
        // Validamos el token contra el Paikki-Rest
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            // Si el token es válido, resolvemos la promesa con los datos decodificados
            const {
                email
            } = decoded;
            resolve({
                email
            });
        } catch (err) {
            // Si hay un error en el token
            if (err.name === 'TokenExpiredError') {
                // Tratamos el caso de token expirado aquí
                try {
                    // Extraemos el correo electrónico del token vencido
                    const decoded = jwt.decode(token);
                    const email = decoded ? decoded.email : null;
                    if (email) {
                        resolve({
                            email
                        });
                    } else {
                        reject(new Error('No se pudo obtener el correo electrónico del token expirado.'));
                    }
                } catch (error) {
                    console.error('Error al extraer el correo electrónico del token:', error.message);
                    reject(error);
                }
            } else {
                // Otros errores en el token
                console.error('Error en el token:', err.message);
                reject(err);
            }
        }
    });
};

module.exports = {
    generarJWTStaff,
    generarJWTEmail,
    validateTokenStaff,
    validateEmailToken,
    generarJWTEmailForgotPass,
    generarJWTSendEmailRemember,
};
