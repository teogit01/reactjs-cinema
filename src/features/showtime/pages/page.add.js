import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useHistory } from 'react-router-dom';

import FormAdd from './../compoments/form-add'
// import PropTypes from 'prop-types';

// PageAdd.propTypes = {

// };

function PageAdd(props) {
    const history = useHistory()
    const redirect = () => {
        history.goBack()
    }
    return (
        <div className='page-add'>
            <div className='title '>
                <h2>Add new show time</h2>
                <FontAwesomeIcon className='ic ic-black' icon="arrow-left" onClick={redirect} />
            </div>
            <hr className='op-5' />

            <div>
                <FormAdd />
            </div>
        </div>
    );
}

export default PageAdd;