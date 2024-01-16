
import axios from 'axios'

const getV2DeprecatedMigrate = async (id) => {
    try {
        const response = await axios.get(
          `/v2-deprecated/migrate/${id}`
        );
        return response.data;
    } catch (e) {
        throw new Error(`API error:${e?.message}`);
    }
}
export default getV2DeprecatedMigrate