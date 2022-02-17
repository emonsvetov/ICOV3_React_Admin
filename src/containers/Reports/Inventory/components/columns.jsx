import { Link } from 'react-router-dom';
const header_columns1 = [
  {
    Header: ' ',
    accessor: 'name',
  },  
  {
      Header: '$1',
      accessor: 'd1',
    },
    {
      Header: '$2',
      accessor: 'd2',
    },
    {
      Header: '$5',
      accessor: 'd5',
    },
]
const header_columns2 = [
    {
        Header: '$',
        accessor: 'cost_basis',
        Cell: ({ row, value }) => { return `$${parseFloat(value).toFixed(2)}`},
      }
]



export const PROGRAM_COLUMNS = [
    
    {
        Header: "Promotional Codes On Hand",
        columns: header_columns1,
        textAlign:'center'
        
    },
    {
        Header: "Cost Basis",
        columns: header_columns2
    },
]

