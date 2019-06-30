import {createMuiTheme} from '@material-ui/core/styles';

const muiTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#323D54',
    },
    secondary: {
      main: '#53658a',
    },
    contrastThreshold: 5,
    tonalOffset: 0.5,
  },
});

export default muiTheme;
