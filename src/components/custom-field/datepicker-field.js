import PropTypes from 'prop-types'
import React, { useState } from 'react';

import DatePicker from "react-datepicker";
import { format } from 'date-fns'

import { Label } from 'reactstrap'

CusDatePicker.propTypes = {
    field: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,

    type: PropTypes.string,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    disabled: PropTypes.bool

}
CusDatePicker.defaultProps = {
    type: 'text',
    label: '',
    placeholder: '',
    disabled: false
}
function CusDatePicker(props) {
    const [startDate, setStartDate] = useState(new Date());
    const handleChange = (date) => {
        let openday = new Date(date)
        setStartDate(openday)
        const changeEvent = {
            target: {
                name: name,
                value: format(openday, 'dd/MM/yyyy')
            }
        }
        field.onChange(changeEvent)
        //field.value = date        
    }
    const { field, label } = props
    const { name } = field

    return (
        <div className='datepicker-field'>
            <div className=''>
                {label && <Label for={name}>{label}</Label>}
            </div>
            <div className='col-12'>
                <DatePicker
                    className='d form-control'
                    dateFormat="dd/MM/yyyy"
                    {...field}
                    value={startDate}
                    selected={startDate}
                    onChange={handleChange}
                // strictParsing
                />
            </div>
        </div>

    );
}

export default CusDatePicker;
