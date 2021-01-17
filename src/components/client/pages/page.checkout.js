import React, { useState, useEffect } from 'react';
import './../css/page-checkout.scss'
import CheckOut from './../components/checkout'
import { useRouteMatch, Redirect } from 'react-router-dom';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import callApi from 'api/apiCaller';
import classnames from 'classnames'
import { set } from 'date-fns';
// import PropTypes from 'prop-types';

// PageCheckout.propTypes = {

// };

const NOTE = [
    { type: 'default', price: 0, color: '#88A09E' },
    { type: 'normal', price: 5, color: '#2B3B3B' },
    { type: 'couple', price: 10, color: '#F6DB79' },
    { type: 'used', price: '', color: '#B79FAD' },
]
const convert = (type, value) => {
    // type 0_ convert String->Number
    // type 1_ convert Number->String
    let result = ''
    if (type === 0) {
        result = value.charCodeAt(0)
    }
    if (type === 1) {
        result = String.fromCharCode(value)
    }
    return result
}

// 'showtime' have all infor
function PageCheckout(props) {
    const [showtime, setShowtime] = useState('')
    const [isLogin, setIsLogin] = useState(true)
    const user = JSON.parse(localStorage.getItem('user'))
    const [seats, setSeats] = useState([])
    const [ROW, setROW] = useState([])
    const [COLUMN, setCOLUMN] = useState([])
    const [seatMax, setSeatMax] = useState('')
    const [tickets, setTickects] = useState([])
    const [seatSelected, setSeatSelected] = useState([])
    const match = useRouteMatch()
    const [total, setTotal] = useState(0)
    const { _idshowtime } = match.params

    useEffect(() => {
        if (!user || user.length === 0) {
            setIsLogin(false)
        }
    }, [user])
    useEffect(() => {
        if (_idshowtime) {
            callApi(`showtime/detail/${_idshowtime}`).then(res => {
                if (res.data) {
                    if (res.data.seats) {
                        setSeats(res.data.seats)
                    }
                    if (res.data.showtime) {
                        setShowtime(res.data.showtime)
                        setTickects(res.data.showtime.tickets)
                    }
                }
            })
        }
    }, [])
    useEffect(() => {
        if (seats.length > 0)
            setSeatMax(seats[seats.length - 1])
    }, [seats])

    useEffect(() => {
        if (seatMax) {
            const rows = []
            const columns = []
            for (let i = 65; i <= convert(0, seatMax.row); i++) {
                rows.push(convert(1, i))
            }
            for (let i = 0; i < seatMax.column; i++) {
                columns.push(i + 1)
            }
            setROW(rows)
            setCOLUMN(columns)
        }
    }, [seatMax])
    //console.log({ seats, seatMax, showtime, ROW, COLUMN })        
    const _choose = (used, type, seat) => {
        if (used === false) {
            const idx = seatSelected.indexOf(seat)
            if (idx === -1) {
                //setSeatSelected([...seatSelected, { ...seat, isCouple: type }])
                setSeatSelected([...seatSelected, seat])
            } else {
                setSeatSelected([...seatSelected.slice(0, idx), ...seatSelected.slice(idx + 1, seatSelected.length)])
            }
        }
    }
    useEffect(() => {
        if (showtime && showtime.film) {
            let total = 0
            seatSelected.map(seat => {
                if (seat.row === seatMax.row) {
                    total += showtime.film.price + 10
                } else {
                    if (seat.type === 'default')
                        total += showtime.film.price
                    else
                        total += showtime.film.price + 5
                }
            })
            setTotal(total)
        }
    }, [seatSelected])

    const _checkOut = () => {
        const data = {
            seats: seatSelected,
            total: total,
            seatMax: seatMax,
            _idfilm: showtime.film._id,
            _idshowtime: showtime._id,
            _iduser: user[0]._id
        }
        console.log(data)
        callApi('ticket/buy', 'POST', data).then(res => {
            if (res.data)
                if (res.data.result) {
                    toggleNotify()
                    console.log('Checkout successfully!')
                }
                else
                    console.log("false")
        })
    }
    const [typePayment, setTypePayment] = useState('cash')
    const _methodPayment = (e) => {
        setTypePayment(e.target.value)
    }

    // alert when checkout success fully
    const [modalNotify, setModalNotify] = useState(false)
    const toggleNotify = () => setModalNotify(!modalNotify)
    // end alert when checkout success fully
    const [redirectCaNhan, setRedirectCaNhan] = useState(false)
    const _redirect = (type) => {
        if (type === 'canhan') {
            setRedirectCaNhan(true)
        }
    }
    return (
        <div className='page-checkout'>
            {
                !isLogin && <Redirect to='/login' />
            }
            {
                redirectCaNhan && <Redirect to={`/client/user/${user[0]._id}`} />
            }
            <div className='checkout-content'>
                <div className='info'>
                    <div className='title'>Chọn ghế và thanh toán</div>
                    <div className='screen'>Màng hình</div>
                    <div className='seats'>
                        <div className='seats-item'>
                            {
                                ROW.length > 0 &&
                                ROW.map((row, idxrow) => {
                                    if (idxrow !== ROW.length - 1) {
                                        return (
                                            <div
                                                className='row-item'
                                                key={row}>
                                                <div
                                                    className='row'
                                                >{row}</div>
                                                {
                                                    COLUMN.length > 0 &&
                                                    COLUMN.map((col, idxcol) => {
                                                        const checkTicket = (tickets.filter((item, idx) => item.name === seats[(idxrow * COLUMN.length) + idxcol].name)).length !== 0 ? true : false
                                                        return (
                                                            <div
                                                                onClick={() => _choose(checkTicket, false, seats[(idxrow * COLUMN.length) + idxcol])}
                                                                className={classnames(
                                                                    'col-item',
                                                                    { 'pagin': col === 2 || col === COLUMN.length - 2 },
                                                                    `${seats[(idxrow * COLUMN.length) + idxcol].type}`,
                                                                    // { 'used': row === 'G' ? col === 5 || col === 6 || col === 7 || col === 8 : '' },
                                                                    // { 'used': (tickets.filter((item, idx) => item.name === seats[(idxrow * COLUMN.length) + idxcol].name)).length !== 0 },
                                                                    { 'used': checkTicket },
                                                                    { 'selected': seatSelected.indexOf(seats[(idxrow * COLUMN.length) + idxcol]) !== -1 },
                                                                )}
                                                                key={`${row}${col}`}>
                                                                {col}
                                                                {/* {seats[(idxrow * COLUMN.length) + idxcol].tye} */}
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        )
                                    } else {
                                        return (
                                            <div
                                                className='row-item'
                                                key={ROW[ROW.length - 1]}>
                                                <div
                                                    className='row'
                                                >{row}</div>
                                                {
                                                    COLUMN.length > 0 &&
                                                    COLUMN.map((col, idxcol) => {
                                                        if (idxcol < COLUMN.length / 2) {
                                                            const checkTicket = (tickets.filter((item, idx) => item.name === seats[((ROW.length - 1) * COLUMN.length) + idxcol].name)).length !== 0 ? true : false
                                                            return (
                                                                <div
                                                                    onClick={() => _choose(checkTicket, true, seats[((ROW.length - 1) * COLUMN.length) + idxcol])}
                                                                    className={classnames(
                                                                        'col-item couple',
                                                                        { 'pagin': col === 1 || col === (COLUMN.length / 2) - 1 },
                                                                        { 'selected': seatSelected.indexOf(seats[(idxrow * COLUMN.length) + idxcol]) !== -1 },
                                                                        { 'used': checkTicket }
                                                                    )}
                                                                    key={`${ROW[ROW.length - 1]}${col}`}>
                                                                    {col}
                                                                    {/* {seats[(idxrow * COLUMN.length) + idxcol].tye} */}
                                                                </div>
                                                            )
                                                        }
                                                    })
                                                }
                                            </div>
                                        )
                                    }
                                })
                            }
                        </div>
                    </div>
                    {/*note*/}
                    <div className='notes'>
                        {
                            NOTE.map(note => {
                                return (
                                    <div className='note-item'>
                                        <div className='bg' style={{ backgroundColor: note.color }}></div>
                                        <div className='type'>{note.type}</div>
                                        <div className='price'>{note.price !== '' ? `+ ${note.price}` : ''}</div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
                <div className='bill'>
                    <div className='bill-content'>
                        <div className='total'>
                            Tổng cộng: {total}K
                        </div>
                        <div className='bill-info'>
                            <div className='info-film'>
                                <div className='name'>{showtime && showtime.film.name}</div>
                                <div className=''>{showtime && showtime.film.price}K/vé</div>
                                <div className='address'>{showtime && `${showtime.room.theater.name} - ${showtime.room.theater.branch.name}`}</div>
                                <div className='date'>{showtime && `${showtime.film.openday} - ${showtime.start}~${showtime.end}`}</div>
                                <div className='room'>{showtime && showtime.room.name}</div>
                            </div>
                            <div className='info-seat'>
                                <div className='seat-title'>Ghế:</div>
                                <div className='seat' style={{ display: 'flex' }}>
                                    {
                                        seatSelected.length > 0 &&
                                        seatSelected.map(item => {
                                            return (
                                                <div key={item._id}>
                                                    {item.name},
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>

                            <div className='info-discount'>
                                <div className='discount-title'>
                                    Khuyến mãi:
                                </div>
                                <div>
                                    <input type='text' className='form-control' placeholder='Nhập khuyến mãi nếu có' />
                                </div>
                            </div>
                            <div className='info-checkout'>
                                <div className='checkout-title'>Hình thức thanh toán:</div>
                                <div className='checkout-item'>
                                    <input type='radio' name='typePayment' value='vnPay' onChange={_methodPayment} checked={typePayment === 'vnPay'} />
                                    <div className='checkout-name'>VNPay</div>
                                </div>

                                <div className='checkout-item'>
                                    <input type='radio' name='typePayment' value='cash' onChange={_methodPayment} checked={typePayment === 'cash'} />
                                    <div className='checkout-name'>Thanh toán tiền mặt</div>
                                </div>
                            </div>
                            <div className='control'>
                                <div className='control-checkout' onClick={() => _checkOut()}>Đặt vé</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <Modal isOpen={modalNotify} toggle={toggleNotify} >
                    <ModalBody>
                        <div className='notify-ticket'>
                            <div className='thong-bao'>Mua vé thành công!</div>
                            <div className='thong-'>Check mail hoặc <span onClick={() => _redirect('canhan')}>"Cá nhân</span> để xem thông tin </div>
                            <br />
                            <div className='tiep-tuc'>
                                Tiếp tục chọn phim
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
            </div>
        </div>
    );
}

export default PageCheckout;