import React, { useEffect, useState } from 'react';
import callApi from 'api/apiCaller';
import { useRouteMatch, useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Detail from './../components/film-detail'


// import PropTypes from 'prop-types';

// PageDetail.propTypes = {

// };

function PageDetail(props) {
    const history = useHistory()
    const match = useRouteMatch()
    const _id = match.params.film_id

    const [film, setFilm] = useState({})

    useEffect(() => {

        const LoadFilm = () => {
            callApi(`film/detail/${_id}`)
                .then(res => setFilm(res.data))
        }
        LoadFilm()
    }, [])

    const redirect = () => {
        history.goBack()
    }
    return (
        <div className='page-detail'>
            <div className='title'>
                <h2>list film</h2>
                <FontAwesomeIcon className='ic ic-black' style={{ zIndex: 1 }} icon="arrow-left" onClick={redirect} />
            </div>
            <hr className='op-5' />

            <Detail film={film} />
        </div>
    );

}

export default PageDetail;