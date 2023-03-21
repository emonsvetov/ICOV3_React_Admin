
import axios from 'axios'

export default async(countryId) => {
    const response = await axios.get(`/country/${countryId}/state`)
    return response.data
}