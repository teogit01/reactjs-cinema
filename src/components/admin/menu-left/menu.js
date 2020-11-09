import React from 'react';
import PropTypes from 'prop-types';
import { Link, useRouteMatch } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

Menu.propTypes = {
    menus: PropTypes.array
};
Menu.defaultProps = {
    menus: []
};

function Li({ label, to, activeOnlyWhenExact, icon }) {
    let match = useRouteMatch({
        path: to,
        exact: activeOnlyWhenExact
    })
    return (
        <div className={match ? "active" : ""}>
            <Link to={to} style={{ textDecoration: 'none' }}>
                <li className={match}>
                    <div className='scroll'></div>
                    <div className='control-ic-label'>
                        <div className=''><FontAwesomeIcon className='ic' icon={icon} /></div>
                        <div className=''>{label}</div>
                    </div>
                </li>
            </Link>
        </div>
    )
}
function Menu(props) {
    const { menus } = props
    return (
        <div className='wrap-menu'>
            <ul>
                {
                    menus.map(item => {
                        return (
                            <Li
                                key={item.name}
                                activeOnlyWhenExact={item.exact}
                                to={item.to}
                                label={item.name}
                                icon={item.icon}
                            />
                        )
                    })
                }
            </ul>
        </div>
    );
}
export default Menu;