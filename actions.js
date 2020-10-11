import * as types from './types'

export const shuffle = () => ({ type: types.SHUFFLE });
export const setIsSorting = (val) => dispatch => dispatch({ type: types.SET_IS_SORTING, payload: val });
export const setComparisons = (val) => dispatch => dispatch({ type: types.SET_COMPARISONS, payload: val });
export const setNoBlocks = (val) => dispatch => dispatch({ type: types.SET_NO_BLOCKS, payload: val });
export const genBlocks = () => dispatch => dispatch({ type: types.GEN_BLOCKS });
export const highlight = (i, color) => ({ type: types.HIGHLIGHT, payload: { i, color } });
export const swap = (i1, i2) => dispatch => dispatch({ type: types.SWAP, payload: { i1, i2 } });
export const setBlock = (i, data) => dispatch => dispatch({ type: types.SET_BLOCK, payload: { i, data } });
export const insertBlock = (i, j) => dispatch => dispatch({ type: types.INSERT_BLOCK, payload: { i, j } });