import React from 'react';
import { Route, Switch } from 'react-router-dom'

import Film from 'features/film/film-index.js'
import Banner from 'features/banner'
import Genre from 'features/genre/index.js'
import Branch from 'features/branch/index'
import Country from 'features/country/index'
import Room from 'features/room/index'
import Theater from 'features/theater/theater-index'
import Upload from 'features/film/upload.js'
import Seat from 'features/seat'
import ShowTime from 'features/showtime'
import Account from 'features/account'
import Thongke from 'features/thong-ke'

import Login from 'features/login/login.js'

function content(props) {
    const { match } = props
    return (
        <div className='content'>
            <Switch>
                <Route path={`${match.url}/film`} component={Film} />
                <Route path={`${match.url}/banner`} component={Banner} />
                <Route path={`${match.url}/genre`} component={Genre} />
                <Route path={`${match.url}/branch`} component={Branch} />
                <Route path={`${match.url}/country`} component={Country} />
                <Route path={`${match.url}/room`} component={Room} />
                <Route path={`${match.url}/seat`} component={Seat} />
                <Route path={`${match.url}/theater`} component={Theater} />
                <Route path={`${match.url}/upload`} component={Upload} />


                <Route path={`${match.url}/showtime`} component={ShowTime} />
                <Route path={`${match.url}/account`} component={Account} />
                <Route path={`${match.url}/thong-ke`} component={Thongke} />

                {/* <Route path={`${match.url}/login`} component={Login} /> */}

            </Switch>
        </div>
    );
}

export default content;