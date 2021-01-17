import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, UncontrolledCollapse } from 'reactstrap';

import PropTypes from 'prop-types';
import classNames from 'classnames'

import Room from '../components/room'

import { getDate, format, addDays, getDay, setDate, addMinutes } from 'date-fns'
import callApi from 'api/apiCaller'
import Select from 'react-select'

PageMain.propTypes = {
};

const TH = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saruday'
]
function createDate() {
    const dateCurrent = new Date()
    const DATES = []
    //console.log(format(dateCurrent, 'dd-MM-yyy'))
    for (let i = -7; i <= 7; i++) {
        let date = addDays(dateCurrent, i)
        DATES.push({
            //date: format(date, 'yyyy-MM-dd'),
            date: date,
            day: getDate(date),
            th: TH[getDay(date)],
            isPass: i >= 0 ? false : true,
            isActived: i === 0 ? true : false
        })
    }
    return DATES
}
function PageMain(props) {
    // contructor
    let DATES = createDate()
    const [dateCurrent, setDateCurent] = useState(new Date())
    const [dates, setDates] = useState(DATES)

    const [branchs, setBranchs] = useState([])
    const [branchActived, setBrachActived] = useState('')
    const [theaterActived, setTheaterActived] = useState('')
    useEffect(() => {
        callApi('branch/info').then(res => {
            if (res.data.branchs) {
                setBranchs(res.data.branchs)
                setBrachActived(res.data.branchs[0])
                if (res.data.branchs[0].theaters && res.data.branchs[0].theaters.length > 0) {
                    setTheaterActived(res.data.branchs[0].theaters[0])
                }
            }
        })
    }, [])
    // end contructor
    useEffect(() => {
        if (branchActived && branchActived.theaters && branchActived.theaters.length > 0) {
            setTheaterActived(branchActived.theaters[0])
        } else {
            setTheaterActived('')
            setTheaterST('')
            setDataShowtime('')
        }
    }, [branchActived])
    const selectDate = (idx) => {
        let newDate = [...dates]
        newDate.map(item => {
            item.isActived = false
        })
        newDate[idx].isActived = !newDate[idx].isActived
        setDates(newDate)
        setDateCurent(newDate[idx].date)
    }
    //console.log('date', format(dateCurrent, 'dd/MM/yyyy'))
    // end handle ------------------
    //console.log(theaterActived)
    const [dataShowtime, setDataShowtime] = useState([])
    useEffect(() => {
        if (theaterActived) {
            if (theaterActived.rooms && theaterActived.rooms.length > 0) {
                let arrShowtimes = [] // all showtime of theater
                theaterActived.rooms.map(room => {
                    arrShowtimes = arrShowtimes.concat(room.showtimes)
                })
                setShowtimeRoomFilm(arrShowtimes) // all showtime of theater
                // if (arrShowtimes.length > 0) {
                if (theaterActived.films && theaterActived.films.length > 0) {
                    let result = []
                    theaterActived.films.map(itemfilm => {
                        //const show = arrShowtimes                        
                        const show = arrShowtimes.filter(item => item.film === itemfilm._id)
                        const data = {
                            film: { _id: itemfilm._id, name: itemfilm.name, time: itemfilm.runtime, price: itemfilm.price },
                            showtimes: show
                        }
                        result.push(data)
                    })
                    setDataShowtime(result)
                }
                //}
            }
        }
        setTheaterST(theaterActived)
    }, [theaterActived])
    //console.log('data', theaterST)
    // console.log('theater', theaterActived)

    // new code
    const [modalST, setModalST] = useState(false);
    const toggleST = () => setModalST(!modalST);
    const [filmST, setFilmST] = useState('')
    const [theaterST, setTheaterST] = useState()
    const _add = (type, data) => {
        if (type === 'ST') {
            setFilmST(data)
            toggleST()
        }
    }
    const [roomSelected, setRoomSelected] = useState('') // room submit save new showtime
    const _changeRoomST = value => {
        setRoomSelected(value)
    }
    const _reset = () => {
        setRoomSelected('')
        setFilmST('')
        setTheaterST('')
        setRoomSelected('')
        setDate(format(dateCurrent, 'yyyy-MM-dd'))
        setTimeEnd('')
        setTimeStart('')
    }
    const _onSubmit = (type) => {
        if (type === 'ST') {
            const data = {
                _idfilm: filmST._id,
                price: filmST.price,
                _idtheater: theaterST._id,
                _idroom: roomSelected.value,
                date: format(new Date(date), 'dd/MM/yyyy'),
                start: timeStart,
                end: timeEnd
            }
            toggleST()
            callApi('showtime/add', 'POST', data).then(res => {
                if (res.data && res.data.theater) {
                    setTheaterActived(res.data.theater)
                    console.log('res', res.data.theater)
                }
            })
            _reset()
        }
    }
    const settimeend = (timestart, minute) => {
        let timeend = ''
        const h = parseInt(timestart.slice(0, 2))
        const m = parseInt(timeStart.slice(3, 5))

        let h_a = parseInt((Math.floor(minute / 60)))
        let m_a = parseInt(minute % 60)
        if (m_a + m >= 60) {
            h_a = h_a + ((Math.floor((m_a + m) / 60)))
            m_a = (m_a + m) % 60
        }
        timeend = ('0' + `${h + h_a}`).slice(-2) + ':' + ('0' + `${m + m_a}`).slice(-2)
        return timeend
    }
    const [timeStart, setTimeStart] = useState('')
    const [timeEnd, setTimeEnd] = useState('')
    const [date, setDate] = useState(format(dateCurrent, 'yyyy-MM-dd'))
    const _onChangetTime = e => {
        const value = e.target.value
        const name = e.target.name

        if (name === 'timeStart') {
            setTimeStart(value)
        }
        if (name === 'date') {
            setDate(value)
        }
    }
    useEffect(() => {
        if (timeStart) {
            setTimeEnd(settimeend(timeStart, filmST.time))
        }
    }, [timeStart])
    const [showtimeRoomFilm, setShowtimeRoomFilm] = useState([])
    const [roomST, setRoomST] = useState([])
    // common funftion
    // showadd ={start, end}
    const check_showtime = (show, showAdd, date) => {

        let result = false
        // show
        if (show.date === (format(new Date(date), 'dd/MM/yyyy'))) {
            let start = show.start
            let h_s = parseInt(start.slice(0, 2))
            let m_s = parseInt(start.slice(3, 5))

            let end = show.end
            let h_e = parseInt(end.slice(0, 2))
            let m_e = parseInt(end.slice(3, 5))
            // show add
            let startA = showAdd.start
            let h_sA = parseInt(startA.slice(0, 2))
            let m_sA = parseInt(startA.slice(3, 5))

            let endA = showAdd.end
            let h_eA = parseInt(endA.slice(0, 2))
            let m_eA = parseInt(endA.slice(3, 5))

            // -----------7-------start ------------8---------end ---------------9--
            // -----------7----------------startA -----8----------------endA ---------9--------

            //07:00 - 08:30
            //04:00 - 06:00
            if (h_sA < h_s && h_eA < h_s) {
                result = true
                return result
            }
            if (h_sA > h_e) {
                result = true
                return result
            }
        } else {
            result = true
        }

        return result
    }
    // end common function
    useEffect(() => {
        if (showtimeRoomFilm && showtimeRoomFilm.length > 0) {
            const arr = [] // room not avaible
            showtimeRoomFilm.map(show => {
                const result = check_showtime(show, { start: timeStart, end: timeEnd }, date)
                //console.log('re', result)
                if (result === false) {
                    arr.push(show.room)
                }
            })
            if (arr.length > 0) {
                let newroom = theaterActived.rooms
                arr.map(room => {

                    const data = newroom.filter(item => item._id !== room._id)
                    newroom = data

                })

                setRoomST(newroom)
            } else {
                setRoomST(theaterActived.rooms)
            }

        } else {
            setRoomST(theaterActived.rooms)
        }
    }, [timeEnd, date])
    const [optionRoom, setOptionRoom] = useState([])
    useEffect(() => {
        if (roomST && roomST.length > 0) {
            const arr = []
            roomST.map(item => {
                arr.push({ label: item.name, value: item._id })
            })
            setOptionRoom(arr)
        } else {
            setOptionRoom([])
        }
    }, [roomST])


    // toggle
    const [modalR, setModalR] = useState(false);
    const toggleR = () => setModalR(!modalR);
    // end toggle
    //const [roomDetail, setRoomDetail] = useState('')
    const [showtimeDetail, setShowtimeDetail] = useState('')
    const _detailRoom = showtime => {
        //console.log(showtime)
        //setRoomDetail(showtime.room)
        setShowtimeDetail(showtime)
        toggleR()
    }
    const _cancel = () => {
        toggleR()
        //setRoomDetail('')
        setShowtimeDetail('')
    }
    /// ticket
    const [tickets, setTickets] = useState([])
    useEffect(() => {
        if (showtimeDetail && showtimeDetail.tickets && showtimeDetail.tickets.length > 0) {
            setTickets(showtimeDetail.tickets)
        }
    }, [showtimeDetail])
    return (

        <div className='page-main'>
            <div className='title '>
                <h2>Show Time</h2>
                {/* <FontAwesomeIcon className='ic ic-black' icon="plus" /> */}
            </div>
            <hr className='op-5' />
            <div className='page-main__content'>
                <div className='filter'>
                    <div className='branchs'>
                        <div className='title'>
                            Branchs
                        </div>
                        <div className='branch'>
                            {
                                (branchs && branchs.length > 0) &&
                                branchs.map(branch => {
                                    return (
                                        <div className={classNames(
                                            'branch-item',
                                            { 'actived': branch._id === branchActived._id }
                                        )}>
                                            <div className='branch-item-content'
                                                id={`id-${branch._id}`}
                                                onClick={() => setBrachActived(branch)}>
                                                <div className='branch-item-content-title'>{branch.name}</div>
                                            </div>
                                            <UncontrolledCollapse toggler={`#id-${branch._id}`}>
                                                <div className='branch-item-content'>
                                                    <div className='branch-theater'>
                                                        {
                                                            (branch.theaters && branch.theaters.length > 0) ?
                                                                branch.theaters.map(theater => {
                                                                    return (
                                                                        <div key={theater._id}
                                                                            onClick={() => setTheaterActived(theater)}
                                                                            className={classNames(
                                                                                'branch-theater-item',
                                                                                { 'actived': theater._id === theaterActived._id }
                                                                            )}
                                                                        >
                                                                            {theater.name}
                                                                        </div>
                                                                    )
                                                                })
                                                                : <div><i>Not found theater </i></div>
                                                        }
                                                    </div>
                                                </div>
                                            </UncontrolledCollapse>

                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    {/* detail show time */}
                    <div className='infor-showtime'>
                        <div className='schedule'
                        //onScroll={handleScroll}
                        >
                            <div className='schedule__head'>

                                {
                                    dates && dates.map((item, idx) => {
                                        return (
                                            <div
                                                key={item.date}
                                                className={
                                                    classNames(
                                                        'schedule__head__item',
                                                        //item.isPass && checkDayPass ? 'none' : '',
                                                        item.isPass ? 'opacity-5' : '',
                                                        item.isActived ? 'actived' : '',
                                                    )}
                                                onClick={() => selectDate(idx)}
                                            >
                                                <div className='bold'>{item.th}</div>
                                                <div>{format(item.date, 'dd/MM/yyyy')}</div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>

                        <div className='showtimes'>
                            <div className='showtime-detail'>
                                {
                                    (dataShowtime && dataShowtime.length > 0) ?
                                        dataShowtime.map(data => {
                                            return (
                                                <div className='showtime-film'
                                                    key={data.film._id}
                                                >
                                                    <div className='data'>
                                                        <div className='hr'></div>
                                                        <div className='film'>
                                                            {data.film.name}
                                                        </div>
                                                        <div className='hr'></div>
                                                    </div>
                                                    <div className='data-showtime'>
                                                        {
                                                            (data.showtimes && data.showtimes.length > 0) ?
                                                                data.showtimes.map(showtime => {
                                                                    let t = 0
                                                                    if (showtime.date === format(new Date(dateCurrent), 'dd/MM/yyyy'))
                                                                        return (
                                                                            <div
                                                                                onClick={() => _detailRoom(showtime)}
                                                                                key={showtime._id} className='data-showtime-item'>
                                                                                <span>{showtime.start}</span>~
                                                                                <span className='end'>{showtime.end}</span>
                                                                            </div>
                                                                        )
                                                                })
                                                                : <div><i>Not found showtime</i></div>
                                                        }
                                                    </div>
                                                    <div className='control'>
                                                        <div className='button-add'
                                                            onClick={() => { _add('ST', data.film) }}
                                                        >
                                                            Add new
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })
                                        : <div><i>showtime not found</i></div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div >

            {/** Modal add new showtime */}
            < div >
                <Modal isOpen={modalST} toggle={toggleST}>
                    <ModalHeader toggle={toggleST}>Add new showtime for {filmST.name}</ModalHeader>
                    <ModalBody>
                        <div>
                            <div>
                                <label>Select time start</label>
                                <div><input type='time' className='form-control' name='timeStart' value={timeStart} onChange={_onChangetTime} /></div>
                                <label>Select time end</label>
                                <div><input type='text' className='form-control' name='timeEnd' value={timeEnd} /></div>
                                <label>Select date</label>
                                <div><input type='date' className='form-control' name='date' value={date} onChange={_onChangetTime} /></div>
                                <label>Select room</label>
                                <div>
                                    <Select
                                        placeholder={'Select room'}
                                        options={optionRoom}
                                        value={roomSelected}
                                        onChange={_changeRoomST}
                                    />
                                </div>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={() => _onSubmit('ST')}>Add Item</Button>
                        <Button color="secondary" onClick={() => {
                            toggleST()
                            _reset()
                        }}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div >
            {/** End Modal add new showtime */}

            {/** Modal add detail room */}

            <div>
                <Modal isOpen={modalR} toggle={toggleR} size='lg'>
                    <ModalHeader toggle={toggleR}>
                        <div>Room: {showtimeDetail.room && showtimeDetail.room.name} - ({branchActived.name})</div>
                        <div>Date:{format(dateCurrent, 'dd/MM/yyyy')}</div>
                        <div>Time: {showtimeDetail.start} - {showtimeDetail.end}</div>
                    </ModalHeader>
                    <ModalBody>

                        <Room room={showtimeDetail.room} tickets={tickets} />

                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={_cancel}>Go back</Button>
                    </ModalFooter>
                </Modal>
            </div>
            {/** End Modal detail room */}
        </div >
    );
}

export default PageMain;