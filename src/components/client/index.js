import React, { useState } from 'react'
import Header from './commons/header'
import Footer from './commons/footer'
import PageHome from 'components/client/pages/page.home'

import PageFilmDetail from 'components/client/pages/page.filmdetail'
import PageCheckout from 'components/client/pages/page.checkout'
import PageUser from 'components/client/pages/page.user'
import { Switch, Route, useRouteMatch } from 'react-router-dom'

function Client() {
    const match = useRouteMatch()
    const [branchActived, setBranchActived] = useState('')
    const _receive = (type, value) => {
        if (type === 'branch') {
            setBranchActived(value)
        }
    }

    return (
        <div className='wrap-client'>
            <Header receive={(value) => _receive('branch', value)} />
            <Switch>
                <Route path={`${match.url}`} exact component={() => <PageHome branchActived={branchActived} />} />
                <Route path={`${match.url}/film/:_idfilm`} exact component={() => <PageFilmDetail branchActived={branchActived} />} />
                <Route path={`${match.url}/film/checkout/:_idshowtime`} exact component={() => <PageCheckout branchActived={branchActived} />} />
                <Route path={`${match.url}/user/:_iduser`} exact component={() => <PageUser />} />
                {/*<Route path='/film' component = { User1 } />*/}
            </Switch>
            <Footer />
        </div>
    );
}

export default Client;