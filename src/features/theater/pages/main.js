import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Theater from 'features/theater/components/theater'
import { useHistory, useRouteMatch } from 'react-router-dom'

import PropTypes from 'prop-types'

Main.propTypes = {
    listTheater: PropTypes.array,

}
function Main(props) {
    const { listTheater } = props
    const history = useHistory()
    const match = useRouteMatch()
    // redirect
    const redirect = () => {
        history.push(`${match.url}/add`)
    }
    return (
        <div className='wrap-theater'>
            <div className='theater_title'>
                <h2>List Theater</h2>
                <FontAwesomeIcon className='ic ic-black' icon="plus" onClick={redirect} />
            </div>
            <hr className='op-5' />

            <div className='theater_list'>

                <div className='theater_list--item col-12 row head'>
                    <div className='col-1 overflow'>#</div>
                    <div className='col-3 overflow'>Name &nbsp;<FontAwesomeIcon icon="sort" /></div>
                    <div className='col-2 overflow'>City &nbsp;<FontAwesomeIcon icon="sort" /></div>
                    <div className='col-3 overflow'>Address &nbsp;<FontAwesomeIcon icon="sort" /></div>
                    <div className='col-2 overflow'>Hot line</div>
                    <div className='col-1 overflow'>Action</div>
                </div>

                {
                    listTheater.map((item, index) => {
                        return (
                            <Theater theater={item} key={index} index={index} />
                        )
                    })
                }
            </div>
        </div>
    );
}

export default Main;