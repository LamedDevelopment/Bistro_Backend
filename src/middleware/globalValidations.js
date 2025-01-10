const { response } = require("express");
mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const rateLimit = require('express-rate-limit');
const sanitize = require('mongo-sanitize');
const { validationResult, Result } = require('express-validator');
const formidable = require('formidable');
const upload = new formidable.IncomingForm();
const { JWT_SECRET } = require("../utils/config");
const { applogger } = require("../utils/logger");

const validateJWT = (req, res = response, next) => {

    // LEER EL TOKEN
    const token = req.header('x-token')
    try {
        if (!token) {
            return res.status(418).json({
                ok: false,
                msg: 'No hay Token en la Peticion'
            });
        }
        const verifyData = jwt.verify(token, JWT_SECRET);
        // pasamos el UID a la Request para que desde alli podamos validar el usuario.
        req.uid = verifyData.uid;
        req.role = verifyData.role;
        next();
    } catch (error) {
        console.error(`Error en GlobalValidations: validateJWT > token ${token}, error: ${error}`);
        return res.status(401).json({
            ok: false,
            msg: 'Token inválido'
        });
    }
};


const acceptTerms = (req, res = response, next) => {

    try {
        const terminosUsu = req.body.terms;
        //VALIDAMOS QUE EL CAMPO SOLO TENGA EL VALOR TRUE, PARA QUE SIGA HACIA LA BD
        if (terminosUsu === "true") {
            next();
        } else {
            return res.status(400).json({
                ok: false,
                msg: 'Las Condiciones de Uso de la Plataforma deben ser Aceptadas ...'
            });
        }        
    } catch (error) {
        applogger.error(`Error en GlovalValidations: acceptTerms error: ${error}`);
        return {
            ok: false,
            msg: 'GLVA: acceptTerms',
            error: error
        }
    }
};

const validateFields = (req, res = response, next) => {

    try {
        const errores = validationResult(req);
    
        if (!errores.isEmpty()) {
            return res.status(400).json({
                ok: false,
                errors: errores.mapped()
            });
        }
        next();
        
    } catch (error) {
        applogger.error(`Error en GlovalValidations: validateFields error: ${error}`);
        return {
            ok: false,
            msg: 'GLVA: validateFields',
            error: error
        }
    }

};
const isEmail = (req, res = response, next) => {

    try {
        const email = req.body.email;
        const emailValido = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{3,63}\.){1,125}[A-Z]{2,63}$/i;
    
        if (emailValido.test(email)) {
            next();
        } else {
            return res.status(400).json({
                ok: false,
                msg: 'El Email es incorrecto en su forma'
            });
        }
        
    } catch (error) {
        applogger.error(`Error en GlovalValidations: isEmail error: ${error}`);
        return {
            ok: false,
            msg: 'GLVA: isEmail',
            error: error
        }
    }
};

const validateJWTValidate = (req, res = response, next) => {

    // LEER EL TOKEN
    const token = req.header('x-token')

    try {
        if (!token) {
            return res.status(418).json({
                ok: false,
                msg: 'No hay Token en la Peticion'
            });
        }
        const { uid } = jwt.verify(token, JWT_SECRET );
        // pasamos el UID a la Request para que desde alli podamos validar el usuario.
        req.uid = uid;
        next();
    } catch (error) {
        applogger.error(`Error en GlovalValidations: validateJWTValidate usersID: ${uid} error: ${error}`);
        return {
            ok: false,
            msg: 'GLVA: validateJWTValidate',
            error: error
        }
    }
};

const validateManager = async (req, res = response, next) => { 

    const token = req.header('x-token');
    const decodedToken = await ShowTokenInComponentsDAO(token)  
    const { uid, bus, role } = decodedToken.msg
    try {
        
        if (role.code !== 'MANAGER_ROLE') {
            res.status(418).json({
                ok: false,
                msg: 'No tiene los permisos Requeridos para Esta Operación: 1'
            })
        }
        next();
    } catch (error) {
        applogger.error(`Error en GlovalValidations > validateManager: No Cuenta con el permiso para esta Operacion. uid: ${uid}, role: ${role}, bus: ${bus},  error: ${error}`);
        return {
            ok: false,
            msg: 'GLVA: No Cuenta con el permiso para esta Operacion.'
        }
    }
}

const validateStaff = async (req, res = response, next) => { 

    const token = req.header('x-token');
    const decodedToken = await ShowTokenInComponentsDAO(token)  
    const { uid, bus, role } = decodedToken.msg
    try {
        
        if (role.code === 'MANAGER_ROLE' || role.code === 'CLLTR_ROLE') {
            next();
        } else {
            res.status(418).json({
                ok: false,
                msg: 'No tiene los permisos Requeridos para Esta Operación: 3'
            })            
        }
    } catch (error) {
        applogger.error(`Error en GlovalValidations > validateStaff: No Cuenta con el permiso para esta Operacion. uid: ${uid}, role: ${role}, bus: ${bus},  error: ${error}`);
        return {
            ok: false,
            msg: 'GLVA: No Cuenta con el permiso para esta Operacion.'
        }
    }
}
const validateLoadData = async (req, res = response, next) => { 

    const token = req.header('x-token');
    const decodedToken = await ShowTokenInComponentsDAO(token)  
    const { uid, bus, role } = decodedToken.msg
    try {
        const data = await upload.parse(req, (err, fields, files) => {
            if (err) {
                console.error('Error al procesar el archivo:', err);
                return res.status(500).json({
                    message: 'Hubo un error al procesar el archivo.'
                });
            }

            // Aquí puedes acceder a los campos y archivos adjuntos si es necesario
            req.fields = fields;
            req.files = files;

            next(); // Llama al siguiente middleware
        });
    } catch (error) {
        applogger.error(`Error en GlovalValidations > validateLoadData: No Cuenta con el permiso para esta Operacion. uid: ${uid}, role: ${role}, bus: ${bus},  error: ${error}`);
        return {
            ok: false,
            msg: 'GLVA: No Cuenta con el permiso para esta Operacion.'
        }
    }
}

// Middleware para limitar la cantidad de intentos de login
const loginRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // máximo de 5 intentos por ventanaMs
    message: {
        ok: false,
        msg: 'Has excedido el límite de intentos de login. Por favor, intenta nuevamente más tarde (20 minutos).'
    },
    handler: (req, res, /*next*/ ) => {
        // Obtener la información del solicitante
        const ip = req.ip || req.connection.remoteAddress;
        const userAgent = req.get('User-Agent');
        const referer = req.get('Referer');
        const url = req.originalUrl;
        const method = req.method;
        const timestamp = new Date().toISOString();
        const payload = JSON.stringify(req.body);

        // Log de intento de fuerza bruta con información extendida
        applogger.error(`Intento de fuerza bruta detectado.
        IP: ${ip},
        Timestamp: ${timestamp},
        URL: ${url},
        Método: ${method},
        User-Agent: ${userAgent},
        Referer: ${referer},
        Payload: ${payload}`);

        res.status(429).json({
            ok: false,
            msg: 'Has excedido el límite de intentos de login. Por favor, intenta nuevamente más tarde (20 minutos).'
        });
    }
});

const preventNoSQLInjection = async (req, res = response, next) => {
    try {
        // Sanitizar todo el objeto req.body
        req.body = sanitize(req.body);

        // Expresión regular para detectar caracteres potencialmente peligrosos
        const invalidCharacters = /[<>&]/;

        const keys = Object.keys(req.body);
        for (let key of keys) {
            if (typeof req.body[key] === 'string' && invalidCharacters.test(req.body[key])) {
                // Obtener la información del solicitante
                const ip = req.ip || req.connection.remoteAddress;
                const userAgent = req.get('User-Agent');
                const referer = req.get('Referer');
                const url = req.originalUrl;
                const method = req.method;
                const timestamp = new Date().toISOString();
                const payload = JSON.stringify(req.body);

                // Log de intento de inyección con información extendida
                applogger.error(`Intento de No-SQL Injection detectado.
                IP: ${ip},
                Timestamp: ${timestamp},
                URL: ${url},
                Método: ${method},
                User-Agent: ${userAgent},
                Referer: ${referer},
                Campo: ${key},
                Valor: ${req.body[key]},
                Payload: ${payload}`);

                return res.status(400).json({
                    ok: false,
                    msg: 'Datos inválidos.'
                });
            }
        }

        next();
    } catch (error) {
        applogger.error(`Error en GlovalValidations: preventNoSQLInjection error: ${error}`);
        return res.status(500).json({
            ok: false,
            msg: 'Error en validación de datos.',
            error: error
        });
    }
};

const preventNoSQLInjectionInternalControl = async (req, res = response, next) => {
    try {
        // Sanitizar todo el objeto req.body
        req.body = sanitize(req.body);

        const token = req.header('x-token');
        let uid = 'unknown';

        if (token) {
            try {
                const decodedToken = await ShowTokenInComponentsDAO(token);
                uid = decodedToken.msg.uid;
            } catch (tokenError) {
                applogger.warn(`Token inválido o error al decodificar: ${tokenError.message}`);
                return res.status(401).json({
                    ok: false,
                    msg: 'Token inválido'
                });
            }
        }

        // Lista extendida de caracteres peligrosos
        const invalidCharacters = /[\$\*\;\\"'\.]/;

        // Validar campos específicos que pueden ser sensibles
        if (req.body.dateService && invalidCharacters.test(req.body.dateService)) {
            // Obtener la información del solicitante
            const ip = req.ip || req.connection.remoteAddress;
            const userAgent = req.get('User-Agent');
            const referer = req.get('Referer');
            const url = req.originalUrl;
            const method = req.method;
            const timestamp = new Date().toISOString();
            const payload = JSON.stringify(req.body);

            // Log de intento de inyección con información extendida
            applogger.error(`Intento de No-SQL Injection detectado.
            IP: ${ip},
            Timestamp: ${timestamp},
            URL: ${url},
            Método: ${method},
            User-Agent: ${userAgent},
            Referer: ${referer},
            Campo: dateService,
            Valor: ${req.body.dateService},
            Payload: ${payload},
            UserID: ${uid}`);

            return res.status(400).json({
                ok: false,
                msg: `Datos inválidos en el campo dateService: ${req.body.dateService}`
            });
        }

        next();
    } catch (error) {
        applogger.error(`Error en GlovalValidations: preventNoSQLInjectionInternalControl error: ${error}`);
        return res.status(500).json({
            ok: false,
            msg: 'Error en validación de datos.',
            error: error
        });
    }
};


module.exports = {
    validateJWT,
    acceptTerms,
    validateFields,
    isEmail,
    validateJWTValidate,    
    validateManager,
    validateStaff,
    validateLoadData,
    preventNoSQLInjection,
    preventNoSQLInjectionInternalControl,
    loginRateLimiter,
};