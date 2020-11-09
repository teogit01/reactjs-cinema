import React from 'react';
import PropTypes from 'prop-types';
import { Label } from 'reactstrap'

TextField.propTypes = {
    field: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,

    type: PropTypes.string,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    disable: PropTypes.bool
};
TextField.defaultProps = {
    type: 'text',
    label: '',
    placeholder: '',
    disable: false
}

function TextField(props) {
    const {
        field,
        type, label, placeholder
    } = props
    const { name } = field

    return (
        <div className='text-field'>
            <div className=''>
                {label && <Label for={name}>{label}</Label>}
            </div>
            <div className='col-12'>
                <textarea
                    className='textarea'
                    id={name}
                    type={type}
                    {...field}
                    placeholder={placeholder}
                    rows='2'
                >
                </textarea>
            </div>
        </div >
    );
}

export default TextField;