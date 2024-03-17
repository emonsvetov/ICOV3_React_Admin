import axios from 'axios'
export const getUnitNumbers = async (organizationId, programId, params="") => {
  try {
    let url = `/organization/${organizationId}/program/${programId}/unitnumber`
    if( params != "" ) {
      url += `?${params}`
    }
    const response = await axios.get(
      url
    )
    return response.data
  } catch (e) {
    throw new Error(`API error:${e?.message}`);
  }
}

export default getUnitNumbers