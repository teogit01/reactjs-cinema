import React, { useEffect, useState } from 'react';

import './showtime.scss'
import { Route, Switch, useRouteMatch } from 'react-router-dom';

import PageMain from './pages/page.main.js'
import PageAdd from './pages/page.add.js'


function ShowtimeIndex(props) {
    const match = useRouteMatch()
    return (
        <div className='wrap-showtime'>
            <Switch>
                <Route path={`${match.url}`} exact component={() => <PageMain />} />
                <Route path={`${match.url}/add`} component={() => <PageAdd />} />
            </Switch>
        </div>
    );
}

export default ShowtimeIndex;