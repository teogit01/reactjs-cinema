import { createSlice } from '@reduxjs/toolkit'

const branch = createSlice({
    name: 'branchs',
    initialState: [],
    reducers: {
        loadBranch: (state, action) => {
            return action.payload
        },
        addBranch: (state, action) => {
            state.push(action.payload)
        },
        removeBranch: (state, action) => {
            return state.filter(branch => branch._id !== action.payload)
        }
    }
})

const { reducer, actions } = branch
export const { loadBranch, addBranch, removeBranch } = actions
export default reducer