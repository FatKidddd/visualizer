import { combineReducers } from 'redux'
import * as types from './types'

const width = 500;
const height = 300;

const initialBlocksState = {
	noBlocks: 25,
	blocks: Array.from({ length: 25 }, (_, i) => ({ width: width / 25, height: height / 25 * (i + 1), color: 'lightblue' })),
	isSorting: 0,
	comparisons: 0,
}

const blocksReducer = (state = initialBlocksState, action) => {
	switch (action.type) {
		case types.SHUFFLE: {
			let array = state.blocks.slice();
			let currentIdx = state.blocks.length, tempVal, randIdx;

			while (0 != currentIdx) {
				randIdx = Math.floor(Math.random() * currentIdx);
				currentIdx--;
				tempVal = array[currentIdx];
				array[currentIdx] = array[randIdx];
				array[randIdx] = tempVal;
				array[currentIdx].color = 'lightblue';
				array[randIdx].color = 'lightblue'
			}
			return Object.assign({}, state, {
				...state,
				blocks: array,
				isSorting: 0,
				comparisons: 0
			});
		}
		case types.HIGHLIGHT: {
			const { i, color } = action.payload;
			return Object.assign({}, state, {
				...state,
				blocks: [
					...state.blocks.slice(0, i),
					{
						...state.blocks[i],
						color: color,
					},
					...state.blocks.slice(i+1)
				]
			});
		}
		case types.SWAP: {
			const { i1, i2 } = action.payload;
			const res = state.blocks.slice();
			const t1 = state.blocks[i1];
			res[i1] = state.blocks[i2];
			res[i2] = t1;
			return Object.assign({}, state, {
				...state,
				blocks: res
			});
		}
		case types.SET_IS_SORTING: {
			return Object.assign({}, state, {
				...state,
				isSorting: action.payload
			});
		}
		case types.SET_COMPARISONS: {
			return Object.assign({}, state, {
				...state,
				comparisons: action.payload
			});
		}			
		case types.SET_NO_BLOCKS: {
			const noBlocks = action.payload;
			return Object.assign({}, state, {
				isSorting: 0,
				comparisons: 0,
				noBlocks: noBlocks,
				blocks: Array.from({ length: noBlocks }, (_, i) => ({
					width: width / noBlocks,
					height: height / noBlocks * (i + 1),
					color: 'lightblue'
				})),
			});
		}
		case types.SET_BLOCK: {
			const { i, data } = action.payload;
			return Object.assign({}, state, {
				...state,
				blocks: [
					...state.blocks.slice(0, i),
					data,
					...state.blocks.slice(i+1)
				]
			});
		}	
		case types.INSERT_BLOCK: {
			const { i, j } = action.payload;
			return Object.assign({}, state, {
				...state,
				blocks: [
					...state.blocks.slice(0, i),
					state.blocks[j],
					...state.blocks.slice(i, j),
					...state.blocks.slice(j+1)
				]
			});
		}	
		default:
			return state
	}
}

// COMBINED REDUCERS
const reducers = {
	sortingState: blocksReducer,
}

export default combineReducers(reducers)
