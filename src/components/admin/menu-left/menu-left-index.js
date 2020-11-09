import React from 'react';
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useRouteMatch } from 'react-router-dom'

import './menu-left.scss'
import Menu from './menu'
import Content from './content'

const menus = [
    { name: 'Film', to: '/admin/film', icon: 'film', exact: false, },
    { name: 'Theater', to: '/admin/theater', icon: 'film', exact: false, },
    { name: 'Genre', to: '/admin/genre', icon: 'film', exact: false },
    { name: 'Country', to: '/admin/country', icon: 'film', exact: false },
    { name: 'Branch', to: '/admin/branch', icon: 'film', exact: false },
    { name: 'Room', to: '/admin/room', icon: 'film', exact: false },
    { name: 'Seat', to: '/admin/seat', icon: 'film', exact: false },
    { name: 'Showtime', to: '/admin/showtime', icon: 'film', exact: false },
    { name: 'Ticket', to: '/admin/ticket', icon: 'film', exact: true },
    { name: 'Account', to: '/admin/account', icon: 'film', exact: false },
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