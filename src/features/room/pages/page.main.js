import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import PropTypes from 'prop-types'
import { useHistory, useRouteMatch } from 'react-router-dom';

import Room from './../components/room'
// import { useDispatch } from 'react-redux';
// import callApi from 'api/apiCaller'
// import { removeRoom } from './../roomSlice'
PageMain.propType = {
    rooms: PropTypes.array
}
function PageMain(props) {
    const { rooms } = props
    const history = useHistory()
    const match = useRouteMatch()

    //redirect to form add
    const redicect = () => {
        history.push(`${match.url}/add`)
    }

    //const [rooms, setrooms] = useState(room_store)
    // const dispatch = useDispatch()
    // const [value, setValue] = useState('')
    // // change value
    // function onChange(e) {
    //     //console.log(e.target.value)
    //     const newValue = e.target.value
    //     setValue(newValue)
    // }
    // // submit new room
    // function onSubmit(e) {
    //     e.preventDefault()
    //     //console.log(value)
    //     if (value === '') return
    //     // call api -> recod{_id, .....}
    //     callApi('room', 'POST', { 'name': value })
    //         .then(res => {
    //             //console.log('res', res.data)
    //             // add to store { _id,...}
    //             dispatch(action.addRoom(res.data.room))
    //             //console.log(res.data.room)
    //         })
    //     setValue('')
    //     //console.log('store', room_store)		
    // }    
    return (
        <div className='page-main'>
            <div className='room_title'>
                <h2>Room</h2>
                <FontAwesomeIcon className='ic ic-black' icon="plus" onClick={redicect} />
            </div>
            <hr className='op-5' />

            <div className='room_list'>
                <div className='room_list--item row sticky'>
                    {/* <form onSubmit={onSubmit} >
                        <input
                            type='text'
                            className='add col-12 '
                            placeholder='Search by theater or branch...'

                            value={value}
                            onChange={onChange}
                        />
                    </form> */}
                </div>

                <div className='room_list--item col-12 row head'>
                    <div className='col-1'>#</div>
                    <div className='col-2'>Name</div>
                    <div className='col-2'>Capacity</div>
                    <div className='col-3'>Theater &nbsp; <FontAwesomeIcon className='ic-init' icon="sort" /></div>
                    <div className='col-3'>Branch &nbsp; <FontAwesomeIcon className='ic-init' icon="sort" /></div>
                    <div className='col-1'>Action</div>
                </div>

                {
                    rooms && rooms.map((room, index) => {
                        return <Room room={room} key={room._id} idx={index} />
                    })
                }
            </div>
        </div>
    );
}

export default PageMain;