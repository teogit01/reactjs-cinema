import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './../components/css/page-main.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { UncontrolledCollapse } from 'reactstrap';
import callApi from 'api/apiCaller';
import classnames from 'classnames'
import { format } from 'date-fns'
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
    // if (n_y < d_y) {
    //     return -1
    // }
    // if (n_y > d_y) {
    //     return 1
    // }
    // if (n_m < d_m) {
    //     return -1
    // }
    // if (n_m > d_m) {
    //     return 1
    // }
    // if (n_d < d_d) {
    //     return -1
    // }
    // if (n_d > d_d) {
    //     return 1
    // }
    if (n_m === d_m) {
        return 0
    } else {
        return 1
    }
}

const MONTH = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12]
function PageMain(props) {
    const [tickets, setTickets] = useState([])
    const [accounts, setAccounts] = useState([])
    const [films, setFilms] = useState([])
    const [branchs, setBranchs] = useState([])
    const [theaters, setTheaters] = useState([])
    const [showtimes, setShowtimes] = useState([])

    const countTicket = (branch, theater, film) => {
        //let tictet = 0
        if (branch) {
            if (theater) {
                if (film !== '') {
                    if (film.showtimes && film.showtimes.length > 0) {
                        let result = []
                        film.showtimes.map(show => {
                            if (show.tickets && show.tickets.length > 0) {
                                show.tickets.map(ticket => {
                                    result.push(ticket)
                                })
                            }
                        })
                        return result
                    }
                } else {
                    // only branch theater
                    if (theater.films && theater.films.length > 0) {
                        let result = []
                        theater.films.map(film => {
                            if (film.showtimes && film.showtimes.length > 0) {
                                film.showtimes.map(show => {
                                    if (show.tickets && show.tickets.length > 0) {
                                        show.tickets.map(ticket => {
                                            result.push(ticket)
                                        })
                                    }
                                })
                            }
                        })
                        return result
                    }
                }
            }
        }
        //return tictet
    }
    // /console.log(branchs)
    const [users, setUsers] = useState([])
    useEffect(() => {
        callApi('ticket').then(res => {
            if (res.data) {
                setTickets(res.data.tickets)
            }
        })
        callApi('user').then(res => {
            if (res.data) {
                setUsers(res.data.users)
            }
        })
        callApi('branch/info').then(res => {
            if (res.data) {
                setBranchs(res.data.branchs)
            }
        })
        callApi('showtime').then(res => {
            if (res.data) {
                setShowtimes(res.data.showtimes)
            }
        })
    }, [])

    const [openFilm, setOpenFilm] = useState(false)
    const [openBranch, setOpenBranch] = useState(false)
    const [openTheater, setOpenTheater] = useState(false)
    const [openDate, setOpenDate] = useState(false)

    const [filterFilm, setFilterFilm] = useState('')
    const [filterBranch, setFilterBranch] = useState('')
    const [filterTheater, setFilterTheater] = useState('')
    const [filterDate, setFilterDate] = useState('')

    const [keyFilm, setKeyFilm] = useState('')
    //const [keyFilm, setKeyFilm] = useState('')
    const _toggle = type => {
        if (type === 'film') {
            setOpenFilm(!openFilm)
            setOpenBranch(false)
            setOpenTheater(false)
            setOpenDate(false)
        }
        if (type === 'branch') {
            setOpenBranch(!openBranch)
            setOpenFilm(false)
            setOpenTheater(false)
            setOpenDate(false)
        }
        if (type === 'theater') {
            setOpenTheater(!openTheater)
            setOpenBranch(false)
            setOpenFilm(false)
            setOpenDate(false)
        }
        if (type === 'date') {
            setOpenDate(!openDate)
            setOpenBranch(false)
            setOpenFilm(false)
            setOpenTheater(false)
        }
    }
    const _filter = (type, value) => {
        if (type === 'branch') {
            setFilterBranch(value)
        }
        if (type === 'theater') {
            setFilterTheater(value)
        }
        if (type === 'film') {
            setFilterFilm(value)
        }
        if (type === 'date') {
            setFilterDate(value)
        }
    }
    const _onChange = e => {
        const name = e.target.name
        const value = e.target.value
        if (name === 'film') {
            setKeyFilm(value)
        }
    }


    const [showOfMonth, setShowOfMonth] = useState([])
    useEffect(() => {
        if (filterDate) {
            setFilterBranch('')
            setFilterTheater('')
            setFilterFilm('')
            const t = new Date(`${filterDate},01,2020`)

            const date = format(t, 'dd/MM/yyyy')
            const arr = []
            if (showtimes && showtimes.length > 0) {
                showtimes.map(show => {
                    if (sosanh(date, show.date) === 0) {
                        arr.push(show)
                    }
                })
                setShowOfMonth(arr)
            }
        }
    }, [filterDate])
    const [total, setTotal] = useState(0)
    //console.log({ filterBranch, filterTheater, filterFilm })
    useEffect(() => {
        if (showOfMonth && showOfMonth.length > 0) {
            const arr = []
            showOfMonth.map(show => {
                if (show.tickets && show.tickets.length > 0) {
                    show.tickets.map(item => {
                        arr.push(item._id)
                    })
                }
            })
            setTotal(arr)

            //console.log('arr', arr)
        } else {
            setTotal([])
        }
    }, [showOfMonth])
    useEffect(() => {
        if (filterBranch) {
            if (filterBranch.theaters && filterBranch.theaters.length > 0) {
                setTheaters(filterBranch.theaters)
            } else {
                setTheaters([])
            }
        }
    }, [filterBranch])
    //console.log(showOfMonth)

    useEffect(() => {
        if (filterTheater) {
            if (filterTheater.films && filterTheater.films.length > 0) {
                setFilms(filterTheater.films)
            } else {
                setFilms([])
            }
        }
    }, [filterTheater])



    useEffect(() => {
        setFilterTheater('')
    }, [theaters])
    useEffect(() => {
        setFilterFilm('')
    }, [films])

    useEffect(() => {
        setTotal(countTicket(filterBranch, filterTheater, filterFilm))
    }, [filterBranch, filterTheater, filterFilm])
    const [doanhThu, setDoanhthu] = useState(0)
    useEffect(() => {
        if (total && total.length > 0) {
            const data = {
                tickets: total
            }
            //console.log('data', data)
            callApi('ticket/total', 'POST', data).then(res => {
                if (res.data) {
                    setDoanhthu(res.data.result)
                }
            })
        } else {
            setDoanhthu(0)
        }
    }, [total])
    return (
        <div className='page-main'>
            <div className='title'>
                <h2>Statistical Management</h2>
            </div>
            <hr />
            <div className='main'>
                <div className='main-title'><i>Filter</i></div>
                <div className='filter'>
                    <div className='filter-item'>
                        {filterBranch ? filterBranch.name : 'Branch'}<FontAwesomeIcon onClick={() => _toggle('branch')} className='ic' icon="sort-down" />

                        <div className={classnames(
                            'openbranch',
                            { 'show': openBranch }
                        )}>
                            <div className='openfilm-content'>
                                {/* <input type='text' name='branch' value={keyFilm} onChange={_onChange} /> */}
                                {
                                    branchs.length > 0 &&
                                    branchs.map(branch => {
                                        return (
                                            <div
                                                onClick={() => _filter('branch', branch)}
                                                className='openfilm-content-item'
                                                key={branch._id}>
                                                {branch.name}
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                    <div className='filter-item'>
                        {filterTheater ? filterTheater.name : 'Theater'}<FontAwesomeIcon onClick={() => _toggle('theater')} className='ic' icon="sort-down" />

                        <div className={classnames(
                            'opentheater',
                            { 'show': openTheater }
                        )}>
                            <div className='openfilm-content'>
                                {/* <input type='text' name='branch' value={keyFilm} onChange={_onChange} /> */}
                                {
                                    theaters.length > 0 &&
                                    theaters.map(theater => {
                                        return (
                                            <div
                                                onClick={() => _filter('theater', theater)}
                                                className='openfilm-content-item'
                                                key={theater._id}>
                                                {theater.name}
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                    <div className='filter-item' id='openfilm' >
                        {filterFilm ? filterFilm.name : 'Film'}<FontAwesomeIcon onClick={() => _toggle('film')} className='ic' icon="sort-down" />

                        <div className={classnames(
                            'openfilm',
                            { 'show': openFilm }
                        )}>
                            <div className='openfilm-content'>
                                {/* <input type='text' name='film' value={keyFilm} onChange={_onChange} /> */}
                                {
                                    films.length > 0 &&
                                    films.map(film => {
                                        return (
                                            <div
                                                onClick={() => _filter('film', film)}
                                                className='openfilm-content-item'
                                                key={film._id}>
                                                {film.name}
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                    <div className='filter-item' id='openfilm' >
                        {filterDate ? `Month ${filterDate}` : 'Month'}<FontAwesomeIcon onClick={() => _toggle('date')} className='ic' icon="sort-down" />

                        <div className={classnames(
                            'openfilm',
                            { 'show': openDate }
                        )}>
                            <div className='openfilm-content'>
                                {/* <input type='text' name='film' value={keyFilm} onChange={_onChange} /> */}
                                {
                                    MONTH.map(month => {
                                        return (
                                            <div
                                                onClick={() => _filter('date', month)}
                                                className='openfilm-content-item'
                                                key={month}>
                                                {`Month ${month}`}
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>

                <div className='tickets'>Tiket: {total && total.length}</div>
                < div className='tickets'>Revenue: {doanhThu}.000 vnđ</div>
            </div>
            <div className='main'>
                <div className='main-title'><i>Member</i></div>
                <div className='tickets'>All Account: {users && users.length}</div>
            </div>

        </div>
    );
}

export default PageMain;