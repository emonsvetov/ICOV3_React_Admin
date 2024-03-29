export const FLASH_MESSAGE = 'FLASH_MESSAGE';

export const sendFlashMessage = (message, className, type) => {
  return {
    type: FLASH_MESSAGE,
    payload: {
      message,
      className,
      type
    }
  }
};