import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './../components/css/seat.scss'
import classnames from 'classnames'

Seat.propTypes = {
    seats: PropTypes.array,
    tickets: PropTypes.array
};
const NOTE = [
    { type: 'default', price: 0, color: '#88A09E' },
    { type: 'normal', price: 5, color: '#2B3B3B' },
    { type: 'adtived', price: '', color: '#917C78' },
    { type: 'couple', price: 10, color: '#F6DB79' },
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

function Seat(props) {
    const { seats, tickets } = props
    const [COLUMN, setCOLUMN] = useState([])
    const [ROW, setROW] = useState([])
    useEffect(() => {
        const columns = []
        const rows = []
        if (seats && seats.length > 0) {
            for (let i = 1; i <= seats[seats.length - 1].column; i++) {
                columns.push(i)
            }
            const start = 65;
            const end = convert(0, seats[seats.length - 1].row)
            for (let i = start; i <= end; i++) {
                rows.push(convert(1, i))
            }
        }
        if (columns.length > 0 && rows.length > 0) {
            setROW(rows)
            setCOLUMN(columns)
        }
    }, [seats])
    return (
        <div className='seats'>
            <div className='index-column'>
                {
                    COLUMN.map(col => {
                        return (
                            <div key={col}
                                className={col === 2 || col == COLUMN.length - 2 ? 'col-item pagin' : 'col-item'}
                            >
                                {col}
                            </div>
                        )
                    })
                }

            </div>
            <div className='rows'>
                {
                    seats.length > 0 &&
                    ROW.map((row, idxrow) => {
                        return (
                            <div className='per-row'>
                                <div className='row-item'>
                                    <div className='index-row row'>{row}</div>
                                </div>
                                {
                                    COLUMN.map((column, idxcol) => {
                                        if (ROW[ROW.length - 1] !== row) {
                                            const checkTicket = (tickets.filter((item, idx) => item.name === seats[(idxcol) + ((COLUMN.length) * idxrow)].name)).length !== 0 ? true : false
                                            return (
                                                seats[(idxcol) + ((COLUMN.length) * idxrow)] &&
                                                <div
                                                    style={{
                                                        backgroundColor: checkTicket ? '#B79FAD' : seats[(idxcol) + ((COLUMN.length) * idxrow)].type === 'default' ?
                                                            '#88A09E' : seats[(idxcol) + ((COLUMN.length) * idxrow)].type === 'normal' ? '#2B3B3B' : '#F6DB79'
                                                    }}
                                                    className={classnames(
                                                        'seat',
                                                        { 'pagin': (idxcol === 1 || idxcol == COLUMN.length - 3) },
                                                        { 'used': checkTicket }
                                                    )}
                                                    key={seats[(idxcol) + ((COLUMN.length) * idxrow)]._id}>
                                                    {/* {(idxcol) + ((COLUMN.length) * idxrow)} */}
                                                    {/* {seats[(idxcol) + ((COLUMN.length) * idxrow)].name} */}
                                                </div>
                                            )
                                        }
                                        else {
                                            const checkTicket = (tickets.filter((item, idx) => item.name === seats[(idxcol) + ((COLUMN.length) * idxrow)].name)).length !== 0 ? true : false
                                            return (
                                                ((seats[(idxcol) + ((COLUMN.length) * idxrow)]) && ((idxcol) + ((COLUMN.length) * idxrow)) < (seats.length - COLUMN.length / 2)) &&
                                                <div className={idxcol === 0 || idxcol === COLUMN.length - COLUMN.length / 2 - 2 ? 'seat seat-couple pagin' : 'seat seat-couple'}
                                                    key={seats[(idxcol) + (COLUMN.length * idxrow)]._id}
                                                    style={{ backgroundColor: checkTicket ? '#B79FAD' : '' }}
                                                >
                                                    {/* {(idxcol) + ((COLUMN.length) * idxrow)} */}
                                                    {/* {seats[(idxcol) + ((COLUMN.length) * idxrow)].name} */}
                                                </div>

                                                // (seats[((idxcol) + (12 * idxrow))]) &&
                                            )
                                        }
                                    })
                                }
                            </div>
                        )
                    })
                }
                <br />
                <hr />
                <div className='notes'>
                    <div className='note-detail'>
                        {
                            NOTE.map(note => {
                                return (
                                    <div className='note-item'>
                                        <div className='type type-selected'
                                            style={{ backgroundColor: note.color }}
                                        ></div>
                                        <div className='name'>{note.type}</div>
                                        <div>+ <i>{note.price}</i></div>
                                    </div>
                                )
                            })
                        }
                    </div>

                </div>
                {/*icon them row*/}
                {/* <div className='per-row'>
                        {checkEdit && <FontAwesomeIcon className='ic row-item-add' icon="plus" onClick={() => _add('row')} />}
                    </div> */}
                {/*icon them row*/}
            </div >
        </div >
    );
}

export default Seat;