import axios from 'axios'

const getUserPointBalance = async (organizationId, programId, userId) => {
    try {
        const response = await axios.get(`/organization/${organizationId}/program/${programId}/user/${userId}/balance`)
        return response.data
    } catch (e) {
        throw new Error(`API error`)
    }
}

export default getUserPointBalance