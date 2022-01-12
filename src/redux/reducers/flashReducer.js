import {FLASH_MESSAGE} from '../actions/flashActions';

const initialState = {  
  message: null,
  className: 'alert-success',
  type: 'nav'
}

export default (state = initialState, action) => {  
  switch(action.type){
    case FLASH_MESSAGE:
      return action.payload;
    default:
      return state;
  }
};