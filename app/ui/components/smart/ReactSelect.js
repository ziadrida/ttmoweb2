/* eslint-disable react/prop-types, react/jsx-handler-names */

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Select from 'react-select';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import NoSsr from '@material-ui/core/NoSsr';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import MenuItem from '@material-ui/core/MenuItem';

import { emphasize } from '@material-ui/core/styles/colorManipulator';



const styles = theme => ({
  root: {
    flexGrow: 1,
    height: 250,
  },
  input: {
    display: 'flex',
    padding: 0,
  },
  valueContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flex: 1,
    alignItems: 'center',
    overflow: 'hidden',
  },
  chip: {
    margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`,
  },
  chipFocused: {
    backgroundColor: emphasize(
      theme.palette.type === 'light' ? theme.palette.grey[300] : theme.palette.grey[700],
      0.08,
    ),
  },
  noOptionsMessage: {
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
  },
  selectValue: {
    fontSize: 16,
  },
  placeholder: {
    position: 'absolute',
    left: 2,
    fontSize: 16,
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0,
  },
  divider: {
    height: theme.spacing.unit * 2,
  },
});

function NoOptionsMessage(props) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.noOptionsMessage}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

function inputComponent({ inputRef, ...props }) {
  return <div ref={inputRef} {...props} />;
}

function Control(props) {
  return (
    <TextField
      fullWidth
      InputProps={{
        inputComponent,
        inputProps: {
          className: props.selectProps.classes.input,
          inputRef: props.innerRef,
          children: props.children,
          ...props.innerProps,
        },
      }}
      {...props.selectProps.textFieldProps}
    />
  );
}

function Option(props) {
  return (
    <MenuItem
      buttonRef={props.innerRef}
      selected={props.isFocused}
      component="div"
      style={{
        fontWeight: props.isSelected ? 500 : 400,
      }}
      {...props.innerProps}
    >
      {props.children}
    </MenuItem>
  );
}

function Placeholder(props) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.placeholder}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

function SelectValue(props) {
  return (
    <Typography className={props.selectProps.classes.selectValue} {...props.innerProps}>
      {props.children}
    </Typography>
  );
}

function ValueContainer(props) {
  return <div className={props.selectProps.classes.valueContainer}>{props.children}</div>;
}



function Menu(props) {
  return (
    <Paper square className={props.selectProps.classes.paper} {...props.innerProps}>
      {props.children}
    </Paper>
  );
}

const components = {
  Control,
  Menu,

  NoOptionsMessage,
  Option,
  Placeholder,
  SelectValue,
  ValueContainer,
};

class ReactSelect extends React.Component {
  state = {
    selectionValue:''
  };
  static getDerivedStateFromProps(props, state) {
    console.log("ReactSelect getDerivedStateFromProps \nprops",props, "\nstate",state)
    var returnState = {}
    if (state.selectionValue != props.value) {
      returnState = {selectionValue: props.value};
    }

    return returnState;

  }

  handleChange = name => value => {
    console.log("ReactSelect handleChange name:value",name,":",value)
      console.log("ReactSelect value.value",value.value)
    this.setState({
      [name]: value.value,
    });
    console.log("props:",this.props)
    const {onChange,valueName} = this.props
    if (onChange && valueName) {
      console.log("Call OnChange on QuoteForm value:",value.value)
        onChange(valueName,value.value)
    }

  };

  render() {
    console.log('ReactSelect props:',this.props)
    console.log('ReactSelect state:',this.state)
    const { classes, theme, selectionList, value, name } = this.props;
    console.log('selectionList:',selectionList)

    const listOfValues = selectionList && selectionList.map(selection => ({
      label: selection.category_name+"/"+selection.category_name_ar ,
      value: selection.category_name,
    }));
    const selectStyles = {
      input: base => ({
        ...base,
        color: theme.palette.text.primary,
        '& input': {
          font: 'inherit',
        },
      }),
    };

    return (
      <div className={classes.root}>
        <NoSsr>
          <Select
            classes={classes}
            styles={selectStyles}
            options={listOfValues}
            components={components}
            value={this.state.selectionValue}
            onChange={this.handleChange('selectionValue')}
            placeholder="Search Categories"
            isClearable
          />
        </NoSsr>
      </div>
    );
  }
}

ReactSelect.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(ReactSelect);
