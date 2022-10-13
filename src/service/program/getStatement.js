import axios from 'axios'
const getStatement = async (organizationId, programId, filters) => {
    try {
        const response = await axios.get(
          `/organization/${organizationId}/program/${programId}/statement`,
          filters
        );
        return response.data;
    } catch (e) {
        throw new Error(`API error:${e?.message}`);
    }
};
export default getStatement