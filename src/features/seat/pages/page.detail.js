import React, { useState, useEffect } from 'react';
import './../seat.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PropTypes from 'prop-types';

import Switch from '@material-ui/core/Switch';

import Seat from './../components/seat'
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
                    seats.push({ _id: seat._id, name: seat.name, isDamaged: !seat.status })
                    type = seat.type
                }
            })
            data.push({ row: row, type: type, seats: seats })
        })
        const result = data.filter(item => item.seats.length > 0)
        return result
    }

    const [row, setRow] = useState(initRow(list_seat))

    // function set price seat (start) ----------------------------
    const [explain, setExplain] = useState(EXPLAIN)
    const [isCheckFucPrice, setIsCheckFucPrice] = useState(false)
    const [price, setPrice] = useState('')
    const handleChangeSetPrice = () => {
        setIsCheckFucPrice(!isCheckFucPrice)
    }
    // function set EXPLAIN
    const handleChangePrice = (e, price_item) => {
        setPrice(price + e.target.value)
        let newPrice = price + e.target.value
        const idx = explain.indexOf(price_item)
        let newExplain = explain
        newExplain[idx].price = newPrice
        setExplain(newExplain)
        // //console.log(explain[idx].price)
    }
    //reset price
    const resetPrice = () => {
        setPrice('')
    }
    // function set price seat (end) ----------------------------
    //console.log(row)
    const [room, setRoom] = useState('')
    useEffect(() => {
        callApi(`room/detail/${showtime.room}`).then((res) => {
            setRoom(res.data)
        })
    }, [])

    return (
        <div className='wrap-page-seat-showtime'>
            <div className='page-main'>
                <div className='title '>
                    <h2>Seat Detail {room && room.name}</h2>
                </div>
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
                                                        <div key={index}>
                                                            < Seat
                                                                name={seat.name}
                                                                isDamaged={seat.isDamaged}
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
                                                        <div key={index} className={(index + 1 === 2) || (index + 1 === seatPerRow - 2) ? 'index-column mr-20' : 'index-column '
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
                                explain.map((item, index) => {
                                    return (
                                        <div key={index} className='explain--item'>
                                            <div
                                                className='color-set-type color'
                                                style={{ backgroundColor: item.color }}
                                            ></div>
                                            <div className='name' >{item.name}</div>

                                            <input type='text'
                                                className={isCheckFucPrice ? 'price showInput' : 'price'}
                                                disabled={!isCheckFucPrice}
                                                placeholder={item.price !== '0' ? `${item.price}k` : ''}
                                                value={isCheckFucPrice ? item.price !== '0' ? '' : '' : ''}
                                                onChange={(e) => handleChangePrice(e, item)}
                                                onClick={resetPrice} />
                                        </div>
                                    )
                                })
                            }
                            <hr />
                            {/* set type seat */}
                            <div className='function'>
                                <label>Function</label>
                                <div>
                                    Set 'Pice Seat':
                                <Switch
                                        onChange={handleChangeSetPrice}
                                        color="primary"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </div>
    );
}

export default PageDetail; 