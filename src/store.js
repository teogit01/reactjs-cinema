import { configureStore } from '@reduxjs/toolkit'
import filmReducer from 'features/film/filmSlice'
import genreReducer from 'features/genre/genreSlice'
import countryReducer from 'features/country/countrySlice'
import branchReducer from 'features/branch/branchSlice'
import roomReducer from 'features/room/roomSlice'
import theaterReducer from 'features/theater/theaterSlice'

const rootReducer = {
    films: filmReducer,
    genres: genreReducer,
    countrys: countryReducer,
    branchs: branchReducer,
    rooms: roomReducer,
    theaters: theaterReducer
}

const store = configureStore({
    reducer: rootReducer
})

export default store