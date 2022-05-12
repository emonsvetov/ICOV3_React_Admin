import axios from 'axios'

export const fetchUser = async (organization_id, id ) => {
    try {
        const response = await axios.get(`/organization/${organization_id}/user/${id}`);
        // console.log(response)
        return response.data;
    } catch (e) {
        throw new Error(`API error:${e?.message}`);
    }
};

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

export const fetchUserProgramRoles = async(organization_id, user_id, program_id) => {
    try {
        const response = await axios.get(
        `/organization/${organization_id}/user/${user_id}/program/${program_id}/role`
        );
        // console.log(response)
        let results = response.data;
        return results;
    } catch (e) {
        throw new Error(`API error:${e?.message}`)
    }
}

export const fetchEventTypes = async() => {
    try {
        const response = await axios.get(
        `/eventtype`
        );
        // console.log(response)
        const results = response.data;
        return results;
    } catch (e) {
        throw new Error(`API error:${e?.message}`)
    }
}

export const fetchEmailTemplates = async(type) => {
    try {
        const response = await axios.get(
        `/emailtemplate/?type=${type}`
        );
        // console.log(response)
        const results = response.data;
        return results;
    } catch (e) {
        throw new Error(`API error:${e?.message}`)
    }
}