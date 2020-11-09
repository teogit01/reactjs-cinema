import React from 'react';
import Film from './../components/film'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import PropTypes from 'prop-types';
import { useHistory, useRouteMatch } from 'react-router-dom';
Film.propTypes = {
    listFilm: PropTypes.array
};

function MainPage(props) {
    const { listFilm } = props
    const history = useHistory()
    const match = useRouteMatch()
    const redirect = () => {
        history.push(`${match.url}/add`)
    }
    // detail film
    const handleDetail = (_id) => {
        history.push(`${match.url}/detail/${_id}`)
    }
    return (
        <div className='page-main'>
            <div className='title'>
                <h2>list film</h2>
                <FontAwesomeIcon className='ic ic-black' style={{ zIndex: 1 }} icon="plus" onClick={redirect} />
            </div>
            <hr className='op-5' />
            <div className='list-film'>
                {
                    listFilm.map((item, index) => {
                        return (
                            <div onClick={() => handleDetail(item._id)} key={index}>
                                <Film film={item} />
                            </div>
                        )
                    })
                }
            </div>
        </div>
    );
}

export default MainPage;