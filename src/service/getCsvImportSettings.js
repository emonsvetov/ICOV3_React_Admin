
import axios from 'axios'

const getCsvImportSettings = async (organizationId, type) => {
    try {
        const url = `/organization/${organizationId}/csv-import-setting/${type}`;
        const response = await axios.get(url);
        return response.data;
    } catch (e) {
        throw new Error(`API error:${e?.message}`);
    }
}
export default getCsvImportSettings