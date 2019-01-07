import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {DateTimePicker} from 'material-ui-pickers';
import { withStyles } from '@material-ui/core/styles';
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
class QuotationForm extends React.Component {
  state = {
    quoteNo: '',
    search: '',
    dateFrom:moment().add(-1,'days').toDate(),
    dateTo:moment().toDate(),
    // TODO: add errors field
  }

  handleChange = ({ target }) => {
    console.log('in handleChange')
    const { value, name } = target;
    this.setState({ [name]: value });
  }

  handleSubmit = (evt) => {
    evt.preventDefault();
    console.log('=> quotation-form in handleSubmit props',this.props)
    console.log('=> quotation-form in handleSubmit state',this.state)
    const { onSubmit } = this.props;
    const { quoteNo, search,dateFrom,dateTo } = this.state;
    // TODO: disable btn on submit
    // TODO: validate fields
    // Pass event up to parent component
    const quotationSearch = { quoteNo, search,dateFrom, dateTo };
     console.log('before onSubmit quotation:',quotationSearch)
    onSubmit({ quotationSearch });
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

  render() {
    const { classes } = this.props;
    const { quoteNo, search,dateFrom, dateTo } = this.state;
    console.log('render quotationForm quoteNo:', quoteNo, ",search: ",search)
    return (
      <form  onSubmit={this.handleSubmit} autoComplete="off">
        {/* Material-UI example usage */}

        <DateTimePicker className="pickers"
                ampm={true}
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
                  ampm={true}
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
              name="quoteNo"
              type="number"
              label="quote #"
              value={quoteNo}
              onChange={this.handleChange}
              margin="dense"
              className={classes.textField}
            />
        <TextField
          name="search"
          type="text"
          label="Search"
          value={search}
          onChange={this.handleChange}
          margin="dense"
          className={classes.textField}
          helperText="Search category, title, name, sales person, part#"
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          margin="dense"
          className={classes.button}

        >
          Search Quotations
        </Button>
      </form>
    );
  }
}

QuotationForm.propTypes = {
  onSubmit: PropTypes.func,
};

QuotationForm.defaultProps = {
  onSubmit: () => {},
};

export default withStyles(styles)(QuotationForm)
