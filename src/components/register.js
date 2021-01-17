import React, { useState, useEffect } from 'react';
import './register.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import logo from './client/img/logo.png'
import callApi from 'api/apiCaller';
import { useHistory, Redirect } from 'react-router-dom';
import { Alert } from 'reactstrap'
import classnames from 'classnames'

function Register(props) {
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState('')
    const [pass, setPass] = useState('')
    const history = useHistory()
    const [isAlert, setIsAlert] = useState(false)
    const [isLogin, setIslogin] = useState(false)

    const user = JSON.parse(localStorage.getItem('user'))
    useEffect(() => {
        if (user && user.length > 0) {
            setIslogin(true)
        }
    }, [user])
    const _onChange = e => {
        const name = e.target.name
        const value = e.target.value
        if (name === 'name')
            setName(value)
        if (name === 'phone')
            setPhone(value)
        if (name === 'email')
            setEmail(value)
        if (name === 'pass')
            setPass(value)
    }
    const _reset = () => {
        setName('')
        setPhone('')
        setEmail('')
        setPass('')
    }

    const _onSubmit = () => {
        const data = {
            name,
            phone,
            email,
            pass
        }
        console.log('data,', data)
        callApi('user/register', 'POST', data).then(res => {
            if (res.data.result === true) {
                localStorage.setItem('user', JSON.stringify([res.data.user]))
                history.goBack()
            }
        })
        _reset()
    }
    const _login = () => {
        setIsAlert(true)
        setIslogin(true)
    }
    useEffect(() => {
        console.log('chan')
        if (isAlert) {
            setTimeout(() => {
                setIsAlert(false)
            }, 2000)
        }
    }, [isAlert == true])

    return (
        <div className='register'>
            {isLogin && <Redirect to='/login' />}
            <div className={classnames(
                'alert',
                { 'alert-none': !isAlert }
            )}>
                <Alert color="info">
                    Đăng ký thành công!
                </Alert>
            </div>
            <div className='register-main'>
                <div className='bg'></div>
                <div className='content'>
                    <FontAwesomeIcon className='ic' icon="sign-out-alt" />
                    <div className='title'>
                        <img src="https://tix.vn/app/assets/img/login/group@2x.png" />
                    </div>
                    <div className='form-register'>
                        <div className='form'>
                            <div className='bg-form'></div>
                            <div className='control'>
                                <label>Họ Tên</label>
                                <div>
                                    <input type='text' className='form-contro' name='name' onChange={_onChange} />
                                </div>
                            </div>

                            <div className='control'>
                                <label>Email</label>
                                <div>
                                    <input type='text' className='form-contro' name='email' onChange={_onChange} />
                                </div>
                            </div>
                            <div className='control'>
                                <label>Số điện thoại</label>
                                <div>
                                    <input type='text' className='form-contro' name='phone' onChange={_onChange} />
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
                                <div className='button button-submit' onClick={_login}>Đăng nhập</div>
                                <div className='button button-login' onClick={_onSubmit}>Đăng ký</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default Register;