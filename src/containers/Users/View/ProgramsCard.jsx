import React, {useState, useEffect} from 'react'
import { Col, Row, Card, CardBody, Spinner } from 'reactstrap'
// import Select from 'react-select'
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'
import axios from 'axios'
import useDebounce from "@/useDebounce"
import {useDispatch, sendFlashMessage} from "@/shared/components/flash"
import ApiErrorMessage from "@/shared/components/ApiErrorMessage"
import {inArray, extractRolesFromProgramPermissions} from "@/shared/helpers"
import { fetchRoles, fetchUserPrograms, fetchUserProgramPermissions } from "@/shared/apiHelper"
import ProgramFormModal from './ProgramFormModal'

const queryClient = new QueryClient()

const ProgramsCard = ( {user, organization}) => {
    const dispatch = useDispatch()

    // console.log(user)
    // console.log(organization)

    const [loading, setLoading] = useState(false)
    const [program, setProgram] = useState(null)
    const [userPrograms, setUserPrograms] = useState(null)
    const [userProgramIds, setUserProgramIds] = useState(null)
    const [isOpen, setOpen] = useState(false);
    const [keyword, setKeyword] = useState('')
    const [show, setShow] = useState(false)
    const [adding, setAdding] = useState(false)
    const [removing, setRemoving] = useState(false)
    const [roles, setRoles] = useState(null)
    const [programRoles, setProgramRoles] = useState(null)
    const [pristine, setPristine] = useState(true)
    const [updating, setUpdating] = useState(false)

    const toggle = () => {
        setOpen(prevState => !prevState)
    }

    const search = async( queryKeyword, cbShow ) => {
        if( queryKeyword.trim().length < 2) return []
        // console.log("searching..")
        try {
            const response = await axios.get(
            `/organization/${organization.id}/program?minimal=true&keyword=${queryKeyword}`
            );
            return response.data;
        } catch (e) {
            throw new Error(`API error:${e?.message}`)
        }
    }

    const debouncedKeyword = useDebounce(keyword, 500);

    const { isLoading, error, data, isSuccess } = useQuery(
        ['users', debouncedKeyword, setShow],
        () => search( debouncedKeyword ).then( results => {
            setShow(true)
            setPristine(false)
            return results
        }),
        {
            keepPreviousData: false,
            staleTime: Infinity,
        }
    )

    const getRoles = () => {
        setLoading(true)
        fetchRoles( organization.id )
        .then( data => {
            setRoles(data);
            setLoading(false)
        })
    }

    const getUserPrograms = () => {
        setLoading(true)
        fetchUserPrograms( organization.id, user.id )
        .then( data => {
            setUserPrograms(data);
            setUserProgramIds(data.map(a => a.id));
            setLoading(false)
        })
    }

    useEffect( () => {
        if( organization?.id)   {
            getUserPrograms()
            getRoles()
        }
    }, [])

    const onChangeSearchKeyword = (e) => {
        const s = e.target.value
        setKeyword(s)
    }    
    
    const toggleResults = () => {
        setShow( ! show )
    }

    const onClickAddProgram = async( program, updating = false ) => {
        setOpen(true)
        setProgram(program)
        setProgramRoles(null)
        if( updating )  {
            setUpdating(true)
            fetchUserProgramPermissions(organization.id, user.id, program.id)
            .then( _permissions => {
                const _roles = extractRolesFromProgramPermissions(_permissions, program.id);
                setProgramRoles(_roles)
            })
        }
    }

    const addProgram = values => {
        // console.log(JSON.stringify({values, program}))
        // return
        if( !program || !values.roles ) return
        const data = {
            program_id: program.id,
            roles: values.roles
        }
        // alert(JSON.stringify(data))
        // return
        setAdding(true)
        axios.post(`/organization/${organization.id}/user/${user.id}/program`, data)
        .then( (res) => {
            if(res.status == 200)  {
                setAdding(false)
                setShow( false )
                dispatch(sendFlashMessage('Program added successfully!', 'alert-success'))
                toggleResults()
                setKeyword('')
                setOpen(false)
                if( !updating ) getUserPrograms()
                setUpdating( false )
            }
        })
        .catch( error => {
            setShow( false )
            dispatch(sendFlashMessage(<ApiErrorMessage errors={error.response.data} />, 'alert-danger'))
            console.log(error.response.data);
            setAdding(false)
        })
    }

    const onClickRemoveProgram = ( program ) => {
        if( !window.confirm( 'Are you sure to remove this program from the user?') )    {
            return;
        }
        setRemoving(true)
        axios.delete(`/organization/${organization.id}/user/${user.id}/program/${program.id}`)
        .then( (res) => {
            if(res.status == 200)  {
                setRemoving(false)
                dispatch(sendFlashMessage('Program removed successfully!', 'alert-success'))
                toggleResults()
                setKeyword('')
                getUserPrograms()
            }
        })
        .catch( error => {
            dispatch(sendFlashMessage(<ApiErrorMessage errors={error.response.data} />, 'alert-danger'))
            console.log(error.response.data);
            setRemoving(false)
        })
    }

    // console.log(data)
    // console.log(userProgramIds)

    if( loading ) return '<p>Loading...</p>';

    const RenderResultItem = ({ program, isSub }) => {
        
        const exists = inArray(program.id, userProgramIds)
        const action = exists ? 'remove' : 'add'

        return (
        <Row className={[`pt-2 pb-0 row-item-program pr-0 ml-0`, isSub ? 'is-sub' : '']}>
            <Col md="6" lg="6" xl="6">{program.id} - {program.name}</Col>
            <Col md="6" lg="6" xl="6" className='pr-3 text-right'><div className='a ucfirst' disabled={adding || removing} onClick={(e)=> exists ? onClickRemoveProgram(program) : onClickAddProgram(program)}>{action}</div></Col>
            {program.children && program.children.length > 0 && <RenderResultPrograms programs={program.children} isSub={true} />}
        </Row>
    )}

    const RenderResultPrograms = ({programs, isSub = false}) => {
        // console.log(programs)
        if( !pristine && keyword.length > 1 && programs.length == 0) return 'No program found'
    
        return (
            programs.map( (program, i) => <RenderResultItem isSub={isSub} program={program} key={`item-program-{${i}}`} /> )
        )
    }

    const RenderItem = ({ program }) => (
        <Row className='pt-4 pb-1 row-item-program pr-0 ml-0'>
            <Col md="6" lg="6" xl="6">{program.id} - {program.name}</Col>
            <Col md="6" lg="6" xl="6" className='pr-3 text-right'><span className='a' onClick={(e)=>onClickRemoveProgram( program )}>Remove</span> | <span className='a' onClick={(e)=>onClickAddProgram( program, true )}>Manage Role</span></Col>
        </Row>
    )

    return(
        <Card className='user-program-card'>
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
                                    <RenderResultPrograms programs={data} />
                                }
                                </div>
                            {
                                <div className='program-existing_results mt-4'>
                                {
                                    userPrograms && userPrograms.length > 0 && userPrograms.map( (program, i) => <RenderItem program={program} key={`item-program-{${i}}`} /> )
                                }
                                </div>
                            }
                            </div>
                            {program && roles && <ProgramFormModal program={program} roles={roles} programRoles={programRoles} isOpen={isOpen} setOpen={setOpen} toggle={toggle} cbAddProgram={addProgram} />}
                        </form>
                    </Col>
                </Row>
            </CardBody>
        </Card>
    )
}

const ProgramsCardWrapper = ({user, organization}) => {
    return (
        <QueryClientProvider client={queryClient}>
            <ProgramsCard user={user} organization={organization} />
        </QueryClientProvider>
    )
}

export default ProgramsCardWrapper;