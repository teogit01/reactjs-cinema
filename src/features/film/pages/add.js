import React, { useState, useEffect } from 'react';
import FilmAdd from './../components/film-add'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PropTypes from 'prop-types';
import { Redirect, useHistory } from 'react-router-dom';
import callApi from 'api/apiCaller';

AddPage.propTypes = {
    //optionsGenre: PropTypes.array // list genre 
};

function AddPage(props) {
    const history = useHistory()
    const redirect = () => {
        history.goBack()
    }
    const [optionGenres, setOptionGenres] = useState([])
    const [optionCountrys, setOptionCountrys] = useState([])
    useEffect(() => {
        callApi('genre').then(res => {
            if (res.data.genres.length > 0) {
                const arr = []
                res.data.genres.map(genre => {
                    arr.push({
                        label: genre.name,
                        value: genre._id
                    })
                })
                setOptionGenres(arr)
            }
        })
        callApi('country').then(res => {
            if (res.data.countrys.length > 0) {
                const arr = []
                res.data.countrys.map(country => {
                    arr.push({
                        label: country.name,
                        value: country._id
                    })
                })
                setOptionCountrys(arr)
            }
        })
    }, [])
    return (
        <div className='page-add'>
            <div className='film_title'>
                <h2>Add new film</h2>
                <FontAwesomeIcon className='ic ic-black ic-left' icon="arrow-left" onClick={redirect} />
            </div>
            <hr className='op-5 hr' />
            <FilmAdd options={{ optionGenres, optionCountrys }} />
        </div>
    );
}

export default AddPage;