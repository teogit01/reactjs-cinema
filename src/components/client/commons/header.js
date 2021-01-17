import React, { useState, useEffect } from 'react';
import './css/header.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import callApi from 'api/apiCaller';

import logo from 'components/client/img/logo.png'
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
Header.propTypes = {
    receive: PropTypes.func
}

function Header(props) {
    const { receive } = props
    const [turn, setTurn] = useState(false)
    const [isLogin, setIsLogin] = useState(false)
    const [isLogout, setIsLogout] = useState(false)
    const toggle = () => {
        setTurn(!turn)
    }
    const [branchs, setBranchs] = useState([])
    const [branchActived, setBranchActived] = useState('')
    useEffect(() => {
        callApi('branch/client/info').then(res => {
            if (res.data) {
                setBranchs(res.data.branchs)
                if (res.data.branchs && res.data.branchs.length > 0) {
                    setBranchActived(res.data.branchs[0])
                    receive(res.data.branchs[0])
                }
            }
        })
    }, [])
    useEffect(() => {
        if (isLogout) {
            setTimeout(() => {
                setIsLogout(false)
            }, 2000)
        }
    }, [isLogout])
    //handleSelectBranch
    const _changeBranch = (branch) => {
        setBranchActived(branch)
        receive(branch)
        setTurn(!turn)
    }
    const user = JSON.parse(localStorage.getItem('user'))
    const _logout = () => {
        if (user && user.length > 0) {
            localStorage.removeItem('user')
            setIsLogout(true)
        }
    }
    const _login = () => {
        setIsLogin(true)
    }
    const [isDetail, setIsDetail] = useState(false)
    const detail = () => {
        setIsDetail(true)
    }
    return (
        <div className="client-header">
            {isLogin && <Redirect to='/login' />}
            {isLogout && <Redirect to='/client' />}
            {isDetail && <Redirect to={`/client/user/${user[0]._id}`} />}
            <div className='header-content'>
                <div className='logo' onClick={() => setIsLogout(true)}>
                    <img src={logo} />
                </div>

                <div className='menu'>
                    <div className='menu__item'>Lịch Chiếu</div>
                    <div className='menu__item'>Cụm Rạp</div>
                    <div className='menu__item'>Tin Tức</div>
                    <div className='menu__item'>Ứng Dụng</div>
                </div>

                <div className='control'>
                    <div className='control__login'>
                        {
                            (user && user.length > 0) ?
                                <div onClick={() => detail()}>
                                    <FontAwesomeIcon className='ic' icon="user" />
                                    {user[0].name}
                                </div>
                                :
                                <div className='btn-login' onClick={_login}>Đăng nhập</div>
                        }
                    </div>
                    <div className='control__location' onClick={toggle}>
                        {branchActived && branchActived.name}
                        <FontAwesomeIcon className='ic ic-down' icon="angle-down" />
                    </div>
                    {
                        (user && user.length > 0) &&
                        <FontAwesomeIcon
                            onClick={_logout}
                            className='ic ic-down hover' style={{ fontSize: '20px' }} icon="sign-out-alt" />
                    }
                </div>
            </div>
            {
                turn &&

                <div className='branch'>
                    {
                        branchs.length > 0 &&
                        branchs.map(branch => {
                            return (
                                <div className='branch-item' key={branch._id} onClick={() => _changeBranch(branch)}>
                                    {branch.name}
                                </div>
                            )
                        })
                    }
                </div>
            }
        </div>
    );
}

export default Header;