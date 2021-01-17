import React from 'react';
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useRouteMatch } from 'react-router-dom'

import './menu-left.scss'
import Menu from './menu'
import Content from './content'

const menus = [

    { name: 'Film', to: '/admin/film', icon: 'film', exact: false, },
    { name: 'Banner', to: '/admin/banner', icon: 'ad', exact: false, },
    // { name: 'Theater', to: '/admin/theater', icon: 'film', exact: false, },
    { name: 'Genre', to: '/admin/genre', icon: 'money-check', exact: false },
    // { name: 'Country', to: '/admin/country', icon: 'film', exact: false },
    { name: 'Branch', to: '/admin/branch', icon: 'code-branch', exact: false },
    // { name: 'Room', to: '/admin/room', icon: 'film', exact: false },
    // { name: 'Seat', to: '/admin/seat', icon: 'film', exact: false },

    { name: 'Showtime', to: '/admin/showtime', icon: 'store-alt', exact: false },
    { name: 'Ticket', to: '/admin/ticket', icon: 'receipt', exact: true },
    { name: 'Account', to: '/admin/account', icon: 'address-card', exact: false },
    { name: 'Statistical', to: '/admin/thong-ke', icon: 'fa-acquisitions-incorporated', exact: false },
]
function MenuLeft(props) {
    const match = useRouteMatch()
    return (
        <div className='menu-left'>
            <Menu menus={menus} />
            <Content match={match} />
        </div>

    );
}

export default MenuLeft;