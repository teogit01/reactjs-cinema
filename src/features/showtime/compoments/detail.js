import React from 'react';
import StartEnd from './start-end'

import useQuery from 'components/queries'
import callApi from 'api/apiCaller'
import PropTypes from 'prop-types';

Detail.propTypes = {
    film: PropTypes.object,
    branch: PropTypes.object,
    theater: PropTypes.object,
    dateCurrent: PropTypes.string,
    showtimes: PropTypes.array,
    remove: PropTypes.func
};

function Detail(props) {
    const { film, theater, branch, dateCurrent, remove, showtimes } = props
    let query = useQuery()
    const handleRemove = (film) => {
        //console.log(film._id)
        //console.log(query.get('_idtheater'))
        let data = {
            _idfilm: film._id,
            _idtheater: query.get('_idtheater')
        }
        callApi('film/remove/theater', 'POST', { data }).then((res) => {
            if (remove) {
                remove(res.data.film)
            }
        })
    }
    return (
        <div className='showtime--item'>
            <div className='showtime--item__film'>
                <div className='img'></div>
                <div className='film'>
                    <div className='remove'>
                        <div className='icon-remove' onClick={() => handleRemove(film)}>X</div>
                    </div>
                    <div><b>Name: {film.name}</b></div>
                    <div><b>Runtime: {film.runtime} phut</b></div>
                    <div className='type-film'>2D - Digital</div>
                </div>
                <hr />
            </div>
            <StartEnd film={film} branch={branch} theater={theater} dateCurrent={dateCurrent} />
        </div>
    );
}

export default Detail;