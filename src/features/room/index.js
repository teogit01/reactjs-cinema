import React, { useEffect, useState } from 'react';
import './room.scss'
import PageMain from './pages/page.main';
import PageAdd from './pages/page.add';
import PageDetail from './pages/page.detail'
import { Switch, Route, useRouteMatch } from 'react-router-dom'

import callApi from 'api/apiCaller'

function RoomIndex() {
    const match = useRouteMatch()
    //const theater_store = useSelector(state => state.theaters)
    // const branch_store = useSelector(state => state.branchs)
    // const room_store = useSelector(state => state.rooms)
    //const dispatch = useDispatch()
    const [branch_store, setbranch] = useState([])
    const [room_store, setroom_store] = useState([])

    useEffect(() => {
        const LoadBranch = async () => {
            let data = await callApi('branch/get')

        }
        if (branch_store.length === 0) {
            LoadBranch()
        }
        // room
        const LoadRoom = async () => {
            let data = await callApi('room/get')
            //dispatch(loadRoom(data.data))
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