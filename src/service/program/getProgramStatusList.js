import axios from 'axios'

const getProgramStatusList = async (organizationId) => {
    try {
        const response = await axios.get(
          `/organization/${organizationId}/programstatus`
        );
        return response.data;
    } catch (e) {
        throw new Error(`API error:${e?.message}`);
    }
};
export default getProgramStatusList