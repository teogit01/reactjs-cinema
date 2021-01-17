import React, { useState, useEffect } from 'react';
//import Genre from 'features/genre/components/genre'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Switch from '@material-ui/core/Switch';

import callApi from 'api/apiCaller'
function Main(props) {
    const [checkEdit, setCheckEdit] = useState(false)
    const handleChange = () => setCheckEdit(!checkEdit)
    const [nameGenre, setNameGenre] = useState('')
    const [nameCountry, setNameCountry] = useState('')
    const [genres, setGenres] = useState([])
    const [countrys, setCountrys] = useState([])
    useEffect(() => {
        const LoadGenre = async () => {
            const data = await callApi('genre')
            if (data) {
                setGenres(data.data.genres)
            }
        }
        const LoadCountry = async () => {
            const data = await callApi('country')
            if (data) {
                setCountrys(data.data.countrys)
            }
        }
        LoadGenre()
        LoadCountry()
    }, [])
    const resetField = () => {
        setNameGenre('')
        setNameCountry('')
    }

    const changeValue = (e) => {
        if (e.target.name === 'name_genre') {
            setNameGenre(e.target.value)
        }
        if (e.target.name === 'name_country') {
            setNameCountry(e.target.value)
        }
    }
    const EnterGenre = (e) => {
        if (e.keyCode === 13) {
            const data = {
                name: nameGenre
            }
            callApi('genre/add', 'POST', data).then(res => {
                if (res.data.genre) {
                    const newGenres = [...genres, res.data.genre]
                    setGenres(newGenres)
                }
            })
            resetField()
        }
    }
    const EnterCountry = (e) => {
        if (e.keyCode === 13) {
            const data = {
                name: nameCountry
            }
            callApi('country/add', 'POST', data).then(res => {
                if (res.data.country) {
                    const newCountrys = [...countrys, res.data.country]
                    setCountrys(newCountrys)
                }
            })
            resetField()
        }
    }
    const _remove = (type, _id) => {
        const data = {
            _id: _id
        }
        if (type === 'genre') {
            callApi('genre/remove', 'POST', data)
            const newGenres = genres.filter(genre => genre._id !== _id)
            setGenres(newGenres)
        }
        if (type === 'country') {
            callApi('country/remove', 'POST', data)
            const newCountrys = countrys.filter(country => country._id !== _id)
            setCountrys(newCountrys)
        }
    }
    return (
        <div className='page-main'>
            <h2>Genre - Country</h2>
            <i>Edit:</i>
            <Switch
                checked={checkEdit}
                onChange={handleChange}
                color="primary"
                name="checkedB"
                inputProps={{ 'aria-label': 'primary checkbox' }}
            />
            <hr />
            <div className='main'>
                <div className='genres'>
                    <div className='form-add' >
                        <input type='text' placeholder='Enter new genre...'
                            value={nameGenre}
                            name='name_genre'
                            onKeyDown={EnterGenre}
                            onChange={changeValue} />
                    </div>
                    <div className='list'>
                        {
                            (genres && genres.length > 0) &&
                            genres.map((genre, idx) => {
                                return (
                                    <div key={genre._id} className='genre-item'>
                                        <div className='genre-stt'>{idx + 1}.</div>
                                        <div className='genre-name'>{genre.name}</div>
                                        <div
                                            className={checkEdit ? 'remove show' : 'remove none'}
                                            onClick={() => { _remove('genre', genre._id) }}
                                        >x</div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
                {/*countrys*/}
                <div className='countrys'>
                    <div className='form-add' >
                        <input type='text' placeholder='Enter new country...'
                            value={nameCountry}
                            name='name_country'
                            onKeyDown={EnterCountry}
                            onChange={changeValue} />
                    </div>
                    <div className='list'>
                        {
                            (countrys && countrys.length > 0) &&
                            countrys.map((country, idx) => {
                                return (
                                    <div key={country._id} className='country-item'>
                                        <div className='country-stt'>{idx + 1}.</div>
                                        <div className='country-name'>{country.name}</div>
                                        <div
                                            className={checkEdit ? 'remove show' : 'remove none'}
                                            onClick={() => { _remove('country', country._id) }}
                                        >x</div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Main;