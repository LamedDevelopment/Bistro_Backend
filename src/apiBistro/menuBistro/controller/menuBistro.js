const bcrypt = require('bcryptjs');
const { response } = require('express');
const { DataMenuBistroDTO, DataViewMenuBistroDTO } = require('../dto/menuBistroDTO');
const { getCreateMenuBistroDAO, getViewMenuBistroDAO } = require('../dao/menuBistroDAO');
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
    const data = req.body;

    try {       
        const DataViewMenuBistroDto = new DataViewMenuBistroDTO(data.business);
        console.log('DataViewMenuBistroDto: ',DataViewMenuBistroDto);
        
        const createMenuBistroDao = await getViewMenuBistroDAO(DataViewMenuBistroDto);

        res.status(200).json({
            ok: true,
            msg: createMenuBistroDao.msg.menu,
        });
        
    } catch (error) {
        console.log(error);
        applogger.error(`MNBISCLL-02: Error al Visualizar el Menu de ${data.business.nit}: ${data.business.tradename}, error: ${error}`);
        res.json({
            ok: true,
            msg: `Error al Visualizar el Menu de: ${data.business.nit}: ${data.business.tradename}`
        });
    }
}

module.exports = {
    createMenuBistro,
    viewMenuBistro,
}