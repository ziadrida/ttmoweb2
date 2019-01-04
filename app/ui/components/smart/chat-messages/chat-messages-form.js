import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import {DatePicker} from 'material-ui-pickers';
//import KeyboardArrowLeftIcon from 'material-ui/svg-icons/action/keyboard-arrow-left';
import {DateTimePicker} from 'material-ui-pickers';
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
});
class ChatMessagesForm extends React.Component {
  state = {
    username: '',
    search: '',
    dateFrom:moment().toDate(),
    dateTo:moment().toDate(),
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
    const { username, search,dateFrom,dateTo } = this.state;
    // TODO: disable btn on submit
    // TODO: validate fields
    // Pass event up to parent component
    const chatMessagesSearch = { username, search,dateFrom, dateTo };
     console.log('before onSubmit ChatMessagesForm:',chatMessagesSearch)
    onSubmit({ chatMessagesSearch });
  }

  render() {
    const { classes } = this.props;
    const { username,dateFrom,dateTo, search } = this.state;
    console.log('render ChatMessagesForm username:', username, ",search: ",search)
    return (
      <form  onSubmit={this.handleSubmit} autoComplete="off">
        {/* Material-UI example usage */}

        <DateTimePicker className="pickers"
                ampm={false}
                autoOk
                disableFuture
                okLabel="OK"
                leftArrowIcon=<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M15.41 16.09l-4.58-4.59 4.58-4.59L14 5.5l-6 6 6 6z"/></svg>
                rightArrowIcon=<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M8.59 16.34l4.58-4.59-4.58-4.59L10 5.75l6 6-6 6z"/></svg>
                value={dateFrom}
                onChange={this.handleFromDateChange}
                format="DD-MMM-YYYY HH:mm"
          />
          <DateTimePicker className="pickers"
                  ampm={false}
                  okLabel="OK"
                  autoOk
                  disableFuture
                  value={dateTo}
                  leftArrowIcon=<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M15.41 16.09l-4.58-4.59 4.58-4.59L14 5.5l-6 6 6 6z"/></svg>
                  rightArrowIcon=<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M8.59 16.34l4.58-4.59-4.58-4.59L10 5.75l6 6-6 6z"/></svg>

                  onChange={this.handleToDateChange}
                  format="DD-MMM-YYYY HH:mm"

            />
            <TextField
              name="username"
              type="text"
              label="username"
              value={username}
              onChange={this.handleChange}
              margin="dense"
              className={classes.textField}
            />
        <TextField
          name="search"
          type="text"
          label="Search chatMessages"
          value={search}
          onChange={this.handleChange}
          margin="dense"
          className={classes.textField}

        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          margin="dense"
          className={classes.button}

        >
          Search Chat Messages
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
