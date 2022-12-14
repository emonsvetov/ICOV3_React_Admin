import { handleActions } from 'redux-actions';
import {setDefaultTheme, getDefaultTheme} from '@/shared/helpers'
import {
  changeThemeToDark,
  changeThemeToLight,
} from '../actions/themeActions';

const defaultState = {
  className: getDefaultTheme(),
};

export default handleActions(
  {
    [changeThemeToDark]() {
      setDefaultTheme('theme-dark')
      return { className: 'theme-dark' };
    },
    [changeThemeToLight]() {
      setDefaultTheme('theme-light')
      return { className: 'theme-light' };
    },
  },
  defaultState,
);
