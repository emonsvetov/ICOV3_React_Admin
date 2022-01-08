export const FLASH_MESSAGE = 'FLASH_MESSAGE';
export const MODAL_FLASH_MESSAGE = 'MODAL_FLASH_MESSAGE';

export const sendFlashMessage = (message, className) => {
  return {
    type: FLASH_MESSAGE,
    payload: {
      message,
      className
    }
  }
};
export const sendModalFlashMessage = (message, className) => {
    return {
        type: MODAL_FLASH_MESSAGE,
        payload: {
            message,
            className
        }
    }
};