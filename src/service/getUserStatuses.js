
import axios from 'axios'

const getUserStatusList = async (organizationId) => {
    try {
        const response = await axios.get(
          `/organization/${organizationId}/userstatus`
        );
        return response.data;
    } catch (e) {
        throw new Error(`API error:${e?.message}`);
    }
}
export default getUserStatusList