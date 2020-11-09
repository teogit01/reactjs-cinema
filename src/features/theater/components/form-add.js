import React from 'react';
import './theater.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useHistory } from 'react-router-dom'

import { Formik, Form, FastField } from 'formik';
import InputField from 'components/custom-field/input-field'
import SelectField from 'components/custom-field/select-field'
import TextField from 'components/custom-field/text-field.js'

import { initiaValues } from 'assets/constant/theater'
import { useDispatch } from 'react-redux';
import { addTheater } from './../theaterSlice'
import callApi from 'api/apiCaller';
//import { validationSchema } from 'assets/validations/valid-theater'
// import callApi from 'api/apiCaller';

function FormAdd(props) {
    const { optionsBranch } = props
    const history = useHistory()
    const dispatch = useDispatch()
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
        console.log(values)
        // call api sumit add
        callApi('theater', 'POST', values).then(() => {
            //add store 
            dispatch(addTheater(values))
            history.goBack()
        })
    }
    //const dispatch = useDispatch()    
    return (
        <div className='wrap-theater'>
            <div className='theater_title'>
                <h2>Add New Theater</h2>
                <FontAwesomeIcon className='ic ic-black' icon="arrow-left" onClick={goBack} />
            </div>
            <hr className='op-5' />
            <div className='form'>
                <Formik
                    initialValues={initiaValues}
                    onSubmit={handelSubmit}
                >
                    {
                        formikProps => {
                            return (
                                <Form>
                                    <FastField
                                        name='name'
                                        component={InputField}
                                        label='Name' />

                                    <FastField
                                        name='hotline'
                                        component={InputField}
                                        label='Hot line' />
                                    <FastField
                                        name='branch'
                                        component={SelectField}
                                        label='Branch'
                                        placeholder='Select Branch'
                                        options={optionsBranch}
                                    />
                                    <FastField
                                        name='address'
                                        component={TextField}
                                        label='Address' />
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
