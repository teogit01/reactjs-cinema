import React, { useState, useEffect } from 'react';
import Film from './../components/film'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Select from 'react-select'
import PropTypes from 'prop-types';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { useHistory, useRouteMatch } from 'react-router-dom';
import callApi from 'api/apiCaller';
Film.propTypes = {
    //listFilm: PropTypes.array
};

function MainPage(props) {
    const history = useHistory()
    const match = useRouteMatch()
    const [resetFilm, setResetFilm] = useState(false)
    const [films, setFilms] = useState([])
    const [filmNows, setFilmNows] = useState([])
    const [filmSoons, setFilmSoons] = useState([])
    const [filmSpecials, setFilmSpecials] = useState([])
    const redirect = () => {
        history.push(`${match.url}/add`)
    }
    // detail film
    const handleDetail = (_id) => {
        history.push(`${match.url}/detail/${_id}`)
    }
    // new version

    useEffect(() => {
        const LOAD_FILM = async () => {
            const data = await callApi('film')
            if (data) {
                setFilms(data.data.films)
                const nows = []
                const soons = []
                const specials = []
                data.data.films.map(film => {
                    if (film.type === 1) {
                        nows.push(film)
                    }
                    if (film.type === 2) {
                        soons.push(film)
                    }
                    if (film.type === 3) {
                        specials.push(film)
                    }
                })
                setFilmNows(nows)
                setFilmSoons(soons)
                setFilmSpecials(specials)
            }
        }
        LOAD_FILM()
    }, [resetFilm])
    // useEffect(() => {
    //     const LOAD_FILM = async () => {
    //         const data = await callApi('film')
    //         if (data) {
    //             setFilms(data.data.films)
    //             const nows = []
    //             const soons = []
    //             const specials = []
    //             data.data.films.map(film => {
    //                 if (film.type === 1) {
    //                     nows.push(film)
    //                 }
    //                 if (film.type === 2) {
    //                     soons.push(film)
    //                 }
    //                 if (film.type === 3) {
    //                     specials.push(film)
    //                 }
    //             })
    //             setFilmNows(nows)
    //             setFilmSoons(soons)
    //             setFilmSpecials(specials)
    //         }
    //     }
    //     LOAD_FILM()
    // }, [!resetFilm])



    //edit
    // now
    const [CEN, setCEN] = useState(false)
    const [CSN, setCSN] = useState(true)
    // soon
    const [CES, setCES] = useState(false)
    const [CSS, setCSS] = useState(true)
    // special
    const [CESP, setCESP] = useState(false)
    const [CSSP, setCSSP] = useState(true)
    //end edit

    //remove
    const _remove = (type, film) => {
        const data = {
            _idfilm: film._id
        }
        if (type === 'now') {
            const newFilm = filmNows.filter(item => item._id !== film._id)
            setFilmNows(newFilm)
            callApi('film/delete', 'POST', data)
        }
        if (type === 'special') {
            const newFilm = filmSpecials.filter(item => item._id !== film._id)
            setFilmSpecials(newFilm)
            callApi('film/delete', 'POST', data)
        }
        if (type === 'soon') {
            const newFilm = filmSoons.filter(item => item._id !== film._id)
            setFilmSoons(newFilm)
            callApi('film/delete', 'POST', data)
        }
    }
    //end remove

    //modal
    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);
    const [modalFilmDetail, setModalFilmDetail] = useState(false);
    const toggleFilmDetail = () => setModalFilmDetail(!modalFilmDetail);

    const onSave = () => {
        toggle()
        const data = {
            filmTo: typeNotShow,
            selectedNows,
            selectedSoons,
            selectedSpecials
        }
        //console.log(data)
        callApi('film/move/multiple', 'POST', data)
        if (selectedNows.length > 0) {
            let arr = filmNows
            selectedNows.map(item => {
                const newFilms = arr.filter(film => film._id !== item.value)
                arr = newFilms
            })
            setFilmNows(arr)
        }
        if (selectedSoons.length > 0) {
            let arr = filmSoons
            selectedSoons.map(item => {
                const newFilms = arr.filter(film => film._id !== item.value)
                arr = newFilms
            })
            setFilmSoons(arr)
        }
        if (selectedSpecials.length > 0) {
            let arr = filmSpecials
            selectedSpecials.map(item => {
                const newFilms = arr.filter(film => film._id !== item.value)
                arr = newFilms
            })
            setFilmSpecials(arr)
        }
        // update film to
        if (typeNotShow === 'now') {
            const arr = selectedNows.concat(selectedSoons, selectedSpecials)
            let arrAdd = []
            if (arr.length > 0) {
                arr.map(item => {
                    const newArr = films.filter(film => film._id === item.value)
                    arrAdd.push(newArr[0])
                })
            }
            setFilmNows(filmNows.concat(arrAdd))
        }
        if (typeNotShow === 'soon') {
            const arr = selectedNows.concat(selectedSoons, selectedSpecials)
            let arrAdd = []
            if (arr.length > 0) {
                arr.map(item => {
                    const newArr = films.filter(film => film._id === item.value)
                    arrAdd.push(newArr[0])
                })
            }
            setFilmSoons(filmSoons.concat(arrAdd))
        }
        if (typeNotShow === 'special') {
            const arr = selectedNows.concat(selectedSoons, selectedSpecials)
            let arrAdd = []
            if (arr.length > 0) {
                arr.map(item => {
                    const newArr = films.filter(film => film._id === item.value)
                    arrAdd.push(newArr[0])
                })
            }
            setFilmSpecials(filmSpecials.concat(arrAdd))
        }
        // added
        resetSelected()
    }
    //end modal

    //options
    const [optionFilmNows, setOptionFilmNows] = useState([])
    const [optionFilmSoons, setOptionFilmSoons] = useState([])
    const [optionFilmSpecials, setOptionFilmSpecials] = useState([])
    useEffect(() => {
        if (filmNows.length > 0) {
            const arr = []
            filmNows.map(film => {
                arr.push({ label: `${film.name} ${film.status ? '' : '(Hidden)'}`, value: film._id, type: 'now' })
            })
            setOptionFilmNows(arr)
        }
    }, [filmNows])
    useEffect(() => {
        if (filmSoons.length > 0) {
            const arr = []
            filmSoons.map(film => {
                arr.push({ label: `${film.name} ${film.status ? '' : '(Hidden)'}`, value: film._id, type: 'soon' })
            })
            setOptionFilmSoons(arr)
        }
    }, [filmSoons])
    useEffect(() => {
        if (filmSpecials.length > 0) {
            const arr = []
            filmSpecials.map(film => {
                arr.push({ label: `${film.name} ${film.status ? '' : '(Hidden)'}`, value: film._id, type: 'special' })
            })
            setOptionFilmSpecials(arr)
        }
    }, [filmSpecials])
    //options
    // _add
    const [typeNotShow, setTypeNotShow] = useState('')
    const _add = (type) => {
        setTypeNotShow(type)
        toggle()
    }
    //end _add

    //_move
    const [typeTo, setTypeTo] = useState('')
    const [isMove, setIsmove] = useState(false)

    const _move = (type) => {

        setIsmove(!isMove)
        setTypeNotShow(type)
    }
    //end _move
    // _save move
    const _saveMove = (film) => {
        if (typeNotShow === 'now') {
            const newFilms = filmNows.filter(item => item._id !== film._id)
            setFilmNows(newFilms)
        }
        if (typeNotShow === 'soon') {
            const newFilms = filmSoons.filter(item => item._id !== film._id)
            setFilmSoons(newFilms)
        }
        if (typeNotShow === 'special') {
            const newFilms = filmSpecials.filter(item => item._id !== film._id)
            setFilmSpecials(newFilms)
        }

        if (typeTo === 'now') {
            setFilmNows([...filmNows, film])
        }
        if (typeTo === 'soon') {
            setFilmSoons([...filmSoons, film])
        }
        if (typeTo === 'special') {
            setFilmSpecials([...filmSpecials, film])
        }
        const data = {
            film: film,
            start: typeNotShow,
            end: typeTo,
        }
        console.log(data)
        callApi('film/move', 'POST', data)
    }
    // end _save move

    //change value select
    const resetSelected = () => {
        setSelectedNows([])
        setSeletedSoons([])
        setSelectedSpecials([])
    }
    const [selectedNows, setSelectedNows] = useState([])
    const [selectedSoons, setSeletedSoons] = useState([])
    const [selectedSpecials, setSelectedSpecials] = useState([])
    const _changeSelect = (type, arr) => {
        //const newValueFilms = valueFilmSelected.concat(arr)
        if (type === 'now') {
            setSelectedNows(arr)
        }
        if (type === 'soon') {
            setSeletedSoons(arr)
        }
        if (type === 'special') {
            setSelectedSpecials(arr)
        }
    }
    // end change value select
    // _actived
    const _adtived = (type, film) => {
        const data = {
            type: type,
            _idfilm: film._id
        }
        callApi('film/edit-status', 'POST', data)
        if (type === 'now') {
            const newFilms = filmNows.filter(item => item._id !== film._id)
            setFilmNows([...newFilms, { ...film, status: !film.status }])
        }
        if (type === 'soon') {
            const newFilms = filmSoons.filter(item => item._id !== film._id)
            setFilmSoons([...newFilms, { ...film, status: !film.status }])
        }
        if (type === 'special') {
            const newFilms = filmSpecials.filter(item => item._id !== film._id)
            setFilmSpecials([...newFilms, { ...film, status: !film.status }])
        }
    }
    // end _actived

    // _detail
    const [filmDetail, setFilmDetail] = useState('')
    const _detail = (film) => {
        setFilmDetail(film)
        toggleFilmDetail()
    }
    // end _detail

    const [name, setName] = useState('')
    const [runtime, setRuntime] = useState('')
    const [price, setPrice] = useState('')
    const [openday, setOpenday] = useState('')

    useEffect(() => {
        setName(filmDetail.name)
        setRuntime(filmDetail.runtime)
        setPrice(filmDetail.price)
        setOpenday(filmDetail.openday)
    }, [filmDetail])

    const _onChange = e => {
        const name = e.target.name
        const value = e.target.value
        if (name === 'name')
            setName(value)
        if (name === 'runtime')
            setRuntime(value)
        if (name === 'price')
            setPrice(value)
        if (name === 'openday')
            setOpenday(value)
    }
    const _reset = () => {
        setName('')
        setRuntime('')
        setPrice('')
        setOpenday('')
    }
    const _onEdit = () => {
        const data = {
            _id: filmDetail._id,
            name,
            runtime,
            price,
            openday
        }

        //console.log('data', data)
        callApi('film/edit-detail', 'POST', data).then(res => {
            if (res.data.film) {
                setFilmDetail(res.data.film)
                setResetFilm(!resetFilm)
                toggleFilmDetail()
            }
        })
        _reset()
        //toggleFilmDetail()
    }
    return (
        <div className='page-main'>
            <div className='title'>
                <h2>Film Management</h2>
                <FontAwesomeIcon className='ic ic-black' style={{ zIndex: 1 }} icon="plus" onClick={redirect} />
            </div>
            <hr className='op-5' />
            <div className='main-films'>
                <div className='film-showing'>
                    <div className='film-type'>
                        <div className='type'><i>Now showing</i></div>
                        <div className={CSN ? 'status status-actived' : 'status status-hidden'} onClick={() => { setCSN(!CSN) }}>
                            <i>{CSN ? 'Actived' : 'Hidden'}</i> {` `}
                            {CSN ? (filmNows.filter(item => item.status === true)).length :
                                (filmNows.filter(item => !item.status)).length}
                        </div>
                        <div className={CEN ? 'edit edit-actived' : 'edit'} onClick={() => { setCEN(!CEN) }}>
                            <i>Edit</i>
                        </div>
                        <div className='add' onClick={() => _add('now')}>
                            <i>Add</i>
                        </div>
                    </div>
                    <div className='film-list'>
                        <div className='film-list-item'>
                            {
                                filmNows.length > 0 &&
                                filmNows.map(film => {
                                    if (film.status === CSN)
                                        return (
                                            <div key={film._id} className={CEN ? 'film film-edit' : 'film'}>
                                                <div className='outlay' onMouseLeave={() => {
                                                    setIsmove(false)
                                                    setTypeTo('')
                                                }
                                                }>
                                                    <div
                                                        onClick={() => _adtived('now', film)}
                                                        className={film.status ? 'button button-hidden' : 'button button-actived'}>
                                                        {film.status ? 'Hidden' : 'Actived'}
                                                    </div>
                                                    <div
                                                        className='button button-delete'
                                                        onClick={() => { _remove('now', film) }}
                                                    >
                                                        Delete
                                                    </div>
                                                    <div
                                                        className='button button-move'
                                                        onClick={() => { _move('now', film) }}
                                                    >
                                                        Move
                                                    </div>
                                                    {
                                                        isMove &&
                                                        <div className='select'>
                                                            <div
                                                                className={typeNotShow === 'now' ? 'select-item none' :
                                                                    typeTo === 'now' ? 'select-item select-item-actived' : 'select-item'}
                                                                onClick={() => { setTypeTo('now') }}
                                                            >
                                                                Film showing
                                                            </div>
                                                            <div
                                                                className={typeNotShow === 'soon' ? 'select-item none' :
                                                                    typeTo === 'soon' ? 'select-item select-item-actived' : 'select-item'}
                                                                onClick={() => { setTypeTo('soon') }}
                                                            >
                                                                Film Soon
                                                            </div>
                                                            <div
                                                                className={typeNotShow === 'special' ? 'select-item none' :
                                                                    typeTo === 'special' ? 'select-item select-item-actived' : 'select-item'}
                                                                onClick={() => { setTypeTo('special') }}
                                                            >
                                                                Film Speacial
                                                            </div>
                                                            <div
                                                                className='select-item save-move'
                                                                onClick={() => { _saveMove(film) }}
                                                            >
                                                                Move
                                                            </div>
                                                        </div>
                                                    }
                                                </div>
                                                <div className='film-poster'>
                                                    <img src={`http://localhost:5000/api/poster/${film.poster}`} />
                                                </div>
                                                <div
                                                    onClick={() => _detail(film)}
                                                    className='film-name'><i>{film.name}</i></div>
                                            </div>
                                        )
                                })
                            }
                        </div>
                    </div>
                </div>
                {/* Speacial */}
                <div className='film-special'>
                    <div className='film-type'>
                        <div className='type'><i>Special</i></div>
                        <div className={CSSP ? 'status status-actived' : 'status status-hidden'} onClick={() => { setCSSP(!CSSP) }}>
                            <i>{CSSP ? 'Actived' : 'Hidden'}</i>{` `}
                            {CSSP ? (filmSpecials.filter(item => item.status === true)).length :
                                (filmSpecials.filter(item => !item.status)).length}
                        </div>
                        <div className={CESP ? 'edit edit-actived' : 'edit'} onClick={() => { setCESP(!CESP) }}>
                            <i>Edit</i>
                        </div>
                        <div className='add' onClick={() => _add('special')}>
                            <i>Add</i>
                        </div>
                    </div>
                    <div className='film-list'>
                        <div className='film-list-item'>
                            {
                                filmSpecials.length > 0 &&
                                filmSpecials.map(film => {
                                    if (film.status === CSSP)
                                        return (
                                            <div key={film._id} className={CESP ? 'film film-edit' : 'film'}>
                                                <div className='outlay' onMouseLeave={() => {
                                                    setIsmove(false)
                                                    setTypeTo('')
                                                }
                                                }>
                                                    <div
                                                        onClick={() => _adtived('special', film)}
                                                        className={film.status ? 'button button-hidden' : 'button button-actived'}>
                                                        {film.status ? 'Hidden' : 'Actived'}
                                                    </div>
                                                    <div
                                                        className='button button-delete'
                                                        onClick={() => { _remove('special', film) }}
                                                    >
                                                        Delete
                                                    </div>
                                                    <div
                                                        className='button button-move'
                                                        onClick={() => { _move('special', film) }}
                                                    >
                                                        Move
                                                    </div>
                                                    {
                                                        isMove &&
                                                        <div className='select'>
                                                            <div
                                                                className={typeNotShow === 'now' ? 'select-item none' :
                                                                    typeTo === 'now' ? 'select-item select-item-actived' : 'select-item'}
                                                                onClick={() => { setTypeTo('now') }}
                                                            >
                                                                Film showing
                                                                </div>
                                                            <div
                                                                className={typeNotShow === 'soon' ? 'select-item none' :
                                                                    typeTo === 'soon' ? 'select-item select-item-actived' : 'select-item'}
                                                                onClick={() => { setTypeTo('soon') }}
                                                            >
                                                                Film Soon
                                                            </div>
                                                            <div
                                                                className={typeNotShow === 'special' ? 'select-item none' :
                                                                    typeTo === 'special' ? 'select-item select-item-actived' : 'select-item'}
                                                                onClick={() => { setTypeTo('special') }}
                                                            >
                                                                Film Speacial
                                                            </div>
                                                            <div
                                                                className='select-item save-move'
                                                                onClick={() => { _saveMove(film) }}
                                                            >
                                                                Move
                                                            </div>
                                                        </div>
                                                    }
                                                </div>
                                                <div className='film-poster'>
                                                    <img src={`http://localhost:5000/api/poster/${film.poster}`} />
                                                </div>
                                                <div
                                                    onClick={() => _detail(film)}
                                                    className='film-name'><i>{film.name}</i></div>
                                            </div>
                                        )
                                })
                            }
                        </div>
                    </div>
                </div>
                {/* soon */}
                <div className='film-comming-soon'>
                    <div className='film-type'>
                        <div className='type'><i>Film Comming Soon</i></div>
                        <div className={CSS ? 'status status-actived' : 'status status-hidden'} onClick={() => { setCSS(!CSS) }}>
                            <i>{CSS ? 'Actived' : 'Hidden'}</i>{` `}
                            {CSS ? (filmSoons.filter(item => item.status === true)).length :
                                (filmSoons.filter(item => !item.status)).length}
                        </div>
                        <div className={CES ? 'edit edit-actived' : 'edit'} onClick={() => { setCES(!CES) }}>
                            <i>Edit</i>
                        </div>
                        <div className='add' onClick={() => _add('soon')}>
                            <i>Add</i>
                        </div>
                    </div>
                    <div className='film-list'>
                        <div className='film-list-item'>
                            {
                                filmSoons.length > 0 &&
                                filmSoons.map(film => {
                                    if (film.status === CSS)
                                        return (
                                            <div key={film._id} className={CES ? 'film film-edit' : 'film'}>
                                                <div className='outlay' onMouseLeave={() => {
                                                    setIsmove(false)
                                                    setTypeTo('')
                                                }
                                                }>
                                                    <div
                                                        onClick={() => _adtived('soon', film)}
                                                        className={film.status ? 'button button-hidden' : 'button button-actived'}>
                                                        {film.status ? 'Hidden' : 'Actived'}
                                                    </div>
                                                    <div
                                                        className='button button-delete'
                                                        onClick={() => { _remove('soon', film) }}
                                                    >
                                                        Delete
                                                    </div>
                                                    <div
                                                        className='button button-move'
                                                        onClick={() => { _move('soon', film) }}
                                                    >
                                                        Move
                                                    </div>
                                                    {
                                                        isMove &&
                                                        <div className='select'>
                                                            <div
                                                                className={typeNotShow === 'now' ? 'select-item none' :
                                                                    typeTo === 'now' ? 'select-item select-item-actived' : 'select-item'}
                                                                onClick={() => { setTypeTo('now') }}
                                                            >
                                                                Film showing
                                                                </div>
                                                            <div
                                                                className={typeNotShow === 'soon' ? 'select-item none' :
                                                                    typeTo === 'soon' ? 'select-item select-item-actived' : 'select-item'}
                                                                onClick={() => { setTypeTo('soon') }}
                                                            >
                                                                Film Soon
                                                            </div>
                                                            <div
                                                                className={typeNotShow === 'special' ? 'select-item none' :
                                                                    typeTo === 'special' ? 'select-item select-item-actived' : 'select-item'}
                                                                onClick={() => { setTypeTo('special') }}
                                                            >
                                                                Film Speacial
                                                            </div>
                                                            <div
                                                                className='select-item save-move'
                                                                onClick={() => { _saveMove(film) }}
                                                            >
                                                                Move
                                                            </div>
                                                        </div>
                                                    }
                                                </div>
                                                <div className='film-poster'>
                                                    <img src={`http://localhost:5000/api/poster/${film.poster}`} />
                                                </div>
                                                <div className='film-content'>Noi dung</div>
                                                <div
                                                    onClick={() => _detail(film)}
                                                    className='film-name'><i>{film.name}</i></div>
                                            </div>
                                        )
                                })
                            }
                        </div>
                    </div>
                </div>
                <div className='film-waiting'></div>
            </div>
            {/* Modal add film type */}
            <div>
                <Modal isOpen={modal} toggle={toggle}>
                    <ModalHeader toggle={toggle}>Modal title</ModalHeader>
                    <ModalBody>
                        <div className='modal-add'>
                            <label>Film now showing</label>
                            <Select
                                options={optionFilmNows}
                                isDisabled={typeNotShow === 'now'}
                                isMulti
                                closeMenuOnSelect={false}
                                onChange={(e) => _changeSelect('now', e)}
                            //onChange={_changeSelect}
                            />
                            <label>Film comming soon</label>
                            <Select
                                isMulti
                                closeMenuOnSelect={false}
                                options={optionFilmSoons}
                                isDisabled={typeNotShow === 'soon'}
                                onChange={(e) => _changeSelect('soon', e)}
                            //onChange={_changeSelect}
                            />
                            <label>Film Speacial</label>
                            <Select
                                options={optionFilmSpecials}
                                isMulti
                                closeMenuOnSelect={false}
                                isDisabled={typeNotShow === 'special'}
                                onChange={(e) => _changeSelect('special', e)}
                            //onChange={_changeSelect}
                            />
                            <label>Film Deleted</label>
                            <Select
                            />
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={onSave}>Add film</Button>{' '}
                        <Button color="secondary" onClick={toggle}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
            {/* Modal delait film*/}
            <div>
                <Modal isOpen={modalFilmDetail} toggle={toggleFilmDetail} >
                    <ModalHeader toggle={toggleFilmDetail}>Detail film '<i>{filmDetail.name}</i>'</ModalHeader>
                    <ModalBody>
                        <div className='detail'>
                            <div className='control'>
                                <label>Code</label>
                                <input type='text' value={filmDetail.code} />
                            </div>
                            <div className='control'>
                                <label>Name</label>
                                <input type='text' value={name} name='name' onChange={_onChange} />
                            </div>
                            <div className='control'>
                                <label>Genre</label>
                                <input type='text' value={
                                    (filmDetail && filmDetail.genres && filmDetail.genres.length > 0) &&
                                    filmDetail.genres.map(genre => {
                                        return (
                                            genre.name
                                        )
                                    })
                                } />
                            </div>
                            <div className='control'>
                                <label>Country</label>
                                <input type='text' value={
                                    (filmDetail && filmDetail.countrys && filmDetail.countrys.length > 0) &&
                                    filmDetail.countrys.map(country => {
                                        return (
                                            country.name
                                        )
                                    })
                                } />
                            </div>
                            <div className='control'>
                                <label>Openday</label>
                                <input type='text' value={openday} name='openday' onChange={_onChange} />
                            </div>
                            <div className='control'>
                                <label>Runtime</label>
                                <input type='text' value={runtime} name='rumtime' onChange={_onChange} />
                            </div>
                            <div className='control'>
                                <label>price</label>
                                <input type='text' value={price} name='price' onChange={_onChange} />
                            </div>
                            <div className='control'>
                                <label>Director</label>
                                <input type='text' value={filmDetail.director} />
                            </div>
                            <div className='control'>
                                <label>Cast</label>
                                <input type='text' value={filmDetail.cast} />
                            </div>
                            <div className='control'>
                                <label>Description</label>
                                <input type='text' value={filmDetail.description} />
                            </div>
                            <br />
                            <div className='control'>
                                <label>Poster</label>
                                <input type='file' />
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={() => _onEdit()}>Edit</Button>
                        <Button color="secondary" onClick={toggleFilmDetail}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        </div>
    );
}

export default MainPage;