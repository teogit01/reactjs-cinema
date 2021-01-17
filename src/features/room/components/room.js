import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import callApi from 'api/apiCaller'

import PropTypes from 'prop-types'
Room.propTypes = {
    room: PropTypes.object,
    idx: PropTypes.number
}
function Room(props) {
    const { room, idx } = props

    // Del room
    function onDel(room) {
        // call api remove room        

        callApi(`room/${room._id}`, 'DELETE', null)
            .then(res => {
                //console.log('res', res.data._id)
                // remove in store { _id,...}
                //dispatch(removeRoom(res.data._id))
                //console.log(res.data.room)
            })
    }
    return (
        <div key={room.code} className='room_list--item col-12 row'>
            <div className='col-1'>{idx + 1}</div>
            <div className='col-2'>{room.name}</div>
            <div className='col-2'>50</div>
            <div className='col-3'>{room.theater.name ? room.theater.name : ''}</div>
            <div className='col-3'>{room.theater.branch.name ? room.theater.branch.name : ''}</div>
            <div className='col-1'>
                <FontAwesomeIcon className='ic-init' icon="eye" />
                &nbsp;
                <FontAwesomeIcon className='ic-init' icon="eraser" onClick={() => onDel(room)} />
            </div>
        </div>
    );
}

export default Room;