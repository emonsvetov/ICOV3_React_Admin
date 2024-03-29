import React, {useState} from 'react'
import { Col, Row, Card, CardBody, Spinner } from 'reactstrap'
// import Select from 'react-select'
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'
import axios from 'axios'
import useDebounce from "@/useDebounce"
import {useDispatch, sendFlashMessage} from "@/shared/components/flash"
import ApiErrorMessage from "@/shared/components/ApiErrorMessage"

const queryClient = new QueryClient()

const initialState = {
    queryTrigger: Math.floor(Date.now() / 1000)
};

const QUERY_TRIGGER = 'QUERY_TRIGGER';

const reducer = (state, { type, payload }) => {
    switch (type) {
      case QUERY_TRIGGER:
          return {
              ...state,
              queryTrigger: payload,
          };
      default:
        throw new Error(`Unhandled action type: ${type}`);
    }
  };

const AddProgramToDomain = ( {organization, domain, setTrigger, searchTrigger, setSearchTrigger}) => {

    // console.log(domain)

    const search = async( queryKeyword, cbShow ) => {
        // if( queryKeyword.trim().length < 2) return []
        // console.log("searching..")
        try {
            const response = await axios.get(
            `/organization/${domain.organization_id}/domain/${domain.id}/listAvailableProgramsToAdd?keyword=${queryKeyword}`
            );
            // console.log(response)
            const results = response.data;
            cbShow(true)
            return results;
        } catch (e) {
            throw new Error(`API error:${e?.message}`)
        }
    }

    const dispatch = useDispatch()

    const [keyword, setKeyword] = useState('')
    const [show, setShow] = useState(false)
    const [adding, setAdding] = useState(false)

    const debouncedKeyword = useDebounce(keyword, 500);

    const [{ queryTrigger }, dispatcher] = React.useReducer(reducer, initialState);

    const { isLoading, error, data, isSuccess } = useQuery(
        ['programs', debouncedKeyword, setShow, queryTrigger],
        () => search(debouncedKeyword, setShow, queryTrigger),
        {
            keepPreviousData: false,
            staleTime: Infinity,
        }
    )

    const onChangeSearchKeyword = (e) => {
        const s = e.target.value
        setKeyword(s)
    }    
    
    const toggleResults = () => {
        setShow( ! show )
    }

    const onClickAddProgram = (program_id) => {
        // alert(JSON.stringify(values))
        const data = {
            program_id
        }
        setAdding(true)
        axios.post(`/organization/${organization.id}/domain/${domain.id}/program`, data)
        .then( (res) => {
            if(res.status == 200)  {
                setAdding(false)
                dispatch(sendFlashMessage('Program added successfully!', 'alert-success'))
                toggleResults()
                setKeyword('')
                setTrigger( Math.floor(Date.now() / 1000) )
                setSearchTrigger( Math.floor(Date.now() / 1000) )
            }
        })
        .catch( error => {
            console.log(error)
            dispatch(sendFlashMessage(<ApiErrorMessage errors={error.response.data} />, 'alert-danger'))
            console.log(error.response.data);
            setAdding(false)
        })
    }

    // console.log(data)
    // console.log(show)

    const RenderResultItem = ({ program }) => (
        <Row className='pt-4 pb-1 row-item-program pr-0 ml-0'>
            <Col md="6" lg="6" xl="6">{program.id} - {program.name}</Col>
            <Col md="6" lg="6" xl="6" className='pr-3 text-right'><span className='a' disabled={adding} onClick={()=>onClickAddProgram(program.id)}>Add</span></Col>
        </Row>
    )

    React.useEffect(() => {
        dispatcher({ type: QUERY_TRIGGER, payload: searchTrigger });
    }, [searchTrigger]);

    return(
        <Card>
            <CardBody className='infoview'>
                <h3 className="mb-4">Add a Program to Domain</h3>
                <Row>
                    <Col md="6" lg="6" xl="6">
                        <form className='form'>
                            <div className="form__form-group-field">
                                <div className="form__form-group-row">
                                    <input value={keyword} onChange={onChangeSearchKeyword} type="text" name="keyword" placeholder="Search programs by ID or name" className='select-input' autoComplete='off' />
                                    {isLoading && <Spinner animation="border" size="sm" className='input-spinner' variant="warning" />}
                                    <span onClick={toggleResults} className={`sidebar__link-icon lnr select-arrow ${ show ? 'lnr-chevron-down' : 'lnr-chevron-up'}`}></span>
                                </div>
                            </div>
                            <div className='form__form-group-field row-program-list-wrap flex-column position-relative'>
                            
                                <div className='program-search_results'>
                                {error && "Error fetching"}
                                {isSuccess && show && 
                                    <>
                                        {
                                            data.length > 0 &&
                                            data.map( (program, i) => <RenderResultItem program={program} key={`item-program-{${i}}`} /> )
                                        }

                                        {data.length == 0 && 'No program found'}
                                    </>
                                }
                                </div>
                            </div>
                        </form>
                    </Col>
                </Row>
            </CardBody>
        </Card>
    )
}

const AddProgramToDomainWrapper = ({organization, domain, setTrigger, searchTrigger, setSearchTrigger}) => {
    return (
        <QueryClientProvider client={queryClient}>
            <AddProgramToDomain organization={organization} domain={domain} setTrigger={setTrigger} searchTrigger={searchTrigger} setSearchTrigger={setSearchTrigger} />
        </QueryClientProvider>
    )
}

export default AddProgramToDomainWrapper;