import React, { Fragment, useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import '../../scss/app.scss';
import Routes from './Routes';
import store from './store';
import ScrollToTop from './ScrollToTop';
import {getBearer} from './auth';
import axios from 'axios'
import {useDispatch, sendFlashMessage, FlashMessage} from "@/shared/components/flash";


require('dotenv').config()
axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL;
axios.defaults.headers.common['Authorization'] = getBearer();
axios.defaults.headers.post['Content-Type'] = 'application/json';

axios.interceptors.request.use(request => {
    // console.log(request);
    // Edit request config
    return request;
}, error => {
    // console.log(error);
    return Promise.reject(error);
});

axios.interceptors.response.use(response => {
    // console.log(response);
    // Edit response config
    return response;
}, error => {
    // console.log(error);
    return Promise.reject(error);
});

const App = () => {

  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    window.addEventListener('load', () => {
      setIsLoading(false);
      setTimeout(() => setIsLoaded(true), 500);
      checkFlashMessage()
    });
  }, []);

  const checkFlashMessage = () => {
    const params = new URLSearchParams(window.location.search)
    let message = params.get('message')
    if( message ) {
      dispatch(sendFlashMessage(message, 'alert-success'))
    }
  }

  return (
    <Router>
      <ScrollToTop>
        <Fragment>
          {!isLoaded && (
            <div className={`load${isLoading ? '' : ' loaded'}`}>
              <div className="load__icon-wrap">
                <svg className="load__icon">
                  <path fill="#4ce1b6" d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z" />
                </svg>
              </div>
            </div>
          )}
          <div>
            <Routes />
            <FlashMessage />
          </div>
        </Fragment>
      </ScrollToTop>
    </Router>
  )
}

const AppProvider = () => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  )
}

export default AppProvider
