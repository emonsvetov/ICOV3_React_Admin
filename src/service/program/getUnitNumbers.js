import axios from 'axios'
export const getUnitNumbers = async (organizationId, programId) => {
  try {
    const response = await axios.get(
      `/organization/${organizationId}/program/${programId}/unitnumber`
    )
    return response.data
  } catch (e) {
    throw new Error(`API error:${e?.message}`);
  }
}

export default getUnitNumbers