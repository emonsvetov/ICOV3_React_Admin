import React, { useMemo } from 'react';

function SelectColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id },
}) {
  // Calculate the options for filtering
  // using the preFilteredRows
  const options = React.useMemo(() => {
    const options = new Set()
    preFilteredRows.forEach(row => {
      options.add(row.values[id])
    })
    return [...options.values()]
  }, [id, preFilteredRows])

  // Render a multi-select box
  return (
    <select
      value={filterValue}
      onChange={e => {
        setFilter(e.target.value || undefined)
      }}
    >
      <option value="">All</option>
      {options.map((option, i) => (
        <option key={i} value={option}>
          {option}
        </option>
      ))}
    </select>
  )
}

const CreateTableData = () => {
  const columns = useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
        disableGlobalFilter: true,
        width: 65,
      },
      {
        Header: 'Program name',
        accessor: 'program_name',
      },
      {
        Header: 'Corporate entity',
        accessor: 'coentity',
        disableGlobalFilter: true,
      },
      {
        Header: 'Domain',
        accessor: 'domain',
        disableGlobalFilter: true,
      },
      {
        Header: 'Status',
        accessor: 'status',
        disableGlobalFilter: true,
      },
      {
        Header: 'Action',
        accessor: 'action',
        disableGlobalFilter: true,
        disableSortBy: true,
      },
    ],
    [],
  );

  const getRandomDate = (start, end) => new Date(start.getTime() + (Math.random() * (end.getTime()
    - start.getTime()))).toLocaleDateString();

  const data = [];
  const rows = () => {
    for (let i = 1; i < 36; i += 1) {
      data.push({
        id: i,
        pname: ['Incentco Global', 'Incentco Incentive  ', 'Xmas special', 'Resident Gifts'][Math.floor((Math.random() * 3))],
        coentity: ['Yes', 'No ', 'Not sure!'][Math.floor((Math.random() * 3))],
        domain: ['employeerewards.incentco.com', 'rewards.incentco.com', 'gifts.incentco.com'][Math.floor((Math.random() * 3))],
        status: ['Active', 'Inactive'][Math.floor((Math.random() * 2))],
        // date: getRandomDate(new Date(2002, 3, 1), new Date(1954, 3, 1)),
        action:''
      });
    }
  };

  rows();
  const reactTableData = { columns: columns, data: data };
  return reactTableData;
};

export default CreateTableData;
