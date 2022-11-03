import axios from 'axios'
export const getTransferMonies = async (organizationId, programId) => {
    console.log(organizationId, programId)
    try {
        const response = await axios.get(
          `/organization/${organizationId}/program/${programId}/transferMonies`
        );
        console.log(response)
        return response.data;
    } catch (e) {
        throw new Error(`API error:${e?.message}`);
    }
};
export const postTransferMonies = async (organizationId, programId, data) => {
    try {
        const response = await axios.post(
          `/organization/${organizationId}/program/${programId}/transferMonies`,
          data
        );
        return response.data;
    } catch (e) {
        throw new Error(`API error:${e?.message}`);
    }
};