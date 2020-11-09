import React from 'react';
import { Route, Switch } from 'react-router-dom'

import Film from 'features/film/film-index.js'
import Genre from 'features/genre/index.js'
import Branch from 'features/branch/index'
import Country from 'features/country/index'
import Room from 'features/room/index'
import Theater from 'features/theater/theater-index'
import Upload from 'features/film/upload.js'
import Seat from 'features/seat'
import ShowTime from 'features/showtime'

function content(props) {
    const { match } = props
    return (
        <div className='content'>
            <Switch>
                <Route path={`${match.url}/film`} component={Film} />
                <Route path={`${match.url}/genre`} component={Genre} />
                <Route path={`${match.url}/branch`} component={Branch} />
                <Route path={`${match.url}/country`} component={Country} />
                <Route path={`${match.url}/room`} component={Room} />
                <Route path={`${match.url}/seat`} component={Seat} />
                <Route path={`${match.url}/theater`} component={Theater} />
                <Route path={`${match.url}/upload`} component={Upload} />


                <Route path={`${match.url}/showtime`} component={ShowTime} />

            </Switch>
        </div>
    );
}

export default content;