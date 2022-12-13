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

export const unpatchSelect = (values, fields, renameFields = null) => {
    let clean = {}
    fields.map( (field, i) => {
        const fieldName = renameFields && renameFields[i] !== undefined && renameFields[i] ? renameFields[i] : field
        clean[fieldName] = values?.[field]?.value
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

// Object with no prototype to avoid false matches on `toString` and other built-ins
var mapChildrenToSubrows = Object.assign(Object.create(null), {
    "children": "subRows"
});
function refit_keys(o){
    var build, key, destKey, value;
    if (o === null || typeof o !== "object") {
        return o;
    }
    if (Array.isArray(o)) {
        return o.map(refit_keys);
    }
    build = {};
    for (key in o) {
        destKey = mapChildrenToSubrows[key] || key;
        value = o[key];
        if (typeof value === "object") {
            value = refit_keys(value);
        }
        build[destKey] = value;
    }
    return build;
}

export const renameChildrenToSubrows = data => {
    // console.log(data)
    
    if( !data || (typeof data == 'object' && data.length == 0) ) return data;
    // console.log(data)
    let newData = []
    data.map( row => {
        let newRow = refit_keys( row )
        newData.push( newRow )
    })
    return newData;
}

export const flatten = (array, prop = 'children') => {
    var result = [];
    array.forEach(function (a) {
        result.push(a);
        if (Array.isArray(a[prop])) {
            result = result.concat(flatten(a[prop], prop));
        }
    });
    return result;
}


export const mapFormDataUploads = (values, multiple = false) => {
    let data = new FormData()
    for (const [key, value] of Object.entries(values)) {
        // console.log(value)
        // console.log(typeof value)
        if(value && typeof value === 'object')  {
            if( multiple )    {
                value.map( itemValue => {
                    data.append(`${key}[]`, itemValue)
                })
            }   else {
                data.append(key, value[0])
            }
        }   else {
            data.append(key, value)
        }
    }
    return data
}

export const answerYesNo = value => value ? 'Yes' : 'No'

export const patchMediaURL = ( dataset, fields ) => {
    if( !dataset || !fields ) return dataset;
    for (const [key, value] of Object.entries(dataset)) {
        if( inArray(key, fields) && value && value.indexOf(process.env.REACT_APP_API_STORAGE_URL) === -1)  {
            dataset[key] = `${process.env.REACT_APP_API_STORAGE_URL}/${value}`
        }
    }
    return dataset
}

export const unpatchMedia = ( dataset, fields ) => {
    if( !dataset || !fields ) return dataset;
    for (const [key, value] of Object.entries(dataset)) {
        if( inArray(key, fields) && (typeof value === 'string' || value === null))  {
            delete dataset[key]
        }
    }
    return dataset
}

export const MERCHANT_MEDIA_FIELDS = ['logo', 'icon', 'large_icon', 'banner']

export const patchMerchantMediaURL = ( merchant ) => {
    if( !merchant ) return merchant;
    for (const [key, value] of Object.entries(merchant)) {
        if( inArray(key, MERCHANT_MEDIA_FIELDS) && value && value.indexOf(process.env.REACT_APP_API_STORAGE_URL) === -1)  {
            merchant[key] = `${process.env.REACT_APP_API_STORAGE_URL}/${value}`
        }
    }
    return merchant
}

export const unpatchMerchantMedia = ( merchant ) => {
    if( !merchant ) return merchant;
    for (const [key, value] of Object.entries(merchant)) {
        if( inArray(key, MERCHANT_MEDIA_FIELDS) && typeof value === 'string')  {
            delete merchant[key]
        }
    }
    return merchant
}

export const unpatchMerchantFields = (values) => {
    let data = {}
    for (const [key, value] of Object.entries(values)) {
        if( value === null || ( key === 'created_at' || key === 'updated_at') ) {
            //noting to do! Do not add field?
        }   else if( typeof value === 'boolean' )   {
            data[key] = value ? 1 : 0
        }   else   {
            data[key] = value
        }
    }
    data = unpatchMerchantMedia(data) //more unpatches here
    return data;
}

function arrayCompare(a1, a2) {
    if (a1.length != a2.length) return false;
    var length = a2.length;
    for (var i = 0; i < length; i++) {
        if (a1[i] !== a2[i]) return false;
    }
    return true;
}

export const inArray = (needle, haystack) => {
    if(!haystack || typeof haystack === 'undefined') return;
    var length = haystack.length;
    for(var i = 0; i < length; i++) {
        if(typeof haystack[i] == 'object') {
            if(arrayCompare(haystack[i], needle)) return true;
        } else {
            if(haystack[i] == needle) return true;
        }
    }
    return false;
}
// Check wheter an object is empty
export const isEmpty = (object) => { for(var i in object) { return false; } return true; }

export const isValidIPAddress = (ipAddress) => {
    var expression = /((^\s*((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))\s*$)|(^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$))/;
    return expression.test(ipAddress);
}

export const removeItemAll = (arr, value) => {
    var i = 0;
    while (i < arr.length) {
        if (arr[i] === value) {
            arr.splice(i, 1);
        } else {
            ++i;
        }
    }
    return arr;
}

export function jsdate2ymd(date) {
    let d = new Date(date)
    let month = '' + (d.getMonth() + 1)
    let day = '' + d.getDate()
    let year = d.getFullYear()

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;
    return [year, month, day].join('-');
}
export const dateStrToYmd = dateString => {
    let date = new Date( dateString )
    if( !isValidDateObj() ) return dateString;
    return date.toISOString().split('T')[0]
}

export const isValidDateObj = d => {
    return ( Object.prototype.toString.call(d) === "[object Date]" && !isNaN(d.getTime()) );
}

export function buildIdArray( object )    {
    let idArray = []
    for(var i in object)    {
        idArray.push( object[i].id );
    }
    return idArray
}

export function ucfirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export const extractRolesFromProgramPermissions = (permissionArr, programId) => {
    return permissionArr.map(function(item) { return parseInt(item.replace(`program.${programId}.role.`, ``)) })
}

export const labelizeNamedData = (data, fields = ["id", "name"]) => {
    let newData = []
    for( var i in data) {
        newData.push({label: String(data[i][fields[1]]), value: String(data[i][fields[0]])})
    }
    return newData;
}

export const labelizeRecursive = (programs, depth = 0) => {
    const fields = ["id", "name"];
    let labelizedData = []
    if( programs.length > 0) {
        programs.map( p => {
          labelizedData.push({label: String('-'.repeat(depth) + ' ' + p[fields[1]]), value: String(p[fields[0]])})
            if( p?.children && p.children.length > 0)   {
                depth++;
                labelizedData = [...labelizedData, ...labelizeRecursive(p.children, depth)]
            }
        })
    }
    return labelizedData;
}

export const BuildProgramOptions = ({programs, depth = 0}) => {
    let optionsHtml = []
    if( programs.length > 0) {
        programs.map( p => {
            optionsHtml.push(<option key={`program-option-${p.id}`} value={`${p.id}`}>{'-'.repeat(depth)} {p.name}</option>)
            if( p?.children && p.children.length > 0)   {
                depth++;
                optionsHtml.push(<BuildProgramOptions key={`program-option-group-${p.id}`} programs={p.children} depth={depth} />)
            }
        })
    }
    return optionsHtml
  }

export const toCurrency = (numberString) => {
    let locale = 'en-US';
    let options = {style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2};
    let formatter = new Intl.NumberFormat(locale, options);
    return formatter.format(numberString);
}

export const toPoints = (numberString) => {
    let locale = 'en-US';
    let options = {style: 'decimal', minimumFractionDigits: 3, maximumFractionDigits: 3};
    let formatter = new Intl.NumberFormat(locale, options);
    let number = formatter.format(numberString);
    return number.toString().replace(/\./g, ",");
}

export const indexOfAll = (array, searchItem) => {
    var i = array.indexOf(searchItem),
      indexes = [];
    while (i !== -1) {
        indexes.push(i);
        i = array.indexOf(searchItem, ++i);
    }
    return indexes;
}

export const getFirstDay = () => {
    let date = new Date();
    return new Date(date.getFullYear(), 0, 1)
}