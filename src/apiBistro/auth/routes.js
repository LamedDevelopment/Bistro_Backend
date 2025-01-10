/*  
    path: '/api/login' Login generado para los Usuario de la Aplicacion
    path: '/api/logn' Login Generado para los Colaboradores registrados por Enterprise
    path: '/api/lgn' Login Usado por el Area de Administracion de Kalos
    path: '/api/validar' Validamos el Token
*/


const { Router } = require('express');
const { check } = require('express-validator');
const { preventNoSQLInjection, loginRateLimiter } = require('../../middleware/globalValidations');
const { login } = require('./controller/auth');


const router = Router()

router.post('/', [
    loginRateLimiter, preventNoSQLInjection
], login);




module.exports = router;
