import React, { useEffect, useState } from 'react';

import './showtime.scss'
import { Route, Switch, useRouteMatch } from 'react-router-dom';

import PageMain from './pages/page.main.js'
import PageAdd from './pages/page.add.js'

import callApi from 'api/apiCaller'
import useQuery from 'components/queries'
import { useDispatch, useSelector } from 'react-redux';
import { loadFilm } from 'features/film/filmSlice';

function ShowtimeIndex(props) {
    const match = useRouteMatch()
    const dispatch = useDispatch()
    const query = useQuery()

    const [branchs, setBranchs] = useState([])
    const [filmAdd, setFilmAdd] = useState([])
    useEffect(() => {
        const LoadBranch = async () => {
            let data = await callApi('branch')
            setBranchs(data.data)
        }
        const LoadFilm = async () => {
            let data = await callApi('film')
            setFilmAdd(data.data)
        }
        LoadFilm()
        LoadBranch()
    }, [])

    // load theater of branch
    let _idbranch = query.get('_idbranch') ? query.get('_idbranch') : branchs[0] ? branchs[0]._id : ''
    const [theaters, setTheaters] = useState([])
    useEffect(() => {
        const LoadTheater = async () => {
            let data = await callApi(`theater/branch/${_idbranch}`)
            setTheaters(data.data)
        }
        LoadTheater()
    }, [_idbranch])
    // load film of theater
    let _idtheater = query.get('_idtheater')

    const [films, setFilms] = useState([]) // film of theater
    //const [rooms, setRooms] = useState([])
    useEffect(() => {
        const LoadFilm = async () => {
            let data = await callApi(`film/theater/${_idtheater}`)
            setFilms(data.data.films)
        }
        const LoadRoom = async () => {
            let data = await callApi(`room/theater?_idtheater=${_idtheater}`)
            //setRooms(data.data.rooms)
            //console.log('rooms', data.data)
        }
        LoadRoom()
        LoadFilm()
    }, [_idtheater])

    //store                
    //const listTheater = useSelector(state => state.theaters)
    // list film render
    const listFilm = useSelector(state => state.films)

    return (
        <div className='wrap-showtime'>
            <Switch>
                <Route path={`${match.url}`} exact
                    component={() => <PageMain
                        films={films}
                        filmAdd={filmAdd}
                        branchs={branchs}
                        theaters={theaters}
                    />}
                />
                <Route path={`${match.url}/add`} component={() => <PageAdd />} />
            </Switch>
        </div>
    );
}

export default ShowtimeIndex;