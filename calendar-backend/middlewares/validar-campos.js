const { response } = require( 'express' );
const { validationResult } = require( 'express-validator' );

const validarCampos = ( req, res = response, next ) => {

    const result = validationResult( req );

    if ( !result.isEmpty() ) {

        return res.status( 400 ).json({
            ok: false,
            errors: result.mapped(),
            errorsArray: result.errors.map( e => e.msg )
        });

    }

    next();

};

module.exports = {
    validarCampos
};
