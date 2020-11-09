import React from 'react';
import Branch from 'features/branch/components/branch'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useHistory, useRouteMatch } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux'
import callApi from 'api/apiCaller'
import * as action from './../branchSlice'

import PropTypes from 'prop-types';
PageMain.propTypes = {
    listBranch: PropTypes.array
}
PageMain.defaultProps = {
    listBranch: []
}

function PageMain(props) {
    const { listBranch } = props
    const history = useHistory()
    const match = useRouteMatch()
    // redirect    
    const redirect = () => {
        history.push(`${match.url}/add`)
    }
    const dispatch = useDispatch()
    //const branch_store = useSelector(state => state.branchs)        
    // // handle delete branch
    const handleDel = branch => {
        if (window.confirm(`Remove ${branch.name}`)) {
            //remove
            callApi(`branch/${branch._id}`, 'DELETE', null)
            //update branchs        
            dispatch(action.removeBranch(branch._id))
        }
    }
    //handle detail
    const handleDetail = branch => {
        history.push(`${match.url}/detail/${branch._id}`)
    }
    return (
        <div className='page-main'>
            <div className='title'>
                <h2>branch</h2>
                <FontAwesomeIcon className='ic ic-black' icon="plus" onClick={redirect} />
            </div>
            <hr className='op-5' />

            <div className='list'>
                <div className='item col-12 row head'>
                    <div className='col-0'>#</div>
                    <div className='col-2'>Name</div>
                    <div className='col-1'>City</div>
                    <div className='col-3'>Address</div>
                    <div className='col-2'>Email</div>
                    <div className='col-2'>Hot line</div>
                    <div className='col-1'>Action</div>
                </div>
                {
                    listBranch.map((item, index) => {
                        return <Branch key={index} branch={item} handleDel={handleDel} handleDetail={handleDetail} />
                    })
                }

            </div>
        </div>
    );
}

export default PageMain;