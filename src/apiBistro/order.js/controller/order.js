const bcrypt = require('bcryptjs');
const { response } = require('express');
const { DataMenuBistroDTO } = require('../dto/menuBistroDTO');
const { getCreateMenuBistroDAO } = require('../dao/menuBistroDAO');

const createMenuBistro = async (req, res) => {

    try {
        const uid = "DatosDelUsuario";
        const data = req.body;

        const DataMenuBistroDto = new DataMenuBistroDTO(uid, data.business, data.menu);

        const createMenuBistroDao = await getCreateMenuBistroDAO(DataMenuBistroDto);


        

        // const CreateStaffDto = new CreateStaffDTO(data, data.countryCod, dateNow);

        // const createStaffDao = await createStaffDAO(CreateStaffDto);

        // console.log('Creacion de Staff: ', createStaffDao );
        
        res.json({
            ok: true,
            msg: createMenuBistroDao
        });
    } catch (error) {
        
    }

}

module.exports = {
    createMenuBistro
}