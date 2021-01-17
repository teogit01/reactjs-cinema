import React from 'react';
import './theater.scss'
import PropTypes from 'prop-types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import Tooltip from 'components/custom-field/tooltip'
import callApi from 'api/apiCaller'

import { useHistory, useRouteMatch } from 'react-router-dom';

Theater.propTypes = {
    theater: PropTypes.object
};
Theater.defaultProps = {
    theater: null
}

function Theater(props) {
    const { theater, index } = props
    const history = useHistory()
    const match = useRouteMatch()
    // // handle delete branch
    const handleDel = theater => {
        if (window.confirm(`Remove ${theater.name}`)) {
            //remove
            callApi(`theater/${theater._id}`, 'DELETE', null)
            //update theaters        
            //dispatch(removeTheater(theater._id))
        }
    }
    const detail = (_id) => {
        history.push(`${match.url}/detail/${_id}`)
    }
    //console.log(theater_store)
    // const [tooltipOpen, setTooltipOpen] = useState()
    // const toggle = () => setTooltipOpen(!tooltipOpen)    
    return (
        <div className='theater_list--item col-12 row' key={theater._id}>
            <div className='col-1 overflow'>{index + 1}</div>
            <div className='col-3 overflow'>{theater.name}</div>
            <div className='col-2 overflow' id={`branch-${index}`}>{theater.branch.name}</div>

            <Tooltip item={theater.code_branch} target={`branch-${index}`} />

            <div className='col-3 overflow' id={`address-${index}`}>{theater.address}</div>
            <Tooltip item={theater.address} target={`address-${index}`} />

            <div className='col-2 overflow'>{theater.hotline}</div>
            <div className='col-1 overflow'>
                <FontAwesomeIcon className='ic-init' icon="eye" onClick={() => detail(theater._id)} />
                &nbsp;
                <FontAwesomeIcon className='ic-init' icon="eraser" onClick={() => handleDel(theater)} />
            </div>
        </div>
    );
}

export default Theater;