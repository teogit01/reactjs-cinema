import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import callApi from 'api/apiCaller';
import classnames from 'classnames'
import { UncontrolledCollapse, Alert } from 'reactstrap'
import { compareAsc, format, setDate } from 'date-fns'
PageMain.propTypes = {

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
function PageMain(props) {
    const [accounts, setAccounts] = useState([])
    const [accountOrigin, setAccountOrigin] = useState([])
    const [accountActived, setAccountActived] = useState('')
    const [tickets, setTickets] = useState([])
    const [showtimes, setShowtimes] = useState([])
    const [tab, setTab] = useState(1)
    useEffect(() => {
        callApi('user').then(res => {
            if (res.data) {
                setAccounts(res.data.users)
                setAccountOrigin(res.data.users)
                if (res.data.users && res.data.users.length > 0) {
                    setAccountActived(res.data.users[0])
                }
            }
        })
    }, [])

    useEffect(() => {
        if (accounts.length > 0) {
            setAccountActived(accounts[0])
        } else {
            setAccountActived('')
        }
    }, [accounts])
    useEffect(() => {
        if (accountActived && accountActived.tickets && accountActived.tickets.length > 0) {
            setTickets(accountActived.tickets)
        } else {
            setTickets([])
        }
    }, [accountActived])
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
    //console.log({ tickets })

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
    // console.log({ datas })
    // console.log({ accountActived })
    //console.log({ dates })
    // console.log('data', accountActived)
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
                    //result.unshift(element)
                })
                //setDataRender(result.reverse())
                setDataRender(result)
            }
        } else {
            setDataRender([])
        }
    }, [datas])
    //console.log({ dataRender })
    const [keySearch, setKeySearch] = useState('')
    const _search = e => {
        setKeySearch(e.target.value)
    }
    const _keyDown = e => {
        if (e.keyCode === 13) {
            // find name
            //const newFilms = filmOrigin.filter(film => film.name.toUpperCase().indexOf(value.toUpperCase()) !== -1)
            const newAccounts = accountOrigin.filter(item => item.name.toUpperCase().indexOf(keySearch.toUpperCase()) !== -1)
            console.log({ newAccounts })
            setAccounts(newAccounts)
        }
    }
    const [alert, setAlert] = useState(false)
    const [alertIn, setAlertIn] = useState(false)
    const _print = (tickets) => {
        const data = {
            tickets: tickets
        }
        console.log(data)
        callApi('ticket/print', 'POST', data).then(res => {
            if (res.data) {
                if (res.data.result === false) {
                    console.log(res.data.result)
                    setAlert(true)
                }
            }
        })
    }
    useEffect(() => {
        if (alert) {
            setTimeout(() => {
                setAlert(false)
            }, 2000)
        }
        if (alertIn) {
            setTimeout(() => {
                setAlertIn(false)
            }, 2000)
        }
    }, [alert, alertIn])

    return (
        <div className='page-account'>
            <div className='title'>
                <h2>Account Management</h2>
                <input type='text' placeholder='Search...' name='search' onKeyDown={_keyDown} value={keySearch} onChange={_search} />
            </div>
            <hr />
            {
                alert &&
                <div className='alert'>
                    <Alert color="danger">
                        Vé này đã được in
                    </Alert>
                </div>
            }
            {
                alertIn &&
                <div className='alert'>
                    <Alert color="success">
                        In thành công!
                    </Alert>
                </div>
            }
            <div className='account-main'>
                <div className='account-list'>
                    <div className='account-list-title account-item'>
                        List account
                    </div>

                    {
                        accounts.length > 0 ?
                            accounts.map(account => {
                                return (
                                    <div className={classnames(
                                        'account-item',
                                        { 'account-actived': account._id === accountActived._id }
                                    )}
                                        key={account._id}
                                        onClick={() => { setAccountActived(account) }}
                                    >
                                        {account.name}
                                    </div>
                                )
                            }) : <div><i>Account not found</i></div>

                    }
                </div>

                <div className='account-info'>
                    <div className='info-title'>
                        Infomation Detail
                    </div>
                    <div className='info-detail'>
                        <div className='control-title'>
                            <div className={classnames(
                                'title-item',
                                { 'title-item-actived': tab === 1 }
                            )}
                                onClick={() => setTab(1)}
                            >Infomation</div>
                            <div className={classnames(
                                'title-item',
                                { 'title-item-actived': tab === 2 }
                            )}
                                onClick={() => setTab(2)}
                            >Ticket</div>
                        </div>
                        {/** Detail info*/}
                        <div className='control-detail'>
                            <div className={classnames(
                                'detail-item info',
                                { 'show': tab === 1 }
                            )}>
                                {
                                    accountActived ?
                                        <div className='item-show'>
                                            <div className='control'>
                                                <label>code</label>
                                                <div>{accountActived.code}</div>
                                            </div>

                                            <div className='control'>
                                                <label>Name</label>
                                                <div>{accountActived.name}</div>
                                            </div>

                                            <div className='control'>
                                                <label>Birthday</label>
                                                <div>{accountActived.birthday}</div>
                                            </div>

                                            <div className='control'>
                                                <label>Email</label>
                                                <div>{accountActived.email}</div>
                                            </div>

                                            <div className='control'>
                                                <label>Phone</label>
                                                <div>{accountActived.phone}</div>
                                            </div>

                                            <div className='control'>
                                                <label>Address</label>
                                                <div>{accountActived.address}</div>
                                            </div>

                                        </div>
                                        : ''
                                }
                            </div>

                            {/* <div className='detail-item'>
                                <div className='item-show'>
                                    <div>Date: 06/01/2020</div>
                                    <div>Ticket : <b>2</b></div>
                                    <div className='status'>Status: seen</div>
                                </div>
                            </div> */}
                        </div>
                        {/** End  Detail info*/}
                        {/** Detail ticket*/}
                        <div className='control-detail'>
                            <div className={classnames(
                                'ticket',
                                { 'show': tab === 2 }
                            )}>
                                <div className='ticket-item'>

                                    {
                                        (dataRender && dataRender.length > 0) &&
                                        dataRender.map((data, idx) => {
                                            const isPass = sosanh(format(new Date(), 'dd/MM/yyyy'), data.date) !== -1
                                            return (
                                                <div>
                                                    <div
                                                        key={data.date}
                                                        className='item-show' id={`id-${idx}`}>
                                                        <div className='control'>
                                                            <div className='title'>Date: {data.date}</div>
                                                            <div className='title'>Ticket : <b>{(datas && datas.length > 0 && datas[idx]) && datas[idx].showtime.length}</b></div>
                                                            <div className={classnames(
                                                                'status',
                                                                { 'pass': isPass },
                                                            )}>Status: {isPass ? 'old' : 'new'}</div>
                                                        </div>
                                                    </div>
                                                    {
                                                        (data.showtime && data.showtime.length > 0) &&
                                                        //showtime => [{showItem, ticket[]}]
                                                        data.showtime.map(show => {
                                                            //console.log('show', show)
                                                            let total = 0
                                                            return (
                                                                <UncontrolledCollapse toggler={`#id-${idx}`} key={show._id}>
                                                                    <div className='item-hidden'>
                                                                        <div><label>Film:</label> {show.showItem.film.name}</div>
                                                                        <div><label>Showtime:</label> {show.showItem.start}~{show.showItem.end}</div>
                                                                        <div style={{ display: 'flex' }}><label>Seat: &nbsp;</label>

                                                                            {
                                                                                (show.ticket.length > 0) &&
                                                                                show.ticket.map(ticket => {
                                                                                    total += ticket.total
                                                                                    return (
                                                                                        <div className=''>
                                                                                            {`${ticket.name}, `}
                                                                                        </div>
                                                                                    )
                                                                                })
                                                                            }
                                                                        </div>
                                                                        <div><label>Discount:</label> </div>
                                                                        <div><label>Total:</label><b>{total}.000vnđ</b> </div>
                                                                        <div className={classnames(
                                                                            'print',
                                                                            {
                                                                                'show': sosanh(format(new Date(), 'dd/MM/yyyy'), data.date) === 0 ?
                                                                                    so_sanh_time(format(new Date(), 'hh:mm a'), show.showItem.start) === -1 ? true : false
                                                                                    : sosanh(format(new Date(), 'dd/MM/yyyy'), data.date) === -1 ? true : false
                                                                            }
                                                                        )}
                                                                            onClick={() => _print(show.ticket)}
                                                                        >Print</div>
                                                                    </div>
                                                                </UncontrolledCollapse >
                                                            )
                                                        })
                                                    }
                                                </div>
                                            )
                                        })
                                    }

                                </div>

                            </div>
                        </div>
                        {/** End Detail ticket*/}
                    </div>
                </div>
            </div>
        </div >
    );
}

export default PageMain;