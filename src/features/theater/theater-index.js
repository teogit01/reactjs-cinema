import React, { useEffect, useState } from 'react';
import { Switch, Route } from 'react-router-dom';

import MainPage from './pages/main';
import AddPage from './pages/add';
import PageDetail from './pages/page.detail';
import { loadTheater } from 'features/theater/theaterSlice';
import { loadBranch } from 'features/branch/branchSlice';

// import DetailPage from './pages/detail';

import { useSelector, useDispatch } from 'react-redux'
import callApi from 'api/apiCaller';

function Theater(props) {
    let { match } = props

    const theater_store = useSelector(state => state.theaters)
    const branch_store = useSelector(state => state.branchs)

    const [listTheater, setListTheater] = useState([])
    const dispatch = useDispatch()
    useEffect(() => {
        const LoadTheater = async () => {
            let data = await callApi('theater')
            if (data) {
                dispatch(loadTheater(data.data))
                setListTheater(data.data)
            }
        }
        const LoadBranch = async () => {
            let data = await callApi('branch')
            if (data) {
                dispatch(loadBranch(data.data))
            }
        }
        LoadTheater()
        LoadBranch()
    }, [])

    let optionsBranch = branch_store.map(item => {
        return { value: item._id, label: item.name }
    })
    return (
        <diiv className='wrap-theater'>
            <Switch>
                <Route path={`${match.url}`} exact component={() => <MainPage listTheater={listTheater} optionsBranch={optionsBranch} />} />
                <Route path={`${match.url}/add`} exact component={() => <AddPage optionsBranch={optionsBranch} />} />
                <Route path={`${match.url}/detail/:_id`} component={() => <PageDetail />} />
            </Switch>
        </diiv>

    )
}
export default Theater;