import axios from 'axios'
const getStatement = async (organizationId, programId, filters) => {
    const response = await axios.get(
        `/organization/${organizationId}/program/${programId}/statement`,
        filters
    );
    return response.data;
};
export default getStatement