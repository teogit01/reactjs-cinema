import { createSlice } from '@reduxjs/toolkit'

const genre = createSlice({
    name: 'genres',
    initialState: [],
    reducers: {
        loadGenre: (state, action) => {
            return action.payload
        },
        addGenre: (state, action) => {
            state.push(action.payload)
        },
        delGenre: (state, action) => {
            return state.filter(genre => genre._id !== action.payload)
        }
    }
})

const { reducer, actions } = genre
export const { loadGenre, addGenre, delGenre } = actions
export default reducer