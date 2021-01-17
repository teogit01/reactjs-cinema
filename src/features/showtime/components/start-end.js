import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import DatePicker from "react-datepicker";

//import Tooltip from 'components/custom-field/tooltip'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { format, getHours, getMinutes, addMinutes, set } from 'date-fns'
import PropTypes from 'prop-types';
import callApi from 'api/apiCaller';
import SeatOfRoom from './seat-of-room'

StartEnd.propTypes = {
    LIST_SHOW: PropTypes.array,
    film: PropTypes.object,
    branch: PropTypes.object,
    theater: PropTypes.object,
    dateCurrent: PropTypes.string,
};

async function LOADROOM(start, end, dateCurrent, film, theater) {
    const date = format(dateCurrent, 'dd/MM/yyyy')
    //console.log('load room', start, end, date, film._id)
    //const [rooms, setRooms] = useState([])    
    const data = {
        _idfilm: film._id,
        _date: date,
        _idtheater: theater._id,
        start: start,
        end: end
    }
    // console.log('data', data)
    return await callApi('showtime/getroom', 'POST', data)

}
function StartEnd(props) {
    const { film, theater, branch, dateCurrent } = props
    //const [listShow, setListShow] = useState(LIST_SHOW)   

    //const { buttonLabel, className } = props;

    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);

    const save = async () => {
        const date = format(dateCurrent, 'dd/MM/yyyy')
        const data = {
            date: date,
            start: timeStart,
            end: timeEnd,
            film: film._id,
            room: room,
            price: price
        }
        //console.log(data)
        callApi('showtime', 'POST', data).then((res) => {
            setShowtimes([...showtimes, res.data.showtime])
        })
        // then save setRoom(''), setTimeStart(''), setTimeEnd('')        
        setTimeStart('')
        setTimeEnd('')
        setRoom('')
        setRooms([])
        setModal(!modal);
    }
    const [dateValue, setDateValue] = useState('')
    const [showtimes, setShowtimes] = useState(film.showtimes)
    useEffect(() => {
        setDateValue(format(dateCurrent, 'dd/MM/yyyy'))
    }, [dateCurrent])

    const [price, setPrice] = useState(film.price)
    const handleChangeOpenday = (date) => {
        setDateValue(format(date, 'dd/MM/yyyy'))
    }
    // handleChangePrice
    const handleChangePrice = (e) => {
        setPrice(e.target.value)
    }

    const [room, setRoom] = useState('')
    const [rooms, setRooms] = useState([])
    const [timeStart, setTimeStart] = useState('')
    const [timeEnd, setTimeEnd] = useState('')
    const handleChangeStart = (e) => {
        let date = dateValue
        let day = date.slice(0, 2)
        let month = date.slice(3, 5)
        let year = date.slice(6, 10)

        let timeStart = e.target.value
        let hourStart = timeStart.slice(0, 2)
        let minuteStart = timeStart.slice(3, 6)

        let timeAdd = addMinutes(new Date(year, month, day, hourStart, minuteStart), film.runtime)
        let hourEnd = `0${timeAdd.getHours(timeAdd)}`.slice(-2)
        let minuteEnd = `0${timeAdd.getMinutes(timeAdd)}`.slice(-2)
        let timeEnd = `${hourEnd}:${minuteEnd}`
        //console.log('end', timeEnd)

        LOADROOM(timeStart, timeEnd, dateCurrent, film, theater).then((res) => {
            if (res.data.length > 0) {
                setRooms(res.data)
                const listRoomApproved = res.data.filter(room_result => room_result.approved)
                if (listRoomApproved.length > 0)
                    setRoom(listRoomApproved[0])
                // res.data.map((room_result) => {
                //     if (room_result.approved)
                //         setRoom(room_result.value)
                // })
                //console.log('load', res.data)
            } else {
                setRooms([])
                setRoom('')
            }
        })

        setTimeStart(timeStart)
        setTimeEnd(timeEnd)
    }
    const handleSelectRoom = (e) => {
        let value = e.target.value
        setRoom(value)
    }

    // handle remove 
    const remove = (show) => {
        //console.log('show', show)
        callApi(`showtime/${show._id}`, 'DELETE', null).then(() => {
            let newShowtimes = showtimes.filter(item => item._id != show._id)
            setShowtimes(newShowtimes)
        })
    }

    // handle detail showtime
    const [showtime, setShowtime] = useState('')
    const [checkOpen, setCheckOpen] = useState(false)
    const toggleDetail = () => {
        setCheckOpen(!checkOpen)
    }
    const handleDetailShowtime = (show) => {
        setShowtime(show)
        setCheckOpen(!checkOpen)
    }
    return (
        <div className='showtime--item__show'>
            {
                showtimes && showtimes.map((show, index) => {
                    if (dateValue === show.date)
                        return (
                            <div className='s'>
                                <div className='show' key={show.start} id={`id-${index}`} onClick={() => handleDetailShowtime(show)}>
                                    <span className='start'>{show.start}</span>
                                    <span className='end'>~{show.end}</span>
                                    {/* <Tooltip item='Room 1' target={`id-${index}`} /> */}
                                </div>
                                <FontAwesomeIcon
                                    className='ic-init fs-16 remove ic-remove-showtime' icon={['fas', 'eraser']}
                                    //onClick={add}
                                    onClick={() => remove(show)}
                                />
                            </div>

                        )
                })
            }
            <div className='show-add'>
                <FontAwesomeIcon
                    className='ic-init fs-16' icon={['fas', 'plus']}
                    //onClick={add}
                    onClick={toggle}
                />
            </div>
            <div>
                <Modal isOpen={modal} toggle={toggle} className='modal-style'>
                    <ModalHeader toggle={toggle}>Add new show time</ModalHeader>
                    <ModalBody>
                        <div className='control'>
                            <label>Branch</label>
                            <div>{branch ? branch.name : ''}</div>
                        </div>
                        <div className='control'>
                            <label>Theater</label>
                            <div>{theater ? theater.name : ''}</div>
                        </div>
                        <div className='control'>
                            <label>Film</label>
                            <div>{film.name}s</div>
                        </div>
                        <div className='control'>
                            <label>Runtime</label>
                            <div>{film.runtime} phút</div>
                        </div>
                        <div className='control'>
                            <label>Price</label>
                            <div>
                                <input type='number' className='form-control'
                                    placeholder={`${film.price} VNĐ`}
                                    onChange={handleChangePrice}
                                    value={price} />
                            </div>
                        </div>
                        <div className='control'>
                            <label>Date</label>
                            <div>
                                <DatePicker
                                    className='date form-control'
                                    dateFormat="dd/MM/yyyy"
                                    value={dateValue}
                                    //selected={startDate}
                                    onChange={handleChangeOpenday}
                                // strictParsing
                                /></div>
                            {/* <div>{dateCurrent}</div> */}
                        </div>
                        <div className='control'>
                            <label>Time Start</label>
                            <div className=''>
                                <input type='time' className='form-control' onChange={handleChangeStart} value={timeStart} />
                            </div>
                        </div>
                        <div className='control'>
                            <label>Time End</label>
                            <div>
                                <input type='time' name='timeEnd' className='form-control' value={timeEnd} />
                            </div>
                        </div>
                        <div className='control'>
                            <label>Select Room</label>
                            {
                                rooms.length > 0 ?
                                    <select className='' onChange={handleSelectRoom} value={room}>
                                        {
                                            rooms && rooms.map(r => {
                                                if (r.approved)
                                                    return (
                                                        <option key={r.value} value={r.value}>{r.label}</option>
                                                    )
                                            })
                                        }
                                    </select>
                                    : ''
                            }
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={save}>Save</Button>{' '}
                        <Button color="secondary" onClick={toggle}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>

            {/* Detail showtime */}
            <div>
                <Modal size='xl' isOpen={checkOpen} toggle={toggleDetail} className='modal-style modal-detail '>
                    <ModalHeader toggle={toggleDetail}>Detail showtime</ModalHeader>
                    <ModalBody>

                        <div className='detail-seats'>
                            <SeatOfRoom showtime={showtime} />
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={toggleDetail}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        </div >
    );
}

export default StartEnd;