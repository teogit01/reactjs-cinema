import React, { useState, useEffect } from 'react';
//import './../seat.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PropTypes from 'prop-types';

import SeatDetail from './seat-detail'
import callApi from 'api/apiCaller';

PageDetail.propTypes = {
    list_seat: PropTypes.array,
    ROW: PropTypes.array,
    COLUMN: PropTypes.array
};

const EXPLAIN = [
    { color: '#C8CCB8', name: 'Default', type: 'default', price: '45' },
    { color: '#6D72C3', name: 'Normal', type: 'normal', price: '65' },
    { color: '#FCB97D', name: 'Vip', type: 'vip', price: '80' },
    { color: '#0C8346', name: 'Actived', type: 'actived', price: '0' },
    { color: '#EAEAEA', name: 'Damaged', type: 'damaged', price: '0' },
]
//row {row:'A', type='default', seat:array, }

function PageDetail(props) {
    //  handle of left ------------------------------------------
    const { ROW, list_seat, showtime } = props
    //console.log(showtime)
    const count = list_seat.filter(x => x.row === 'A')

    const [seatPerRow, setSeatPerRow] = useState(count.length)
    const seatInit = []
    for (let i = 1; i <= count.length; i++) {
        seatInit.push(i)
    }

    const [columnIndex, setColumnIndex] = useState([{ row: '', seats: seatInit }])
    const initRow = (list_seat) => {
        let data = []
        ROW.map(row => {
            let seats = []
            let type = ''
            list_seat.map(seat => {
                if (row === seat.row) {
                    seats.push({ _id: seat._id, name: seat.name, isDamaged: !seat.status, isSelected: false })
                    type = seat.type
                }
            })
            data.push({ row: row, type: type, seats: seats })
        })
        const result = data.filter(item => item.seats.length > 0)
        return result
    }

    const [row, setRow] = useState(initRow(list_seat))


    // function set price seat (end) ----------------------------

    const [room, setRoom] = useState('')
    useEffect(() => {
        callApi(`room/detail/${showtime.room}`).then((res) => {
            setRoom(res.data)
        })
    }, [])

    const selectSeat = (seat) => {
        console.log('seat')
        const rowSeat = seat.name.slice(0, 1)
        const idx = row.findIndex(r => {
            return r.row === rowSeat
        })
        const seats = row[idx].seats
        const idxseat = seats.indexOf(seat)
        let newSeat = [...seats.slice(0, idxseat), { ...seats[idxseat], isSelected: !seats[idxseat].isSelected }, ...seats.slice(idxseat + 1, seats.length)]
        const newRow = [...row.slice(0, idx), { ...row[idx], seats: newSeat }, ...row.slice(idx + 1, row.length)]
        setRow(newRow)
        //let
    }
    return (
        <div className='wrap-page-seat-showtime'>
            <div className='page-main'>

                <hr className='op-5' />
                <div className='page-main__content'>
                    {/* left */}
                    <div className='page-main__content--left'>
                        <div className='screen'>
                            <div className='name'><h5>Screen</h5></div>
                            <div className='item'></div>
                        </div>

                        <br />
                        <div className='list-seat'>

                            {
                                row && row.map(item => {
                                    return (
                                        <div className='per-row' key={item.row}>
                                            <div className='ROW'>{item.row}</div>
                                            {
                                                item.seats.map((seat, index) => {

                                                    return (
                                                        <div key={index} onClick={() => selectSeat(seat)}>
                                                            <SeatDetail
                                                                name={seat.name}
                                                                isDamaged={seat.isDamaged}
                                                                isSelected={seat.isSelected}
                                                                type={item.type}
                                                                index={index}
                                                                length={seatPerRow}
                                                            />
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    )
                                })
                            }

                            {
                                columnIndex.map(item => {
                                    return (
                                        <div className='per-row' key={item.row}>
                                            <div className='hide'>
                                                <input type='checkbox' value={item.row} name='row' />
                                            </div>
                                            <div className='ROW'>{item.row}</div>
                                            {
                                                item.seats.map((seat, index) => {
                                                    return (
                                                        <div
                                                            key={index}
                                                            className={(index + 1 === 2) || (index + 1 === seatPerRow - 2) ? 'index-column mr-20' : 'index-column '
                                                            }>{seat}</div>
                                                    )
                                                })
                                            }
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>

                    {/*right */}
                    <div className='page-main__content--right'>
                        <div className='explain'>
                            {
                                EXPLAIN.map((item, index) => {
                                    return (
                                        <div key={index} className='explain--item'>
                                            <div
                                                className='color-set-type color'
                                                style={{ backgroundColor: item.color }}
                                            ></div>
                                            <div className='name'>{item.price > 0 ? `${item.price}K` : ''}</div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </div >
        </div>
    );
}

export default PageDetail; 