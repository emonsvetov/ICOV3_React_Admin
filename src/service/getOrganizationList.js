
import axios from 'axios'

const getOrganizationList = async (organizationId) => {
    try {
        const response = await axios.get(
          `/organization`
        );
        return response.data;
    } catch (e) {
        throw new Error(`API error:${e?.message}`);
    }
}
export default getOrganizationList