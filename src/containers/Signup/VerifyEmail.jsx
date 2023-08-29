import React, { useState, useEffect } from 'react';
import {
    // BrowserRouter as Router,
    // Switch,
    // Route,
    Link,
    useParams
  } from "react-router-dom";
import axios from 'axios';
import { Col, Container, Row, Spinner} from 'reactstrap';
import Alert from '@/shared/components/Alert';
import {getAuthUser, AUTH_USER_KEY} from '../App/auth';
const TEXT_ALREADY_VERIFIED = 'You have verified your email already';
const VerifyEmail = () => {
    const [id, setId] = useState(null);
    const [step, setStep] = useState(0);
    const [code, setCode] = useState(null);
    const [errors, setErrors] = useState(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [completed, setCompleted] = useState(false);
    const [status403, setStatus403] = useState(false);
    const [initialized, setInitialized] = useState(true);
    const [verificationLinkSent, setVerificationLinkSent] = useState(false);

    const params = React.useMemo(() => new URLSearchParams(window.location.search), []) // id=123
    let expires = params.get('expires');
    let signature = params.get('signature');
    
    let { userid, vcode } = useParams();
    if( !id && typeof userid !== 'undefined')   {
        setId(userid);
    }
    if( !code && typeof vcode !== 'undefined')   {
        setCode(vcode);
    }
    useEffect(() => {
        init();
    });
    const processRequest = () => {
        if(!completed && !loading && id && code && expires && signature )    {
            setStep(1);
            setLoading(true);
            verifyEmail();
        }
    }
    const verifyEmail = () => {
        // console.log(window.location.pathname)
        if( completed || loading ) return;
        const fullUrl = window.location.pathname + '?expires=' + expires + '&signature=' + signature
        axios.get(fullUrl)
        .then( (res) => {
            console.log(res)
            // console.log(res.status == 200)
            if(res.status === 200)  {
                setSuccess(true)
                let user = getAuthUser()
                user.email_verified_at = new Date()
                localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
                // console.log(user)
                var tmp = setTimeout(() => {window.location.href = '/'}, 5000)
            }
            setCompleted(true)
            setLoading(false)
            setInitialized(false)
        })
        .catch( error => {
            // console.log(error.response);
            if( error.response.status === 403 ) {
                setStatus403(true);
            }
            setErrors(error.response.data.message);
            setLoading(false)
            setCompleted(true)
            setInitialized(false)
        })
    }
    const init = () => {
        const user = getAuthUser();
        // const token = getToken();
        // console.log(token)
        if( !user.email_verified_at )   {
            processRequest();
            return;
        }
        setErrors(TEXT_ALREADY_VERIFIED)
        setStep(1)
        setInitialized(false)
    }

    const onClickResendVerification = (e) => {
        if ( loading ) return;
        setLoading(true)
        axios.post('/email/verification-notification')
        .then( (res) => {
            console.log(res)
            if(res.status === 200)  {
                setStep(1);
                if( res.data.message==='Already Verified')  {
                    setErrors(TEXT_ALREADY_VERIFIED)
                }   else if( res.data.status === 'verification link sent' )   {
                    setVerificationLinkSent(true)
                }
            }
            setLoading(false)
            setInitialized(false)
        })
        .catch( error => {
            console.log(error)
            setInitialized(false)
        })
        e.preventDefault();
    }

  return (
    <Container className="dashboard">
    <Row>
      <Col md={12}>
        {/* <h3 className="page-title">Email Verification</h3> */}
        <Row>
            <Col md={12}>
                {step === 0 && <RenderInitialBlock onClick={onClickResendVerification} loading={loading} />}
                {step === 1 && 
                    <Alert dismiss={false} color="info" className="alert--bordered bg-white" icon>
                        {initialized && 
                            <ProcessingBlock />
                        }
                        {
                            errors && (!completed && !success) &&  <RenderErrorBlock status403={status403} errors={errors} />
                        }
                        {
                            completed && success && <RenderCompleted success={success}/>
                        }
                        {
                            verificationLinkSent && <RenderVerificationLinkSent />
                        }
                    </Alert>
                }
            </Col>
        </Row>
      </Col>
    </Row>
  </Container>
)}

const RenderInitialBlock = ({onClick, loading}) => {
    return (
        <Alert dismiss={false} color="info" className="alert--bordered bg-white" icon>
            <h4 className="bold-text text-warning mb-1">Email Verification Required!</h4><div>Email verification is still pending. Please check your email for a verification link set to you and click it to verify your account with us.</div>
            <div><span className="bold-text">Could not find the email?</span> <Link to="/#" onClick={onClick}>Resend verification link</Link> {loading && <Spinner animation="border" variant="warning" size="sm" />}</div>
        </Alert>
    )
}

const Render403 = (props) => {
    if( !props.status403 ) return null;
    return (
        <>
            <h4 className="bold-text text-danger mb-1">Invalid Request!</h4>
            <p className='text-dark'>There was an error processing your verification request. Please try again or contact site administrator.</p>
        </>
    )
}

const ProcessingBlock = (props) => {
    return (
        <>
            <h4 className="bold-text text-warning mb-1">Email Verification Required!</h4>
            <div>Email verification is processing <Spinner animation="border" variant="warning" size="sm" /></div>
        </>
    )
}

const RenderVerificationLinkSent = (props) => {
    return (
        <>
            <h4 className="bold-text text-success mb-1">Verification Link Sent!</h4>
            <p className='text-dark'>A link has been emailed to you. Please check your email inbox or check the junk folder if you do not find it in the inbox.</p>
        </>
    )
}
const RenderErrors = (props) => {
    if( !props.errors ) return null;
    if( props.status403 ) return null;
    return (
        <>
            <h4 className="bold-text text-warning mb-1">Error!</h4>
            <p className='text-danger'>{props.errors}</p>
        </>
    )
}
const RenderCompleted = (props) => {
    if( !props.success ) return null;
    return (
        <>
            <h4 className="bold-text text-success mb-1">Completed!</h4>
            <p className=''>You have completed your email verification successfully. You will be redirected in a moment.. Or click <Link to="/">this link</Link> to go to dashboard now!</p>
        </>
    )
}

const RenderErrorBlock = (props) => {
    return (
        <>
            <Render403 {...props} />
            <RenderErrors {...props} />
            <RenderCompleted {...props} />
        </>
    )
}

export default VerifyEmail;
