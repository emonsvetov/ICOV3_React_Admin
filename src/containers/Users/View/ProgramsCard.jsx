import React, {useState, useCallback, useEffect} from 'react'
import { Col, Row, Card, CardBody, Spinner } from 'reactstrap'
// import Select from 'react-select'
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'
import axios from 'axios'
import useDebounce from "@/useDebounce"

const queryClient = new QueryClient()

const PROGRAMS = [
    {id: "001", name: 'Program 1'},
    {id: "002", name: 'Program 2'},
    {id: "003", name: 'Program 3'},
]

const ProgramsCard = ( {user, organization}) => {

    const search = async( queryKeyword, cbShow ) => {
        if( queryKeyword.trim().length < 2) return []
        // console.log("searching..")
        try {
            const response = await axios.get(
            `/organization/${organization.id}/program?minimal=true&keyword=${queryKeyword}`
            );
            console.log(response)
            const results = response.data;
            cbShow(true)
            return results;
        } catch (e) {
            throw new Error(`API error:${e?.message}`)
        }
    }

    const [keyword, setKeyword] = useState('')
    const [show, setShow] = useState(false)

    const debouncedKeyword = useDebounce(keyword, 500);

    const { isLoading, error, data, isSuccess } = useQuery(
        ['users', debouncedKeyword, setShow],
        () => search(debouncedKeyword, setShow),
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

    // console.log(data)
    // console.log(show)

    return(
        <Card>
            <CardBody className='infoview'>
                <h3 className="mb-4">Programs</h3>
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
                            {
                                // <div className='program-existing_results'>
                                // {
                                //     PROGRAMS.map( (program, i) => <RenderItem program={program} key={`item-program-{${i}}`} /> )
                                // }
                                // </div>
                            }
                            </div>
                        </form>
                    </Col>
                </Row>
            </CardBody>
        </Card>
    )
}

const RenderItem = ({ program }) => (
    <Row className='pt-4 pb-1 row-item-program pr-0 ml-0'>
        <Col md="6" lg="6" xl="6">{program.id} - {program.name}</Col>
        <Col md="6" lg="6" xl="6" className='pr-3 text-right'><span className='a' onClick={()=>alert(program.id)}>Remove</span></Col>
    </Row>
)
const RenderResultItem = ({ program }) => (
    <Row className='pt-4 pb-1 row-item-program pr-0 ml-0'>
        <Col md="6" lg="6" xl="6">{program.id} - {program.name}</Col>
        <Col md="6" lg="6" xl="6" className='pr-3 text-right'><span className='a' onClick={()=>alert(program.id)}>Add</span></Col>
    </Row>
)

const ProgramsCardWrapper = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <ProgramsCard />
        </QueryClientProvider>
    )
}

export default ProgramsCardWrapper;