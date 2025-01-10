const bcrypt = require('bcryptjs');
const { response } = require('express');
const { DataMenuBistroDTO } = require('../dto/menuBistroDTO');
const { getCreateMenuBistroDAO } = require('../dao/menuBistroDAO');
const { applogger } = require('../../../utils/logger');

const createMenuBistro = async (req, res) => {

    try {
        const uid = "DatosDelUsuario";
        const data = req.body;

        const DataMenuBistroDto = new DataMenuBistroDTO(uid, data.business, data.menu);

        const createMenuBistroDao = await getCreateMenuBistroDAO(DataMenuBistroDto);

        res.json({
            ok: true,
            msg: `Se Creo el Menu de: ${data.business.nit}: ${data.business.tradename}`
        });
        
    } catch (error) {
        applogger.error(`MNBISCLL-01: Error al Crear el Menu de ${data.business.nit}: ${data.business.tradename}, error: ${error}`);
        res.json({
            ok: true,
            msg: `NO Se Creo el Menu de: ${data.business.nit}: ${data.business.tradename}`
        });
    }
}


const viewMenuBistro = async (req, res) => {

    try {
        const uid = "DatosDelUsuario";
        const data = req.body;

        const DataMenuBistroDto = new DataMenuBistroDTO(uid, data.business, data.menu);

        const createMenuBistroDao = await getCreateMenuBistroDAO(DataMenuBistroDto);

        res.json({
            ok: true,
            msg: `Se Creo el Menu de: ${data.business.nit}: ${data.business.tradename}`
        });
        
    } catch (error) {
        applogger.error(`MNBISCLL-01: Error al Crear el Menu de ${data.business.nit}: ${data.business.tradename}, error: ${error}`);
        res.json({
            ok: true,
            msg: `NO Se Creo el Menu de: ${data.business.nit}: ${data.business.tradename}`
        });
    }
}

module.exports = {
    createMenuBistro,
    viewMenuBistro,
}