import React, { useEffect, useState } from 'react';

import callApi from 'api/apiCaller'
import PropTypes from 'prop-types';
import Seat from 'features/seat/pages/page.detail'
import { ROW, COLUMN } from 'features/seat/list-seat'

SeatOfRoom.propTypes = {
    showtime: PropTypes.object
};

function SeatOfRoom(props) {
    const { showtime } = props
    const _idroom = showtime.room

    // useEffect(() => {

    // }, [])
    const [seats, setSeats] = useState([])
    useEffect(() => {
        const LoadSeat = async () => {
            let data = await callApi(`seat/room/${_idroom}`)
            setSeats(data.data)
        }
        LoadSeat()
    }, [])
    return (
        <div className='seats' >
            {
                seats.length > 0 ? <Seat list_seat={seats} ROW={ROW} COLUMN={COLUMN} showtime={showtime} /> : ''
            }

        </div>
    );
}

export default SeatOfRoom;