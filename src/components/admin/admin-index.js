import React, { useEffect } from 'react';
//import { BrowserRouter as Router, Route, useRouteMatch, Switch } from 'react-router-dom'

import Header from 'components/admin/header'
import MenuLeft from 'components/admin/menu-left/menu-left-index.js'

// import { useDispatch } from 'react-redux'
// import { loadBranch } from 'features/branch/branchSlice';
// import { loadTheater } from 'features/theater/theaterSlice';
// import { loadFilm } from 'features/film/filmSlice';
// import { loadGenre } from 'features/genre/genreSlice';

// import callApi from 'api/apiCaller'


function DidMount() {

    // const dispatch = useDispatch()
    //const branch_store = useSelector(state => state.branchs)
    // load branch
    // useEffect(() => {
    //     const LoadFilm = async () => {
    //         let data = await callApi('film')
    //         dispatch(loadFilm(data.data))
    //     }
    //     const LoadGenre = async () => {
    //         let data = await callApi('genre')
    //         dispatch(loadGenre(data.data))
    //     }
    //     const LoadBranch = async () => {
    //         let data = await callApi('branch')
    //         dispatch(loadBranch(data.data))
    //     }
    //     const LoadTheater = async () => {
    //         let data = await callApi('theater')
    //         dispatch(loadTheater(data.data))
    //     }
    //     // LoadFilm()
    //     // LoadGenre()
    //     // LoadBranch()
    //     // LoadTheater()
    // }, [])
    //console.log(branch_store)    
}
function index(props) {
    DidMount()
    return (
        <div className='admin'>
            <Header />
            <MenuLeft />
        </div>
    );
}

export default index;