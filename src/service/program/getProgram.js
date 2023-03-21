import axios from 'axios'
export const getProgram = async (organizationId, programId) => {
    const response = await axios.get(
        `/organization/${organizationId}/program/${programId}`
    );
    return response.data;
};