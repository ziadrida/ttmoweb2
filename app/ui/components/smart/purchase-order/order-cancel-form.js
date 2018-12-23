import React from 'react';
// Import React Table
import ReactTable,{ReactTableDefaults} from "react-table";
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import ListSubheader from '@material-ui/core/ListSubheader';
import moment from 'moment';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import {  graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { onError } from "apollo-link-error";
import {DatePicker} from 'material-ui-pickers';
//import DateFnsUtils from "material-ui-pickers/utils/date-fns-utils";

import AddIcon from '@material-ui/icons/Add';
import CancelIcon from '@material-ui/icons/Cancel';
import DeleteIcon from '@material-ui/icons/Delete';
import Fab from '@material-ui/core/Fab';
import Icon from '@material-ui/core/Icon';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

// refetch option to mutate
import orderDetailsQuery from '/app/ui/apollo-client/order-details/query/order-details';

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

class OrderCancelForm extends React.Component {
  constructor(props) {
    console.log("OrderCancelForm constructor props:",props)
  super(props);
  this.state = {
    copySuccess: '',
    bulkUpdate: false,
    refresh: false,
    selectedPoList: [],
    allowSave: true,
    message: '',
  formEditInfo: {
    po_no:'',
    order_no: '',
    purchased_qty: 0,
    delivery_days_from: 0,
    delivery_days_to: 0,
    purchase_id: -99,
    order_date:  moment().format("MM-DD-YYYY"),
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
    order_date:  moment().format("MM-DD-YYYY"),
  }
}
    // TODO: add errors field
    this.mutateAction = this.mutateAction.bind(this)
}

static getDerivedStateFromProps(props, state) {
  console.log("OrderCancelForm getDerivedStateFromProps \nprops",props, "\nstate",state)
  const {selection,getRow} = props
  const bulkUpdate = selection && selection.length > 1
  var tmpSelectedPoList = []
  var changedList = false;
  if (bulkUpdate && props.poInfo) {
    selection.map(key => {
      console.log('build update list ', key)
      var row = getRow(key)
      if (row) {
        row.message = ""
        row.purchased_qty = parseInt(row.po_qty) - parseInt(row.total_purchased_qty)

        tmpSelectedPoList.push(row)
        if (!changedList)  {
        changedList = state.selectedPoList.length == 0 ||
                      (state.selectedPoList.length>0 &&
                        state.selectedPoList[0] != undefined &&
                        state.selectedPoList.findIndex(x=> x._id === key) < 0);
        console.log("selectedPoList changedList",changedList)
      }
     }
    })

  }
  if (tmpSelectedPoList != state.selectedPoList) {
    console.log("object compare =>  listChanged")

  } else {  console.log("object compare =>  list DID NOT Change")}

  console.log("findIndex says =>  listChanged:",changedList)
  var returnState = {}
    if ( changedList ) {
      returnState =  {
        bulkUpdate: bulkUpdate,
        selectedPoList: tmpSelectedPoList,
        refresh: false,
      }
    }
    if (state.refresh ) {
      returnState =  {
        ...returnState,
        refresh: false,
      }
    }
      if (props.poInfo && state.poInfo && props.poInfo.po_no !== state.poInfo.po_no) {
      returnState =  {
        ...returnState,
        poInfo: props.poInfo ,
        formEditInfo: {
          purchase_id: props.poInfo.purchase_id,
          po_no:props.poInfo.po_no,
          order_no: props.poInfo.order_no,
          purchased_qty:  parseInt(props.poInfo.purchase_id)>0?
             parseInt(props.poInfo.purchased_qty):
              parseInt(props.poInfo.po_qty)-parseInt(props.poInfo.total_purchased_qty) ,
          delivery_days_from: props.poInfo.delivery_days_from,
          delivery_days_to: props.poInfo.delivery_days_to,
          purchase_id: props.poInfo.purchase_id,
          order_date: props.poInfo.order_date && props.poInfo.order_date!=''?
           moment(props.poInfo.order_date,'DD/MM/YYYY').format("MM-DD-YYYY"):
           moment().format("MM-DD-YYYY"),
          // moment(props.poInfo.order_date,'DD/MM/YYYY').format('DD-MM-YYYY') :
          //   moment().format("DD-MM-YYYY"),
          source: props.poInfo.source,
          notes:props.poInfo.order_notes,
        },

      };
    }
    var finalState = returnState!={}? returnState: null
    console.log('finalState:',finalState)
    // Return null to indicate no change to state.
   return finalState;
  }
// componentWillReceiveProps(nextProps) {
//  //here u might want to check if u are currently editing but u get the idea -- maybe u want to reset it to the current prop on some cancelEdit method instead
//  console.log("OrderCancelForm componentWillReceiveProps nextProps\n",nextProps)
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
handleDateChange = date => {

      this.setState({
          formEditInfo: {
          ...this.state.formEditInfo,
          order_date: date
        },
        allowSave: true
      });
  };

  handleChange = ({ target }) => {
    console.log('in handleChange ',target)
    const { value, name } = target;

    this.setState(
        {
          formEditInfo: {
          ...this.state.formEditInfo,
            [name]: value
        },
        allowSave: true
      });

    console.log('cancelPurhaseOrder handleChange',this.state)
    //let order-detail-page set the state so when page filter is
    // used the form values are correct
    // this means we actually don't need to pass form values onSubmit (but we do!)
    // if (typeof this.props.onChange === 'function') {
    //        this.props.onChange({target});
    //    }
  }

  addNew = (evt) => {
    console.log("=> addNew")
    //reset formEditInfo
    this.setState({
      formEditInfo: {
        po_no:this.props.poInfo.po_no,
        order_no: '',
        purchased_qty: 0,
        delivery_days_from: 0,
        delivery_days_to: 0,
        purchase_id: -99,
        order_date:   moment().format("MM-DD-YYYY"),
        source: this.props.poInfo.source,
        notes:'',
      },
      allowSave: true,
    })
    }

  cancelAddNew = (evt) => {
    console.log("=> cancelAddNew")
    setState({
    formEditInfo: {
      purchase_id: this.state.poInfo.purchase_id,
      po_no:this.state.poInfo.po_no,
      order_no: this.state.poInfo.order_no,
      purchased_qty: this.state.poInfo.purchase_id? parseInt(this.state.poInfo.purchased_qty):
      parseInt(this.state.poInfo.po_qty) - parseInt(this.state.poInfo.total_purchased_qty),
      delivery_days_from: this.state.poInfo.delivery_days_from,
      delivery_days_to: this.state.poInfo.delivery_days_to,
      purchase_id: this.state.poInfo.purchase_id,
      order_date: this.state.poInfo.order_date?
      moment(this.state.poInfo.order_date,'DD/MM/YYYY').format('MM-DD-YYYY'):
       moment().format('MM-DD-YYYY'),
      // moment(this.state.poInfo.order_date,'DD/MM/YYYY').format('MM-DD-YYYY'):
      //   moment().format('MM-DD-YYYY') ,
      source: this.state.poInfo.source,
      notes:this.state.poInfo.order_notes,
    },
    allowSave: true
      })
  }

  deleteRecord = (evt) => {
    console.log("=> deleteRecord")
    // simply clear the purchase_id!
    this.setState({message:"not working yet Call me if you need it!"}) // revert back to existing purchase_id
  }

  handleAction = (evt) => {
    evt.preventDefault();
    console.log('OrderCancelForm handleAction:',evt)
    console.log('=> OrderCancelForm in handleAction props==>\n',this.props)
    console.log('=> OrderCancelForm in handleAction state\n',this.state)
    const { closePopup } = this.props;
    this.setState({message:"Updating ...",
                allowSave: false})


     const { selectedPoList, bulkUpdate } = this.state
     var newSelectedPoList = []
     if (bulkUpdate) {
       // creating multiple orders
       selectedPoList.map(poInfo => {

        //console.log('update=>',poInfo)
        var newPoInfo =  this.mutateAction(poInfo)
         //poInfo.message = res.message;
         console.log("newPoInfo returned:",newPoInfo)
         if (newPoInfo) newSelectedPoList.push(newPoInfo)
         else newSelectedPoList.push(poInfo)
       })
       console.log("setState with latest selectedPoList")
       this.setState({
         refresh: true,
         selectedPoList: newSelectedPoList
       })
     } else {
          this.mutateAction(this.state.poInfo)
     }


  }

  async mutateAction (selectedPo)  {
    console.log('=> mutateAction selectedPo:', selectedPo)
    var message =  ""
    var sucess = false
    var rtnPoInfo = selectedPo;
    const { mutate, setRow} = this.props
    if (mutate) {
      console.log("call mutate")
      var updateInfo = this.state.bulkUpdate?
       {
        po_no: selectedPo.po_no,
        _id:  selectedPo.purchase_id && parseInt(selectedPo.purchase_id)>0?
            parseInt(selectedPo.purchase_id):null,
        purchased_qty:  parseInt(selectedPo.purchased_qty),
      }:
      {
        po_no: this.state.formEditInfo.po_no,
        _id:  parseInt(this.state.formEditInfo.purchase_id)?
         parseFloat(this.state.formEditInfo.purchase_id):null,
         purchased_qty: this.state.formEditInfo.purchased_qty &&
               parseInt(this.state.formEditInfo.purchased_qty)>0 ?
               parseInt(this.state.formEditInfo.purchased_qty) :
               parseInt(this.state.formEditInfo.po_qty)-
               parseInt(this.state.formEditInfo.total_purchased_qty),

      }
      console.log('updateInfo:',updateInfo)
       const response = await mutate({

         variables: {
           "cancelPoInput": {
            "po_no": updateInfo.po_no,

            "notes":this.state.formEditInfo.notes,
          }
        },
        refetchQueries: [
                {
          query: orderDetailsQuery,
          variables:this.props.variables
        }],
     })
     .then( res => {
       console.log("mutation result:",res)
       if (!res || !res.data || !res.data.cancelPurchaseOrder) {
          this.setState({message: "DB Error",
          allowSave: true})
            rtnPoInfo.message = rtnPoInfo.message==""? rtnPoInfo.message:rtnPoInfo.message+'\n'+
             "DB Error";
              return rtnPoInfo;
       } else if (!res.data.cancelPurchaseOrder._id ||
             res.data.cancelPurchaseOrder._id == -99) {
           this.setState(
               {message: res.data.cancelPurchaseOrder.message ,
               allowSave: true},
             )
               rtnPoInfo.message = rtnPoInfo.message==""? rtnPoInfo.message:rtnPoInfo.message+'\n'+
                    res.data.cancelPurchaseOrder.message;
             return rtnPoInfo;
       }  else     {
         console.log("created/updated vendor purchase - now setting state")
         this.setState(
           { message: "Updated Successfully.Purchase Id is " +
                 res.data.cancelPurchaseOrder._id + " info:"+
                 res.data.cancelPurchaseOrder.message ,
             poInfo: {
                 ...this.state.poInfo,
                order_no: this.state.formEditInfo.order_no,
                purchased_qty: this.state.formEditInfo.purchased_qty,
                delivery_days_from: this.state.formEditInfo.delivery_days_from,
                delivery_days_to: this.state.formEditInfo.delivery_days_to,

                order_date: this.state.formEditInfo.order_date,
                source: this.state.formEditInfo.source,
                order_notes:this.state.formEditInfo.order_notes,
                purchase_id: res.data.cancelPurchaseOrder._id

             },
             formEditInfo: {
               ...this.state.formEditInfo,
                purchase_id: res.data.cancelPurchaseOrder._id,

             },
             allowSave: true
             }
           );

          // setRow(poInfo)
           console.log('new state:',this.state)

           // console.log("Call registerPurchase in order-details")
           // this.props.registerPurchase(res.data.cancelPurchaseOrder._id,
           //   this.props.rowIndex)

         rtnPoInfo.message = rtnPoInfo.message==""? rtnPoInfo.message:rtnPoInfo.message+'\n'+
                "Updated Successfully.Purchase Id is " +
                   res.data.cancelPurchaseOrder._id + " info:"+
                   res.data.cancelPurchaseOrder.message;
          rtnPoInfo.order_no=this.state.formEditInfo.order_no;
            rtnPoInfo.purchase_id=res.data.cancelPurchaseOrder._id
        return rtnPoInfo;
     }

     }).catch((err) => {
       console.log('mutation err:',JSON.stringify(err))
       const { graphQLErrors, networkError } = err
       var errMsg =""
       if (graphQLErrors) {

       graphQLErrors.map(({ message, locations, path }) =>
         console.log(
           `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
           ),
          errMsg = errMsg==""? errMsg:errMsg + '\n'+
              `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`

         );
       }

         if (networkError) {
           console.log(`[Network error]: ${networkError}`);
           errMsg = errMsg==""? errMsg:errMsg + '\n'+
               `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`

         }

       if (err && err.errmsg) {
          errMsg = errMsg==""? errMsg:errMsg + '\n'+  err.errmsg
       }
       rtnPoInfo.message = rtnPoInfo.message==""? rtnPoInfo.message:rtnPoInfo.message+'\n'+
                errMsg
       return rtnPoInfo;
     });;
     console.log("MUTATION response:",response)
     return response;
   } else {
     console.log("ERROR - No mutate funtion!!!")
     return rtnPoInfo
   }

  }

  copyToClipboard = (e,val) => {
    console.log(e);
      console.log('val:',val)
    var textField = document.createElement('textarea')
    textField.innerText = val
    document.body.appendChild(textField)
    textField.select()
    document.execCommand('copy')
    textField.remove()
    };

  renderExistingOrders(orderList){
      console.log('=> in OrderCancelForm  renderExistingOrders orderList:',orderList)
    const {orders} = orderList
    console.log('=> in renderExistingOrders:',orders)
    var tmpVal = typeof orders != 'undefined'? orders:'No orders'
       return  tmpVal!='' &&
              typeof tmpVal !== 'string'?
          orders.map(orderNo => {
          return <ListItem button key={orderNo}
          onClick={(e) => {this.copyToClipboard(e, orderNo)}} >
            <ListItemText primary={orderNo}  onClick={this.copyToClipboard} />
            </ListItem>

      }):
      <ListItem button>
        <ListItemText primary={tmpVal} key={tmpVal}   onClick={(e) => {this.copyToClipboard(e, tmpVal)}} />
        </ListItem>

  }
  render() {
    console.log('render OrderCancelForm props:',this.props)
    console.log('render OrderCancelForm state:',this.state)
    const columnDefaults = { ...ReactTableDefaults.column, headerClassName: 'wordwrap' }
    const { classes, history, selection, getRow} = this.props;
    //const { classes, history, selection, getRow, notPurchased} = this.props;
  //  console.log('notPurchased:',notPurchased)
    // const bulkUpdate = selection && selection.length > 1
    // var selectedPoList = []
    // if (bulkUpdate) {
    //   selection.map(key => {
    //     var row = getRow(key)
    //     row.message = ""
    //     selectedPoList.push(row)
    //   })
    // }


    const {_id, po_no,
       title, link, po_qty, total_purchased_qty,
       price,sale_price,first_payment,total_amount,options
       ,source, notes,orders,destination
    } = this.state.poInfo;

    // const rowSelection =  this.props.getRow(_id)
    // console.log("rowSelection:",rowSelection)
     const { purchased_qty,purchase_id,order_notes,order_date,
          order_no,delivery_days_to,delivery_days_from} = this.state.formEditInfo

      const {message, bulkUpdate,selectedPoList} = this.state
     console.log("render new message:",message, " purchase_id:",purchase_id)


    return (
    <div className="popup">
      <div className="popup_inner">
        {   !bulkUpdate ?
        <div className=" flex flex-column  flex-wrap p1 m1 border">

          <div className="flex flex-wrap  ml2">
            <TextField
              disabled={bulkUpdate}
              name="poNo"
              type="String"
              label="PO #"
              value={po_no}
              onClick={(e) => {this.copyToClipboard(e, po_no)}}
              margin="dense"
              className={classes.textField}
              style={{
                //backgroundColor:'pink',
                'whiteSpace': 'unset',
                 'fontSize': '12px' ,
                 'fontWeight':'bold',
                'width' : '8em',
              }}
            />
            <TextField
              disabled={bulkUpdate}
              name="title"
              type="String"
              label="Title"
              value={title}
              onClick={(e) => {this.copyToClipboard(e, title)}}
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
                 'fontWeight':'bold',
                'width' : '32em',
              }}
              className={classes.textField}
            />
            <TextField
              disabled={bulkUpdate}
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

            <List
            className="col-3 border "
            component="nav"
            subheader={<ListSubheader component="div">Orders List</ListSubheader>}
            >
                    {this.renderExistingOrders({orders})}
            </List>
            {/* poQty block*/}
            <p> {this.state.copySuccess} </p>
          </div>

        </div>
        :<ReactTable
          column={columnDefaults}
          data={selectedPoList}
          columns={[
            {
              Header: "Selected Orders",
              columns: [
                {
                  Header: "PO#",
                  accessor: "po_no"
                },
                {
                  Header: "Title",
                  accessor: "title"
                },
                {
                  Header: "Link",
                  id: "link",
                  accessor: "link",
                  accessor: d =>
                  <a href = { d.link } target = "_blank" > {d.link  } </a>,

                },
                {
                  Header: "PO Qty",
                  id: "po_qty",
                  accessor: d => d.po_qty
                },
                {
                  Header: "T. Pur Qty",
                  id: "total_purchased_qty",
                  accessor: d => d.total_purchased_qty
                },
                ,
                {
                  Header: "Order#",
                  id: "order_no",
                  accessor: d => d.order_no
                },
                {
                  Header: "Set Pur Qty",
                  id: "purchased_qty",
                  accessor: d => d.purchased_qty,
                  style: {
                    backgroundColor: 'lightblue',
                    font: "bold"

                  }
                },
                {
                  Header: "source",
                  id: "source",
                  accessor: d => d.source
                }
              ]
            },
            {
              Header: "Results",
              columns: [
                {
                  Header: "message",
                    id: "message",
                  accessor: "message",
                  accessor: d => d.message
                },
              ]
            }
          ]}
          defaultPageSize={5}
          className="-striped -highlight"
        />
       }

        <div  className="flex flex-column ml2 p0 ">
        <div className=" flex flex-auto lightgray  p0 boarder-bottom m0">
          <Fab size="small" color="primary" aria-label="Add" className={classes.fab}>
            <AddIcon size="small" onClick={this.addNew} />
          </Fab>
          <Fab size="small" color="secondary" aria-label="Cancel" className={classes.fab}>
            <CancelIcon size="small" onClick={this.cancelAddNew} />
          </Fab>
          <Fab size="small" disabled aria-label="Delete" className={classes.fab}>
            <DeleteIcon size="small" onClick={this.deleteRecord} />
          </Fab>
        </div> {/* Fab div */}
        <div className="flex-auto px1 lightblue ">
          <form  className="ml2" onSubmit={this.handleAction} autoComplete="off">

            <div className="flex flex-row ml2 ">
            <TextField
              name="order_no"
              required
              type="String"
              label={"Order # [" + (!purchase_id||purchase_id==-99? "New":"Edit")+"]"}
              autoFocus={true}
              value={order_no}
              onChange={this.handleChange}
              margin="dense"
              className="col-5 ml2"
            />
            <TextField
              name="purchased_qty"
              required
              type="Number"
              label="Qty"
              value={purchased_qty}
              onChange={this.handleChange}
              margin="dense"
              className="col-1 ml2"
            />
            <DatePicker className="pickers"
                    autoOk
                    disableFuture
                    value={order_date}
                    onChange={this.handleDateChange}
                    format="DD-MMM-YYYY"
              />
            </div> {/* div for order_no and purchased_qty */}

            <div className="flex flex-wrap ml2">
            <TextField
              name="delivery_days_from"
              required
              type="Number"
              label="Days from"
              value={delivery_days_from}
              onChange={this.handleChange}
              margin="dense"
              className="col-1"
            />
             -
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
              name="order_notes"
              type="String"
              label="Order Cust Note"

              value={order_notes}
              onChange={this.handleChange}
              margin="dense"
              className="col-4 ml2"
            />
            <TextField
              name="source"
              type="String"
              label="Actual Source"
              value={source}
              onChange={this.handleChange}
              margin="dense"
              className="col-2 ml2"
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
            </div>
          </form>
          </div> {/* end of form div*/}

          <div className="flex flex-wrap col3">
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
                        'fontSize': '12px' ,
                        'font': 'bold',
                      'width' : 600,
                    }}

                    margin="dense"

            />
            <Button size="medium"  variant="contained"
              color="primary"
              margin="dense" onClick={this.props.closePopup}>
              Close
            </Button>
          </div>
        </div> {/* close div which includes Fabs, foem and message */}
      </div>  {/* popup_inner */}

    </div>  // close div popup



    );
  }
}

OrderCancelForm.propTypes = {
  onSubmit: PropTypes.func,

};

OrderCancelForm.defaultProps = {
  onSubmit: () => {},
};

const cancelPurchaseOrder = gql`
  mutation cancelPurchaseOrder($cancelPoInput: CancelPoInput!) {
    cancelPurchaseOrder (input: $cancelPoInput) {
     _id
      message
   }
  }
`;

const OrderCancelFormWithMutation =
graphql( cancelPurchaseOrder)
(OrderCancelForm);

export default withStyles(styles)(OrderCancelFormWithMutation)
