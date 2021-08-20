const express = require( 'express' );
const bcrypt = require( 'bcryptjs' );

const Usuario = require( '../models/Usuario' );
const { generarJWT } = require( '../helpers/jwt' );

const crearUsuario = async ( req = express.request, res = express.response ) => {

    const { email, password } = req.body;

    try {

        let usuario = await Usuario.findOne({ email });

        if ( usuario ) {

            return res.status( 400 ).json({
                ok: false,
                msg: 'Un usuario existe con ese correo'
            });

        }

        usuario = new Usuario( req.body );

        // Encriptar password
        const salt = bcrypt.genSaltSync();

        usuario.password = bcrypt.hashSync( password, salt );

        await usuario.save();

        // Generar JWT
        const token = await generarJWT( usuario.id, usuario.name );

        res.status( 201 ).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        });

    } catch ( error ) {

        res.status( 500 ).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });

    }

};

const loginUsuario = async ( req = express.request, res = express.response ) => {

    const { email, password } = req.body;

    try {

        const usuario = await Usuario.findOne({ email });

        if ( !usuario ) {

            return res.status( 400 ).json({
                ok: false,
                msg: 'El usuario con ese email no existe'
            });

        }


        // Confirmar password

        const validPassword = bcrypt.compareSync( password, usuario.password );

        if ( !validPassword ) {

            res.status( 400 ).json({
                ok: false,
                msg: 'Password incorrecto'
            });

        }

        // Generar JWT
        const token = await generarJWT( usuario.id, usuario.name );

        res.status( 200 ).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        });

    } catch ( error ) {

        res.status( 500 ).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });

    }

};

const revalidarToken = async ( req = express.request, res = express.response ) => {

    const uid = req.uid;
    const name = req.name;

    const token = await generarJWT( uid, name );

    res.json({
        ok: true,
        token,
        uid,
        name
    });

};

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
};
