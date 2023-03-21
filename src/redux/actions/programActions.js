import { createAction } from 'redux-actions';
import { getProgram } from '@/service/program/getProgram';

export const setProgramAction = createAction('SET_PROGRAM');

export const getProgramAction = (organizationId, programId) => {
    return (dispatch) => {
        getProgram(organizationId, programId)
        .then(program => {
            dispatch(setProgramAction(program))
        })
        .catch(e => {
            throw new Error(`API error:${e?.message}`);
        });
    };
};