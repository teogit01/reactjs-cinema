import React, { useState, useEffect } from 'react';

//	import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useSelector } from 'react-redux'
import callApi from 'api/apiCaller'
import { useDispatch } from 'react-redux'
import * as action from './../genreSlice'

function Genre(props) {
    const genre_store = useSelector(state => state.genres)
    const [genres, setGenres] = useState(genre_store)
    const dispatch = useDispatch()

    const [value, setValue] = useState('')
    // change value
    function onChange(e) {
        //console.log(e.target.value)
        const newValue = e.target.value
        setValue(newValue)
    }
    // submit new genre
    function onSubmit(e) {
        e.preventDefault()
        //console.log(value)
        if (value === '') return
        // call api -> recod{_id, .....}
        callApi('genre', 'POST', { 'name': value })
            .then(res => {
                //console.log('res', res.data)
                // add to store { _id,...}
                dispatch(action.addGenre(res.data.genre))
                //console.log(res.data.genre)
            })
        setValue('')
        //console.log('store', genre_store)		
    }
    // Del genre
    function onDel(genre) {
        // call api remove genre        

        callApi(`genre/${genre._id}`, 'DELETE', null)
            .then(res => {
                //console.log('res', res.data._id)
                // remove in store { _id,...}
                dispatch(action.delGenre(res.data._id))
                //console.log(res.data.genre)
            })
    }

    useEffect(() => {
        const LoadGenre = async () => {
            let data = await callApi('genre')
            setGenres(data.data)
            dispatch(action.loadGenre(data.data))
            console.log('called Api')
        }
        if (genres.length === 0) {
            LoadGenre()
        }
    }, [])

    return (
        <div className='wrap_genre'>
            <div className='genre_title'>
                <h2>Genre</h2>
                {/*<FontAwesomeIcon className='ic ic-black' icon="plus"/>*/}
            </div>
            <hr className='op-5' />

            <div className='genre_list'>
                <div className='genre_list--item row sticky'>
                    <form onSubmit={onSubmit} >
                        <input
                            type='text'
                            className='add col-12 '
                            placeholder='Enter new genre! ...'

                            value={value}
                            onChange={onChange}
                        />
                    </form>
                </div>

                <div className='genre_list--item col-12 row head'>
                    <div className='col-1'>#</div>
                    <div className='col-2'>Name</div>
                    <div className='col-2'>Action</div>
                </div>
                {
                    genre_store.map((genre, index) => {
                        return (
                            <div key={genre.code} className='genre_list--item col-12 row'>
                                <div className='col-1'>{index + 1}</div>
                                <div className='col-2'>{genre.name}</div>
                                <div className='col-2' onClick={() => onDel(genre)}>Del</div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    );
}

export default Genre;