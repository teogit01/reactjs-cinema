import React, { useState, useEffect, useRef } from 'react';
import './css/filter.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Alert } from 'reactstrap';
import PropTypes from 'prop-types';
import callApi from 'api/apiCaller';
import classnames from 'classnames'
import { Redirect } from 'react-router-dom';
import { compareAsc, format, setDate } from 'date-fns'
Filter.propTypes = {
    branchActived: PropTypes.object
};

const sosanh = (now, date) => {
    //now dd/mm/yyyy
    // result -1 .. now < date
    // result 1 .. now > date
    // 0 now = date
    // console.log(now, date)
    // let result = 0
    const n_y = parseInt(now.slice(6, 10))
    const n_m = parseInt(now.slice(3, 5))
    const n_d = parseInt(now.slice(0, 2))

    const d_y = parseInt(date.slice(6, 10))
    const d_m = parseInt(date.slice(3, 5))
    const d_d = parseInt(date.slice(0, 2))

    let result = 0
    if (n_y < d_y) {
        return -1
    }
    if (n_y > d_y) {
        return 1
    }
    if (n_m < d_m) {
        return -1
    }
    if (n_m > d_m) {
        return 1
    }
    if (n_d < d_d) {
        return -1
    }
    if (n_d > d_d) {
        return 1
    }

    return 0
}
const so_sanh_time = (time1, time2) => {
    // time1 < time2  -1
    // time1 = time2  0
    // time1 > time2  1
    const type = time1.slice(6, 8)
    let t1_h = parseInt(time1.slice(0, 2))
    if (type === 'PM') {
        t1_h += 12
    }
    const t1_m = parseInt(time1.slice(3, 5))

    const t2_h = parseInt(time2.slice(0, 2))
    const t2_m = parseInt(time2.slice(3, 5))

    if (t1_h < t2_h)
        return -1
    if (t1_h > t2_h)
        return 1
    if (t1_m < t2_m)
        return -1
    if (t1_m > t2_m)
        return 1

    return 0
}
function Filter(props) {
    const { branchActived } = props
    // film
    const [filmOrigin, setFilmOrigin] = useState([])
    const [films, setFilms] = useState([])
    const [filmFilter, setFilmFilter] = useState('')
    const [turnFilm, setTurnFilm] = useState(false)
    // theater
    const [theaters, setTheaters] = useState([])
    const [theaterFilter, setTheaterFilter] = useState('')
    const [turnTheater, setTurnTheater] = useState(false)
    // date
    const [dates, setDates] = useState([])
    const [dateFilter, setDateFilter] = useState('')
    const [turnDate, setTurnDate] = useState(false)

    // showtime
    const [showtimes, setShowtimes] = useState([])
    const [showtimeFilter, setShowtimeFilter] = useState('')
    const [turnShowtime, setTurnShowtime] = useState(false)
    const [allshowtime, setAllshowtime] = useState([])

    useEffect(() => {
        if (branchActived) {
            if (branchActived.theaters && branchActived.theaters.length > 0) {
                let arrFilm = []
                branchActived.theaters.map(theater => {
                    let data = arrFilm.concat(theater.films)
                    arrFilm = data
                })
                //const newFilms = arrFilm.filter(item, index) => arrFilm.indexOf(item) === index);
                const newFilms = arrFilm.filter((item, idx) => arrFilm.findIndex(e => e._id === item._id) === idx)
                setFilms(newFilms)
                setFilmOrigin(newFilms)
                setTheaters(branchActived.theaters)
            }
        }
    }, [branchActived])
    useEffect(() => {
        if (filmFilter) {
            if (branchActived.theaters.length > 0) {
                let arrTheater = []
                branchActived.theaters.map(theater => {
                    if (theater.films.filter(film => film._id === filmFilter._id).length > 0) {
                        arrTheater.push(theater)
                    }
                })
                setTheaters(arrTheater)
                setTheaterFilter('')
                setDateFilter('')
                setShowtimeFilter('')
                setShowtimes([])
            }
        }
    }, [filmFilter])

    useEffect(() => {
        if (theaterFilter) {
            if (theaterFilter.rooms && theaterFilter.rooms.length > 0) {
                let arrDate = []
                theaterFilter.rooms.map(room => {
                    if (room.showtimes && room.showtimes.length > 0) {
                        room.showtimes.map(showtime => {
                            arrDate.push(showtime)
                        })
                    }
                })
                const newDates = arrDate.filter((item, idx) => arrDate.findIndex(e => e.date === item.date) === idx)
                const dateRender = []
                if (newDates.length > 0) {
                    newDates.map(item => {
                        if (sosanh(format(new Date(), 'dd/MM/yyyy'), item.date) <= 0) {
                            dateRender.push(item)
                        }
                    })
                }
                setDates(dateRender)
                setDateFilter('')
                setShowtimeFilter('')
                setShowtimes([])
            }
        }
    }, [theaterFilter])

    // console.log('data', allshowtime)    
    useEffect(() => {
        if (dateFilter) {
            let arrShowtime = []
            branchActived.theaters.map(theater => {
                if (theater.rooms && theater.rooms.length > 0) {
                    theater.rooms.map(room => {
                        let data = arrShowtime.concat(room.showtimes)
                        arrShowtime = data
                    })
                }
            })

            const newShowtimes = arrShowtime.filter(item => item.date === dateFilter.date)
            if (newShowtimes.length > 0) {
                const showtimeRender = []
                newShowtimes.map(item => {
                    if (so_sanh_time(format(new Date(), 'hh:mm a'), item.start) === -1) {
                        showtimeRender.push(item)
                    }

                })
                setShowtimes(showtimeRender)
            }
            //console.log('showtime', newShowtimes)            
            // setShowtimes(newShowtimes)
            setShowtimeFilter('')

        }
    }, [dateFilter])

    const _filter = (type, value) => {
        if (type === 'film') {
            setFilmFilter(value)
            setTurnFilm(!turnFilm)
        }
        if (type === 'theater') {
            setTheaterFilter(value)
            setTurnTheater(!turnTheater)
        }
        if (type === 'date') {
            setDateFilter(value)
            setTurnDate(!turnDate)
        }
        if (type === 'showtime') {
            setShowtimeFilter(value)
            setTurnShowtime(!turnShowtime)
        }
    }
    const _turn = (type) => {
        if (type === 'film') {
            setTurnFilm(!turnFilm)
            setTurnTheater(false)
            setTurnDate(false)
            setTurnShowtime(false)
        }
        if (type === 'theater') {
            setTurnTheater(!turnTheater)
            setTurnFilm(false)
            setTurnDate(false)
            setTurnShowtime(false)
        }
        if (type === 'date') {
            setTurnDate(!turnDate)
            setTurnFilm(false)
            setTurnTheater(false)
            setTurnShowtime(false)
        }
        if (type === 'showtime') {
            setTurnShowtime(!turnShowtime)
            setTurnFilm(false)
            setTurnDate(false)
            setTurnTheater(false)
        }
    }
    const [keySearch, setKeySearch] = useState('')
    const typingTimeoutRef = useRef(null)
    const _search = (e) => {
        const value = e.target.value
        setKeySearch(value)
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current)
        }
        typingTimeoutRef.current = setTimeout(() => {
            const newFilms = filmOrigin.filter(film => film.name.toUpperCase().indexOf(value.toUpperCase()) !== -1)
            setFilms(newFilms)
        }, 1000)
    }

    const [checkout, setCheckout] = useState(false)
    const [alert, setAlert] = useState(false)
    const _book = () => {
        if (!filmFilter || !theaterFilter || !dateFilter || !showtimeFilter) {
            setAlert(true)
        } else {
            setCheckout(true)
        }
    }
    useEffect(() => {
        if (alert) {
            setTimeout(() => {
                setAlert(false)
            }, 2000)
        }
    }, [alert])
    return (
        <div className='filter'>
            {
                checkout && <Redirect to={`/client/film/checkout/${showtimeFilter._id}`} />
            }
            <div className={classnames(
                'alert-filter',
                { 'show': alert }
            )}>
                <Alert color="danger" className='al'>
                    {!filmFilter ? 'Vui lòng chọn phim !' :
                        !theaterFilter ? 'Vui lòng cụm rạp !' :
                            !dateFilter ? 'Vui lòng chọn ngày !' :
                                !showtimeFilter ? 'Vui lòng chọn suất chiếu!' : ''
                    }
                </Alert>
            </div>

            <div className="control-menu">
                <div className="control-menu__item">
                    <div className='film' onClick={() => _turn('film')}>
                        {filmFilter ? filmFilter.name : 'Phim'}
                        <FontAwesomeIcon className='ic ic-down' icon="angle-down" />
                    </div>
                    <div className='theater' onClick={() => _turn('theater')}>
                        {theaterFilter ? theaterFilter.name : 'Rạp'}
                        <FontAwesomeIcon className='ic ic-down' icon="angle-down" />
                    </div>
                    <div className='date' onClick={() => _turn('date')}>
                        {dateFilter ? dateFilter.date : 'Ngày xem'}
                        <FontAwesomeIcon className='ic ic-down' icon="angle-down" /></div>
                    <div className='showtime' onClick={() => _turn('showtime')}>
                        {showtimeFilter ? `${showtimeFilter.start}~${showtimeFilter.end}` : 'Suất chiếu'}
                        <FontAwesomeIcon className='ic ic-down' icon="angle-down" />
                    </div>
                    &nbsp;
                    <div className='col-2 btn btn-secondary' onClick={() => _book()}>Mua vé ngay</div>
                </div>
            </div>

            <div className={turnFilm ? 'film-content show' : 'film-content'}>
                {
                    films.length > 0 ?
                        <>
                            <div className='film-content__item search-film' >
                                <input type='text' placeholder='Bạn muốn tìm phim nào' value={keySearch} name='search' onChange={_search} />
                            </div>
                            {
                                films.map(film => {
                                    return (
                                        <div className='film-content__item' key={film._id} onClick={() => _filter('film', film)}>
                                            {film.name}
                                        </div>
                                    )
                                })
                            }
                        </>
                        :
                        <>
                            <div className='film-content__item search-film' >
                                <input type='text' placeholder='Bạn muốn tìm phim nào' value={keySearch} name='search' onChange={_search} />
                            </div>
                            <div className='film-content__item'>
                                Không có phim phù hợp
                            </div>
                        </>
                }
            </div>

            <div className={turnTheater ? 'theater-content show' : 'theater-content'}>
                {
                    (theaters.length > 0 && filmFilter) ?
                        <>
                            {
                                theaters.map(theater => {
                                    return (
                                        <div className='theater-content__item' key={theater._id} onClick={() => _filter('theater', theater)}>
                                            {theater.name}
                                        </div>
                                    )
                                })
                            }
                        </>
                        : <div className='theater-content__item'>
                            Vui lòng chọn phim
                        </div>
                }
            </div>

            <div className={turnDate ? 'date-content show' : 'date-content'}>
                {
                    // (theaters.length > 0 && filmFilter) ?
                    (theaterFilter && filmFilter) ?
                        (dates.length > 0) ?
                            dates.map(date => {
                                return (
                                    <div className='date-content__item' key={date._id} onClick={() => _filter('date', date)}>
                                        {date.date}
                                    </div>
                                )
                            })
                            : <div className='date-content__item'>
                                Không có ngày phù hợp
                                </div>

                        : <div className='date-content__item'>
                            Vui lòng chọn phim và cụm rạp
                            </div>

                }
            </div>

            <div className={turnShowtime ? 'showtime-content show' : 'showtime-content'}>
                {
                    (filmFilter && theaterFilter && dateFilter) ?
                        (showtimes.length > 0) ?
                            showtimes && showtimes.map(show => {
                                return (
                                    <div className='showtime-content__item' key={show._id} onClick={() => _filter('showtime', show)}>
                                        {show.start}~ {show.end}
                                    </div>
                                )
                            })
                            : <div className='showtime-content__item'>
                                Không có suất chiếu phù hợp
                            </div>
                        : <div className='showtime-content__item'>
                            Vui lòng chọn phim, cụm rạp và ngày
                        </div>
                }
            </div>
        </div>
    );
}

export default Filter;