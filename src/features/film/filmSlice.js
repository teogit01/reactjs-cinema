import { createSlice } from '@reduxjs/toolkit'

const film = createSlice({
    name: 'films',
    initialState: [],
    reducers: {
        loadFilm: (state, action) => {
            return action.payload
        },
        addFilm: (state, action) => {
            state.push(action.payload)
        },
        removeFilm: (state, action) => {
            return state.filter(film => film._id !== action.payload)
        }
    }
})

const { reducer, actions } = film
export const { loadFilm, addFilm, removeFilm } = actions
export default reducer