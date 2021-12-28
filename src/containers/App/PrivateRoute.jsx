import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { isAuthenticated, isVerified } from './auth';

const isEmailVerifyPath = (props) => {
    // console.log(props)
    // if (typeof props.location === 'undefined') return null;
    // if (typeof props.location.pathname === 'undefined') return null;
    // return props.location.pathname === '/email/verify'
    return props.path === '/email/verify/:userid?/:vcode?'
}

const PrivateRoute = ({component: Component, ...rest}) => {
    // console.log(isEmailVerifyPath(rest))
    return (
        <Route {...rest} render={props => (
            isAuthenticated() ? ( !isVerified() && !isEmailVerifyPath(rest) ? 
            <Redirect to="/email/verify" /> : <Component {...props} />  )
            : <Redirect to="/login" />
        )} />
    );
};

export default PrivateRoute;