import React from 'react';
import Seat from 'features/seat'

import PropTypes from 'prop-types';

detail.propTypes = {
    seats: PropTypes.array
};

function detail(props) {
    const { seats } = props
    return (
        <div className='detail'>
            <Seat listSeats={seats} />
        </div>
    );
}

export default detail;