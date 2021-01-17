import React from 'react';
import './banner.scss'
import { Switch, Route, useRouteMatch } from 'react-router-dom';

import PageMain from './pages/page.main'
function Index() {
    const match = useRouteMatch()
    return (
        <div className='wrap-banner'>
            <Switch>
                <Route path={`${match.url}`} exact component={() => <PageMain />} />
            </Switch>
        </div>
    );
}

export default Index;