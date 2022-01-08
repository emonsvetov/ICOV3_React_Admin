export const getLabelByCode = (value, list) => {
    return list.find( item => item.value === value)?.label
}

export const patch4Select = (data, field, list, cb) => {
    // console.log(data[field])
    // console.log(list)
    if( typeof data[field] === 'object') return data //in case it is already patched!
    return {
        ...data, 
        ...{
            [field]: {
                label: typeof cb === 'function' ? cb(data[field], list) : getLabelByCode(data[field], list),
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