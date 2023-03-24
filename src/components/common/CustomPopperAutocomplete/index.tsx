import { makeStyles, Popper, Theme } from '@material-ui/core';

export const useStylesAutoComplete = makeStyles((theme: Theme) => ({
  root: {
    zIndex: theme.zIndex.modal,

    '& .MuiAutocomplete-option': {
      backgroundColor: 'white',
      transition: 'all 0.1s linear !important',

      '&:hover, &:active, &:focus, &[data-focus="true"]': {
        color: 'white !important',
        backgroundColor: 'rgba(43,109,163, 1) !important',
      },
      '&[aria-selected="true"]': {
        color: 'white !important',
        backgroundColor: 'rgba(43,109,163, 0.8) !important',
      },
    },
  },
}));

const CustomPopperAutocomplete = function (props) {
  const classes = useStylesAutoComplete();
  return <Popper {...props} className={classes.root} placement="bottom" />;
};

export default CustomPopperAutocomplete;
