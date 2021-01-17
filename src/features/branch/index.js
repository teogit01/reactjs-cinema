import React, { useState, useEffect } from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import './branch.scss'

import MainPage from './pages/page.main';
import AddPage from './pages/page.add';
import DetailPage from './pages/page.detail';

function BranchIndex() {
    const match = useRouteMatch()
    return (
        <div className='wrap-page'>
            <Switch>
                <Route path={`${match.url}`} exact component={() => <MainPage />} />
                <Route path={`${match.url}/add`} exact component={AddPage} />
                <Route path={`${match.url}/detail/:_id`} component={DetailPage} />
            </Switch>
        </div>

    )
}
export default BranchIndex;