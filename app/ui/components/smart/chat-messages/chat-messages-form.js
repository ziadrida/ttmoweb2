import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import {DatePicker} from 'material-ui-pickers';
//import KeyboardArrowLeftIcon from 'material-ui/svg-icons/action/keyboard-arrow-left';
import {DateTimePicker} from 'material-ui-pickers';

import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import moment from 'moment';
const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
  button: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    marginTop: 19,
    width: 200,
  },
  dense: {
    marginTop: 19,
  },
  menu: {
    width: 200,
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,

  },
});
class ChatMessagesForm extends React.Component {
  state = {
    username: '',
    search: '',
    searchField:'',
    dateFrom:moment().add(-4,'days').toDate(),
    dateTo:moment().add(0.5,'days').toDate(),
    data:[],
    // TODO: add errors field
  }

  static getDerivedStateFromProps(props, state) {
         console.log("chatMessage-Data getDerivedStateFromProps \nprops",props,
         "\nstate",state)
         return null;
  }

  handleChange = ({ target }) => {
    console.log('in handleChange')
    const { value, name } = target;
    this.setState({ [name]: value });
  }
  handleFromDateChange = date => {

        this.setState({
            dateFrom: date
        });
    };
    handleToDateChange = date => {

          this.setState({
              dateTo: date
          });
      };
  handleSubmit = (evt) => {
    evt.preventDefault();
    console.log('=> chat-messages-form in handleSubmit props',this.props)
    console.log('=> chat-messages-form in handleSubmit state',this.state)
    const { onSubmit } = this.props;
    const { username, search,searchField,dateFrom,dateTo } = this.state;
    // TODO: disable btn on submit
    // TODO: validate fields
    // Pass event up to parent component
    const chatMessagesSearch = { username, search,searchField,dateFrom, dateTo };
     console.log('before onSubmit ChatMessagesForm:',chatMessagesSearch)
    onSubmit({ chatMessagesSearch });
  }

  render() {
    const { classes } = this.props;
    const { username,dateFrom,dateTo, search,searchField } = this.state;
    console.log('render ChatMessagesForm username:', username, ",search: ",search, '-',searchField)
    return (
      <form  onSubmit={this.handleSubmit} autoComplete="off">
        {/* Material-UI example usage */}


            <TextField
              name="search"
              type="text"
              label="Search Value"
              value={search}
              onChange={this.handleChange}
              margin="dense"
              className={classes.textField}
              style={{
                //backgroundColor:'pink',
                //backgroundImage:'url(image)',
                'width' : 160,

              }}
              helperText="قيمة البحث"
            />
            <FormControl required className={classes.formControl}>
            <InputLabel htmlFor="search-field">Search Field</InputLabel>
            <Select
              disabled={false}
              value={searchField}
              onChange={this.handleChange}
              name="searchField"
              inputProps={{
                id: 'search-field',
              }}
              className={classes.selectEmpty}
            >
              <MenuItem value={''}>Not Selected</MenuItem>
              <MenuItem value={'days_back'}># of Days Back</MenuItem>
              <MenuItem value={"name"}>Username</MenuItem>
              <MenuItem value={"userId"}>userId</MenuItem>
              <MenuItem value={"messageText"}>مضمون الرسالة</MenuItem>
              <MenuItem value={"messageAttachments"}>الرابط URL</MenuItem>
              <MenuItem value={"phone_no"}>؛Phone# </MenuItem>
              <MenuItem value={"all"}>All Fields</MenuItem>

            </Select>
            <FormHelperText>خانت البحث</FormHelperText>
          </FormControl>
          { searchField != 'days_back'?
          <div className="inline-block">
          <DateTimePicker className="pickers"
                  ampm={true}
                  autoOk
                  disableFuture={false}
                  label="From Date/Time"
                  okLabel="OK"
                  leftArrowIcon=<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M15.41 16.09l-4.58-4.59 4.58-4.59L14 5.5l-6 6 6 6z"/></svg>
                  rightArrowIcon=<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M8.59 16.34l4.58-4.59-4.58-4.59L10 5.75l6 6-6 6z"/></svg>
                  value={dateFrom}
                  onChange={this.handleFromDateChange}
                  format="DD-MMM-YYYY HH:mm"
            />
            <DateTimePicker className="pickers"
                    ampm={true}
                    okLabel="OK"
                    label="To Date/Time"
                    autoOk
                    disableFuture={false}
                    value={dateTo}
                    leftArrowIcon=<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M15.41 16.09l-4.58-4.59 4.58-4.59L14 5.5l-6 6 6 6z"/></svg>
                    rightArrowIcon=<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M8.59 16.34l4.58-4.59-4.58-4.59L10 5.75l6 6-6 6z"/></svg>

                    onChange={this.handleToDateChange}
                    format="DD-MMM-YYYY HH:mm"
              /></div>:null}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          margin="dense"
          className={classes.button}

        >
        Go
        </Button>
      </form>
    );
  }
}

ChatMessagesForm.propTypes = {
  onSubmit: PropTypes.func,
};

ChatMessagesForm.defaultProps = {
  onSubmit: () => {},
};

export default withStyles(styles)(ChatMessagesForm)
