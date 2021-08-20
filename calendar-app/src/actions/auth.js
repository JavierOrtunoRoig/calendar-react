import Swal from 'sweetalert2';
import { fetchConToken, fetchSinToken } from '../helpers/fetch';
import { types } from '../types/types';
import { eventLogout } from './events';

/**
 *
 * @param {string} email
 * @param {string} password
 * @returns
 */
export const startLogin = ( email, password ) => {

    return async ( dispatch ) => {

        const respuesta = await fetchSinToken( 'auth', { email, password }, 'POST' );
        const body = await respuesta.json();

        if ( body.ok ) {

            localStorage.setItem( 'token', body.token );
            localStorage.setItem( 'token-init-date', new Date().getTime() );

            dispatch( login({
                uid: body.uid,
                name: body.name
            }) );

        } else {

            Swal.fire( 'Error', body.msg, 'error' );

        }

    };

};

const login = ( user ) => ({
    type: types.authLogin,
    payload: user
});

export const startRegister = ( email, password, name ) => {

    return async ( dispatch ) => {

        const respuesta = await fetchSinToken( 'auth/new', { password, email, name }, 'POST' );
        const body = await respuesta.json();


        if ( body.ok ) {

            localStorage.setItem( 'token', body.token );
            localStorage.setItem( 'token-init-date', new Date().getTime() );

            dispatch( login({
                uid: body.uid,
                name: body.name
            }) );

        } else {

            if ( body.errors ) {

                const { errorsArray } = body;

                Swal.fire( 'Error', errorsArray[0], 'error' );

            } else {

                Swal.fire( 'Error', body.msg, 'error' );

            }

        }

    };

};

export const startChecking = () => {

    return async ( dispatch ) => {

        const respuesta = await fetchConToken( 'auth/renew' );
        const body = await respuesta.json();

        if ( body.ok ) {

            localStorage.setItem( 'token', body.token );
            localStorage.setItem( 'token-init-date', new Date().getTime() );

            dispatch( login({
                uid: body.uid,
                name: body.name
            }) );

        } else {

            dispatch( checkingFinish() );

        }

    };

};

const checkingFinish = () => ({
    type: types.authCheckingFinish
});

export const startLogout = () => {

    return async ( dispatch ) => {

        localStorage.clear();
        dispatch( logout() );
        dispatch( eventLogout() );

    };

};

const logout = () => ({
    type: types.authLogout
});
