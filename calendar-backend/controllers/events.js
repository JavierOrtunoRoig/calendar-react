const { response } = require( 'express' );
const Evento = require( '../models/Evento' );

const getEventos = async ( req, res = response ) => {

    const eventos = await Evento.find()
        .populate( 'user', 'name' );


    res.json({
        ok: true,
        eventos
    });

};

const crearEventos = async ( req, res = response ) => {

    const evento = new Evento( req.body );

    try {

        evento.user = req.uid;

        const eventoGuardado = await evento.save();

        res.status( 201 ).json({
            ok: true,
            evento: eventoGuardado
        });

    } catch ( error ) {

        res.status( 500 ).json({
            ok: false,
            msg: 'Hable con el administrador'
        });

    }

    res.json({
        ok: true,
        msg: 'crearEventos'
    });

};

const actualizarEventos = async ( req, res = response ) => {

    const eventoId = req.params.id;

    try {

        const evento = await Evento.findById( eventoId );

        if ( !evento ) {

            res.status( 404 ).json({
                ok: false,
                msg: 'Evento no existe por ese id'
            });

        }

        if ( evento.user.toString() !== req.uid ) {

            return res.status( 401 ).json({
                ok: false,
                msg: 'No tiene privilegio de editar este evento'
            });

        }

        const nuevoEvento = {
            ...req.body,
            user: req.uid
        };

        const eventoActualizado = await Evento.findByIdAndUpdate( eventoId, nuevoEvento, { new: true });

        res.status( 200 ).json({
            ok: true,
            evento: eventoActualizado
        });

    } catch ( error ) {

        res.status( 500 ).json({
            ok: false,
            msg: 'Hable con el administrador'
        });

    }

};

const eliminarEventos = async ( req, res = response ) => {

    const eventoId = req.params.id;

    try {

        const evento = await Evento.findById( eventoId );

        if ( !evento ) {

            res.status( 404 ).json({
                ok: false,
                msg: 'Evento no existe por ese id'
            });

        }

        if ( evento.user.toString() !== req.uid ) {

            return res.status( 401 ).json({
                ok: false,
                msg: 'No tiene privilegio de eliminar este evento'
            });

        }

        const eventoEliminado = await Evento.findByIdAndDelete( eventoId );

        res.status( 200 ).json({
            ok: true,
            evento: eventoEliminado
        });

    } catch ( error ) {

        console.log( error );
        res.status( 500 ).json({
            ok: false,
            msg: 'Hable con el administrador'
        });

    }

};


module.exports = {
    getEventos,
    crearEventos,
    actualizarEventos,
    eliminarEventos
};


