import React, { useState, useEffect } from 'react';
import classnames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useHistory, useRouteMatch, Switch, Redirect } from 'react-router-dom'
import { TabContent, TabPane, Nav, NavItem, NavLink, Row, Col } from 'reactstrap';
import callApi from 'api/apiCaller';
import Select from 'react-select'

function Detail(props) {
    const history = useHistory()
    const match = useRouteMatch()
    const goBack = () => {
        history.goBack()
    }
    // tab
    const [activeTab, setActiveTab] = useState('1');

    const toggle = tab => {
        if (activeTab !== tab) setActiveTab(tab);
    }
    // end tab     
    const [rooms, setRooms] = useState([])
    const [films, setFilms] = useState([])
    const [allFilm, setAllFilm] = useState([])
    useEffect(() => {
        const LoadRoom = async () => {
            let data = await callApi(`theater/${match.params._id}`)
            setRooms(data.data.rooms)
            setFilms(data.data.films)
        }
        const LoadAllFilm = async () => {
            let data = await callApi(`film`)
            setAllFilm(data.data)
        }
        LoadRoom()
        LoadAllFilm()
    }, [])
    let optionsFilm = []
    if (allFilm.length > 0) {
        allFilm.map(item => {
            optionsFilm.push({ value: item._id, label: item.name })
        })
    }
    // handle Change Select Film
    const [valueFilmSelect, setValueFilmSelect] = useState([])
    const handleChangeSelectFilm = (value) => {
        //let newValue = valueFilmSelect.concat(value)        
        setValueFilmSelect(value)
    }
    //handle save
    const handleSave = () => {
        let films = []
        valueFilmSelect.map(item => {
            films.push(item.value)
        })
        const data = {
            _idtheater: `${match.params._id}`,
            _films: films
        }
        //console.log('data', data)
        callApi('theater/add-film', 'POST', data).then(() => {
            setValueFilmSelect([])
        })
    }

    // detailRoom    
    const detailRoom = (_idroom) => {
        history.push(`/admin/room/detail/${_idroom}`)
    }
    const handleRemoveRoom = async (_id) => {
        let data = await callApi(`room/${_id}`, 'DELETE', null)
        let newRooms = rooms.filter(x => x._id !== _id)
        setRooms(newRooms)
    }
    //handleChangeRoom
    const [room, setRoom] = useState('')
    const handleChangeRoom = (e) => {
        setRoom(e.target.value)
    }
    //keyPress
    const keyPress = (e) => {
        if (e.keyCode === 13) {
            // call api add room
            const data = {
                name: room,
                _idtheater: match.params._id,
            }
            callApi('room', 'POST', data).then((res) => {
                let newRooms = rooms.push(res.data.room)
                setRooms(newRooms)
            })
            setRoom('')
        }
    }
    return (
        <div className='wrap-branch'>
            <div className='branch_title'>
                <h2>Detail</h2>
                <FontAwesomeIcon className='ic ic-black' icon="arrow-left" onClick={goBack} />
            </div>
            <hr className='op-5' />
            <div className='form'>
                <div>
                    <div className='infor-rom'>
                        <div>
                            <Nav tabs>
                                <NavItem>
                                    <NavLink
                                        className={classnames({ active: activeTab === '1' })}
                                        onClick={() => { toggle('1'); }}
                                    >
                                        Room
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink
                                        className={classnames({ active: activeTab === '2' })}
                                        onClick={() => { toggle('2'); }}
                                    >
                                        Film
                                    </NavLink>
                                </NavItem>

                                <NavItem>
                                    <NavLink
                                        className={classnames({ active: activeTab === '3' })}
                                        onClick={() => { toggle('3'); }}
                                    >
                                        About
                                    </NavLink>
                                </NavItem>
                            </Nav>
                            <br />
                            <TabContent activeTab={activeTab}>
                                <TabPane tabId="1">
                                    <Row>
                                        <Col sm="12">
                                            <input type='text'
                                                className='form-control'
                                                placeholder='add new room'
                                                value={room}
                                                onChange={handleChangeRoom}
                                                onKeyDown={keyPress}
                                            />
                                            <br />
                                            {/* <div className='rooms head'>
                                                <div className='col-1'>#</div>
                                                <div className='col-2'>Name</div>
                                                <div className='col-2'>Action</div>
                                            </div> */}
                                            {
                                                rooms && rooms.map((room, idx) => {
                                                    return (
                                                        <div key={room._id} className='rooms'>
                                                            <div className='col-1'>{idx + 1}.</div>
                                                            <div className='col-2' onClick={() => detailRoom(room._id)}>{room.name}</div>
                                                            <div className='col-0' onClick={() => handleRemoveRoom(room._id)}>X</div>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </Col>
                                    </Row>
                                </TabPane>

                                <TabPane tabId="2">
                                    <div style={{ display: 'flex' }}>
                                        <Select
                                            value={valueFilmSelect}
                                            className='col-10'
                                            options={optionsFilm}
                                            isMulti
                                            closeMenuOnSelect={false}
                                            onChange={handleChangeSelectFilm}
                                        />
                                        <div className='btn btn-info' onClick={handleSave}>Save</div>
                                    </div>
                                    <br />
                                    {
                                        films && films.map((film, idx) => {
                                            return (
                                                <div key={film._id} className='rooms'>
                                                    <div className='col-1'>{idx + 1}.</div>
                                                    <div className='col-2'>{film.name}</div>
                                                    <div className='col-2'></div>
                                                </div>
                                            )
                                        })
                                    }
                                </TabPane>
                            </TabContent>
                        </div>

                    </div>
                </div>
            </div>
        </div >

    );
}

export default Detail;
