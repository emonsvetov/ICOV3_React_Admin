import {MODAL_FLASH_MESSAGE} from '../actions/flashActions';

const initialState = {  
  message: null,
  className: null
}

export default (state = initialState, action) => {  
  switch(action.type){
    case MODAL_FLASH_MESSAGE:
      return action.payload;
    default:
      return state;
  }
};