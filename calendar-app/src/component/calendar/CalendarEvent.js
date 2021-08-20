import React from 'react';
import PropTypes from 'prop-types';

export const CalendarEvent = ({ event }) => {

    const { title, user: { name } } = event;

    return (
        <div>
            <strong>{ title }</strong>
            <span> - { name }</span>
        </div>
    );

};

CalendarEvent.propTypes = {
    event: PropTypes.object
};
