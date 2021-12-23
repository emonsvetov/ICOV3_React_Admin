import React from 'react'
// import { Input, CustomInput } from "reactstrap"
// import renderSelectField from '@/shared/components/form/Select';
import Select from 'react-select';
export const StatusFilter = ({
    setFilter, preFilteredRows, id }) => {
    const [filterValue, setFilterValue] = React.useState("")

    const statuses = React.useMemo(() => {
      const statuses = new Set()
      preFilteredRows.forEach(row => {
        statuses.add(row.values[id])
      })
      return [...statuses.values()]
    }, [id, preFilteredRows])

    const options = React.useMemo(() => {
        const options = new Set()
        options.add({'value':'', 'label':'All'})
        statuses.forEach(value => {
            options.add({'value':value, 'label':value})
        })
        return [...options.values()]
    }, [statuses])

    // const options = new Array()
    // options.push({'value':'', 'label':'All'})
    // statuses.forEach(value => {
    //     // alert(value)
    //     options.push({'value':value, 'label':value})
    // })

    // console.log(options)

    const placeholder = filterValue ? filterValue : 'Status'

    const handleChange = (selectedOption) => {
        // onChange(selectedOption);
        // console.log(selectedOption)
        // alert(selectedOption)
        setFilterValue(selectedOption.value)
        setFilter("status", selectedOption.value || undefined)
    };
  
    return (
        <Select
            value={filterValue}
            onChange={handleChange}
            options={options}
            clearable={false}
            className="react-select"
            placeholder={placeholder}
            classNamePrefix="react-select"
        />
    //   <CustomInput
    //     id="status"
    //     type="select"
    //     value={filterValue}
    //     onChange={e => {
    //         setFilterValue(e.target.value)
    //         setFilter("status", e.target.value || undefined)
    //     }}
    //   >
    //     <option value="">All</option>
    //     {options.map(option => (
    //       <option key={option} value={option}>
    //         {option}
    //       </option>
    //     ))}
    //   </CustomInput>
    )
  }