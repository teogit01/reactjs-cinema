import React, { useEffect } from 'react';
import './film.scss'
import { Route, Switch } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import { loadFilm } from './filmSlice'
import { loadGenre } from 'features/genre/genreSlice'
import { loadCountry } from 'features/country/countrySlice'

import callApi from 'api/apiCaller'

import MainPage from './pages/main'
import AddPage from './pages/add'
import PageDetail from './pages/page.detail'

function Film(props) {
    const { match } = props
    const dispatch = useDispatch()
    const film_store = useSelector(state => state.films)
    const genre_store = useSelector(state => state.genres)
    const country_store = useSelector(state => state.countrys)
    // load film
    useEffect(() => {
        const LoadFilm = async () => {
            let data = await callApi('film')
            if (data) {
                dispatch(loadFilm(data.data))
            }
        }
        const LoadGenre = async () => {
            let data = await callApi('genre')
            if (data) {
                dispatch(loadGenre(data.data))
            }
        }
        const LoadCountry = async () => {
            let data = await callApi('country')
            if (data) {
                dispatch(loadCountry(data.data))
            }
        }
        LoadFilm()
        LoadGenre()
        LoadCountry()
    }, [])

    let optionsGenre = genre_store.map(item => {
        return { value: item._id, label: item.name }
    })
    let optionsCountry = country_store.map(item => {
        return { value: item._id, label: item.name }
    })
    return (
        <div className='wrap-page-film'>
            <Switch>
                <Route path={`${match.url}`} exact component={() => <MainPage listFilm={film_store} />} />
                <Route path={`${match.url}/add`} component={() => <AddPage optionsGenre={optionsGenre} optionsCountry={optionsCountry} />} />

                <Route path={`${match.url}/detail/:film_id`} component={() => <PageDetail />} />
            </Switch>
        </div>
    );
}

export default Film;