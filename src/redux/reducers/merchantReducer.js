import { handleActions } from 'redux-actions';
import {
    setMerchant,
} from '../actions/merchantActions';

const defaultState = {
};

export default handleActions(
    {
        [setMerchant](state, action) {
            return { ...state, ...action.payload };
        }
    },
    defaultState,
);
