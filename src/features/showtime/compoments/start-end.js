import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import DatePicker from "react-datepicker";

//import Tooltip from 'components/custom-field/tooltip'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { format, getHours, getMinutes, addMinutes } from 'date-fns'
import PropTypes from 'prop-types';
import callApi from 'api/apiCaller';

StartEnd.propTypes = {
    LIST_SHOW: PropTypes.array,
    film: PropTypes.object,
    branch: PropTypes.object,
    theater: PropTypes.object,
    dateCurrent: PropTypes.string,
};

// const LIST_SHOW = [
//     { start: '20:10', end: '21:30' },
//     { start: '21:10', end: '22:30' },
//     { start: '22:10', end: '23:30' },
//     { start: '24:10', end: '24:30' },
// ]

function StartEnd(props) {
    const { film, theater, branch, dateCurrent } = props
    //const [listShow, setListShow] = useState(LIST_SHOW)
    const handleSelectTime = () => {
        console.log('time')
    }
    // const add = () => {
    //     let newList = [...listShow,
    //     {
    //         start: <FontAwesomeIcon className='ic-init ' icon={['fas', 'clock']} onClick={handleSelectTime} />,
    //         end: <FontAwesomeIcon className='ic-init ' icon={['far', 'clock']} onClick={handleSelectTime} />
    //     }
    //     ]
    //     setListShow(newList)
    // }
    const add = () => {
        console.log('add')
    }

    //const { buttonLabel, className } = props;

    const [modal, setModal] = useState(false);

    const toggle = () => setModal(!modal);

    const save = () => {
        console.log('save')
        setModal(!modal);
    }
    const [dateValue, setDateValue] = useState('')

    useEffect(() => {
        setDateValue(format(dateCurrent, 'dd/MM/yyyy'))
    }, [dateCurrent])

    const handleChangeOpenday = (date) => {
        setDateValue(format(date, 'dd/MM/yyyy'))
    }

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
        setTimeEnd(timeEnd)
    }
    return (
        <div className='showtime--item__show'>
            {
                film.showtimes && film.showtimes.map((show, index) => {
                    if (dateValue === show.date)
                        return (
                            <div className='show' key={show.start} id={`id-${index}`}>
                                <span className='start'>{show.start}</span>
                                <span className='end'>~{show.end}</span>
                                {/* <Tooltip item='Room 1' target={`id-${index}`} /> */}
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
                                <input type='time' className='form-control' onChange={handleChangeStart} />
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
                            <select className=''>
                                <option>room1 </option>
                                <option>room1 </option>
                            </select>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={save}>Save</Button>{' '}
                        <Button color="secondary" onClick={toggle}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        </div >
    );
}

export default StartEnd;