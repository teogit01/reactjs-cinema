import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useHistory, useParams } from 'react-router-dom'

function Detail(props) {
    const { _id } = useParams()
    const history = useHistory()
    const goBack = () => {
        history.goBack()
    }
    console.log(_id)
    return (
        <div className='wrap-branch'>
            <div className='branch_title'>
                <h2>Detail {_id}</h2>
                <FontAwesomeIcon className='ic ic-black' icon="arrow-left" onClick={goBack} />
            </div>
            <hr className='op-5' />
            <div className='form'>
                <div>Cum rap</div>
            </div>
        </div>

    );
}

export default Detail;
