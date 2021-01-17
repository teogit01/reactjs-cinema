import React from 'react';
import PropTypes from 'prop-types';
import { Formik, Form, FastField, Field } from 'formik';
import InputField from 'components/custom-field/input-field'
import SelectField from 'components/custom-field/select-field'
//import TextField from 'components/custom-field/text-field.js'
import { initiaValues } from 'assets/constant/room'
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import callApi from 'api/apiCaller'

FormAdd.propTypes = {
    optionsTheater: PropTypes.array,
    // optionsBranch: PropTypes.array
};

function FormAdd(props) {
    const { optionsBranch } = props
    const history = useHistory()
    const goBack = () => {
        history.goBack()
    }
    //reset form
    const handleReset = (resetForm) => {
        if (window.confirm('Reset?')) {
            resetForm();
        }
    };
    // handle submit
    const handelSubmit = values => {
        //call api sumit add
        callApi('room', 'POST', values).then((res) => {
            //add store 
            //let data = res.data.room            
            //data.room.theater.push(res.data.theater)            
            history.goBack()
        })
    }
    return (
        <div className='wrap-room'>
            <div className='room_title'>
                <h2>Add New Room</h2>
                <FontAwesomeIcon className='ic ic-black' icon="arrow-left" onClick={goBack} />
            </div>
            <hr className='op-5' />
            <div className='form'>
                <Formik
                    enableReinitialize={true}
                    initialValues={initiaValues}
                    onSubmit={handelSubmit}
                >
                    {
                        formikProps => {
                            const { values } = formikProps
                            let optionsTheater = []
                            //console.log(values.branch)
                            if (values.branch) {
                                values.branch.map(item => {
                                    optionsTheater.push({ value: item._id, label: item.name })
                                })
                            }
                            return (
                                <Form>
                                    <FastField
                                        name='name'
                                        component={InputField}
                                        label='Name' />

                                    <FastField
                                        name='capacity'
                                        type='number'
                                        component={InputField}
                                        label='Capacity' />
                                    <FastField
                                        name='branch'
                                        component={SelectField}
                                        label='Branch'
                                        placeholder='Select Branch'
                                        options={optionsBranch}
                                    />
                                    <Field
                                        name='_idtheater'
                                        component={SelectField}
                                        label='Theater'
                                        placeholder='Select Theater'
                                        options={optionsTheater}
                                    />
                                    <br />

                                    <div className='button'>
                                        <div
                                            className='btn btn-secondary'
                                            onClick={handleReset.bind(null, formikProps.resetForm)}
                                        >Cancal</div>
                                        <button type='submit' className='btn btn-info'>Add</button>
                                    </div>
                                </Form>
                            )
                        }
                    }
                </Formik>
            </div>
        </div >
    );
}

export default FormAdd;