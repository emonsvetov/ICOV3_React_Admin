
import axios from 'axios'

const getEmailTemplateTypeList = async (organizationId, programId) => {
    try {
        const response = await axios.get(
          `/organization/${organizationId}/program/${programId}/emailtemplate/typeList`
        );
        return response.data;
    } catch (e) {
        throw new Error(`API error:${e?.message}`);
    }
}
export default getEmailTemplateTypeList