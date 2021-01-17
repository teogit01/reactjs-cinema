import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { format, addDays, getDate, getDay } from 'date-fns'
import callApi from 'api/apiCaller';
import Star from 'assets/img/star1.png'
import { Modal } from 'reactstrap';
import './../css/modal.scss'
import { useHistory, useRouteMatch } from 'react-router-dom';

FilmDetail.propTypes = {
    film: PropTypes.object,
    // theaters: PropTypes.array,
    // branch: PropTypes.object
};

function FilmDetail(props) {
    const { film } = props
    const [actived, setActived] = useState(0)
    const [theaterActived, setTheaterActived] = useState('')
    const handleActiveControll = (number) => {
        setActived(number)
    }
    useEffect(() => {
        setTheaterActived(theaters[0])
    }, [theaters])

    const handleChangeTheaterActived = (theater) => {
        setTheaterActived(theater)
    }

    let DATES = []
    const dateCurent = new Date()
    for (let i = 0; i < 7; i++) {
        let date = addDays(dateCurent, i)
        DATES.push({ date: format(date, 'dd/MM/yyyy'), day: getDate(date), th: getDay(date) })
    }
    const [dateActived, setDateActived] = useState(DATES[0])
    // handleChangeDateActived
    const handleChangeDateActived = (date) => {
        setDateActived(date)
    }
    // end handleChangeDateActived
    // LOAD SHOWTIME OF THEATER - DATE
    const [showtimes, setShowtimes] = useState([])
    const LOAD_SHOWTIME = async () => {
        let data = await callApi(`showtime/getshow?_idtheater=${theaterActived._id}&_idfilm=${film._id}&_date=${dateActived.date}`)
        setShowtimes(data.data)
        //console.log('res', data.data)
    }
    useEffect(() => {
        if (film && theaterActived && dateActived)
            LOAD_SHOWTIME()
    }, [theaterActived, dateActived])
    // END LOAD SHOWTIME OF THEATER - DATE
    const [modal, setModal] = useState(false);

    const toggle = () => setModal(!modal);
    const [point, setPoint] = useState(0)
    const hoverStar = (point) => {
        setPoint(point)
    }
    const leaveHover = () => {
        setPoint(0)
    }

    // detail showtime //
    const history = useHistory()
    const detailShowtime = (show) => {
        history.push(`checkout/${show._id}`)
    }
    // end detail showtime //
    return (
        <div className="film-detail">
            <div className='background'>
                {
                    film && <img src={`http://localhost:5000/api/poster/${film.poster}`} />
                }
                < div className='black' >
                    {
                        film && <img src={`http://localhost:5000/api/poster/${film.poster}`} />
                    }
                </div>
            </div>
            <div className='film-detail__head'>
                {/*Head infor*/}
                <div className='head__infor'>
                    <div className='infor__img'>
                        {
                            film && <img src={`http://localhost:5000/api/poster/${film.poster}`} />
                        }
                    </div>
                    <div className='infor__detail'>
                        {film.openDay}
                        <br />
                            C8 film.name
                        <br />
                            Transference: Dark Matants
                    <br />
                        {film.runtime} phut - 0 IMBD ....
                        <br />
                        <br />
                        <button className='btn btn-danger'>Mua Ve</button>
                    </div>
                </div>

                <div className='head__star'>
                    <div className='star__detail'>
                        8.7
              </div>
                    <div className='star__item'>
                        ****
                <br />
                5 nguoi danh gia
              </div>
                </div>
            </div>
            {/*end Head infor*/}

            {/*showtime infor*/}
            <div className='film-detail__infor'>

                <div className='infor__control'>
                    <div className={actived === 0 ? 'control__item actived' : 'control__item'} onClick={() => handleActiveControll(0)}>Lịch chiếu</div>
                    <div className={actived === 1 ? 'control__item actived' : 'control__item'} onClick={() => handleActiveControll(1)}>Thông tin</div>
                    <div className={actived === 2 ? 'control__item actived' : 'control__item'} onClick={() => handleActiveControll(2)}>Đánh giá</div>
                </div>

                {/*Tap show time */}
                <div className={actived === 0 ? 'tap__showtime' : 'tap__showtime none'}>
                    {/*left*/}
                    <div className='showtime__branch'>

                        {
                            theaters.length > 0 &&
                            theaters.map(theater => {
                                return (
                                    <div
                                        onClick={() => handleChangeTheaterActived(theater)}
                                        className={theaterActived === theater ? 'branch__item actived' : 'branch__item'}
                                        key={theater._id}>
                                        < div className='item__img' >
                                            img
                                            </div>
                                        <div className='item__detail'>
                                            {theater.name}
                                            <br />
                                            {theater.address}
                                            <br />
                                            [chi tiet]
                                        </div>
                                    </div>
                                )
                            })
                        }

                    </div>
                    {/*end left*/}
                    {/*right*/}
                    <div className='showtime__detail'>
                        <div className='showtime__detail--day'>

                            <div className='showtime__detail--day__title'>
                                {
                                    DATES.map(date => {
                                        return (
                                            <div
                                                className={date.day === dateActived.day ? 'showtime__detail--day__title--item actived' :
                                                    'showtime__detail--day__title--item'} key={date.day}
                                                onClick={() => handleChangeDateActived(date)}>
                                                {
                                                    date.th === 0 ? 'Chủ nhật' : `Thứ ${date.th + 1}`
                                                }
                                                <br />
                                                {date.day}
                                            </div>
                                        )
                                    })
                                }

                            </div>

                        </div>
                        <hr />
                        {/* detail item showtime*/}

                        <div className='showtime__detail--show'>

                            <div className='showtime__detail--show-item'>

                                {/* <div className='showtime__detail--show-item__infor'>
                                    <div className='img'>img</div>
                                    <div className='infor'>
                                        BHD Star - Bitexco
                                    <br />
                                    L3-vi...............
                                    </div>
                                </div>

                                <div className='showtime__detail--show-item__type'>2D Ditail</div> */}
                                <div className='showtime__detail--show-item__time'>
                                    {
                                        showtimes.length > 0 &&
                                        showtimes.map(show => {
                                            return (
                                                <div className='item' key={show._id}
                                                    onClick={() => { detailShowtime(show) }}><span>{show.start}</span>~{show.end}</div>
                                            )
                                        })
                                    }
                                </div>

                            </div>

                        </div>
                    </div>
                    {/* end detail item showtime*/}
                    {/*end right*/}
                </div>

                {/* end Tap show time */}
                {/*Tap show infor */}
                <div className={actived === 1 ? 'tap__infor' : 'tap__infor none'}>
                    <div className='tap__infor--summary'>
                        <table>
                            <tr>
                                <td className='title'>Ngày công chiếu</td>
                                <td>{film.openday}</td>
                            </tr>
                            <tr>
                                <td className='title'>Đạo diễn</td>
                                <td>{film.director}</td>
                            </tr>
                            <tr>
                                <td className='title'>Diễn viên</td>
                                <td>{film.cast}</td>
                            </tr>
                            <tr>
                                <td className='title'>Thể loại</td>
                                <td>
                                    {
                                        film && film.genres.map(genre => {
                                            return `${genre.name}, `
                                        })
                                    }
                                </td>
                            </tr>
                            <tr>
                                <td className='title'>Quốc gia</td>
                                <td>
                                    {
                                        film && film.countrys.map(country => {
                                            return `${country.name}, `
                                        })
                                    }
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div className='tap__infor--content'>
                        <div className='title'>Nội dung</div>
                        <p>
                            Trái Tim Quái Vật’ là một câu chuyện đậm chất thriller kể về Khánh (Hoàng Thùy Linh) – một người mẹ đơn thân với khao khát được sống và làm ăn lương thiện nhưng không may vướng vào vòng xoáy tội ác. Liệu sự thật ở phía sau là gì?
                        </p>
                    </div>
                </div>
                {/* end tap infor*/}

                {/*Tap show comment */}
                <div className={actived === 2 ? 'tap__comment' : 'tap__comment'}>
                    <div className='tap__comment--vote' onClick={toggle}>
                        <div className='avatar'></div>
                        <div className='text'>Bạn nghĩ gì về phim này?</div>
                        <div className='star'>
                            <img src={Star} />
                            <img src={Star} />
                            <img src={Star} />
                            <img src={Star} />
                            <img src={Star} />
                        </div>
                    </div>
                    <div className='tap__comment--list' >
                        list comment
                    </div>

                    <div className='tap__comment--list' >
                        list comment
                    </div>

                    {/*Modal */}
                    <div>
                        <Modal isOpen={modal} toggle={toggle} size='lg' className='wrap-modal'>
                            <div className='style-modal'>
                                <div className='point'>
                                    {point}.0
                                </div>
                                <div className='star'>
                                    <img src={Star} className={point >= 1 ? 'star-item actived' : 'star-item'}
                                        onMouseEnter={() => hoverStar(1)}
                                        onMouseLeave={leaveHover} />
                                    <img src={Star} className={point >= 2 ? 'star-item actived' : 'star-item'}
                                        onMouseEnter={() => hoverStar(2)}
                                        onMouseLeave={leaveHover} />
                                    <img src={Star} className={point >= 3 ? 'star-item actived' : 'star-item'}
                                        onMouseEnter={() => hoverStar(3)}
                                        onMouseLeave={leaveHover} />
                                    <img src={Star} className={point >= 4 ? 'star-item actived' : 'star-item'}
                                        onMouseEnter={() => hoverStar(4)}
                                        onMouseLeave={leaveHover} />
                                    <img src={Star} className={point >= 5 ? 'star-item actived' : 'star-item'}
                                        onMouseEnter={() => hoverStar(5)}
                                        onMouseLeave={leaveHover} />
                                </div>
                                <div>
                                    <textarea>
                                    </textarea>
                                </div>

                                <div className='button'>
                                    <div className='btn dang'>Đăng</div>
                                </div>
                            </div>
                        </Modal>
                    </div>
                </div>
                {/* end tap comment*/}

            </div >

            {/* end showtime infor*/}
        </div >
    );
}

export default FilmDetail;