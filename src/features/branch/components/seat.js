import React, { useState, useEffect } from 'react';
import './css/seat.scss'
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import callApi from 'api/apiCaller';

Seat.propTypes = {
    seats: PropTypes.array,
    checkEdit: PropTypes.bool,
    checkEditSeat: PropTypes.bool,
    typeSelected: PropTypes.string,
    checkAddSeat: PropTypes.bool,
    resetTypeSelected: PropTypes.func
};

const CONST_COLUMN = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
const CONST_ROW = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']

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
    const { seats, checkEdit, checkEditSeat, typeSelected, resetTypeSelected, checkAddSeat } = props
    const [ROW, setROW] = useState(CONST_ROW)
    const [COLUMN, setCOLUMN] = useState(CONST_COLUMN)
    const [seatRender, setSeatRender] = useState([])
    const [seatMax, setSeatMax] = useState('')
    const [rowadd, setRowadd] = useState([])
    const [coladd, setColadd] = useState([])

    useEffect(() => {
        if (seats) {
            setSeatRender(seats)
            setSeatMax(seats[seats.length - 1])
        }
    }, [seats])
    useEffect(() => {
        const columns = []
        const rows = []
        if (seatMax) {
            for (let i = 1; i <= seatMax.column; i++) {
                columns.push(i)
            }
            const start = 65;
            const end = convert(0, seatMax.row)
            for (let i = start; i <= end; i++) {
                rows.push(convert(1, i))
            }
        }
        if (columns.length > 0 && rows.length > 0) {
            setROW(rows)
            setCOLUMN(columns)
        }
    }, [seatMax])

    const [COLUMN_ORIGIN, setCOLUMN_ORIGIN] = useState(COLUMN.length)
    // console.log(seats)
    //console.log('ex', 'B'.charCodeAt(0))
    //console.log('ex', String.fromCharCode(65))    
    const _add = (type) => {
        setRowChoose([])
        if (type === 'row') {
            const lastRow = ROW[ROW.length - 1]
            const newRow = convert(1, convert(0, lastRow) + 1)
            const rowUpdate = [...ROW, newRow]
            setROW(rowUpdate)
            // update new seat 
            const seatAdds = []

            COLUMN.map(col => {
                seatAdds.push({
                    name: `${newRow}${col}`,
                    column: col,
                    row: newRow,
                    type: seatRender[seatRender.length - COLUMN.length - 1].type
                })
            })
            const newSeats = seatRender.concat(seatAdds)
            setSeatRender(newSeats)

            setRowadd([...rowadd, convert(1, convert(0, lastRow) + 1)])
        }

        // col
        if (type === 'col') {
            const seatAdds = []
            ROW.map((row, idx) => {
                seatAdds.push({
                    name: `${row}${COLUMN.length + 1}`,
                    row: row,
                    column: COLUMN.length + 1,
                    type: seatRender[idx * COLUMN.length].type
                }, {
                    name: `${row}${COLUMN.length + 2}`,
                    row: row,
                    column: COLUMN.length + 2,
                    type: seatRender[idx * COLUMN.length].type
                }
                )
            })

            //let newSeats = seatRender
            const arr = []
            let count = 0
            seatRender.map(seat => {
                if (seat.row === seatAdds[count].row && seat.column === COLUMN.length) {
                    arr.push(seat, seatAdds[count], seatAdds[count + 1])
                    count = count + 2
                } else {
                    arr.push(seat)
                }
            })
            setSeatRender(arr)
            setCOLUMN([...COLUMN, COLUMN.length + 1, COLUMN.length + 2])

            setColadd([...coladd, COLUMN.length + 1, COLUMN.length + 2])
        }
    }

    // _click
    const [rowChoose, setRowChoose] = useState('')
    const _click = (type, value) => {
        if (checkEditSeat) {
            if (type === 'row') {
                if (rowChoose.indexOf(value) === -1) {
                    setRowChoose([...rowChoose, value])
                } else {
                    setRowChoose([...rowChoose.slice(0, rowChoose.indexOf(value)), ...rowChoose.slice(rowChoose.indexOf(value) + 1, rowChoose.length)])
                }
            }
        }
    }
    // useEffect(() => {
    //     setRowChoose([])
    // }, [checkEditSeat, typeSelected])

    const [DRow, setDRow] = useState([])
    const [DType, SetDType] = useState('')
    useEffect(() => {
        if (rowChoose.length > 0 && typeSelected) {
            // data submit
            setDRow(rowChoose)
            SetDType(typeSelected)
            const newSeats = []
            seatRender.map(seat => {
                if (rowChoose.indexOf(seat.row) === -1) {
                    // khong cos thi giu bguyen
                    newSeats.push(seat)
                } else {
                    //console.log({ ...seat, type: typeSelected })
                    newSeats.push({ ...seat, type: typeSelected })
                    //newSeats.push(seat)
                }
            })
            //console.log(newSeats)
            setSeatRender(newSeats)
        }
        //console.log(rowChoose)
        setRowChoose([])
        resetTypeSelected()
    }, [typeSelected])

    // end _click
    //console.log(rowChoose, typeSelected)
    const _onSave = () => {
        const data = {
            _add: {
                row: rowadd,
                col: coladd
            },
            _type: {
                type: DType,
                row: DRow
            },
            _idroom: seats[0].room
        }
        console.log('data', data)
        callApi('seat/edit', 'POST', data)
    }
    return (
        <div className='seats'>
            {
                checkEditSeat && <div className='button-save' onClick={() => _onSave()}>Save</div>
            }
            <div className='seat-wrap'>
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
                    {/*icon them column*/}
                    <div className='col-item'>
                        {/* {checkAddSeat && <FontAwesomeIcon className='ic' icon="plus" onClick={() => _add('col')} />} */}
                        {checkEditSeat && <FontAwesomeIcon className='ic' icon="plus" onClick={() => _add('col')} />}
                    </div>
                    {/*icon them column*/}
                </div>
                <div className='rows'>
                    {
                        seatRender.length > 0 &&
                        ROW.map((row, idxrow) => {
                            return (
                                <div className='per-row'>
                                    <div className='row-item row-add'>
                                        {
                                            // (ROW.length - 1 === idxrow && checkAddSeat) &&
                                            (ROW.length - 1 === idxrow && checkEditSeat) &&
                                            <div className='row-add-item'>
                                                <FontAwesomeIcon className='ic' icon="plus" onClick={() => _add('row')} />
                                            </div>
                                        }
                                    </div>
                                    <div className={checkEditSeat ? 'row-item set-type-seat' : 'row-item'}
                                        onClick={() => _click('row', row)}
                                    >
                                        <div className={rowChoose.indexOf(row) !== -1 ? 'row-item index-row' : ''}>{row}</div>
                                    </div>
                                    {
                                        COLUMN.map((column, idxcol) => {
                                            if (ROW[ROW.length - 1] !== row)
                                                return (
                                                    seatRender[(idxcol) + ((COLUMN.length) * idxrow)] &&
                                                    <div
                                                        style={{
                                                            backgroundColor: seatRender[(idxcol) + ((COLUMN.length) * idxrow)].type === 'default' ?
                                                                '#88A09E' : seatRender[(idxcol) + ((COLUMN.length) * idxrow)].type === 'normal' ? '#2B3B3B' : '#F6DB79'
                                                        }}
                                                        className={idxcol === 1 || idxcol == COLUMN.length - 3 ? 'seat pagin' : 'seat'}
                                                        key={seatRender[(idxcol) + ((COLUMN.length) * idxrow)]._id}>
                                                        {/* {(idxcol) + ((COLUMN.length) * idxrow)} */}
                                                        {/* {seatRender[(idxcol) + ((COLUMN.length) * idxrow)].name} */}
                                                    </div>
                                                )
                                            else
                                                return (
                                                    ((seatRender[(idxcol) + ((COLUMN.length) * idxrow)]) && ((idxcol) + ((COLUMN.length) * idxrow)) < (seatRender.length - COLUMN.length / 2)) &&
                                                    <div className={idxcol === 0 || idxcol === COLUMN.length - COLUMN.length / 2 - 2 ? 'seat seat-couple pagin' : 'seat seat-couple'}
                                                        key={seatRender[(idxcol) + (COLUMN.length * idxrow)]._id}>
                                                        {/* {(idxcol) + ((COLUMN.length) * idxrow)} */}
                                                        {/* {seatRender[(idxcol) + ((COLUMN.length) * idxrow)].name} */}
                                                    </div>

                                                    // (seats[((idxcol) + (12 * idxrow))]) &&
                                                )

                                        })
                                    }
                                </div>
                            )
                        })
                    }
                    {/*icon them row*/}
                    {/* <div className='per-row'>
                        {checkEdit && <FontAwesomeIcon className='ic row-item-add' icon="plus" onClick={() => _add('row')} />}
                    </div> */}
                    {/*icon them row*/}
                </div>
            </div>
        </div >
    );
}

export default Seat;