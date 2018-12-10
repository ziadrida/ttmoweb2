import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import moment from 'moment';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import {  graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { onError } from "apollo-link-error";
import AddIcon from '@material-ui/icons/Add';
import CancelIcon from '@material-ui/icons/Cancel';
import DeleteIcon from '@material-ui/icons/Delete';
import Fab from '@material-ui/core/Fab';
import Icon from '@material-ui/core/Icon';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
// withStyles takes the styles and change them to classes props
const styles = theme => ({
  fab: {
  margin: theme.spacing.unit,

},
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
    allowSave: true,
    message: '',
  vendorPurchaseInfo: {
    po_no:'',
    order_no: '',
    purchase_qty: 0,
    delivery_days_from: 0,
    delivery_days_to: 0,
    purchase_id: -99,
    order_date:  moment().format("DD/MM/YYYY"),
    source: '',
    notes:'',
  },

  poInfo: {
    rowIndex:0,
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
    purchase_id: -99,
    order_date:  moment().format("DD/MM/YYYY"),
  }
}
    // TODO: add errors field
}

static getDerivedStateFromProps(props, state) {
  console.log("vendorPurchaseForm getDerivedStateFromProps \nprops",props, "\nstate",state)
    if (props.poInfo.po_no !== state.poInfo.po_no) {
      return {
        poInfo: props.poInfo ,
        vendorPurchaseInfo: {
          purchase_id: props.poInfo.purchase_id,
          po_no:props.poInfo.po_no,
          order_no: props.poInfo.order_no,
          purchase_qty: props.poInfo.purchase_qty,
          delivery_days_from: props.poInfo.delivery_days_from,
          delivery_days_to: props.poInfo.delivery_days_to,
          purchase_id: props.poInfo.purchase_id,
          order_date: props.poInfo.order_date && props.poInfo.order_date!=''? props.poInfo.order_date :
            moment().format("DD/MM/YYYY"),
          source: props.poInfo.source,
          notes:props.poInfo.order_notes,
        },

      };
    }
    // Return null to indicate no change to state.
   return null;
  }
// componentWillReceiveProps(nextProps) {
//  //here u might want to check if u are currently editing but u get the idea -- maybe u want to reset it to the current prop on some cancelEdit method instead
//  console.log("vendorPurchaseForm componentWillReceiveProps nextProps\n",nextProps)
//  this.setState({purchase_id: nextProps.poInfo.purchase_id})
//
// }

// componentDidUpdate(prevProps) {
//   console.log("vendor-purchase-form componentDidUpdate \nprevProps\n:",prevProps)
//   console.log('this.state',this.state)
//   // Typical usage (don't forget to compare props):
//
//   if (prevProps && this.state.poInfo &&
//     this.state.poInfo.po_no != prevProps.poInfo.po_no  ) {
//     // const { po_no,
//     //    title, link, po_qty, total_purchased_qty,
//     //    price,sale_price,first_payment,
//     //    order_no,delivery_days_to,delivery_days_from,order_date,options,
//     //  } = this.props.poInfo;
//     console.log("update state for ",prevProps.poInfo)
//     this.setState({
//               poInfo: prevProps.poInfo
//             }  );
//
//   }
// }
  handleChange = ({ target }) => {
    console.log('in handleChange ',target)
    const { value, name } = target;
    var newState = {vendorPurchaseInfo: {...this.state.vendorPurchaseInfo}}
    newState.vendorPurchaseInfo[name] = value
    this.setState(newState);

    console.log('handleChange',this.state)
    //let order-detail-page set the state so when page filter is
    // used the form values are correct
    // this means we actually don't need to pass form values onSubmit (but we do!)
    // if (typeof this.props.onChange === 'function') {
    //        this.props.onChange({target});
    //    }
  }

  addOrder = (evt) => {
    console.log("=> addOrder")
    //reset vendorPurchaseInfo
    setState({
      vendorPurchaseInfo: {
        po_no:'',
        order_no: '',
        purchase_qty: 0,
        delivery_days_from: 0,
        delivery_days_to: 0,
        purchase_id: -99,
        order_date:   moment().format("DD/MM/YYYY"),
        source: '',
        notes:'',
      }
    })
    }

  cancelAddOrder = (evt) => {
    console.log("=> cancelAddOrder")
    setState({
    vendorPurchaseInfo: {
      purchase_id: this.state.poInfo.purchase_id,
      po_no:this.state.poInfo.po_no,
      order_no: this.state.poInfo.order_no,
      purchase_qty: this.state.poInfo.purchase_qty,
      delivery_days_from: this.state.poInfo.delivery_days_from,
      delivery_days_to: this.state.poInfo.delivery_days_to,
      purchase_id: this.state.poInfo.purchase_id,
      order_date: this.state.poInfo.order_date,
      source: this.state.poInfo.source,
      notes:this.state.poInfo.order_notes,
    },
      })
  }

  deleteOrder = (evt) => {
    console.log("=> deleteOrder")
    // simply clear the purchase_id!
    this.setState({message:"not working yet Call me if you need it!"}) // revert back to existing purchase_id
  }

  handleSubmit = (evt) => {
    evt.preventDefault();
    console.log('VendorPurchaseForm handleSubmit:',evt)
    console.log('=> VendorPurchaseForm in handleSubmit props==>\n',this.props)
    console.log('=> VendorPurchaseForm in handleSubmit state\n',this.state)
    const { closePopup } = this.props;
    this.setState({message:"Updating ...",
                allowSave: false})

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
             "po_no": this.state.vendorPurchaseInfo.po_no,
             "_id":this.state.vendorPurchaseInfo.purchase_id?
              parseFloat(this.state.vendorPurchaseInfo.purchase_id):null,
             "order_no": this.state.vendorPurchaseInfo.order_no,
             "source": this.state.vendorPurchaseInfo.source != this.props.poInfo.source? this.state.vendorPurchaseInfo.source:
                null,
             "purchased_qty": parseInt(this.state.vendorPurchaseInfo.purchased_qty),
             "delivery_days_from": parseInt(this.state.vendorPurchaseInfo.delivery_days_from),
             "delivery_days_to":  parseInt(this.state.vendorPurchaseInfo.delivery_days_to),
             "order_date": this.state.vendorPurchaseInfo.order_date,
             "notes":this.state.vendorPurchaseInfo.notes,
           }
         }
      })
      .then( res => {
        console.log("mutation result:",res)
        if (!res || !res.data || !res.data.createVendorPurchase) {
           this.setState({message: "DB Error"})
        } else if (!res.data.createVendorPurchase._id ||
              res.data.createVendorPurchase._id == -99) {
            this.setState({message: res.data.createVendorPurchase.message })
        }  else     {
          console.log("created/updated vendor purchase - now setting state")
          this.setState(
            { message: "Updated Successfully.Purchase Id is " +
                  res.data.createVendorPurchase._id + " info:"+
                  res.data.createVendorPurchase.message ,
              poInfo: {
                  ...this.state.poInfo,
                 order_no: this.state.vendorPurchaseInfo.order_no,
                 purchase_qty: this.state.vendorPurchaseInfo.purchase_qty,
                 delivery_days_from: this.state.vendorPurchaseInfo.delivery_days_from,
                 delivery_days_to: this.state.vendorPurchaseInfo.delivery_days_to,
                 purchase_id: this.state.vendorPurchaseInfo.purchase_id,
                 order_date: this.state.vendorPurchaseInfo.order_date,
                 source: this.state.vendorPurchaseInfo.source,
                 order_notes:this.state.poInfo.order_notes,
              },
              vendorPurchaseInfo: {
                ...this.state.vendorPurchaseInfo,
                 purchase_id: res.data.createVendorPurchase._id
              },

              }
            );
            console.log('new state:',this.state)

            console.log("Call registerPurchase in order-details")
            this.prop.registerPurchase(res.data.createVendorPurchase._id,
              this.prop.rowIndex)
      }

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

        if (err && err.errmsg) this.setState({message: err.errmsg })
      });;

    }

  }

  renderOrders(orderList){
      console.log('=> in renderOrders orderList:',orderList)
    const {orders} = orderList
    console.log('=> in renderOrders:',orders)
    var tmpOrders = typeof orders != 'undefined'? orders:'No orders'
       return  tmpOrders!='' &&
              typeof tmpOrders !== 'string'?
          orders.map(i => {
          return <ListItem button>
            <ListItemText primary={i} key={i} />
            </ListItem>

      }):
      <ListItem button>
        <ListItemText primary={tmpOrders} key={tmpOrders} />
        </ListItem>

  }
  render() {
    console.log('render vendorPurchaseForm props:',this.props)
    console.log('render vendorPurchaseForm state:',this.state)
    const { classes, history} = this.props;

    const { po_no,
       title, link, po_qty, total_purchased_qty,
       price,sale_price,first_payment,total_amount,options
       ,source, notes,orders,destination
    } = this.state.poInfo;

     const { purchased_qty,purchase_id,order_notes,order_date,
          order_no,delivery_days_to,delivery_days_from} = this.state.vendorPurchaseInfo
      const {message} = this.state
     console.log("new message:",message, " purchase_id:",purchase_id)

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
            <div className="border"
              style={{'overflowX': 'hidden',
              'overflowY':'scroll',
               width:'500px',height:'4em'}}>
            {  <a href = { link } target = "_blank" > {link  } </a>}
            </div> {/* link */}

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
            className="col-1"
          />
          <TextField
            name="first_payment"
            type="Number"
            label="Init. Paymt"
            value={first_payment}

            InputProps={{
             readOnly: true,
           }}
            margin="dense"
            className="col-1"
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
            className="col-1"
          />
          </div>
          <div className="flex flex-wrap block ml2">
          <TextField
            name="poQty"
            type="Number"
            label="Po Qty"
            value={po_qty}

            InputProps={{
             readOnly: true,
           }}
            margin="dense"
            className="col-1"
          />
          <TextField
            name="total_purchased_qty"
            type="Number"
            label="T. Pur Qty"
            value={total_purchased_qty}
            InputProps={{
             readOnly: true,
            }}
            margin="dense"
            className="col-1"
          />
          <TextField
            name="destination"
            type="String"
            label="Destination"
            value={destination}
            InputProps={{
             readOnly: true,
            }}
            margin="dense"
            className="col-1"
          />


          <TextField
            name="notes"
            type="String"
            label="Notes"
            value={notes}
            onChange={this.handleChange}
            margin="dense"
            className="col-3 ml2"
          />

          <List className="col-3 border ">
                  {this.renderOrders({orders})}
          </List>
          </div>  {/* poQty block*/}
        </div>
        <div  className="flex flex-row ml2 p1 col-10">
        <div className="col1">
        <Fab size="small" color="primary" aria-label="Add" className={classes.fab}>
          <AddIcon size="small" onClik={this.addOrder} />
        </Fab>
        <Fab size="small" color="secondary" aria-label="Cancel" className={classes.fab}>
          <CancelIcon size="small" onClick={this.cancelAddOrder} />
        </Fab>
        <Fab size="small" disabled aria-label="Delete" className={classes.fab}>
          <DeleteIcon size="small" onClick={this.deleteOrder} />
        </Fab>
        </div>

          <form  className="ml2" onSubmit={this.handleSubmit} autoComplete="off">
              {/* Material-UI example usage */}

            <TextField
              name="order_no"
              required
              type="String"
              label={"Order # ->" + (!purchase_id||purchase_id==-99? "New":"Edit")}
              autoFocus={true}
              value={order_no}
              onChange={this.handleChange}
              margin="dense"
              className="col-4 ml2"
            />
            <TextField
              name="purchased_qty"
              required
              type="Number"
              label="Qty"
              value={purchased_qty}
              onChange={this.handleChange}
              margin="dense"
              className="col-2 ml2"
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
              className="col-2 ml2"
            />

            <TextField
              name="order_date"
              required
              type="date"
              label="Pur Date"
              defaultValue={order_date && order_date != ''?
                  moment(order_date,"DD/MM/YYYY").format('YYYY-MM-DD'):
                  moment().format('YYYY-MM-DD')}
              onChange={this.handleChange}
              InputLabelProps={{ shrink: true }}

              className="col-3 ml2"
            />
            <TextField
              name="order_notes"

              type="String"
              label="Notes"

              value={order_notes}
              onChange={this.handleChange}
              margin="dense"
              className="col-3 ml2"
            />
            <TextField
              name="source"
              type="String"
              label="Actual Source"
              value={source}
              onChange={this.handleChange}
              margin="dense"
              className="col-3 ml2"
            />

            <Button
              disabled={!this.state.allowSave}
              size="medium"
              type="submit"
              variant="contained"
              color="primary"
              margin="dense"
              className="col-1 ml2"
            >   Save
            </Button>

          </form>

          <div className=" col3">
                  <TextField
                    name="message"
                    error
                    label="message"
                    value={message? message:''}
                    multiline
                    rowsMax="2"
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
            <Button size="small"  variant="contained"
              color="primary"
              margin="dense" onClick={this.props.closePopup}>
              Close
            </Button>
          </div>
        </div> {/* close div which includes Fabs, from and message */}
      </div>  {/* popup_inner */}

    </div>  // close div popup



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
