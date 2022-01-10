import React, {useState} from 'react'
import { Col, Row, Card, CardBody } from 'reactstrap'
// import Select from 'react-select'
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'
import axios from 'axios'

const queryClient = new QueryClient()

const search = async( queryKeyword ) => {
    if( queryKeyword.trim().length < 2) return []

    return PROGRAMS;

    try {
        const response = await axios.get(
        `/organization/1/program?minimal=true`
        );
        const results = response.data;
        return results;
    } catch (e) {
        throw new Error(`API error:${e?.message}`)
    }
}

const PROGRAMS = [
    {id: "001", name: 'Program 1'},
    {id: "002", name: 'Program 2'},
    {id: "003", name: 'Program 3'},
]

const ProgramsCard = ( {user}) => {

    const [keyword, setKeyword] = useState('')
    const [results, setResults] = useState([])

    const { isLoading, error, data, isSuccess } = useQuery(
        ['users', keyword],
        () => search(keyword),
        {
            keepPreviousData: false,
            staleTime: Infinity,
        }
    )

    console.log(data)

    const onSearchChange = (e) => {
        const s = e.target.value
        setKeyword(s)
        setResults([])
        if( s.trim().length < 2)   {
            return
        }
        setResults(PROGRAMS)
    }

    return(
        <Card>
            <CardBody className='infoview'>
                <h3 className="mb-4">Programs</h3>
                <Row>
                    <Col md="6" lg="6" xl="6">
                        <form className='form'>
                            <div className="form__form-group-field">
                                <div className="form__form-group-row">
                                    <input value={keyword} onChange={onSearchChange} type="text" name="keyword" placeholder="Search programs by ID or name" className='select-input' />
                                    <span class="sidebar__link-icon lnr lnr-chevron-down select-arrow"></span>
                                </div>
                            </div>
                            <div className='form__form-group-field row-program-list-wrap flex-column position-relative'>
                            
                                <div className='program-search_results'>
                                {error && "Error fetching"}
                                {isLoading && "Loading..."}
                                {isSuccess && data.length > 0 &&
                                    PROGRAMS.map( (program, i) => <RenderResultItem program={program} key={`item-program-{${i}}`} /> )
                                }
                                </div>
                            {
                                <div className='program-existing_results'>
                                {
                                    PROGRAMS.map( (program, i) => <RenderItem program={program} key={`item-program-{${i}}`} /> )
                                }
                                </div>
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

export default ProgramsCard