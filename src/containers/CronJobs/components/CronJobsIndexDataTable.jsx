import React, {useState} from "react";
import {Link, withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import axios from 'axios';
import {QueryClient, QueryClientProvider, useQuery} from 'react-query'
import {fetchApiData, initialState, reducer} from "@/shared/apiTableHelper"
import CronJobsConfirm from "./CronJobsRunConfirm";
import CronJobsRunResult from "./CronJobsRunResult";

const queryClient = new QueryClient()

const DataTable = ({organization}) => {

  const [{queryPageIndex, queryPageSize, queryPageFilter, queryPageSortBy}, dispatch] =
  React.useReducer(reducer, initialState);
  const [isOpen, setOpen] = useState(false);
  const [isOpenOutput, setOpenOutput] = useState(false);
  const [cronId, setCronId] = useState(null);
  const [output, setOutput] = useState(null);
  const toggle = () => {
    setOpen(prev => !prev)
  }
  const toggleOutput = () => {
    setOpenOutput(prev => !prev)
  }
  const apiUrl = `/cron-jobs/read-list`;
  const { isLoading, error, data, isSuccess } = useQuery(
    ['cron-jobs', apiUrl],
    () => fetchApiData(
      {
        url: apiUrl,
      }),
    {
      keepPreviousData: true,
      staleTime: Infinity,
    }
  );

  const createMarkup = (value) => {
    return {__html: value};
  }

  let tableIndex = 0;

  const onConfirmCronJobs = async () => {
    const apiRunUrl = `/cron-jobs/run/${cronId}`;
    try {
      const response = await axios.get(
        apiRunUrl
      );
      if (response.data.length === 0) return {results: [], count: 0}

      let data = response.data.output;
      try {
        data = Object.entries(data).map(x=>x.join(": ")).join("<br/>");
      } catch (e) {
        data = JSON.stringify(data);
      }

      setOutput(data);
      setOpen(false);
      setOpenOutput(true);

    } catch (e) {
      throw new Error(`API error:${e?.message}`);
    }
  }

  if (error) {
    return <p>Error: {JSON.stringify(error)}</p>;
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isSuccess) {
    return (
      <>
        <div className='table react-table merchant-table'>
          <table className="table">
            <thead>
                <th>№</th>
                <th>Cron</th>
                <th>Action</th>
            </thead>
            <tbody className="table table--bordered">
              {data.results.map((row, index) => {
                let i = index + 1

                if (row.command) {
                  tableIndex++;
                  return (
                    <tr>
                      <td>{ tableIndex }</td>
                      <td>
                        <div style={{color:'#a5a5a5'}}><span dangerouslySetInnerHTML={ createMarkup(row.comment) } /></div>
                        <div style={{color: row.color}}>{ row.value }</div>
                      </td>
                      <td>
                        <Link className={'link-run-cron'} onClick={()=>{
                          setCronId(i);
                          setOpen(true)}
                        } >Run</Link>
                      </td>
                    </tr>
                  )
                }

              })}
            </tbody>
          </table>
        </div>
        <CronJobsConfirm action={onConfirmCronJobs} isOpen={isOpen} setOpen={setOpen} toggle={toggle} />
        <CronJobsRunResult output={output} isOpen={isOpenOutput} setOpen={setOpenOutput} toggle={toggleOutput} />
      </>
    )
  }
}


const TableWrapper = ( {organization} ) => {
    if( !organization ) return 'Loading...'
    return (
        <QueryClientProvider client={queryClient}>
            <DataTable organization={organization} />
        </QueryClientProvider>
    )
}

export default withRouter(connect((state) => ({
    theme: state.theme,
    rtl: state.rtl,
    organization: state.organization
}))(TableWrapper));