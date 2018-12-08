import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import moment from 'moment';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import {  graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { onError } from "apollo-link-error";
// withStyles takes the styles and change them to classes props
const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 100,
    font: 'bold',
  },
  button: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    marginTop: 19,
    width: 120,
  },
  dense: {
    marginTop: 19,
  },
  menu: {
    width: 180,
  },
});

class VendorPurchaseForm extends React.Component {
  constructor(props) {
    console.log("VendorPurchaseForm constructor props:",props)
  super(props);
  this.state = {
    message: '',
  poInfo: props.poInfo? props.poInfo: {
    po_no: '',
    title: '',
    link: '',
    price: 0,
    sale_price: 0,
    first_payment:'',
    username:'',
    total_purchased_qty: 0,
    po_qty: 0,
    order_no: '',
    delivery_days_from: 0,
    delivery_days_to: 0,
    order_date: '',//moment(new Date()).format('DD/MM/YYYY')
  }
    // TODO: add errors field
  }
}
componentDidUpdate(prevProps) {
  console.log("vendor-purchase-form componentDidUpdate \nprevProps\n:",prevProps)
  console.log('this.state',this.state)
  // Typical usage (don't forget to compare props):

  if (prevProps && this.state.poInfo &&
    this.state.poInfo.po_no != prevProps.poInfo.po_no  ) {
    // const { po_no,
    //    title, link, po_qty, total_purchased_qty,
    //    price,sale_price,first_payment,
    //    order_no,delivery_days_to,delivery_days_from,order_date,options,
    //  } = this.props.poInfo;
    console.log("update state for ",prevProps.poInfo)
    this.setState({
              poInfo: prevProps.poInfo
            }  );

  }
}
  handleChange = ({ target }) => {
    console.log('in handleChange ',target)
    const { value, name } = target;
    var newState = {poInfo: {...this.state.poInfo}}
    newState.poInfo[name] = value
    this.setState(newState);

    //let order-detail-page set the state so when page filter is
    // used the form values are correct
    // this means we actually don't need to pass form values onSubmit (but we do!)
    if (typeof this.props.onChange === 'function') {
           this.props.onChange({target});
       }
  }

  handleSubmit = (evt) => {
    evt.preventDefault();
    console.log('VendorPurchaseForm handleSubmit:',evt)
    console.log('=> VendorPurchaseForm in handleSubmit props',this.props)
    console.log('=> VendorPurchaseForm in handleSubmit state',this.state)
    const { closePopup } = this.props;
  //   this.setState({message:"Updating ..."})

  //  const { poNo, orderNo } = this.state;
    //const {po_no} = this.props.location.state
    // TODO: disable btn on submit
    // TODO: validate fields
    // Pass event up to parent component
  //  const modifiedRow = { poNo,orderNo,trackingNo};
  //   console.log('before onSubmit VendorPurchaseForm:',pageSearch)
     // calling on Submit on VendorPurchaseForm
     const mutate = this.props.mutate
     if (mutate) {
       mutate({
          variables: {
            "vendorPurchase": {
             "po_no": this.state.poInfo.po_no,
             "_id":this.state.poInfo.purchase_id?
              parseFloat(this.state.poInfo.purchase_id):null,
             "order_no": this.state.poInfo.order_no,
             "source": this.state.poInfo.source != this.props.poInfo.source? this.state.poInfo.source:
                null,
             "purchased_qty": parseInt(this.state.poInfo.purchased_qty),
             "delivery_days_from": parseInt(this.state.poInfo.delivery_days_from),
             "delivery_days_to":  parseInt(this.state.poInfo.delivery_days_to),
             "order_date": this.state.poInfo.order_date,
             "notes":this.state.poInfo.notes,
           }
         }
      })
      .then( res => {
        console.log("mutation result:",res)
        if (!res || !res.data || !res.data.createVendorPurchase) {
           this.setState({message: "DB Error"})
        } else if (!res.data.createVendorPurchase._id) {
            this.setState({message: res.data.createVendorPurchase.message })
        }  else    this.setState({message: "Created Successfully." || res.data.createVendorPurchase.message });
      }).catch((err) => {
        console.log('mutation err:',JSON.stringify(err))
        const { graphQLErrors, networkError } = err

        if (graphQLErrors)
        graphQLErrors.map(({ message, locations, path }) =>
          console.log(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
            ),
            this.setState({message:
               `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}` })

          );

          if (networkError) {
            console.log(`[Network error]: ${networkError}`);
            this.setState({message: `[Network error]: ${networkError}`})
          }

        this.setState({message: err.errmsg })
      });;

    }

  }

  render() {
    console.log('render vendorPurchaseForm props:',this.props)
    console.log('render vendorPurchaseForm state:',this.state)
    const { classes, history} = this.props;

    const { po_no,
       title, link, po_qty, total_purchased_qty,
       price,sale_price,first_payment,total_amount,
       order_no,delivery_days_to,delivery_days_from,order_date,options,
       purchased_qty,source,purchase_id, notes,
    } = this.state.poInfo;

     const { message } = this.state
     console.log("new message:",message)
    // if (!order_date || order_date == '') {
    //     order_date=moment(new Date()).format('YYYY/MM/DD')
    // }
       // <div className="m2">
       // <a href = {link} target = "_blank" > {link  } </a>}
       // </div>
       // <Button disabled={this.props.history||this.props.history1? false:true}
       // className="col-3"
       // onClick={() => {this.props.history?
       //    this.props.history.goBack():
       //    this.props.history1? this.props.history1.goBack():null}}>
       //    Go Back
       // </Button>
    return (
    <div className="popup">
      <div className="popup_inner">
        <div className=" flex flex-column  flex-wrap p1 m1 border">
          <div className="flex flex-wrap  ml2">
            <TextField
              name="poNo"
              type="String"
              label="PO #"
              value={po_no}
              margin="dense"
              className={classes.textField}
              style={{
                //backgroundColor:'pink',
                'whiteSpace': 'unset',
                 'fontSize': '12px' ,
                 'font-weight':'bold',
                'width' : '8em',
              }}
            />
            <TextField
              name="title"
              type="String"
              label="Title"
              value={title}
              multiline
              rowsMax="2"
              InputProps={{
                 readOnly: true,
               }}
              margin="dense"
              style={{
                //backgroundColor:'pink',
                'whiteSpace': 'unset',
                 'fontSize': '12px' ,
                 'font-weight':'bold',
                'width' : '32em',
              }}
              className={classes.textField}
            />
            <TextField
              name="options"
              type="String"
              label="options"
              multiline
              rowsMax="2"
              value={options}
              InputProps={{
               readOnly: true,
             }}
             style={{
               //backgroundColor:'pink',
               'whiteSpace': 'unset',
                'fontSize': '10px' ,
               'width' : '40em',
             }}
              margin="dense"
            />
            <div style={{'overflow-x': 'hidden','overflowY':'scroll', width:'500px',height:'2em'}}>
            {link}
            </div>

          <TextField
            name="Price"
            type="Number"
            label="Price"
            value={price}


            margin="dense"
            className={classes.textField}
          />
          <TextField
            name="Sale Price"
            type="Number"
            label="Sale Price"
            value={sale_price}

            InputProps={{
             readOnly: true,
           }}
            margin="dense"
            className={classes.textField}
          />
          <TextField
            name="first_payment"
            type="Number"
            label="Initial Payment"
            value={first_payment}

            InputProps={{
             readOnly: true,
           }}
            margin="dense"
            className="col-2"
          />
          <TextField
            name="total_amount"
            type="Number"
            label="T. Amount"
            value={total_amount}

            InputProps={{
             readOnly: true,
           }}
            margin="dense"
            className="col-2"
          />
          </div>
          <div className="block ml2">
          <TextField
            name="poQty"
            type="Number"
            label="Po Qty"
            value={po_qty}

            InputProps={{
             readOnly: true,
           }}
            margin="dense"
            className={classes.textField}
          />
          <TextField

            name="total_purchased_qty"
            type="Number"
            label="Total Purchased Qty"
            value={total_purchased_qty}
            InputProps={{
             readOnly: true,
            }}
            margin="dense"
            className="col-3"
          />
          </div>
        </div>
        <div  className="flex flex-row ml2 p1 col-10">

        <form  onSubmit={this.handleSubmit} autoComplete="off">
            {/* Material-UI example usage */}
          <TextField
            name="order_no"
            required
            type="String"
            label={"Order # ->" + (!purchase_id||purchase_id=="-99"? "New":"Edit")}
            autoFocus={true}
            value={order_no}
            onChange={this.handleChange}
            margin="dense"
            className="col-4"
          />
          <TextField
            name="purchased_qty"
            required
            type="Number"
            label="Purchased Qty"
            value={purchased_qty}
            onChange={this.handleChange}
            margin="dense"
            className="col-2"
          />
          <TextField
            name="delivery_days_from"
            required
            type="Number"
            label="Days from"
            value={delivery_days_from}
            onChange={this.handleChange}
            margin="dense"
            className="col-2"
          />
          <TextField
            name="delivery_days_to"
            required
            type="Number"
            label="Days to"

            value={delivery_days_to}
            onChange={this.handleChange}
            margin="dense"
            className="col-2"
          />

          <TextField
            name="order_date"
            required
            type="date"
            label="Order Date"
            defaultValue={moment(order_date,"DD/MM/YYYY").format('YYYY-MM-DD')}
            onChange={this.handleChange}
            InputLabelProps={{ shrink: true }}
            helperText="Purchase Date"
          />
          <TextField
            name="source"

            type="String"
            label="Actual Source"
            value={source}
            onChange={this.handleChange}
            margin="dense"
            className="col-4"
          />
          <TextField
            name="notes"

            type="String"
            label="notes"

            value={notes}
            onChange={this.handleChange}
            margin="dense"
            className="col-4"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            margin="dense"
            className="col-3"
          >
            purchase
          </Button>

        </form>
        <div>
                  <TextField
                    name="message"
                    error
                    label="message"
                    value={message}
                    multiline
                    rowsMax="3"
                    variant="outlined"
                    InputProps={{
                     readOnly: true,
                   }}
                    style={{
                      //backgroundColor:'pink',
                       //'whiteSpace': 'unset',
                        'fontSize': '14px' ,
                        'font': 'bold',
                      'width' : 400,
                    }}

                    margin="dense"

            />
          <Button   variant="contained"
            color="primary"
            margin="dense" onClick={this.props.closePopup}>Close</Button>
            </div>
        </div>
      </div>
    </div>


    );
  }
}

VendorPurchaseForm.propTypes = {
  onSubmit: PropTypes.func,

};

VendorPurchaseForm.defaultProps = {
  onSubmit: () => {},
};

const createVendorPurchase = gql`
  mutation createVendorPurchase($vendorPurchase: VendorPurchaseInput!) {
    createVendorPurchase (input: $vendorPurchase) {
     _id
      message
   }
  }
`;

const VendorPurchaseFormWithMutation = graphql(
  createVendorPurchase
)(VendorPurchaseForm);


//export default withStyles(styles)(VendorPurchaseForm)
export default withStyles(styles)(VendorPurchaseFormWithMutation)
