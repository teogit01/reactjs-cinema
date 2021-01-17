import React from 'react';
import './film.scss'
import { Route, Switch, useRouteMatch } from 'react-router-dom'

import MainPage from './pages/main'
import AddPage from './pages/add'
import PageDetail from './pages/page.detail'
//import { RouteMatch } from 'react-router-dom'
function Index() {
    const match = useRouteMatch()
    return (
        <div className='feature-films'>
            <Switch>
                <Route path={`${match.url}`} exact component={() => <MainPage />} />
                <Route path={`${match.url}/add`} component={() => <AddPage />} />

                <Route path={`${match.url}/detail/:film_id`} component={() => <PageDetail />} />
            </Switch>
        </div>
    );
}

export default Index;