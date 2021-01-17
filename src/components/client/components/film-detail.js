import React, { useState, useEffect } from 'react';
import './css/film-detail.scss'
import PropTypes from 'prop-types';
import classnames from 'classnames'
import { format, addDays, getDay } from 'date-fns';
import star from 'assets/img/star1.png'
import avatar from 'assets/img/avatar.png'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Alert } from 'reactstrap';
import { useHistory, useRouteMatch, Redirect } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import callApi from 'api/apiCaller';

FilmDetail.propTypes = {
    film: PropTypes.object,
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
function FilmDetail(props) {
    const { film, branchActived } = props
    const user = JSON.parse(localStorage.getItem('user'))
    const [login, setLogin] = useState(false)
    useEffect(() => {
        if (user && user.length > 0) {
            setLogin(true)
        }
    }, [user])
    const [control, setControl] = useState('ST')
    const [dates, setDates] = useState([])
    const [date, setDate] = useState('')

    const [theaters, setTheaters] = useState([])
    const [theaterActived, setTheaterActived] = useState('')
    const [showtimes, setShowtimes] = useState([])
    const [showtimeRender, setShowtimeRender] = useState([])

    const [rates, setRates] = useState([])
    const [comment, setComment] = useState('')

    useEffect(() => {
        if (film) {
            callApi(`rate/film/${film._id}`).then(res => {
                //console.log('data', res.data)
                if (res.data && res.data.rates) {
                    setRates(res.data.rates)
                }
            })
        }
    }, [film])
    //console.log(rates)
    useEffect(() => {
        const now = new Date()
        const date = []
        for (let i = 0; i < 7; i++) {
            date.push({
                date: format(addDays(new Date(now), i), 'dd/MM/yyyy'),
                day: getDay(addDays(new Date(now), i))
            })
        }
        setDates(date)
        setDate(date[0].date)
    }, [])

    useEffect(() => {
        if (branchActived) {
            if (branchActived.theaters && branchActived.theaters.length > 0) {
                setTheaters(branchActived.theaters)
                setTheaterActived(branchActived.theaters[0])
            }
        }
    }, [branchActived])

    useEffect(() => {
        if (theaterActived && theaterActived.rooms && theaterActived.rooms.length > 0) {
            let arrShowtime = []
            theaterActived.rooms.map(room => {
                let data = arrShowtime.concat(room.showtimes)
                arrShowtime = data
            })
            //const newShowtime = arrShowtime.filter((item, idx) => item.date === date && item._id === theaterActived._id)
            const newShowtime = arrShowtime.filter((item, idx) => item.date === date)
            setShowtimeRender(newShowtime)
        }
    }, [theaterActived, date])

    const [modalR, setModalR] = useState(false);
    const toggleR = () => setModalR(!modalR);

    // rate
    const [numstar, setNumstar] = useState(0)
    const [numstartemp, setNumstarTemp] = useState(0)
    // end rate

    // redirect showtime
    const history = useHistory()
    const match = useRouteMatch()
    const openInNewTab = (url) => {
        const newWindow = window.open(url)
        if (newWindow) newWindow.opener = null
    }
    const _checkout = (dateIsPass, showtime) => {
        if (!dateIsPass) {
            history.push(`checkout/${showtime._id}`)
        }
    }

    const [alert, setAlert] = useState(false)
    const [alert2, setAlert2] = useState(false)
    useEffect(() => {
        if (alert) {
            setTimeout(() => {
                setAlert(false)
            }, 2000)
        }
        if (alert2) {
            setTimeout(() => {
                setAlert2(false)
            }, 3000)
        }
    }, [alert, alert2])
    const _rate = () => {
        if (user && user.length > 0) {
            if (rates.length > 0) {
                let check = false
                rates.map(rate => {
                    if (rate.user._id === user[0]._id) {
                        check = true
                    }
                })
                if (!check)
                    toggleR()
                else
                    setAlert2(true)
            }
        } else {
            // not login
            setAlert(true)
        }
    }
    const _submitRate = () => {
        const data = {
            _iduser: user[0]._id,
            star: numstar,
            comment: comment,
            _idfilm: film._id
        }
        setNumstar(0)
        setComment('')
        setNumstarTemp(0)
        callApi('rate/add', 'POST', data).then(res => {
            if (res.data.rates) {
                //console.log('data', res.data)
                setRates(res.data.rates)
                toggleR()
            }
        })
        //console.log(data)
    }
    const _changeComment = e => {
        setComment(e.target.value)
    }

    const [point, setPoint] = useState('')
    const [rateRender, setRateRender] = useState([])
    useEffect(() => {
        if (rates.length > 0) {
            let sum = 0
            rates.map(rate => {
                sum += rate.star
            })
            //setPoint(sum / rates.length)
            setPoint(Number((sum / rates.length).toFixed(1)))
            setRateRender(rates.reverse())
        }
    }, [rates])
    const _remove = (rate) => {
        const data = {
            rate: rate
        }
        //console.log(data)
        callApi('rate/remove', 'POST', data).then(res => {
            const newRates = rates.filter(item => item._id !== rate._id)
            setRates(newRates)
        })
    }
    return (
        <div className='film-detail'>
            <div className={classnames(
                'alert',
                { 'show': alert }
            )}>
                <Alert color='danger'>
                    Vui lòng đăng nhập để có thể đánh giá phim!
                </Alert>
            </div>
            <div className={classnames(
                'alert',
                { 'show': alert2 }
            )}>
                <Alert color='danger'>
                    Bạn đã đánh giá phim này !
                </Alert>
            </div>
            <div className='detail-main'>
                <div className='main-bg'
                    style={
                        {
                            backgroundImage: `url(http://localhost:5000/api/poster/${film.poster})`
                        }
                    }
                >
                </div>
                <div className='main-content'>
                    <div className='content-head'>
                        <div className='head-img'>
                            <img src={`http://localhost:5000/api/poster/${film.poster}`} />
                        </div>
                        <div className='head-info'>
                            <div className='date'>{film.openday}</div>
                            <div className='name'>{film.name}</div>
                            <div className='time'>{film.runtime} phút</div>
                            <div className='control'>
                                <div className='button' onClick={() => setControl('ST')}>Mua Vé</div>
                            </div>
                        </div>
                        <div className='head-rate'>
                            {
                                point ?
                                    <div className='rate-item'>
                                        <label><span className='item1'>{point}</span>/5</label>
                                        <div className='item2'>{rates.length} người đánh giá</div>
                                    </div> :
                                    <div>
                                        <div className='item2'>{rates.length} người đánh giá</div>
                                    </div>
                            }
                        </div>

                    </div>
                    <div className='content-control'>
                        <div
                            onClick={() => setControl('ST')}
                            className={classnames(
                                'control-showtime control-item',
                                { 'actived': control === 'ST' }
                            )}>
                            Suất chiếu
                        </div>
                        <div
                            onClick={() => setControl('I')}
                            className={classnames(
                                'control-showtime control-item',
                                { 'actived': control === 'I' }
                            )}>
                            Thông tin
                        </div>
                        <div
                            onClick={() => setControl('R')}
                            className={classnames(
                                'control-showtime control-item',
                                { 'actived': control === 'R' }
                            )}>
                            Đánh giá
                        </div>
                    </div>
                    <div className='content-info'>
                        {/**content showtime*/}
                        <div className={classnames(
                            'showtime',
                            { 'show': control === 'ST' }
                        )}>
                            <div className={classnames(
                                'showtime-theater',
                            )}>
                                <div className='theater-item theater-title'>Theaters</div>
                                {
                                    theaters.length > 0 &&
                                    theaters.map(theater => {
                                        return (
                                            <div
                                                onClick={() => setTheaterActived(theater)}
                                                key={theater._id} className={classnames(
                                                    'theater-item',
                                                    { 'theater-actived': theater._id === theaterActived._id }
                                                )}>{theater.name}
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <div className='showtime-info'>
                                <div className='info-day'>
                                    <div className='day-content'>
                                        {
                                            dates.length > 0 &&
                                            dates.map(d => {
                                                return (
                                                    <div
                                                        onClick={() => setDate(d.date)}
                                                        key={dates.date}
                                                        className={classnames(
                                                            'day-item',
                                                            { 'day-actived': d.date === date }
                                                        )}>
                                                        <div className='item-day'>
                                                            {
                                                                (() => {
                                                                    switch (d.day) {
                                                                        case 1:
                                                                            return (<div>Thứ 2</div>)
                                                                        case 2:
                                                                            return (<div>Thứ 3</div>)
                                                                        case 3:
                                                                            return (<div>Thứ 4</div>)
                                                                        case 4:
                                                                            return (<div>Thứ 5</div>)
                                                                        case 5:
                                                                            return (<div>Thứ 6</div>)
                                                                        case 6:
                                                                            return (<div>Thứ 7</div>)
                                                                        default:
                                                                            return (<div>Chủ nhật</div>)

                                                                    }
                                                                })()
                                                            }
                                                        </div>
                                                        <div className='item-date'>{d.date}</div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                                <div className='info-detail'>
                                    {
                                        showtimeRender.length > 0 ?
                                            showtimeRender.map(showtime => {
                                                // console.log('1', format(new Date(), 'dd/MM/yyyy'))
                                                // console.log('2', showtime.date)
                                                // console.log('ss', sosanh(format(new Date(), 'dd/MM/yyyy'), showtime.date))
                                                //console.log(sosanh(format(new Date(), 'dd/MM/yyyy'), showtime.date))
                                                const dateIsPass = sosanh(format(new Date(), 'dd/MM/yyyy'), showtime.date) === -1 ? false
                                                    : so_sanh_time(format(new Date(), 'hh:mm a'), showtime.start) === -1 ? false : true
                                                // const dateIsPass = sosanh(format(new Date(), 'dd/MM/yyyy'), showtime.date) === -1 ?
                                                //     false : sosanh(format(new Date(), 'dd/MM/yyyy'), showtime.date) === 1 ? true :
                                                //         so_sanh_time(format(new Date(), 'hh:mm a'), showtime.start) === -1 ? true : false

                                                //const dateIsPass = sosanh(format(new Date(),'dd/MM/yyyy'), showtime.date) ?
                                                // (so_sanh_time(format(new Date(), 'hh:mm a'), showtime.start)) > 0
                                                return (
                                                    <div
                                                        onClick={() => _checkout(dateIsPass, showtime)}
                                                        key={showtime._id}
                                                        className={classnames(
                                                            'showtime-item',
                                                            {
                                                                'pass': dateIsPass
                                                            }
                                                        )
                                                        }
                                                    >
                                                        <span className='start'>{showtime.start}</span>~<span>{showtime.end}</span>
                                                    </div>
                                                )
                                            })
                                            : <div className='not-found'><i>Không có suất chiếu</i></div>
                                    }

                                </div>
                            </div>
                        </div>
                        {/** end content showtime*/}
                        {/** content info film */}
                        <div className={classnames(
                            'info',
                            { 'show': control === 'I' }
                        )}>
                            <div className='info-left'>
                                <div className='left-content'>
                                    <div className='control'>
                                        <label>Ngày công chiếu</label>
                                        <div className='content'>{film.openday}</div>
                                    </div>
                                    <div className='control'>
                                        <label>Đạo diễn</label>
                                        <div className='content'>{film.director}</div>
                                    </div>
                                    <div className='control'>
                                        <label>Diễn viên</label>
                                        <div className='content'>{film.cast}</div>
                                    </div>
                                    <div className='control'>
                                        <label>Thể loại</label>
                                        <div className='content'>
                                            {
                                                film.genres && film.genres.length > 0 &&
                                                film.genres.map(genre => {
                                                    return (
                                                        <>
                                                            {`${genre.name}, `}
                                                        </>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                    <div className='control'>
                                        <label>Quốc gia</label>
                                        <div className='content'>
                                            {
                                                film.countrys && film.countrys.length > 0 &&
                                                film.countrys.map(country => {
                                                    return (
                                                        <>
                                                            {`${country.name}, `}
                                                        </>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='info-right'>
                                <div className='right-content'>
                                    <div className='title'>Nội dung</div>
                                    <div className='content'>
                                        Phần hai Chị Mười Ba: 3 Ngày Sinh Tử được đầu tư hoành tráng hơn với những màn rượt đuổi ngẹt thở, những pha đánh đấm chân thật hơn, hứa hẹn “bùng cháy” mạnh mẽ và kịch tính vào tháng 12 này</div>
                                </div>
                            </div>
                        </div>
                        {/** end content info film */}
                        {/** content rate film */}
                        <div className={classnames(
                            'rate',
                            { 'show': control === 'R' }
                        )}>
                            <div className='rate-content'>
                                <div className='rate-new' onClick={() => _rate()}>
                                    <div className='avatar'>
                                        <img src={avatar} />
                                    </div>
                                    <div className='title'>Bạn nghĩ gì về phim này</div>
                                    <div className='star'>
                                        <img src={star} alt="star" className='stars-item' />
                                        <img src={star} alt="star" className='stars-item' />
                                        <img src={star} alt="star" className='stars-item' />
                                        <img src={star} alt="star" className='stars-item' />
                                        <img src={star} alt="star" className='stars-item' />
                                    </div>
                                </div>
                                <div className='rate-info'>
                                    {
                                        (rateRender && rateRender.length > 0) &&
                                        rateRender.reverse().map(rate => {
                                            const stars = []
                                            for (let i = 0; i < rate.star; i++) {
                                                stars.push(i)
                                            }
                                            return (
                                                <div className='rate-info-item' key={rate._id}>
                                                    <div className='item-title'>
                                                        <div className='item-title-name'>
                                                            <img src={avatar} />
                                                            <label>{rate.user.name}</label>
                                                        </div>
                                                        <div className='item-title-star'>
                                                            {
                                                                stars.length > 0 &&
                                                                stars.map(item => {
                                                                    return (
                                                                        <img src={star} />
                                                                    )
                                                                })
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className='item-content'>
                                                        {rate.comment}
                                                    </div>
                                                    <div className={classnames(
                                                        'item-edit',
                                                        { 'show': rate.user._id === user[0]._id }
                                                    )}>
                                                        <div className='edit-control'>...</div>
                                                        <div className='control-item'>
                                                            {/* <div className='sua'>
                                                                <FontAwesomeIcon className='' icon="edit" />
                                                            </div> */}
                                                            <div className='xoa'>
                                                                <FontAwesomeIcon className='' icon="eraser" onClick={() => _remove(rate)} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                        {/** end content rate filn */}
                        <div>
                            <Modal isOpen={modalR} toggle={toggleR} size='lg' className='modal-rate'>
                                <ModalBody>
                                    <div className='modal-rate-form'>
                                        <div className='modal-main'>
                                            <div className='out' onClick={() => toggleR()}>x</div>
                                            <div className='modal-main-title'>
                                                <label>{numstartemp}</label>
                                                <div className='stars'>
                                                    <img
                                                        onMouseEnter={() => setNumstarTemp(1)}
                                                        onMouseLeave={() => setNumstarTemp(numstar)}
                                                        onClick={() => setNumstar(1)}
                                                        src={star} alt="stars" className={classnames(
                                                            'stars-item',
                                                            { 'actived': numstartemp >= 1 }
                                                        )} />
                                                    <img
                                                        onMouseEnter={() => setNumstarTemp(2)}
                                                        onMouseLeave={() => setNumstarTemp(numstar)}
                                                        onClick={() => setNumstar(2)}
                                                        src={star} alt="stars" className={classnames(
                                                            'stars-item',
                                                            { 'actived': numstartemp >= 2 }
                                                        )} />
                                                    <img
                                                        onMouseEnter={() => setNumstarTemp(3)}
                                                        onMouseLeave={() => setNumstarTemp(numstar)}
                                                        onClick={() => setNumstar(3)}
                                                        src={star} alt="stars" className={classnames(
                                                            'stars-item',
                                                            { 'actived': numstartemp >= 3 }
                                                        )} />
                                                    <img
                                                        onMouseEnter={() => setNumstarTemp(4)}
                                                        onMouseLeave={() => setNumstarTemp(numstar)}
                                                        onClick={() => setNumstar(4)}
                                                        src={star} alt="stars" className={classnames(
                                                            'stars-item',
                                                            { 'actived': numstartemp >= 4 }
                                                        )} />
                                                    <img
                                                        onMouseEnter={() => setNumstarTemp(5)}
                                                        onMouseLeave={() => setNumstarTemp(numstar)}
                                                        onClick={() => setNumstar(5)}
                                                        src={star} alt="stars" className={classnames(
                                                            'stars-item',
                                                            { 'actived': numstartemp >= 5 }
                                                        )} />
                                                </div>
                                            </div>
                                            <br />
                                            <div>
                                                <textarea
                                                    name='comment'
                                                    value={comment}
                                                    onChange={_changeComment}
                                                    className='form-control' rows='4'
                                                    placeholder='Nói cho mọi người biết cảm nghỉ của bạn...'>

                                                </textarea>
                                            </div>
                                            <br />
                                            <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
                                                <Button style={{ width: '130px' }} color="danger" onClick={() => { _submitRate() }}>Đăng</Button>
                                            </div>
                                        </div>
                                    </div>
                                </ModalBody>

                            </Modal>
                        </div>
                    </div>
                </div>
            </div >
        </div >
    );
}

export default FilmDetail;