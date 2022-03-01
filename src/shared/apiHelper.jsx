import axios from 'axios'

export const fetchRoles = async(organization_id) => {
    try {
        const response = await axios.get(
        `/organization/${organization_id}/role?minimal=true`
        );
        // console.log(response)
        const results = response.data;
        return results;
    } catch (e) {
        throw new Error(`API error:${e?.message}`)
    }
}

export const fetchUserPrograms = async(organization_id, user_id) => {
    try {
        const response = await axios.get(
        `/organization/${organization_id}/user/${user_id}/program?minimal=true`
        );
        // console.log(response)
        const results = response.data;
        return results;
    } catch (e) {
        throw new Error(`API error:${e?.message}`)
    }
}

export const fetchUserProgramPermissions = async(organization_id, user_id, program_id) => {
    try {
        const response = await axios.get(
        `/organization/${organization_id}/user/${user_id}/program/${program_id}/permission`
        );
        // console.log(response)
        let results = response.data;
        return results;
    } catch (e) {
        throw new Error(`API error:${e?.message}`)
    }
}