import React, { useState, useEffect } from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import './branch.scss'

import MainPage from './pages/page.main';
import AddPage from './pages/page.add';
import DetailPage from './pages/page.detail';


import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import callApi from 'api/apiCaller'
import * as action from './branchSlice'

function BranchIndex(props) {
    //let { match } = props
    const match = useRouteMatch()
    const branch_store = useSelector(state => state.branchs)
    //const [branchs, setBranchs] = useState(branch_store)
    const dispatch = useDispatch()

    useEffect(() => {
        const LoadBranch = async () => {
            let data = await callApi('branch')
            if (data) {
                dispatch(action.loadBranch(data.data))
            }
        }
        if (branch_store.length === 0) {
            LoadBranch()
        }
    })

    return (
        <div className='wrap-page'>
            <Switch>
                <Route path={`${match.url}`} exact component={() => <MainPage listBranch={branch_store} />} />
                <Route path={`${match.url}/add`} exact component={AddPage} />
                <Route path={`${match.url}/detail/:_id`} component={DetailPage} />
            </Switch>
        </div>

    )
}
export default BranchIndex;