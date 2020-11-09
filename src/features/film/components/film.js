import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { format } from 'date-fns';

Film.propTypes = {
    film: PropTypes.object //detail film
};

function Film(props) {
    const { film } = props
    return (
        <div className='film' style={{ backgroundImage: `url("http://localhost:5000/api/${film.poster}")` }}>
            <div className='film-content'>
                <div className='remove-film'>
                    {/* <FontAwesomeIcon className='ic-init ic-decrease' icon="minus-circle" /> */}
                    X
                </div>
                <div className='infor'>

                    <div className='control'>
                        <span className='title'>Code:</span>
                        <span className='data'>{film.code}</span>
                    </div>

                    <div className='control'>
                        <span className='title'>Name:</span>
                        <span className='data'>{film.name}</span>
                    </div>

                    <div className='control'>
                        <span className='title'>Run Time:</span>
                        <span className='data'>{film.runtime}</span>
                    </div>

                    <div className='control'>
                        <span className='title'>OpenDay:</span>
                        <span className='data'>{film.openday}</span>
                    </div>

                    <div className='control'>
                        <span className='title'>Genre:</span>
                        <span className='data'>{film.genre}</span>
                    </div>

                    <div className='control'>
                        <span className='title'>Director:</span>
                        <span className='data'>{film.director}</span>
                    </div>

                    <div className='control'>
                        <span className='title'>Cast:</span>
                        <span className='data'>{film.cast}</span>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Film;