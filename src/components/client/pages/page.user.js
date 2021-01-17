import React, { useState, useEffect } from 'react';
import './../css/page-user.scss'
import PropTypes from 'prop-types';
import classnames from 'classnames'
import { UncontrolledCollapse } from 'reactstrap'
import { compareAsc, format, setDate } from 'date-fns'
import callApi from 'api/apiCaller';

PageUser.propTypes = {

};
const so_sanh_time = (time1, time2) => {
    // time1 < time2  -1
    // time1 = time2  0
    // time1 > time2  1
    let t1_h = parseInt(time1.slice(0, 2))
    const t1_m = parseInt(time1.slice(3, 5))

    const type = time1.slice(6, 8)
    if (type === 'PM') {
        t1_h += 12
    }

    const t2_h = parseInt(time2.slice(0, 2))
    const t2_m = parseInt(time2.slice(3, 5))

    if (t1_h < t2_h) {
        return -1
    }
    if (t1_h > t2_h) {
        return 1
    }
    if (t1_m < t2_m) {
        return -1
    }
    if (t1_m > t2_m) {
        return 1
    }

    return 0
}

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
function PageUser(props) {
    const [tab, setTab] = useState('info')
    const user = JSON.parse(localStorage.getItem('user'))
    const [info, setInfo] = useState('')
    const [showtimes, setShowtimes] = useState([])
    useEffect(() => {
        if (user && user.length > 0) {
            callApi(`user/detail/${user[0]._id}`).then(res => {
                if (res.data.user) {
                    setInfo(res.data.user)
                }
            })
        }
    }, [])

    const [tickets, setTickets] = useState([])
    useEffect(() => {
        if (info && info.tickets && info.tickets.length > 0) {
            setTickets(info.tickets)
        } else {
            setTickets([])
        }
    }, [info])

    const [dates, setDates] = useState([])
    useEffect(() => {
        if (tickets.length > 0) {
            const arrDate = []
            const arrShowtime = []
            tickets.map(ticket => {
                arrShowtime.push(ticket.showtime)
                const check = arrDate.filter(item => item === ticket.showtime.date)
                if (check.length === 0) {
                    arrDate.push(ticket.showtime.date)
                }
            })
            setDates(arrDate)
            setShowtimes(arrShowtime)
        } else {
            setDates([])
            setShowtimes([])
        }
    }, [tickets])

    const [datas, setDatas] = useState([])
    useEffect(() => {
        if (dates && dates.length > 0) {
            const data = []
            dates.map(item => {
                const element = {
                    date: item,
                    showtime: showtimes.filter(show => show.date === item)
                }
                data.push(element)
            })
            setDatas(data)
        } else {
            setDatas([])
        }
    }, [dates])

    const [dataRender, setDataRender] = useState([])
    useEffect(() => {
        if (datas && datas.length > 0) {
            const arr = []
            datas.map(data => {
                const show = []
                data.showtime.map(item => {
                    const check = show.filter(itemShow => itemShow._id === item._id)
                    if (check.length === 0) {
                        show.push(item)
                    }
                })
                const element = {
                    date: data.date,
                    showtime: show,
                }
                arr.push(element)
            })
            // setDataRender(arr)
            if (arr.length > 0) {
                const result = []
                arr.map(item => {
                    const ar = []
                    item.showtime.map(item2 => {

                        const ticket = tickets.filter(it => it.showtime._id === item2._id)
                        const el = {
                            showItem: item2,
                            ticket: ticket
                        }
                        ar.push(el)
                    })
                    const element = {
                        date: item.date,
                        showtime: ar
                    }
                    result.push(element)
                })
                //setDataRender(result.reverse())
                setDataRender(result)
            }
        } else {
            setDataRender([])
        }
    }, [datas])
    //console.log('data', data)
    //console.log(format(new Date(), 'hh:mm'))
    console.log({ dataRender })
    return (
        <div className='page-user'>
            <div className='user-main'>
                <div className='title'>Thông tin thành viên</div>
                <div className='main-content'>
                    <div className='left'>
                        <div
                            onClick={() => setTab('info')}
                            className={classnames(
                                'left-item',
                                { 'actived': tab === 'info' }
                            )}>
                            Thông tin
                            </div>
                        <div
                            onClick={() => setTab('history')}
                            className={classnames(
                                'left-item',
                                { 'actived': tab === 'history' }
                            )}>
                            Lịch sử mua vé
                        </div>
                    </div>
                    <div className='right'>
                        <div className={classnames(
                            'info',
                            { 'show': tab === 'info' }
                        )}>
                            <div className='control'>
                                <label>Họ tên</label>
                                <div>{info ? info.name : ''}</div>
                            </div>
                            <div className='control'>
                                <label>Sinh nhật</label>
                                <div>{info ? info.birthday : ''}</div>
                            </div>
                            <div className='control'>
                                <label>Số điện thoại</label>
                                <div>{info ? info.phone : ''}</div>
                            </div>
                            <div className='control'>
                                <label>Email</label>
                                <div>{info ? info.email : ''}</div>
                            </div>
                            <div className='control'>
                                <label>Địa chỉ</label>
                                <div>{info ? info.address : ''}</div>
                            </div>
                            <br />
                            <div className='control-button'>
                                <div className='button-edit'>Chỉnh sửa thông tin</div>
                            </div>
                        </div>
                        <div className={classnames(
                            'history',
                            { 'show': tab === 'history' }
                        )}>
                            <div className='history-content'>
                                {
                                    dataRender.length > 0 &&
                                    dataRender.map((data, idx) => {
                                        return (
                                            <div className='history-item' id={`id-${idx}`}>
                                                <div className='item-title'>
                                                    <div className='title-date'>
                                                        Ngày:{data.date}
                                                    </div>
                                                    <div className=''>Ticket : <b>{(datas && datas.length > 0 && datas[idx]) && datas[idx].showtime.length}</b></div>
                                                    <div className={classnames(
                                                        'title-status',
                                                        {
                                                            'used': sosanh(format(new Date(), 'dd/MM/yyyy'), data.date) > 0

                                                        }
                                                    )}>
                                                        {
                                                            // now 10/01/2020 < date 11/01/2020 === -1   chua xem                                                        
                                                            // now 11/01/2020 = date 11/01/2020 === 0   da xem                                                    
                                                            // now 12/01/2020 > date 11/01/2020 === 1   da xem                                                         
                                                            (sosanh(format(new Date(), 'dd/MM/yyyy'), data.date) > 0) ?

                                                                //|| (show.tiecks && show.tickets.length > 0 && show.tickets[0].status === false) ?
                                                                'Đã xem' : 'Chưa xem'
                                                        }
                                                    </div>
                                                </div>
                                                <div className='content'>
                                                    <UncontrolledCollapse toggler={`#id-${idx}`}>
                                                        {
                                                            (data.showtime && data.showtime.length > 0) &&
                                                            data.showtime.map(show => {
                                                                let total = 0
                                                                // console.log(show.showItem.start)
                                                                console.log(so_sanh_time(format(new Date(), 'hh:mm a'), show.showItem.start))
                                                                return (
                                                                    <div className='content-item' key={show._id}>
                                                                        <div>
                                                                            Phim: {show.showItem.film.name}
                                                                        </div>
                                                                        <div>
                                                                            Suất chiếu: {show.showItem.start}~{show.showItem.end}
                                                                        </div>
                                                                        <div>
                                                                            Vé: &nbsp;
                                                                            {
                                                                                (show.ticket && show.ticket.length > 0) &&
                                                                                show.ticket.map(ticket => {
                                                                                    total += ticket.total
                                                                                    return `${ticket.name}, `
                                                                                })
                                                                            }
                                                                        </div>
                                                                        <div>
                                                                            Tổng thanh toán: <b>{total}.000 vnđ</b>
                                                                        </div>
                                                                        <div>
                                                                            Hình thức thanh toán: Tiền mặt
                                                                        </div>
                                                                        <div
                                                                            className={classnames(
                                                                                'status'
                                                                            )}
                                                                        >
                                                                            Trạng thái:
                                                                            <span>
                                                                                {/* {
                                                                                    (sosanh(format(new Date(), 'dd/MM/yyyy'), data.date) > 0) ? 'Đã xem' : 'Chưa xem'
                                                                                } */}
                                                                                {
                                                                                    //////-------------/-----show---------/---------
                                                                                    sosanh(format(new Date(), 'dd/MM/yyyy'), data.date) === -1 ? 'Chưa xem' :
                                                                                        so_sanh_time(format(new Date(), 'hh:mm a'), show.showItem.start) === -1 ? 'Chưa Xem' : 'Đã xem'
                                                                                    // sosanh(format(new Date(), 'dd/MM/yyyy'), data.date) === 0 ?
                                                                                    //     so_sanh_time(format(new Date(), 'hh:mm a'), show.showItem.start) === -1 ? 'Đã xem' : 'Chưa xem'
                                                                                    //     : sosanh(format(new Date(), 'dd/MM/yyyy'), data.date) === 1 ? 'Đã xem' : 'Chưa xem'
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            })
                                                        }
                                                    </UncontrolledCollapse>
                                                </div>
                                            </div>
                                        )
                                    })

                                }
                                {/* <div className='history-item' id='toggler'>
                                    <div className='item-title'>
                                        <div className='title-date'>
                                            Ngày: 20/11/2020
                                        </div>
                                        <div className='title-status'>
                                            Đã xem
                                        </div>
                                    </div>
                                    <div className='content'>
                                        <UncontrolledCollapse toggler="#toggler">
                                            <div className='content-item'>
                                                <div>
                                                    Phim: Joker
                                                </div>
                                                <div>
                                                    Suất chiếu: 07:10~09:30
                                                </div>
                                                <div>
                                                    Ghế: H1, H2, H3, H4
                                                </div>
                                                <div>
                                                    Tổng thanh toán: 260.000 vnđ
                                                </div>
                                            </div>
                                        </UncontrolledCollapse>
                                    </div>
                                </div> */}

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PageUser;