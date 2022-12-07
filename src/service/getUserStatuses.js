
import axios from 'axios'

export default async(orgId) => {
    const response = await axios.get(`/organization/${orgId}/userstatus`)
    return response.data
}