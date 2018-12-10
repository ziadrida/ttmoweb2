import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';

import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

// withStyles tables the typles in styles and change them to classes props
const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 100,
  },
  button: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    marginTop: 19,
    width: 40,
  },
  dense: {
    marginTop: 19,
  },
  menu: {
    width: 180,
  },
});

class OrderDetailsForm extends React.Component {
  constructor(props) {

  super(props);
  this.state = {
    poNo: '',
    status:'',
    orderNo:'',
    trackingNo:'',
    awbNo:'',
    username:'',
    search: '',
    // TODO: add errors field
  }
}
  handleChange = ({ target }) => {
    console.log('in handlesChange ')//,target)
    const { value, name } = target;
    this.setState({ [name]: value });

    //let order-detail-page set the state so when page filter is
    // used the form values are correct
    // this means we actually don't need to pass form values onSubmit (but we do!)
    if (typeof this.props.onChange === 'function') {
           this.props.onChange({target});
       }
  }
clearFilter = (evt) => {
  setState({
    poNo: '',
    status:'',
    orderNo:'',
    trackingNo:'',
    awbNo:'',
    username:'',
    search: '',

  })
  const { poNo,status,orderNo,trackingNo,awbNo,username, search } = this.state;

  const orderDetailsSearch = { poNo,status,orderNo,trackingNo,awbNo,username, search };
   console.log('before onSubmit order-details-form:',orderDetailsSearch)
   // calling on Submit on order-details-page
  onSubmit({ orderDetailsSearch });
}
  handleSubmit = (evt) => {
    evt.preventDefault();
    console.log('=> order-details-form in handleSubmit props',this.props)
    console.log('=> order-details-form in handleSubmit state',this.state)
    const { onSubmit } = this.props;
    const { poNo,status,orderNo,trackingNo,awbNo,username, search } = this.state;
    // TODO: disable btn on submit
    // TODO: validate fields
    // Pass event up to parent component
    const orderDetailsSearch = { poNo,status,orderNo,trackingNo,awbNo,username, search };
     console.log('before onSubmit order-details-form:',orderDetailsSearch)
     // calling on Submit on order-details-page
    onSubmit({ orderDetailsSearch });
  }

  render() {
    console.log('order-details-form props:',this.props)
    console.log('order-details-form state:',this.state)
    const { classes } = this.props;

    const { poNo,status,orderNo, trackingNo,awbNo,username,search } = this.state;
    console.log('render OrderDetailsForm poNo:', poNo, "OrderNo:",orderNo,
      "search: ",search)
    return (
      <div className="search flex flex-row">

      <form   onSubmit={this.handleSubmit} autoComplete="off">
        {/* Material-UI example usage */}

        <TextField
          name="poNo"
          type="String"
          label="PO #"
          value={poNo}
          autoFocus={true}
          onChange={this.handleChange}
          margin="dense"
          className={classes.textField}
        />
        <TextField
          name="status"
          type="String"
          label="Order Status"
          value={status}
          onChange={this.handleChange}
          margin="dense"
          className={classes.textField}
          helperText="Use ac, aw or ca"
        />
        <TextField
          name="orderNo"
          type="String"
          label="Order #"
          value={orderNo}
          onChange={this.handleChange}
          margin="dense"
          className={classes.textField}
        />
        <TextField
          name="trackingNo"
          type="String"
          label="tracking #"
          value={trackingNo}
          onChange={this.handleChange}
          margin="dense"
          className={classes.textField}
        />
        <TextField
          name="awbNo"
          type="String"
          label="AWB #"
          value={awbNo}
          onChange={this.handleChange}
          margin="dense"
          className={classes.textField}
        />
        <TextField
          name="username"
          type="String"
          label="username"
          value={username}
          onChange={this.handleChange}
          margin="dense"
          className={classes.textField}
        />

        <TextField
          name="search"
          type="text"
          label="Search orderDetails"
          value={search}
          onChange={this.handleChange}
          margin="dense"
          className={classes.textField}
          style={{
            //backgroundColor:'pink',
            //backgroundImage:'url(image)',
            'width' : 200,

          }}
          helperText="Any field!"
        />
        <Button
          type="button"
          variant="contained"
          color="primary"
          margin="dense"
          className={classes.button}
          onClick={this.clearFilter}
        >
          Clear
        </Button>
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
      </div>
    );
  }
}

OrderDetailsForm.propTypes = {
  onSubmit: PropTypes.func,

};

OrderDetailsForm.defaultProps = {
  onSubmit: () => {},
};

export default withStyles(styles)(OrderDetailsForm)
