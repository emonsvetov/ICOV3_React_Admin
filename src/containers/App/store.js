import { combineReducers, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { reducer as reduxFormReducer } from 'redux-form';
import { sidebarReducer, themeReducer, rtlReducer, flashReducer, merchantReducer, organizationReducer, userReducer, programReducer } from '../../redux/reducers/index';

const reducer = combineReducers({
  form: reduxFormReducer, // mounted under "form",
  theme: themeReducer,
  sidebar: sidebarReducer,
  rtl: rtlReducer,
  flashMessage: flashReducer,
  merchant: merchantReducer,
  organization: organizationReducer,
  auth: userReducer,
  program: programReducer,
});

const store = createStore(reducer, applyMiddleware(thunk));
export default store;
