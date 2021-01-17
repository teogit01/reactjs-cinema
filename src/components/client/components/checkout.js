import React, { useEffect, useState } from 'react';
import './../components/css/checkout.scss'
// import Seat from './seat'
import PropTypes from 'prop-types';
//import Seat from './seat'

import { useRouteMatch } from 'react-router-dom';
import callApi from 'api/apiCaller';
//import Seat from 'features/seat/pages/page.detail'
import Seat from './seat'
import { ROW, COLUMN } from 'features/seat/list-seat'

// CheckOut.propTypes = {

// };

function CheckOut(props) {
    const match = useRouteMatch()
    const { _idshowtime } = match.params

    const [showtime, setShowtime] = useState('')
    useEffect(() => {
        const LOAD_SHOWTIME = async () => {
            let data = await callApi(`showtime/detail/${_idshowtime}`)
            setShowtime(data.data)
        }
        LOAD_SHOWTIME()
    }, [])
    const [seats, setSeats] = useState([])
    const [theater, setTheater] = useState('')
    useEffect(() => {
        const LoadSeat = async () => {
            let data = await callApi(`seat/room/${showtime.room}`)
            setSeats(data.data)
        }
        const LoadTheater = async () => {
            let data = await callApi(`theater/room/${showtime.room}`)
            setTheater(data.data)
            //console.log('daya', data.data)
        }
        if (showtime != '') {
            LoadSeat()
            LoadTheater()
        }
    }, [showtime])
    // console.log('room', room)
    //console.log('setTheater', theater)
    return (
        <div className='checkout'>
            <div className='showtime'>
                <div className='head'></div>
                <div className='seat'>
                    <div>
                        <div>
                            {
                                theater != '' &&
                                theater.name
                            }
                        </div>
                        <div>time</div>
                    </div>
                    <div>
                        screen
                    </div>
                    <div className='seat-item'>
                        {
                            seats.length > 0 ? <Seat list_seat={seats} ROW={ROW} COLUMN={COLUMN} showtime={showtime} /> : ''
                        }
                    </div>
                </div>
            </div>
            <div className='pay'>
                <div className='pay-infor'>
                    <div className='total'>0d</div>
                    <div className='tab-2'>
                        <div className='h'>
                            <div className='c'>C18</div>
                            <div>Trai tim quai vat</div>
                        </div>
                        <div className='r'>
                            24/11/2020 - 19:00 Rap 1
                        </div>
                    </div>
                    <div className='tab-3'>
                        <div className='g'>Ghế</div>
                        <div className='ghe-chi-tiet'></div>
                        <div className='price'>0d</div>
                    </div>

                    <div className='tab-4'>
                        <div className='nhap-ma'>
                            <input type='text' placeholder='Nhập mã giảm giá' />
                        </div>
                        <div className='price'>0d</div>
                    </div>
                    <div className=' btn-secondary ap-dung'>Áp dụng</div>
                </div>
                <div className='dat-ve'>
                    Đặt vé
                </div>
            </div>
        </div>
    );
}

export default CheckOut;