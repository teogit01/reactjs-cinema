import { createSlice } from '@reduxjs/toolkit'

const room = createSlice({
    name: 'rooms',
    initialState: [],
    reducers: {
        loadRoom: (state, action) => {
            return action.payload
        },
        addRoom: (state, action) => {
            state.push(action.payload)
        },
        removeRoom: (state, action) => {
            return state.filter(room => room._id !== action.payload)
        }
    }
})

const { reducer, actions } = room
export const { loadRoom, addRoom, removeRoom } = actions
export default reducer