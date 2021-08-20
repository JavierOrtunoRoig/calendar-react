/*
    Rutas de los eventos
    /api/events
*/


const { Router } = require( 'express' );
const { getEventos, crearEventos, actualizarEventos, eliminarEventos } = require( '../controllers/events' );
const { check } = require( 'express-validator' );
const { validarJWT } = require( '../middlewares/validar-jwt' );
const { validarCampos } = require( '../middlewares/validar-campos' );
const { isDate } = require( '../helpers/isDate' );
const router = Router();

// middleware que se aplica a todas las rutas del archivo después de esta función
router.use( validarJWT );

// Obtener eventos
router.get( '/', getEventos );

// crear un nuevo evento
router.post(
    '/',
    [
        check( 'title', 'El titulo es obligatorio' ).not().isEmpty(),
        check( 'start', 'Fecha de inicio obligatoria' ).custom( isDate ),
        check( 'end', 'Fecha de inicio obligatoria' ).custom( isDate ),
        validarCampos
    ],
    crearEventos );

// Actualizar evento
router.put( '/:id', actualizarEventos );

// Borrar evento
router.delete( '/:id', eliminarEventos );


module.exports = router;
