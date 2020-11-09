import { createSlice } from '@reduxjs/toolkit'

const theater = createSlice({
    name: 'theaters',
    initialState: [],
    reducers: {
        loadTheater: (state, action) => {
            return action.payload
        },
        addTheater: (state, action) => {
            state.push(action.payload)
        },
        removeTheater: (state, action) => {
            return state.filter(theater => theater._id !== action.payload)
        }
    }
})

const { reducer, actions } = theater
export const { loadTheater, addTheater, removeTheater } = actions
export default reducer