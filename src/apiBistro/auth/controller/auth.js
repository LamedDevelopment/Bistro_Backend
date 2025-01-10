const jwt = require("jsonwebtoken");
const { response } = require('express');
const { loginDAO } = require("../dao/AuthDAO");

const login = async (req, res = response) => {
    const { user, pass } = req.body;

    try {

      const loginDao = await loginDAO(user, pass);

      if (!loginDao) {    
        return res.status(400).json({
          ok: false,
          msg: 'El usuario o la contraseña no son correctos',
        });
      }
  
      return res.json({
          ok: true,
          msg: loginDao
      }); 
      
    } catch (error) {
      console.error('Error en el proceso de login:', error);
      return res.status(500).json({
        ok: false,
        msg: 'Error interno en el servidor',
      });
    }
  };



  module.exports = {
    login,
  }