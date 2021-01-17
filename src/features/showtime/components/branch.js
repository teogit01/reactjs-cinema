import React from 'react';
import PropTypes from 'prop-types';
import { useRouteMatch, useHistory, useLocation } from 'react-router-dom';

import classnames from 'classnames'

Branch.propTypes = {
    brach: PropTypes.object,

};

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function Branch(props) {
    let query = useQuery()
    const { branch } = props
    const match = useRouteMatch()
    const history = useHistory()

    const onClick = (_id) => {
        history.push(`${match.url}?_idbranch=${_id}`)
    }

    return (
        <div className='branch'>
            <div
                className={classnames('branch__item', { 'actived': query.get('_idbranch') === branch._id })}
                onClick={() => onClick(branch._id)}
            >
                {branch.name}
            </div >
        </div >
    );
}

export default Branch;