import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

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
    const { quoteNo, search } = this.state;
    // TODO: disable btn on submit
    // TODO: validate fields
    // Pass event up to parent component
    const quotationSearch = { quoteNo, search };
     console.log('before onSubmit quotation:',quotationSearch)
    onSubmit({ quotationSearch });
  }

  render() {
    const { classes } = this.props;
    const { quoteNo, search } = this.state;
    console.log('render quotationForm quoteNo:', quoteNo, ",search: ",search)
    return (
      <form  onSubmit={this.handleSubmit} autoComplete="off">
        {/* Material-UI example usage */}
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
          label="Search quotations"
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
