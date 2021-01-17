import React from 'react';
import PropTypes from 'prop-types';
import { useRouteMatch, useHistory, useLocation } from 'react-router-dom';
import classnames from 'classnames'

Theater.propTypes = {
    theater: PropTypes.object
};

function Theater(props) {
    const { theater } = props
    const match = useRouteMatch()
    const history = useHistory()
    const query = new URLSearchParams(useLocation().search)

    // handle click push prams url
    const onClick = (_id) => {
        const _idbranch = query.get('_idbranch')
        const _idtheater = _id
        history.push(`${match.url}?_idbranch=${_idbranch}&_idtheater=${_idtheater}`)
    }
    return (
        <div className='theater'>
            <div className={classnames('theater__item', { 'actived': query.get('_idtheater') === theater._id })}
                onClick={() => onClick(theater._id)}>
                <div className='img'></div>
                <div className='infor'>
                    <div className='name'>{theater.name}</div>
                    <div className='infor'>{theater.address}</div>
                    <div className='detail'>[Detail]</div>
                </div>
            </div>
        </div >
    );
}

export default Theater;