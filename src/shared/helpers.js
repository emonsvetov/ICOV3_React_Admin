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

const ligthTheme = {
    backgroundColor: 'white',
    color: '#646777',
};
  
const darkTheme = {
    backgroundColor: '#2e2c34',
    color: '#dddddd',
};
  
export const themes = {
    ligthTheme,
    darkTheme,
};
  
  export const emailPatter = /^[\w-]+(\.[\w-]+)*@([a-z0-9-]+(\.[a-z0-9-]+)*?\.[a-z]{2,6}|(\d{1,3}\.){3}\d{1,3})(:\d{4})?$/;
  export const urlPattern = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_.~#?&//=]*)/;
  
  export const toPercent = (decimal, fixed = 0) => `${decimal.toFixed(fixed)}%`;
  
  export const getTooltipStyles = (themeName, type) => {
    switch (themeName) {
      case 'theme-dark': {
        const { backgroundColor, color } = darkTheme;
        return {
          contentStyle: { backgroundColor },
          itemStyle: type === 'defaultItems' ? null : { color },
        };
      }
      case 'theme-light': {
        return ligthTheme;
      }
      default: return ligthTheme;
    }
};

  