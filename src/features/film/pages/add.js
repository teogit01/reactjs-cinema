import React, { useState } from 'react';
import FilmAdd from './../components/film-add'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PropTypes from 'prop-types';
import { Redirect, useHistory } from 'react-router-dom';

AddPage.propTypes = {
    optionsGenre: PropTypes.array // list genre 
};

function AddPage(props) {
    const history = useHistory()
    const { optionsGenre, optionsCountry } = props
    const redirect = () => {
        history.goBack()
    }
    return (
        <div className='page-add'>
            <div className='film_title'>
                <h2>Thêm Film</h2>
                <FontAwesomeIcon className='ic ic-black ic-left' icon="arrow-left" onClick={redirect} />
            </div>
            <hr className='op-5 hr' />
            <FilmAdd optionsGenre={optionsGenre} optionsCountry={optionsCountry} />
        </div>

    );
}

export default AddPage;