import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputLabel from '@material-ui/core/InputLabel';
import Checkbox from "@material-ui/core/Checkbox";
import Select from '@material-ui/core/Select';

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
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 350,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
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
    searchField:'',
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
    // if (typeof this.props.onChange === 'function') {
    //        this.props.onChange({target});
    //    }
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
    searchField:'',

  })
  const { poNo,status,orderNo,trackingNo,awbNo,username, search, searchField } = this.state;

  const orderDetailsSearch = { poNo,status,orderNo,trackingNo,awbNo,username, search,searchField };
   console.log('before onSubmit order-details-form:',orderDetailsSearch)
   // calling on Submit on order-details-page
  onSubmit({ orderDetailsSearch });
}
  handleSubmit = (evt) => {
    evt.preventDefault();
    console.log('=> order-details-form in handleSubmit props',this.props)
    console.log('=> order-details-form in handleSubmit state',this.state)
    const { onSubmit } = this.props;
    const { poNo,status,orderNo,trackingNo,awbNo,username, search, searchField } = this.state;
    // TODO: disable btn on submit
    // TODO: validate fields
    // Pass event up to parent component
    const orderDetailsSearch = { poNo,status,orderNo,trackingNo,awbNo,username, search, searchField };
     console.log('before onSubmit order-details-form:',orderDetailsSearch)
     // calling on Submit on order-details-page
    onSubmit({ orderDetailsSearch });

  }

  render() {
    console.log('render order-details-form props:',this.props)
    console.log('render order-details-form state:',this.state)
    const { classes } = this.props;

    const { poNo,status,orderNo, trackingNo,awbNo,username,search, searchField } = this.state;
    console.log('render OrderDetailsForm poNo:', poNo, "OrderNo:",orderNo,
      "search: ",search, "-",searchField)
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
          label="Status"
          value={status}
          onChange={this.handleChange}
          margin="dense"
          className={classes.textField}
          helperText="Use ac, aw or ca"
        />

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
          <MenuItem value={"username"}>username</MenuItem>
          <MenuItem value={"awb_no"}>AWB</MenuItem>
          <MenuItem value={"order_no"}>Vendor Order#</MenuItem>
          <MenuItem value={"tracking_no"}>Tracking#</MenuItem>
          <MenuItem value={"sales_person"}>Sales Person</MenuItem>
            <MenuItem value={"source"}>Source</MenuItem>
          <MenuItem value={"title"}>Title</MenuItem>
          <MenuItem value={"url"}>Url</MenuItem>
            <MenuItem value={"category"}>Category</MenuItem>
          <MenuItem value={"seller"}>Seller</MenuItem>
          <MenuItem value={"shipment_ref"}>Shipment Ref</MenuItem>
          <MenuItem value={"destination"}>Destination</MenuItem>
          <MenuItem value={"box_id"}>Box ID</MenuItem>
          <MenuItem value={"final_box_id"}>Final Box ID</MenuItem>
          <MenuItem value={"all"}>All Fields</MenuItem>

        </Select>
        <FormHelperText>خانت البحث</FormHelperText>
      </FormControl>


        {/*
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
        */ }
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
//
// <TextField
//   name="orderNo"
//   type="String"
//   label="Order #"
//   value={orderNo}
//   onChange={this.handleChange}
//   margin="dense"
//   className={classes.textField}
// />
// <TextField
//   name="trackingNo"
//   type="String"
//   label="tracking #"
//   value={trackingNo}
//   onChange={this.handleChange}
//   margin="dense"
//   className={classes.textField}
// />
// <TextField
//   name="awbNo"
//   type="String"
//   label="AWB #"
//   value={awbNo}
//   onChange={this.handleChange}
//   margin="dense"
//   className={classes.textField}
// />
// <TextField
//   name="username"
//   type="String"
//   label="username"
//   value={username}
//   onChange={this.handleChange}
//   margin="dense"
//   className={classes.textField}
// />
//  />
