import React from 'react';
import './components/css/index.scss'
import PropTypes from 'prop-types';
import { Switch, useRouteMatch, Route } from 'react-router-dom';

import PageMain from './pages/page.main'
Thongke.propTypes = {

};

function Thongke(props) {
    const match = useRouteMatch()
    return (
        <div className=''>
            <Switch>
                <Route path={`${match.url}`} exact component={() => <PageMain />} />

            </Switch>
        </div>
    );
}

export default Thongke;