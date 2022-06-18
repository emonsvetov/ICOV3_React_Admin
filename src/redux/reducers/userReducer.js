import { handleActions } from 'redux-actions';
import {
    setAuthUser
} from '../actions/userActions';

const defaultState = null

export default handleActions(
    {
        [setAuthUser](state, action) {
            return { ...state, ...action.payload };
        }
    },
    defaultState,
);
