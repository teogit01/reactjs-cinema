import React, { useEffect } from 'react';
import './room.scss'
import PageMain from './pages/page.main';
import PageAdd from './pages/page.add';
import PageDetail from './pages/page.detail'
import { Switch, Route, useRouteMatch } from 'react-router-dom'

//import { loadTheater } from 'features/theater/theaterSlice'
import { loadBranch } from 'features/branch/branchSlice'
import { loadRoom } from 'features/room/roomSlice'
import callApi from 'api/apiCaller'

import { useSelector, useDispatch } from 'react-redux'
function RoomIndex() {
    const match = useRouteMatch()
    //const theater_store = useSelector(state => state.theaters)
    const branch_store = useSelector(state => state.branchs)
    const room_store = useSelector(state => state.rooms)
    const dispatch = useDispatch()

    useEffect(() => {
        const LoadBranch = async () => {
            let data = await callApi('branch/get')
            dispatch(loadBranch(data.data))
        }
        if (branch_store.length === 0) {
            LoadBranch()
        }
        // room
        const LoadRoom = async () => {
            let data = await callApi('room/get')
            dispatch(loadRoom(data.data))
        }
        if (room_store.length === 0) {
            LoadRoom()
        }
    }, [])


    // format select react    
    let optionsBranch = branch_store.map(item => {
        return { value: item.theaters, label: item.name }
    })

    return (
        <div className='wrap-room'>
            <Switch>
                <Route path={`${match.url}`} exact component={() => <PageMain rooms={room_store} />} />
                <Route path={`${match.url}/add`} exact
                    component={() =>
                        <PageAdd
                            optionsBranch={optionsBranch}
                        />} />
                <Route path={`${match.url}/detail/:_id`} component={PageDetail} />
            </Switch>
        </div>
    )
}
export default RoomIndex;