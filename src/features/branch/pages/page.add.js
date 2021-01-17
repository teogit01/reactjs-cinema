import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import FormAdd from '../components/form-add'
import { useHistory } from 'react-router-dom';

function PageAdd() {
    const history = useHistory()
    const goBack = () => {
        history.goBack()
    }

    const handleSubmit = (values) => {
        //up store        
    }
    return (
        <div className='page-add'>
            <div className='title'>
                <h2>Add New Branch</h2>
                <FontAwesomeIcon className='ic ic-black' icon="arrow-left" onClick={goBack} />
            </div>
            <hr className='op-5' />

            <div className='form-add'>
                <FormAdd onSubmit={handleSubmit} />
            </div>

        </div>
    );
}

export default PageAdd;