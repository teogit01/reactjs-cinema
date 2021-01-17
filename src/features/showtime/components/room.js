import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Seat from './seat'
import './../components/css/room.scss'
import callApi from 'api/apiCaller';

Room.propTypes = {
    room: PropTypes.object,
    tickets: PropTypes.array
};

function Room(props) {
    const { room, tickets } = props
    const [seats, setSeats] = useState([])
    useEffect(() => {
        if (room) {
            callApi(`seat/room/${room._id}`).then(res => {
                if (res.data.seats) {
                    setSeats(res.data.seats)
                }
            })
        }
    }, [room])
    //console.log('tick', tickets)
    return (
        <div className='room'>
            {/* <div className='title'>{room.name} - {theater && theater.name}</div> */}
            <div className='screen'>Screen</div>
            <div className='room-seats'>
                <Seat seats={seats} tickets={tickets} />
            </div>
        </div>
    );
}

export default Room;