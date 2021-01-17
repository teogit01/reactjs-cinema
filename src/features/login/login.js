import React, { useEffect, useState } from 'react';
import './login.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PropTypes from 'prop-types';
import { useHistory, Redirect } from 'react-router-dom';
import callApi from 'api/apiCaller';
import { Alert } from 'reactstrap'
import classnames from 'classnames'
Login.propTypes = {

};

function Login(props) {
    const user = JSON.parse(localStorage.getItem('userAdmin'))
    const [isLogin, setIsLogin] = useState(false)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [isErr, setIsErr] = useState(false)
    useEffect(() => {
        if (user && user.length > 0) {
            setIsLogin(true)
        }
    }, [user])
    const history = useHistory()
    const _goback = () => {
        history.goBack()
    }
    const _onSubmit = () => {
        const data = {
            username,
            password
        }
        callApi('user/admin-login', 'POST', data).then(res => {
            if (res.data.result) {
                setIsLogin(true)
                localStorage.setItem('userAdmin', JSON.stringify([res.data.user]))
            } else {
                setPassword('')
                setIsErr(true)
            }
        })
    }
    const _reset = () => {
        setUsername('')
        setPassword('')
    }
    const _onChange = e => {
        const name = e.target.name
        const value = e.target.value
        if (name === 'username')
            setUsername(value)
        if (name === 'password')
            setPassword(value)
    }
    useEffect(() => {
        if (isErr) {
            setTimeout(() => {
                setIsErr(false)
            }, 3000)
        }
    }, [isErr])
    return (
        <div className='admin-login'>
            <div className={classnames(
                'alert',
                { 'alert-none': !isErr }
            )}>
                <Alert color='danger'>
                    Sai tài khoản hoặc mật khẩu
                </Alert>
            </div>
            {isLogin && <Redirect to='/admin' />}
            <div className='form-login'>
                <div className='bg'>
                </div>
                <div className='form-content'>
                    <FontAwesomeIcon
                        onClick={() => _goback()}
                        className='ic ic-down hover' style={{ fontSize: '20px', position: 'absolute', top: '5px', right: '5px' }} icon="sign-out-alt" />
                    <div className='control'>
                        <label>Username</label>
                        <input type='text' className='form-control' name='username' onChange={_onChange} value={username} />
                        <label>Password</label>
                        <input type='password' className='form-control' name='password' onChange={_onChange} value={password} />
                        <br />
                        <div className='button' onClick={_onSubmit}>
                            Login
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;  