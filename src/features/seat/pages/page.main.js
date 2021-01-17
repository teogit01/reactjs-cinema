import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PropTypes from 'prop-types';

import Switch from '@material-ui/core/Switch';

import Select from 'react-select'
import Seat from './../components/seat'
import callApi from 'api/apiCaller';
import { useRouteMatch } from 'react-router-dom';

PageMain.propTypes = {
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

function PageMain(props) {
    //  handle of left ------------------------------------------
    const { ROW, list_seat } = props
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

    const [isCheckAddSeat, setIsCheckAddSeat] = useState(false)
    const handleChangeAddSeat = () => {
        setIsCheckAddSeat(!isCheckAddSeat)
    }
    // create row
    const [rowAdd, setRowAdd] = useState([])
    const handleCreateRow = () => {
        const index = row.length
        const key = ROW[index]
        let seats = []
        let seatIndex = []
        for (let i = 1; i <= seatPerRow; i++) {
            seats.push({ name: `${key}${i}`, isDamaged: false })
            seatIndex.push(i)
        }
        //console.log(seats)
        const newValue = [...row, { row: key, type: 'default', seats: seats }]
        const newValueIndex = [{ row: '', seats: seatIndex }]
        setRow(newValue)
        setColumnIndex(newValueIndex)
        setRowAdd([...rowAdd, { row: key, type: 'default', seats: seats, length: seats.length }])
        //newValue.push({ row: '_', seats: seats })
    }

    const [columnAdd, setColumnAdd] = useState([])
    const handleCreateColumn = () => {
        setSeatPerRow(seatPerRow + 2)
        let newRow = []
        let newColumnAdd = [...columnAdd]
        row.map((item, idx) => {
            let newSeats = []
            newSeats = [...item.seats]
            newSeats.push({ name: `${item.row}${seatPerRow + 1}`, isDamaged: false }, { name: `${item.row}${seatPerRow + 2}`, isDamaged: false })
            newColumnAdd.push({ row: item.row, column: seatPerRow + 1, type: item.type, name: `${item.row}${seatPerRow + 1}`, isDamaged: false }, {
                row: item.row, column: seatPerRow + 2, type: item.type, name: `${item.row}${seatPerRow + 2}`, isDamaged: false
            })
            return newRow.push({ ...item, seats: newSeats })
        })
        setColumnAdd(newColumnAdd)
        let newSeatIndex = [...columnIndex]
        newSeatIndex[0].seats.push(seatPerRow + 1, seatPerRow + 2)
        const newValueIndex = [{ row: '', seats: newSeatIndex[0].seats }]
        setRow(newRow)
        setColumnIndex(newValueIndex)

        // push column row add
        let newRowAdd = []
        rowAdd && rowAdd.map(item => {
            let newSeats = []
            newSeats = [...item.seats]
            newSeats.push({ name: `${item.row}${seatPerRow + 1}`, isDamaged: false }, { name: `${item.row}${seatPerRow + 2}`, isDamaged: false })
            return newRowAdd.push({ ...item, seats: newSeats })
        })
        setRowAdd(newRowAdd)
    }
    //  handle of right ------------------------------------------
    // function set type seat (start) ----------------------------
    const [isCheckFucType, setIsCheckFucType] = useState(false)// type if true then set type (color) for seat
    const [type, setType] = useState('default')
    const handleChangeSetType = () => {
        setIsCheckFucType(!isCheckFucType)
    }
    const handleSelectType = (item) => {
        setType(item.type)// render
    }
    //const [rowType, setRowType] = useState([])// list row will set type

    // set row edit type of seat
    const [rowWillUpdate, setRowWillUpdate] = useState([])
    const handleSelectRow = (e, item) => {
        //console.log(e.target.checked)
        const idx = row.indexOf(item)
        if (e.target.checked) {
            let rowUpdate = { ...row[idx], type: type }
            let newRow = [...row.slice(0, idx), rowUpdate, ...row.slice(idx + 1, row.length)]
            setRow(newRow)
            setRowWillUpdate([...rowWillUpdate, rowUpdate])
        } else {
            let rowUpdate = { ...row[idx], type: 'default' }
            let newRow = [...row.slice(0, idx), rowUpdate, ...row.slice(idx + 1, row.length)]
            setRow(newRow)// render
        }
    }
    //set per seat damaged
    const [seatDamaged, setSeatDamaged] = useState([])
    const handleSetSeatDamged = (row_item, idx_seat) => {
        const idx_row = row.indexOf(row_item) // get index of item onclick in state row[]
        let newSeats = row[idx_row].seats // set new seats of row[idx_row]
        newSeats[idx_seat].isDamaged = !newSeats[idx_seat].isDamaged
        //console.log(newSeats)   
        let rowUpdate = { ...row[idx_row], seats: newSeats }
        let newRow = [...row.slice(0, idx_row), rowUpdate, ...row.slice(idx_row + 1, row.length)]
        setRow(newRow)// render

        let oldSeatDamaged = [...seatDamaged]
        let check = -1
        let position = -1
        oldSeatDamaged.map((item, idx) => {
            if (item.row === row_item.row) {
                if (item.column === idx_seat + 1) {
                    check = 1
                    position = idx
                }
            }
        })
        let newSeatDamaged = []
        if (check !== -1) {
            newSeatDamaged = oldSeatDamaged.filter(x => x != oldSeatDamaged[position])
        } else {
            newSeatDamaged = [...seatDamaged, { row: row_item.row, column: idx_seat + 1 }]
        }
        setSeatDamaged(newSeatDamaged)
    }

    // function set type seat (end) ----------------------------
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

    // on save
    const match = useRouteMatch()
    const handleSave = () => {
        const _idroom = match.params._id
        const data = {
            rowAdd: rowAdd,
            columnAdd: columnAdd,
            rowWillUpdate: rowWillUpdate,
            seatDamaged: seatDamaged
        }
        console.log(data)
        callApi(`seat/edit/room/${_idroom}`, 'POST', data).then(() => {
            setIsCheckFucType(isCheckFucType ? false : isCheckFucType)
            setIsCheckAddSeat(isCheckAddSeat ? false : isCheckAddSeat)
            setIsCheckFucPrice(isCheckFucPrice ? false : isCheckFucPrice)
            setRowWillUpdate([])
            setSeatDamaged([])
            setRowAdd([])
            setColumnAdd([])
        })
    }
    return (
        <div className='page-main'>
            <div className='title '>
                <h2>Seat</h2>
                {/* <div className='select-room'>
                    <Select
                        defaultValue={rooms[0]}
                        options={rooms}
                        //styles={customStyles}
                        theme={theme => ({
                            ...theme,
                            colors: {
                                ...theme.colors,
                                primary: '#8DA8B9',
                            },
                        })}
                    />
                </div> */}
                {/* <FontAwesomeIcon className='ic ic-black' icon="plus" /> */}
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
                        <div className='add-column'>
                            {
                                isCheckAddSeat ? <FontAwesomeIcon className='ic-init column' icon="plus" onClick={handleCreateColumn} /> : <FontAwesomeIcon className='ic-init column' icon="plus" style={{ visibility: 'hidden' }} />
                            }
                        </div>

                        {
                            row && row.map(item => {
                                return (
                                    <div className='per-row' key={item.row}>
                                        <div className={isCheckFucType ? 'show select-type-seat' : 'hide select-type-seat'}>
                                            <input type='checkbox' name='hello' value={item.row} onChange={(e) => handleSelectRow(e, item)} />
                                        </div>
                                        <div className='ROW'>{item.row}</div>
                                        {
                                            item.seats.map((seat, index) => {

                                                return (
                                                    <div key={index} onClick={isCheckFucType && type === 'damaged' ? () => handleSetSeatDamged(item, index) : null}>
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
                                            <input type='checkbox' value={item.row} name='row' onChange={handleSelectRow} />
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
                        {
                            isCheckAddSeat ? <FontAwesomeIcon className='ic-init' icon="plus" onClick={handleCreateRow} /> : ''
                        }
                        {
                            isCheckFucType || isCheckAddSeat ? <div className='btn' style={{ textAlign: 'right' }} onClick={handleSave} >Save</div> : ''
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
                                            className={(isCheckFucType === true && type === item.type) ? 'color-set-type selected' : isCheckFucType ? 'color-set-type' : 'color'}
                                            style={{ backgroundColor: item.color }}
                                            onClick={isCheckFucType ? () => handleSelectType(item) : null}
                                        ></div>
                                        <div className='name' >{item.name}</div>
                                        {/* <div className='price'>{item.price !== '0   ' ? item.price : ''}</div> */}
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
                                Fuc 'Add Seat'&nbsp;:
                                <Switch
                                    checked={isCheckAddSeat}
                                    onChange={handleChangeAddSeat}
                                    color="primary"
                                // name="checkedB"
                                // inputProps={{ 'aria-label': 'primary checkbox' }}
                                />
                            </div>
                            <div>
                                Set 'Type Seat':
                                <Switch
                                    // checked={state.checkedB}
                                    checked={isCheckFucType}
                                    onChange={handleChangeSetType}
                                    color="primary"
                                // name="checkedB"
                                // inputProps={{ 'aria-label': 'primary checkbox' }}
                                />
                            </div>
                            <div>
                                Set 'Pice Seat':
                                <Switch
                                    // checked={state.checkedB}
                                    onChange={handleChangeSetPrice}
                                    color="primary"
                                // name="checkedB"
                                // inputProps={{ 'aria-label': 'primary checkbox' }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default PageMain; 