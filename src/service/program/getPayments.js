import axios from 'axios'
const getPayments = async (organizationId, programId) => {
    try {
        const response = await axios.get(
          `/organization/${organizationId}/program/${programId}/payments`
        );
        // console.log(response)
        return response.data;
    } catch (e) {
        throw new Error(`API error:${e?.message}`);
    }
};
export default getPayments