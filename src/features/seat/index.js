import React from 'react';
import './seat.scss'

import PageMain from './pages/page.main'
import PageDetail from './pages/page.detail'
import { Route, Switch, useRouteMatch } from 'react-router-dom';
// import PropTypes from 'prop-types';

// SeatIndex.propTypes = {

// };

import { list_seat, ROW, COLUMN } from './list-seat'

function SeatIndex(props) {
    const { listSeats } = props
    const match = useRouteMatch()
    return (
        <div className='wrap-page-seat'>
            <Switch>
                <Route patch={`${match.url}`} exact component={() => <PageMain list_seat={listSeats} ROW={ROW} COLUMN={COLUMN} />} />
                <Route patch={`${match.url}/showtime`} component={() => <PageDetail list_seat={listSeats} ROW={ROW} COLUMN={COLUMN} />} />
            </Switch>
        </div>
    );
}

export default SeatIndex;