import React, { useState, useEffect } from 'react';
import Header from 'components/admin/header'
import MenuLeft from 'components/admin/menu-left/menu-left-index.js'
import { Redirect } from 'react-router-dom';

function Index() {
    const [isLogin, setIsLogin] = useState(true)
    const user = JSON.parse(localStorage.getItem('userAdmin'))

    useEffect(() => {
        if (!user || user.length === 0) {
            setIsLogin(false)
        }
    }, [user])
    return (
        <div className='admin'>
            {!isLogin && <Redirect to='/admin-login' />}
            <Header />
            <MenuLeft />
        </div>
    );
}

export default Index;