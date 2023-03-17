const express = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario')
const {generarJWT} = require('../helpers/jwt')
const crearUsuario =async (req, res = express.response) => {
    
    const { email, password } = req.body;
    
   try {

        let usuario = await Usuario.findOne({email})
        if(usuario){
            return res.status(400).json({
                ok:false,
                msg:'Un usuario existe con ese correo'
            })
        }
    
       usuario = new Usuario(req.body)

        //Encriptar password
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt)
        
        await usuario.save();

        //GENERAR JWT
        const token = await generarJWT(usuario.id, usuario.name);

        res.status(201).json({
            ok:true,
            uid:usuario.id,
            name:usuario.name,
            token
        })
   } catch (error) {
        res.status(400).json({
            ok:false,
            msg:'Por favor hable con el admin'
        })
   }
   
}

const loginUsuario = async (req, res = express.response)=>{
    
    const { email, password} = req.body;

    try {
        const usuario = await Usuario.findOne({email})
        if(!usuario){
            return res.status(400).json({
                ok:false,
                msg:'el usuario no existe con ese correo'
            })
        }


        const validPassword  = bcrypt.compareSync(password, usuario.password)
         const token = await generarJWT(usuario.id, usuario.name);
        if(!validPassword){
            return res.status(400).json({
                ok:false,
                msg:'password incorrecto'
            })
        }
        res.json({
            ok:true,
            mgs:'login',
            email,
            password,
            token
        })

    } catch (error) {
        res.status(400).json({
            ok:false,
            msg:'Por favor hable con el admin'
        })
        
    }
   
    
}

const revalidarToken = async (req, res = express.response)=>{
   
    const {uid, name}= req;

    const token = await generarJWT(uid, name)

    
    res.json({
        ok:true,
        mgs:'renew',
        uid,
        name,
        token
    })
}

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}