import React, { useState, useEffect, useRef } from 'react';
import Branch from 'features/branch/components/branch'
import Breadcrumbs from 'components/admin/breadcrumbs'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useHistory, useRouteMatch } from 'react-router-dom';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, UncontrolledCollapse } from 'reactstrap';
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, CardTitle, CardText, Row, Col } from 'reactstrap';
import classnames from 'classnames';
import Select from 'react-select'
import Switch from '@material-ui/core/Switch';

import callApi from 'api/apiCaller'
import citys from 'components/admin/constant'
import Room from './../components/room'
import PropTypes from 'prop-types';
PageMain.propTypes = {
    //branchs: PropTypes.array
}

const NOTE = [
    { type: 'default', price: 0, color: '#88A09E' },
    { type: 'normal', price: 5, color: '#2B3B3B' },
    { type: 'couple', price: 10, color: '#F6DB79' }
]
function PageMain(props) {
    const history = useHistory()
    const match = useRouteMatch()
    const [branchs, setBranchs] = useState([])
    const [branchActived, setBranchActived] = useState()
    const [films, setFilms] = useState([])
    const [optionFilms, setOptionFilms] = useState([])
    // did mount    
    useEffect(() => {
        const LoadBranch = async () => {
            let data = await callApi('branch')
            setBranchs(data.data)
            setBranchActived(data.data[0])
        }
        const LoadFilm = async () => {
            let data_film = await callApi('film')
            setFilms(data_film.data.films)
            if (data_film.data && data_film.data.films.length > 0) {
                const arr = []
                data_film.data.films.map(film => {
                    arr.push({ label: film.name, value: film._id })
                })
                setOptionFilms(arr)
            }
        }
        LoadBranch()
        LoadFilm()
    }, [])
    // end did mount
    // redirect    
    const redirect = () => {
        history.push(`${match.url}/add`)
    }
    // // handle delete branch
    const handleDel = branch => {
        if (window.confirm(`Remove ${branch.name}`)) {
            //remove
            callApi(`branch/${branch._id}`, 'DELETE', null)
        }
    }
    //handle detail
    const handleDetail = branch => {
        history.push(`${match.url}/detail/${branch._id}`)
    }

    // branch actived    
    const changeBranchActived = (branch) => {
        setBranchActived(branch)
    }
    const [theaters, setTheaters] = useState([])
    useEffect(() => {
        if (branchActived)
            setTheaters(branchActived.theaters)
        else
            setTheaters('')
    }, [branchActived])
    //console.log(theaters)    
    if (!localStorage.getItem('status-feature')) {
        localStorage.setItem('status-feature', false)
    }

    useEffect(() => {
        setStatusFeature(localStorage.getItem('status-feature'))
    }, [])
    const [statusFeature, setStatusFeature] = useState(localStorage.getItem('status-feature'))
    /// changeStatusFeature    
    const changeStatusFeature = () => {
        setStatusFeature(statusFeature === 'true' ? 'false' : 'true')
        localStorage.setItem('status-feature', statusFeature === 'true' ? 'false' : 'true')

    }

    const resetField = () => {
        setName('')
        setEmail('')
        setHotline('')
        setAddress('')
        setCity('')
        setBranch('')
        setCapacity('')
    }

    /// modal new branch
    const [modalBranch, setModalBranch] = useState(false);
    const toggleBranch = () => setModalBranch(!modalBranch);
    const optionCitys = []
    citys.map(city => {
        optionCitys.push({ label: city, value: city, type: 'city' })
    })
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [hotline, setHotline] = useState('')
    const [city, setCity] = useState('')
    const [address, setAddress] = useState('')
    const [branch, setBranch] = useState('')
    const [branchSelected, setBranchSelected] = useState('')
    const [capacity, setCapacity] = useState('')
    useEffect(() => {
        if (branchActived) {
            setBranchSelected({ label: branchActived.city, value: branchActived._id, type: 'theater' })
            setBranch(branchActived._id)
        }

    }, [branchActived])

    const changevalue = (e) => {
        if (e.target) {
            if (e.target.name === 'name') {
                setName(e.target.value)
            }
            if (e.target.name === 'email') {
                setEmail(e.target.value)
            }
            if (e.target.name === 'hotline') {
                setHotline(e.target.value)
            }
            if (e.target.name === 'address') {
                setAddress(e.target.value)
            }
            if (e.target.name === 'capacity') {
                setCapacity(e.target.value)
            }
        } else {
            if (e.type === 'city')
                setCity(e.value)
            else {
                setBranch(e.value)
                setBranchSelected({ label: e.label, value: e.value, type: 'theater' })
            }

        }
    }
    const saveBranch = () => {
        const data = {
            name: name,
            email: email,
            hotline: hotline,
            city: city
        }
        toggleBranch()
        resetField()
        callApi('branch/add-new-branch', 'POST', data).then(res => {
            const newBranch = [res.data.branch, ...branchs]
            setBranchs(newBranch)
        })
    }

    /// end modal new branch

    // modal new theater
    const [modalTheater, setModalTheater] = useState(false)
    const toggleTheater = () => setModalTheater(!modalTheater)

    const optionBranchs = []
    branchs.map(branch => {
        optionBranchs.push({ label: branch.city, value: branch._id, type: 'theater' })
    })
    const saveTheater = () => {
        const data = {
            name: name,
            email: email,
            hotline: hotline,
            address: address,
            branch: branch
        }
        callApi('theater/add-new-theater', 'POST', data).then(res => {
            setBranchActived(res.data.branch)
            let idx = -1
            branchs.map((branch, index) => {
                if (branch._id === res.data.branch._id)
                    idx = index
            })
            if (idx !== -1) {
                const newBranchs = [...branchs.slice(0, idx), res.data.branch, ...branchs.slice(idx + 1, branchs.length)]
                setBranchs(newBranchs)
            }
        })
        toggleTheater()
        resetField()
    }
    // end model theater

    // switch
    const [checkEdit, setCheckEdit] = useState(false)
    const [checkSave, setCheckSave] = useState(false)
    const handleChange = () => {
        setCheckEdit(!checkEdit)
    };
    // end switch
    const inputRef = useRef(null);

    // remove (type, _id)
    const remove = (type, _id) => {
        /// delete branch
        if (type === 'branch') {
            let idx = -1
            const newBranchs = branchs.filter((branch, index) => {
                if (branch._id === _id) {
                    idx = index
                }
                return branch._id !== _id
            })
            if (newBranchs.length === 0) {
                setBranchActived('')
            } else if (newBranchs.length === 1) {
                setBranchActived(newBranchs[0])
            } else {
                if ((newBranchs.filter(b => b._id === branchActived._id)).length !== 1) {
                    setBranchActived(newBranchs[idx])
                }
            }
            // send sever
            const data = {
                _idbranch: _id
            }
            callApi('branch/remove', 'POST', data)
            setBranchs(newBranchs)
        }
        // delete theater
        if (type === 'theater') {
            // const newTheaters = theaters.filter(theater => theater._id !== _id)
            // setTheaters(newTheaters)            

            const data = {
                _idtheater: _id,
                _idbranch: branchActived._id
            }
            callApi('theater/remove', 'POST', data).then(res => {

                setBranchActived(res.data.branch)
                let idx = -1
                if (branchs.map((branch, index) => {
                    if (branch._id === res.data.branch._id)
                        idx = index
                }))
                    if (idx !== -1) {
                        const newBranchs = [...branchs.slice(0, idx), res.data.branch, ...branchs.slice(idx + 1, branchs.lenth)]
                        setBranchs(newBranchs)
                    }
            })
        }
    }
    // end remove
    const saveEdit = () => {
        const data = {
            name: name,
            hotline: hotline,
            email: email,
            _idbranch: branchActived._id
        }
        resetField()
        setCheckSave(!checkSave)
        callApi('branch/edit', 'POST', data).then(res => {
            setBranchActived(res.data.branch)
        })
    }
    // detail theater
    const [checkDetail, setCheckDetail] = useState(false)
    const detail = (_idtheater) => {
        setCheckDetail(!checkDetail)
    }
    // end detail theater
    const [activeTab, setActiveTab] = useState('1');

    const toggle = tab => {
        if (activeTab !== tab) setActiveTab(tab);
    }

    // add film theater
    const [modalAddFilm, setModalAddFilm] = useState(false)
    const toggleFilm = () => setModalAddFilm(!modalAddFilm)

    const [theaterActived, setTheaterActived] = useState('')
    const [filmSelecteds, setFilmSelecteds] = useState([])
    const changeFilm = (e) => {
        setFilmSelecteds(e)
    }
    const [_idtheaterCurrent, set_idTheaterCurrent] = useState('')
    const _add = (type, _idtheater) => {
        if (type === 'film') {
            set_idTheaterCurrent(_idtheater)
            toggleFilm()
        }
        if (type === 'room') {
            set_idTheaterCurrent(_idtheater)
            toggleRoom()
        }
    }
    const saveFilm = () => {
        const data = {
            //_idtheater: theaterActived._id,
            _idtheater: _idtheaterCurrent,
            films: filmSelecteds
        }
        callApi('theater/add-film', 'POST', data).then(res => {
            setTheaterActived(res.data.theater)
            let idx = -1
            theaters.map((item, index) => {
                if (item._id === res.data.theater._id)
                    idx = index
            })
            if (idx != -1) {
                const newTheaters = [...theaters.slice(0, idx), res.data.theater, ...theaters.slice(idx + 1, theaters.length)]
                setTheaters(newTheaters)
            }
            //console.log('res', res.data.theater)
        })
        toggleFilm()
    }
    // end add film theater
    // add ROOM theater
    const [modalAddRoom, setModalAddRoom] = useState(false)
    const toggleRoom = () => setModalAddRoom(!modalAddRoom)
    const saveRoom = () => {
        const data = {
            name: name,
            capacity: capacity,
            // _idtheater: theaterActived._id
            _idtheater: _idtheaterCurrent
        }
        callApi('room/add', 'POST', data).then(res => {
            let idx = -1
            theaters.map((item, index) => {
                if (item._id === res.data.theater._id)
                    idx = index
            })
            if (idx !== -1) {
                const newTheaters = [...theaters.slice(0, idx), res.data.theater, ...theaters.slice(idx + 1, theaters.length)]
                setTheaters(newTheaters)
            }
            setTheaterActived(res.data.theater)
        })
        resetField()
        toggleRoom()
    }
    // end add ROOM theater
    // remove
    const _remove = (type, _id, _idtheater) => {
        // set_idTheaterCurrent(_idtheater)
        if (type === 'room') {
            const data = {
                //_idtheater: theaterActived._id,
                _idtheater: _idtheater,
                _idroom: _id
            }
            callApi('room/remove', 'POST', data).then(res => {
                setTheaterActived(res.data.theater)
                let idx = -1
                theaters.map((item, index) => {
                    if (item._id === res.data.theater._id)
                        idx = index
                })
                if (idx !== -1) {
                    const newTheaters = [...theaters.slice(0, idx), res.data.theater, ...theaters.slice(idx + 1), theaters.length]
                    setTheaters(newTheaters)
                }
            })
        }
        // remove FILM
        if (type === 'film') {
            const data = {
                //_idtheater: theaterActived._id,
                _idtheater: _idtheater,
                _idfilm: _id
            }
            callApi('theater/remove-film', 'POST', data).then(res => {
                setTheaterActived(res.data.theater)
                let idx = -1
                theaters.map((item, index) => {
                    if (item._id === res.data.theater._id) {
                        idx = index
                    }
                })
                if (idx !== -1) {
                    const newTheaters = [...theaters.slice(0, idx), res.data.theater, ...theaters.slice(idx + 1, theaters.length)]
                    setTheaters(newTheaters)
                }
            })
        }
    }
    // detail room
    const [checkDetailRoom, setCheckDetailRoom] = useState(false)
    const [roomActived, setRoomActived] = useState('')
    const _detail = (type, value) => {
        if (type === 'room') {
            setRoomActived(value)
        }
        setCheckDetailRoom(!checkDetailRoom)
    }
    // end detail room    

    //_change type
    const [checkEditSeat, setCheckEditSeat] = useState(false)
    const [checkAddSeat, setCheckAddSeat] = useState(false)
    const _change = (type) => {
        if (type === 'typeseat') {
            setCheckEditSeat(!checkEditSeat)
        }
        if (type === 'addSeat') {
            setCheckAddSeat(!checkAddSeat)
        }
    }
    //_change

    // _click
    const [typeSelected, setTypeSelected] = useState('')
    const _click = (type, value) => {
        if (checkEditSeat) {
            if (type === 'typeselect') {
                if (value !== 'couple')
                    setTypeSelected(value)
            }
        }
    }
    useEffect(() => {
        setTypeSelected('')
    }, [checkEditSeat])
    // end _click

    return (
        <div className='page-main'>
            <div className='title'>
                <h2>Branch Management</h2>
                {/* <FontAwesomeIcon className='ic ic-black' icon="plus" onClick={redirect} /> */}
                {/* <FontAwesomeIcon className='ic ic-black' icon="plus" onClick={changeStatusFeature} /> */}
                <i>Edit:</i>
                <Switch
                    checked={checkEdit}
                    onChange={handleChange}
                    color="primary"
                    name="checkedB"
                    inputProps={{ 'aria-label': 'primary checkbox' }}
                />
            </div>
            <br />
            <hr className='op-5' />

            <div className='list'>
                <div className='branchs'>
                    <div className='branch-item'>
                        {
                            (branchs && branchs.length > 0) &&
                            branchs.map(branch => {
                                return (
                                    <div className='branch-item-branch'>
                                        {checkEdit && <div className='branch-remove' onClick={() => { remove('branch', branch._id) }}>x</div>}
                                        <div key={branch._id}
                                            onClick={() => { changeBranchActived(branch) }}
                                            className={branchActived && branchActived._id === branch._id ? 'branch actived' : 'branch'}>
                                            <div>{branch.city}</div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                        {
                            branchs.length === 0 ? <div><b><i>Not found branch...</i></b></div> : ''
                        }

                        <div className='branch-add'>
                            <div className='button' onClick={() => toggleBranch()}>Add new branch</div>
                        </div>
                    </div>
                    <div className='wrap-middle'>
                        <div className='branch-actived theaters'>
                            {
                                (theaters && theaters.length > 0) &&
                                theaters.map(theater => {
                                    return (
                                        // <div className='theater-item' onClick={() => detail(theater._id)}>
                                        <div className='theater-item'>
                                            {
                                                checkEdit &&
                                                <div className='theater-remove'
                                                    onClick={() => remove('theater', theater._id)}
                                                >x
                                                </div>
                                            }
                                            <div className='theater' key={theater._id} id={`id-${theater._id}`} onClick={() => setTheaterActived(theater)}>
                                                <div>
                                                    <label>Code: </label>
                                                    {theater.code}
                                                </div>
                                                <div>
                                                    <label>Name: </label>
                                                    {theater.name}
                                                </div>
                                                <div>
                                                    <label>Hotline: </label>
                                                    {theater.hotline}
                                                </div>
                                                <div>
                                                    <label>Address: </label>
                                                    {theater.address}
                                                </div>
                                                <div>
                                                    <label>Rooms: </label>
                                                    {theater.rooms ? theater.rooms.length : 0}
                                                    &nbsp;&nbsp;&nbsp;
                                                    <label>Films: </label>
                                                    {theater.films ? theater.films.length : 0}
                                                </div>
                                                {/* <div>
                                                    <label>Film: </label>
                                                    {theater.films ? theater.films.length : 0}
                                                </div> */}
                                            </div>
                                            <UncontrolledCollapse toggler={`#id-${theater._id}`}>
                                                {theater._id === theaterActived._id ?
                                                    <div className='theater-detail'>
                                                        <div className='theater-detail-item'>
                                                            <Nav tabs>
                                                                <NavItem>
                                                                    <NavLink
                                                                        className={classnames({ active: activeTab === '1', title: true })}
                                                                        onClick={() => { toggle('1'); }}
                                                                    >
                                                                        Films
                                                                 </NavLink>
                                                                </NavItem>
                                                                <NavItem>
                                                                    <NavLink
                                                                        className={classnames({ active: activeTab === '2', title: true })}
                                                                        onClick={() => { toggle('2'); }}
                                                                    >
                                                                        Rooms
                                                            </NavLink>
                                                                </NavItem>
                                                            </Nav>
                                                            <br />
                                                            <TabContent activeTab={activeTab}>
                                                                <TabPane tabId="1">
                                                                    <Row>
                                                                        <Col sm="12">
                                                                            <table className='table-film'>
                                                                                <div>
                                                                                    <FontAwesomeIcon className='ic ic-add' icon="plus" onClick={() => _add('film', theater._id)} />
                                                                                </div>
                                                                                {
                                                                                    (theaterActived && theaterActived.films) &&
                                                                                    theaterActived.films.map((item, idx) => {
                                                                                        return (
                                                                                            <tr key={item._id}>
                                                                                                <td>{idx + 1}</td>
                                                                                                <td>{item.name}</td>
                                                                                                {
                                                                                                    checkEdit ?
                                                                                                        <td onClick={() => _remove('film', item._id, theater._id)}>
                                                                                                            x
                                                                                                        </td> :
                                                                                                        <td>
                                                                                                            <div className='none'>x</div>
                                                                                                        </td>
                                                                                                }
                                                                                            </tr>
                                                                                        )
                                                                                    })
                                                                                }
                                                                            </table>
                                                                        </Col>
                                                                    </Row>
                                                                </TabPane>
                                                                <TabPane tabId="2">
                                                                    <Row>
                                                                        <Col sm="12">
                                                                            <table className='table-film'>
                                                                                <div>
                                                                                    <FontAwesomeIcon className='ic ic-add' icon="plus" onClick={() => _add('room', theater._id)} />
                                                                                </div>
                                                                                {
                                                                                    (theaterActived && theaterActived.rooms) &&
                                                                                    theaterActived.rooms.map((item, idx) => {
                                                                                        return (
                                                                                            <tr key={item._id}>
                                                                                                <td>{idx + 1}</td>
                                                                                                <td onClick={() => { _detail('room', item) }}>{item.name}</td>
                                                                                                {
                                                                                                    checkEdit ?
                                                                                                        <td style={{ zIndex: 1 }} onClick={() => _remove('room', item._id, theater._id)}>
                                                                                                            x
                                                                                                        </td> :
                                                                                                        <td>
                                                                                                            <div className='none'>x</div>
                                                                                                        </td>
                                                                                                }
                                                                                            </tr>
                                                                                        )
                                                                                    })
                                                                                }
                                                                            </table>
                                                                        </Col>
                                                                    </Row>
                                                                </TabPane>
                                                            </TabContent>
                                                        </div>
                                                    </div>
                                                    :
                                                    <div className='theater-detail'>
                                                        <div className='theater-detail-item'>
                                                            <Nav tabs>
                                                                <NavItem>
                                                                    <NavLink
                                                                        className={classnames({ active: activeTab === '1', title: true })}
                                                                        onClick={() => { toggle('1'); }}
                                                                    >
                                                                        Films
                                                            </NavLink>
                                                                </NavItem>
                                                                <NavItem>
                                                                    <NavLink
                                                                        className={classnames({ active: activeTab === '2', title: true })}
                                                                        onClick={() => { toggle('2'); }}
                                                                    >
                                                                        Rooms
                                                            </NavLink>
                                                                </NavItem>
                                                            </Nav>
                                                            <br />
                                                            <TabContent activeTab={activeTab}>
                                                                <TabPane tabId="1">
                                                                    <Row>
                                                                        <Col sm="12">
                                                                            <table className='table-film'>
                                                                                <div>
                                                                                    <FontAwesomeIcon className='ic ic-add' icon="plus" onClick={() => _add('film', theater._id)} />
                                                                                </div>
                                                                                {
                                                                                    (theater && theater.films) &&
                                                                                    theater.films.map((item, idx) => {
                                                                                        return (
                                                                                            <tr key={item._id}>
                                                                                                <td>{idx + 1}</td>
                                                                                                <td>{item.name}</td>
                                                                                                {
                                                                                                    checkEdit ?
                                                                                                        <td onClick={() => _remove('film', item._id, theater._id)}>
                                                                                                            x
                                                                                                        </td> :
                                                                                                        <td>
                                                                                                            <div className='none'>x</div>
                                                                                                        </td>
                                                                                                }
                                                                                            </tr>
                                                                                        )
                                                                                    })
                                                                                }
                                                                            </table>
                                                                        </Col>
                                                                    </Row>
                                                                </TabPane>
                                                                <TabPane tabId="2">
                                                                    <Row>
                                                                        <Col sm="12">
                                                                            <table className='table-film'>
                                                                                <div>
                                                                                    <FontAwesomeIcon className='ic ic-add' icon="plus" onClick={() => _add('room', theater._id)} />
                                                                                </div>
                                                                                {
                                                                                    (theater && theater.rooms) &&
                                                                                    theater.rooms.map((item, idx) => {
                                                                                        return (
                                                                                            <tr key={item._id}>
                                                                                                <td>{idx + 1}</td>
                                                                                                <td>{item.name}</td>
                                                                                                {
                                                                                                    checkEdit ?
                                                                                                        <td onClick={() => _remove('room', item._id, theater._id)}>
                                                                                                            x
                                                                                                        </td> :
                                                                                                        <td>
                                                                                                            <div className='none'>x</div>
                                                                                                        </td>
                                                                                                }
                                                                                            </tr>
                                                                                        )
                                                                                    })
                                                                                }
                                                                            </table>
                                                                        </Col>
                                                                    </Row>
                                                                </TabPane>
                                                            </TabContent>
                                                        </div>
                                                    </div>
                                                }
                                            </UncontrolledCollapse>
                                        </div>
                                    )
                                })
                            }
                            {
                                theaters.length === 0 ? <div className='not-found'><b><i>Not found theater...</i></b></div> : ''
                            }
                            <div className='theater-add'>
                                <div className='button' onClick={() => toggleTheater()}>Add new branch</div>
                            </div>
                        </div>
                        {
                            checkDetailRoom &&
                            <div className={checkDetailRoom ? 'room-detail room-detail-actived' : 'room-detail'}>
                                <div className='close-detail' onClick={() => setCheckDetailRoom(!checkDetailRoom)}>
                                    Close
                            </div>
                                <Room
                                    room={roomActived}
                                    checkEdit={checkEdit}
                                    checkAddSeat={checkAddSeat}
                                    checkEditSeat={checkEditSeat}
                                    typeSelected={typeSelected}
                                    resetTypeSelected={() => { setTypeSelected('') }}
                                />
                            </div>
                        }
                    </div>

                    <div className='wrap-right'>
                        {
                            branchActived &&
                            <div className='branch-detail'>
                                {
                                    branchActived &&
                                    <>
                                        <div>
                                            <label>Code:</label>
                                            {branchActived.code}
                                        </div>
                                        <div>
                                            <label>Name:</label>
                                            <input type='text'
                                                value={name}
                                                placeholder={branchActived.name}
                                                ref={inputRef} disabled={!checkSave}
                                                name='name'
                                                onChange={changevalue} />
                                        </div>
                                        <div>
                                            <label>Email:</label>
                                            <input type='text'
                                                value={email}
                                                placeholder={branchActived.email}
                                                onChange={changevalue}
                                                name='email'
                                                disabled={!checkSave} />
                                        </div>
                                        <div>
                                            <label>Hotline:</label>
                                            <input type='text'
                                                value={hotline}
                                                name='hotline'
                                                placeholder={branchActived.hotline}
                                                onChange={changevalue}
                                                disabled={!checkSave} />
                                        </div>
                                        <div>
                                            <label>City:</label>
                                            {branchActived.city}
                                        </div>
                                        <div>
                                            <label>Theater:</label>
                                            <b>{branchActived.theaters && branchActived.theaters.length}</b>
                                        </div>
                                    </>
                                }
                                <div className='button-control'>
                                    {
                                        checkEdit &&
                                        <>
                                            {
                                                !checkSave &&
                                                <div className='button-control-edit' onClick={() => {
                                                    inputRef.current.focus()
                                                    setCheckSave(!checkSave)
                                                }}>Edit
                                        </div>
                                            }
                                            {
                                                checkSave &&
                                                <>
                                                    <div className='button-control-edit' onClick={() => {
                                                        setCheckSave(!checkSave)
                                                        resetField()
                                                    }}>Cancel</div>
                                                    <div className='button-control-edit' onClick={() => { saveEdit() }}>Save</div>
                                                </>

                                            }
                                        </>
                                    }
                                </div>
                            </div>
                        }
                        {
                            checkDetailRoom &&
                            <div className='notes'>
                                <div className='note'>
                                    <hr />
                                    <div className='note-detail'>
                                        <div>
                                            {
                                                NOTE.map(note => {
                                                    return (
                                                        <div className='note-item'>
                                                            <div className={typeSelected === note.type ? 'type type-selected' : 'type'}
                                                                style={{ backgroundColor: note.color }}
                                                                onClick={() => _click('typeselect', note.type)}
                                                            ></div>
                                                            <div className='name'>{note.type}</div>
                                                            <div>+ <i>{note.price}vnđ</i></div>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                        <hr />
                                        <i>Function:</i>
                                        <div>
                                            <i>Set type:</i>
                                            <Switch
                                                checked={checkEditSeat}
                                                onChange={() => _change('typeseat')}
                                                color="primary"
                                                name="checkedB"
                                                inputProps={{ 'aria-label': 'primary checkbox' }}
                                            />
                                        </div>
                                        {/* <div>
                                            <i>Add seat:</i>
                                            <Switch
                                                checked={checkAddSeat}
                                                onChange={() => _change('addSeat')}
                                                color="primary"
                                                name="checkedB"
                                                inputProps={{ 'aria-label': 'primary checkbox' }}
                                            />
                                        </div> */}
                                        <hr />
                                        {/* <div>
                                            {
                                                checkEditSeat &&
                                                <div
                                                    onClick={_onSave}
                                                    className='button-save'
                                                >save</div>
                                            }
                                        </div> */}
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
            {/* modal add new branch*/}
            <div>
                <Modal isOpen={modalBranch} toggle={toggleBranch} size='lg'>
                    <ModalHeader toggle={toggleBranch}><b>Add new branch</b></ModalHeader>
                    <ModalBody>
                        <div className='form-add-branch'>
                            <div className='control'>
                                <label>Name:</label>
                                <input type='text' className='form-control' name='name' onChange={changevalue} />
                            </div>
                            <div className='control'>
                                <label>Email:</label>
                                <input type='text' className='form-control' name='email' onChange={changevalue} />
                            </div>
                            <div className='control'>
                                <label>Hotline:</label>
                                <input type='text' className='form-control' name='hotline' onChange={changevalue} />
                            </div>
                            <div className='control'>
                                <label>City:</label>
                                <Select
                                    name='city'
                                    options={optionCitys}
                                    onChange={changevalue}
                                    placeholder='select city'
                                />
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" style={{ width: '120px' }} onClick={saveBranch}>Add</Button>
                        <Button color="secondary" style={{ width: '120px' }} onClick={toggleBranch}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
            {/* end modal add new branch */}

            {/* modal add new theater*/}
            <div>
                <Modal isOpen={modalTheater} toggle={toggleTheater} size='lg'>
                    <ModalHeader toggle={toggleTheater}><b>Add new theater</b></ModalHeader>
                    <ModalBody>
                        <div className='form-add-branch'>
                            <div className='control'>
                                <label>Name:</label>
                                <input type='text' className='form-control' name='name' onChange={changevalue} />
                            </div>
                            <div className='control'>
                                <label>Email:</label>
                                <input type='text' className='form-control' name='email' onChange={changevalue} />
                            </div>
                            <div className='control'>
                                <label>Hotline:</label>
                                <input type='text' className='form-control' name='hotline' onChange={changevalue} />
                            </div>
                            <div className='control'>
                                <label>Address:</label>
                                <input type='text' className='form-control' name='address' onChange={changevalue} />
                            </div>
                            <div className='control'>
                                <label>Branch:</label>
                                <Select
                                    name='branch'
                                    options={optionBranchs}
                                    onChange={changevalue}
                                    value={branchSelected}
                                    // valueDefault={
                                    //     {
                                    //         label: branchActived ? branchActived.city : '',
                                    //         value: branchActived ? branchActived._id : '',
                                    //         type: 'theater'
                                    //     }
                                    // }
                                    placeholder='select branch'
                                />
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" style={{ width: '120px' }} onClick={saveTheater}>Add</Button>
                        <Button color="secondary" style={{ width: '120px' }} onClick={toggleTheater}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
            {/* end modal add new theater */}

            {/* modal add new FILM to theater*/}
            <div>
                <Modal isOpen={modalAddFilm} toggle={toggleFilm} size=''>
                    <ModalHeader toggle={toggleFilm}><b>Add new film to '<i>{theaterActived.name}'</i></b></ModalHeader>
                    <ModalBody>
                        <Select
                            placeholder='Select film..'
                            options={optionFilms}
                            isMulti
                            closeMenuOnSelect={false}
                            onChange={changeFilm}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" style={{ width: '120px' }} onClick={saveFilm}>Add</Button>
                        <Button color="secondary" style={{ width: '120px' }} >Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
            {/* end add new FILM to theater*/}

            {/* modal add new ROOM to theater*/}
            <div>
                <Modal isOpen={modalAddRoom} toggle={toggleRoom} size=''>
                    <ModalHeader toggle={toggleRoom}><b>Add new room to '<i>{theaterActived.name}'</i></b></ModalHeader>
                    <ModalBody>
                        <div className='form-add-room'>
                            <label>Name:</label>
                            <input type='text' className='form-control' value={name} name='name' onChange={changevalue} />
                            <label>Capacity:</label>
                            <input type='number' className='form-control' value={capacity} name='capacity' onChange={changevalue} />
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" style={{ width: '120px' }} onClick={saveRoom}>Add</Button>
                        <Button color="secondary" style={{ width: '120px' }} >Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
            {/* end add new ROOM to theater*/}
        </div >
    );
}

export default PageMain;