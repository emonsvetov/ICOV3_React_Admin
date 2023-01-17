import { handleActions } from 'redux-actions';
import {
    setProgramAction
} from '../actions/programActions';

const defaultState = null

export default handleActions(
    {
        [setProgramAction](state, action) {
            return { ...state, ...action.payload };
        }
    },
    defaultState,
);
