import React, { useEffect, useState } from 'react';
import { Switch, Route } from 'react-router-dom';

import MainPage from './pages/main';
import AddPage from './pages/add';
import PageDetail from './pages/page.detail';

// import DetailPage from './pages/detail';

import callApi from 'api/apiCaller';

function Theater(props) {
    let { match } = props

    const [branch_store, setbranch_store] = useState([])


    const [listTheater, setListTheater] = useState([])
    useEffect(() => {
        const LoadTheater = async () => {
            let data = await callApi('theater')
            if (data) {
                setListTheater(data.data)
            }
        }
        const LoadBranch = async () => {
            let data = await callApi('branch')

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