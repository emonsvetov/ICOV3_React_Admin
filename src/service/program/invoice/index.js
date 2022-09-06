import axios from 'axios'
export const getInvoice = async (organizationId, programId, invoiceId) => {
    try {
        const response = await axios.get(
          `/organization/${organizationId}/program/${programId}/invoice/${invoiceId}`
        );
        // console.log(response)
        return response.data;
    } catch (e) {
        throw new Error(`API error:${e?.message}`);
    }
};

export const getPayInvoice = async (organizationId, programId, invoiceId) => {
    try {
        const response = await axios.get(
          `/organization/${organizationId}/program/${programId}/invoice/${invoiceId}/pay`
        );
        // console.log(response)
        return response.data;
    } catch (e) {
        throw new Error(`API error:${e?.message}`);
    }
};