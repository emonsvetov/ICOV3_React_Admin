
import axios from 'axios'

export default async(orgId) => {
    const response = await axios.get(`/organization/${orgId}/event_icons?include=global`)
    return response.data
}