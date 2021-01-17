import React from 'react';
import './css/film.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import PropTypes from 'prop-types';

Film.propTypes = {
    film: PropTypes.object
};

function Film(props) {
    const { film } = props
    return (
        <div className='film'>
            <div className="film-item">
                <div className='film' style={{
                    backgroundImage: `url(http://localhost:5000/api/poster/${film.poster})`,
                    backgroundSize: 'cover'
                }}>
                    <div className='film-background'>
                        <FontAwesomeIcon className='ic play' style={{ color: '#eee' }} icon='play' />
                    </div>


                </div>
                <div className='film-info'>
                    <div>{film.name}</div>
                    <div>Runtime: {film.runtime} minute</div>
                    <button className='btn button'>Mua vé</button>
                </div>
            </div>
        </div >
    );
}

export default Film;