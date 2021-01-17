import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import callApi from 'api/apiCaller'
import './css/room.scss'
import Seat from './seat'

Room.propTypes = {
    room: PropTypes.object,
    checkEdit: PropTypes.bool,
    checkEditSeat: PropTypes.bool,
    checkAddSeat: PropTypes.bool,
    typeSelected: PropTypes.string,
    resetTypeSelected: PropTypes.func
};

function Room(props) {
    const { room, checkEdit, checkEditSeat, typeSelected, resetTypeSelected, checkAddSeat } = props
    const [theater, setTheater] = useState('')
    const [seats, setSeats] = useState([])
    useEffect(() => {
        if (room) {
            callApi(`theater/detail/${room.theater}`).then(res => {
                if (res.data) {
                    setTheater(res.data)
                }
            })
            callApi(`seat/room/${room._id}`).then(res => {
                if (res.data) {
                    setSeats(res.data.seats)
                }
            })
        }
    }, [room])

    return (
        <div className='room'>
            <div className='title'>{room.name} - {theater && theater.name}</div>
            <div className='screen'>Screen</div>
            <div className='room-seats'>
                <Seat
                    seats={seats}
                    checkEdit={checkEdit}
                    checkEditSeat={checkEditSeat}
                    typeSelected={typeSelected}
                    checkAddSeat={checkAddSeat}
                    resetTypeSelected={() => resetTypeSelected()}
                />
            </div>
        </div>
    );
}

export default Room;