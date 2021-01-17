import React from 'react';
import './components/css/page-account.scss'
import PropTypes from 'prop-types';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import PageMain from './pages/page.main.js'

Index.propTypes = {

};

function Index(props) {
    const match = useRouteMatch()
    return (
        <Switch>
            <Route path={`${match.url}`} exact component={() => <PageMain />} />
        </Switch>
    );
}

export default Index;