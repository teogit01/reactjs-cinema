import React from 'react';
import PropTypes from 'prop-types';

FormAdd.propTypes = {

};

function FormAdd(props) {
    return (
        <div className='form'>
            <form>
                <div className='control'>
                    <label>Select film</label>
                    <select className='form-control'>
                        <option>Film1</option>
                        <option>Film1</option>
                    </select>
                </div>

                <div className='control'>
                    <label>Select film</label>
                    <select className='form-control'>
                        <option>Film1</option>
                        <option>Film1</option>
                    </select>
                </div>

            </form>
        </div>
    );
}

export default FormAdd;