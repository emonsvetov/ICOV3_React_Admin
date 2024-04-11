
import axios from 'axios'

const getCsvImportTypes = async (organizationId, type) => {
    try {
        const url = `/organization/${organizationId}/importtype`;
        const response = await axios.get(url);
        return response.data;
    } catch (e) {
        throw new Error(`API error:${e?.message}`);
    }
}
export default getCsvImportTypes