import { handleActions } from 'redux-actions';
import {
    setOrganization, setSuOrganization
} from '../actions/organizationActions';

const defaultState = null

export default handleActions(
    {
        [setOrganization](state, action) {
            return { ...state, ...action.payload };
        },
        [setSuOrganization](state, action) {
            return { ...state, ...action.payload };
        }
    },
    defaultState,
);
