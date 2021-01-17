import React, { useState, useEffect } from 'react';
import './login.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import { Redirect, useHistory } from 'react-router-dom';
import callApi from 'api/apiCaller';
import { Alert } from 'reactstrap'
import classnames from 'classnames'

Login.propTypes = {

};

function Login(props) {
    const [isRegister, setIsRegister] = useState(false)
    const [isLogin, setIsLogin] = useState(false)
    const [isHome, setIsHome] = useState(false)
    const [isError, setIsError] = useState(false)

    const [email, setEmail] = useState('')
    const [pass, setPass] = useState('')
    const _reset = () => {
        setEmail('')
        setPass('')
    }
    const history = useHistory()
    const user = JSON.parse(localStorage.getItem('user'))
    useEffect(() => {
        if (user && user.length > 0) {
            setIsLogin(true)
        }
    }, [user])

    const _register = () => {
        setIsRegister(true)
    }

    const _back = () => {
        setIsHome(true)
    }
    const _onSubmit = () => {
        const data = {
            email,
            pass
        }
        callApi('user/login', 'POST', data).then(res => {
            console.log(res.data.result)
            if (res.data.result) {
                localStorage.setItem('user', JSON.stringify(res.data.user))
                history.goBack()
                // setIsLogin(true)
            } else {
                setIsError(true)
            }
        })
    }
    useEffect(() => {
        if (isError === true) {
            setTimeout(() => {
                setIsError(false)
            }, 3000);
        }
    }, [isError])
    const _onChange = e => {
        const name = e.target.name
        const value = e.target.value
        if (name === 'email')
            setEmail(value)
        if (name === 'pass')
            setPass(value)
    }
    return (
        <div className='login'>
            <div className={classnames(
                'alert',
                { 'alert-none': !isError }
            )}>
                <Alert color="danger">
                    Sai Email hoặc mật khẩu!
                </Alert>
            </div>
            {isRegister && <Redirect to='/register' />}
            {isLogin && <Redirect to='/client' />}
            {isHome && <Redirect to='/client' />}
            <div className='login-main'>
                <div className='bg'></div>
                <div className='content'>
                    <FontAwesomeIcon className='ic' icon="sign-out-alt" onClick={_back} />
                    <div className='title'>
                        <img src="https://tix.vn/app/assets/img/login/group@2x.png" />
                    </div>
                    <div className='form-login'>
                        <div className='form'>
                            <div className='bg-form'></div>

                            <div className='control'>
                                <label>Email hoặc số điện thoại</label>
                                <div>
                                    <input type='text' className='form-contro' name='email' onChange={_onChange} />
                                </div>
                            </div>
                            <div className='control'>
                                <label>Mật khẩu</label>
                                <div>
                                    <input type='password' className='form-contro' name='pass' onChange={_onChange} />
                                </div>
                            </div>

                            <br />
                            <div className='control control-button'>
                                <div className='button button-login' onClick={_register}>Đăng ký</div>
                                <div className='button button-submit' onClick={_onSubmit}>Đăng nhập</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default Login;