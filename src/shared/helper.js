export const getLabelByCode = (code, list) => {
    // console.log(list.find( item => item.value === code)?.label)
    return list.find( item => item.value === code)?.label
}

export const patch4Select = (data, field, list, cb) => {
    // console.log(data[field])
    // console.log(list)
    if( typeof data[field] === 'object') return data //in case it is already patched!
    return {
        ...data, 
        ...{
            [field]: {
                label: typeof cb === 'function' ? cb(data[field], list) : data[field],
                value: data[field]
            }
        }
    }
}

export const unpatchSelect = (values, fields) => {
    let clean = {}
    fields.map( field => {
        clean[field] = values?.[field]?.value
    })
    return {...values, ...clean}
}