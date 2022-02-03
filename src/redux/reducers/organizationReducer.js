import { handleActions } from 'redux-actions';
import {
    setOrganization,
} from '../actions/organizationActions';

const defaultState = {
};

export default handleActions(
    {
        [setOrganization](state, action) {
            return { ...state, ...action.payload };
        }
    },
    defaultState,
);
