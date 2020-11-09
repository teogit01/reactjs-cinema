import React from 'react';
import PropTypes from 'prop-types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

Branch.propTypes = {
    branchs: PropTypes.object,

    handleDetail: PropTypes.func,
    handleDel: PropTypes.func
};
Branch.defaultProps = {
    branchs: null,

    handleDetail: null,
    handleDel: null
}

function Branch(props) {
    const { branch, handleDel, handleDetail } = props
    return (
        <div className='branch'>
            <div className='item col-12 row '>
                <div className='col-0'>#</div>
                <div className='col-2'>{branch.name}</div>
                <div className='col-1'>{branch.city}</div>
                <div className='col-3'>{branch.address}</div>
                <div className='col-2'>{branch.email}</div>
                <div className='col-2'>{branch.hotline}</div>
                <div className='col-1'>
                    <FontAwesomeIcon className='ic-init' icon="eye" onClick={() => handleDetail(branch)} />
                    &nbsp;
                    <FontAwesomeIcon className='ic-init' icon="eraser" onClick={() => handleDel(branch)} />
                </div>
            </div>
        </div >

    );
}

export default Branch;