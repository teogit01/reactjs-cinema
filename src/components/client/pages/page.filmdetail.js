import React, { useEffect, useState } from 'react';
import './../css/page-film-detail.scss'
import { useRouteMatch } from 'react-router-dom';
import FilmDetail from './../components/film-detail'
import callApi from 'api/apiCaller.js';
import PropTypes from 'prop-types';

PageFilmDetail.propTypes = {
    branchActived: PropTypes.object
};

function PageFilmDetail(props) {
    const { branchActived } = props
    const match = useRouteMatch()
    const [film, setFilm] = useState('')
    const { _idfilm } = match.params
    useEffect(() => {
        if (_idfilm) {
            callApi(`film/detail/${_idfilm}`).then(res => {
                if (res.data.film) {
                    setFilm(res.data.film)
                }
            })
        }
    }, [])

    return (
        <div className='page-film-detail'>
            <FilmDetail film={film} branchActived={branchActived} />
        </div>
    );
}

export default PageFilmDetail;