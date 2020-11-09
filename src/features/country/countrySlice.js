import { createSlice } from '@reduxjs/toolkit'

const country = createSlice({
    name: 'countrys',
    initialState: [],
    reducers: {
        loadCountry: (state, action) => {
            return action.payload
        },
        addCountry: (state, action) => {
            state.push(action.payload)
        },
        delCountry: (state, action) => {
            return state.filter(country => country._id !== action.payload)
        }
    }
})

const { reducer, actions } = country
export const { loadCountry, addCountry, delCountry } = actions
export default reducer