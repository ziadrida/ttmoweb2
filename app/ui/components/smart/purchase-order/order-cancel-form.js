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
import Input from '@material-ui/core/Input';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import FilledInput from '@material-ui/core/FilledInput';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

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
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 300,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
  dense: {
    marginTop: 10,
  },
  menu: {
    width: 300,
  },
});

class OrderCancelForm extends React.Component {
  constructor(props) {
    console.log("OrderCancelForm constructor props:",props)
  super(props);
  this.state = {
    copySuccess: '',
    bulkUpdate: false,
    validBulkUpdate: false,
    refresh: false,
    selectedPoList: [],
    allowSave: true,
    message: '',
  formEditInfo: {
    po_no:'',
    edit_notes:'',
    edit_status:'',
    edit_delivered_qty:0,
  },

  poInfo: {
    rowIndex:0,
    po_no: '',
    title: '',
    option:'',
    link: '',
    price: 0,
    sale_price: 0,
    first_payment:'',
    username:'',
    total_purchased_qty: 0,
    po_qty: 0,
    status:'',
    notes:'',
    order_no: '',
    delivery_days_from: 0,
    delivery_days_to: 0,
    delivered_qty:0,
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
    var validUpdate = true;
  var tmpSelectedPoList = []
  var changedList = false;

  if (bulkUpdate && props.poInfo) {
    var tmpStatus = '';
    selection.map(key => {
      console.log('build update list ', key)
      var row = getRow(key)
      if (row) {
        row.message = ""
        // to do bulk update, all selected items do not share the same status
        if (tmpStatus == '') tmpStatus = row.status?row.status:'';
        else if (tmpStatus != row.status) validUpdate = false

        row.edit_delivered_qty = parseInt(row.po_qty) - parseInt(row.delivered_qty?row.delivered_qty:0)

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
        validBulkUpdate: validUpdate,
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
    if (props.poInfo && state.poInfo && props.poInfo._id !== state.poInfo._id) {
      returnState =  {
        ...returnState,
        message:props.poInfo.po_no?'Loaded PO#'+props.poInfo.po_no:'',
        poInfo: props.poInfo ,
        formEditInfo: {
          po_no:props.poInfo.po_no,
          edit_notes:props.poInfo.notes? props.poInfo.notes:'',
          edit_delivered_qty: props.poInfo.delivered_qty,
          edit_status:props.poInfo.status?props.poInfo.status:'' ,
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


  handleAction = (evt) => {
    evt.preventDefault();
    console.log('OrderCancelForm handleAction:',evt)
    console.log('=> OrderCancelForm in handleAction props==>\n',this.props)
    console.log('=> OrderCancelForm in handleAction state\n',this.state)
    const { closePopup } = this.props;
    this.setState({message:"Updating ...",
                allowSave: false})


     const { selectedPoList, bulkUpdate,  validBulkUpdate } = this.state
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
         // fiels that come from the list of PO to be changed
        po_no: selectedPo.po_no,
        delivered_qty: selectedPo.edit_delivered_qty? parseInt(selectedPo.edit_delivered_qty):null,
        delivered:selectedPo.delivered,
      }:
      {
        po_no: this.state.formEditInfo.po_no,
        delivered:this.state.poInfo.delivered,
        delivered_qty: this.state.formEditInfo.edit_delivered_qty?
          parseInt(this.state.formEditInfo.edit_delivered_qty):null,
      }
      console.log('updateInfo:',updateInfo)
       const response = await mutate({

         variables: {
           "updateStatusInput": {
            "po_no": updateInfo.po_no,
            "notes":this.state.formEditInfo.edit_notes,
            "status":this.state.formEditInfo.edit_status,
            "delivered_qty":updateInfo.delivered_qty,
            "delivered":updateInfo.delivered, // if -1 then cannot change status unless cancelled
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
         console.log("got response from mutation")
         this.setState(
           { message:  res.data.cancelPurchaseOrder.message ,
             poInfo: {
                 ...this.state.poInfo,

                   status:res.data.cancelPurchaseOrder.status,
                   notes:res.data.cancelPurchaseOrder.notes,
                   delivered_qty:res.data.cancelPurchaseOrder.delivered_qty,
             },
             formEditInfo: {
               ...this.state.formEditInfo,
                edit_status: res.data.cancelPurchaseOrder.status,
                edit_notes:res.data.cancelPurchaseOrder.notes,
                edit_delivered_qty:res.data.cancelPurchaseOrder.delivered_qty
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
                     res.data.cancelPurchaseOrder.message;
          rtnPoInfo.status=res.data.cancelPurchaseOrder.status;

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

    renderExistingTrackings(trackingList){
        console.log('=> in renderExistingTrackings trackingList:',trackingList)
      const {trackings} = trackingList
      console.log('=> in renderExistingTrackings:',trackings)
      var tmpVal = typeof trackings != 'undefined'? trackings:'No trackings'
         return  tmpVal!='' &&
                typeof tmpVal !== 'string'?
            trackings.map(trackingNo => {
                return <ListItem button key={trackingNo}     >
                  <ListItemText primary={trackingNo}    onClick={(e) => {this.copyToClipboard(e, trackingNo)}}  />
                  </ListItem>

        }):
        <ListItem button   onClick={(e) => {this.copyToClipboard(e, trackingNo)}} >
          <ListItemText primary={tmpVal} key={tmpVal}   onClick={(e) => {this.copyToClipboard(e, tmpVal)}}  />
          </ListItem>

    }

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
       ,source, notes,orders,trackings,destination,status,username,delivered_qty
    } = this.state.poInfo;

    // const rowSelection =  this.props.getRow(_id)
    // console.log("rowSelection:",rowSelection)
     const { edit_notes,edit_status,edit_delivered_qty} = this.state.formEditInfo

      const {message, bulkUpdate,validBulkUpdate,selectedPoList} = this.state
     console.log("render new message:",message)


    return (
    <div className="popup">
      <div className="popup_inner">
        {   !bulkUpdate ?
        <div className=" flex flex-wrap   p1 m1 border">

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
                 'fontSize': '10px' ,
                 'fontWeight':'bold',
                'width' : '42em',
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
               'width' : '32em',
             }}
              margin="dense"
            />
            <div className="border"
              style={{'overflowX': 'hidden',
              'overflowY':'scroll',
              'fontSize': '10px' ,
               width:'80em',height:'3em'}}>
            {  <a href = { link } target = "_blank" > {link  } </a>}
            </div> {/* link */}
          </div>
          <TextField
            name="username"
            type="String"
            label="User"
            value={username}
            InputProps={{
             readOnly: true,
            }}
            margin="dense"

            className="col-1"
          />
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
          <TextField
            name="status"
            type="String"
            label="Status"
            value={status}

            InputProps={{
             readOnly: true,
           }}
            width='8em'
            margin="dense"
            className="col-1"
          />
          <TextField
            name="poQty"
            type="Number"
            label="Po Qty"
            value={po_qty}

            InputProps={{
             readOnly: true,
           }}
            margin="dense"
            width='4em'
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
              width='4em'
            className="col-1"
          />
          <TextField
            name="delivered_qty"
            type="String"
            label="Delv Qty"
            value={delivered_qty}
            InputProps={{
             readOnly: true,
            }}
            margin="dense"
            width='6em'
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
            width='6em'
            className="col-1"
          />
          <TextField
            name="ponotes"
            type="String"
            label="All Notes"
            value={notes}
            onClick={(e) => {this.copyToClipboard(e, notes)}}
            margin="dense"
              width='32em'
            className="col-3 ml2"
          />

          <div className="flex flex-wrap">
            <List
            style={{
            'fontSize': '10px' ,
             margin:'0pm',
             width:'20em'}}
            className=" border "
            component="nav"
            subheader={<ListSubheader component="div">Orders List</ListSubheader>}
            >
                    {this.renderExistingOrders({orders})}
            </List>
            <List
            style={{
            'fontSize': '10px' ,
            margin:'0pm',
             width:'20em'}}
            className="border "
            component="nav"
            subheader={<ListSubheader component="div">Trackings List</ListSubheader>}
            >
                    {this.renderExistingTrackings({trackings})}
            </List>

            {/* poQty block*/}

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
                  Header: "Status",
                  id: "status",
                  accessor: d => d.status
                },
                {
                  Header: "PO Qty",
                  id: "po_qty",
                  accessor: d => d.po_qty
                },
                {
                  Header: "Delv Qty",
                  id: "delivered_qty",
                  accessor: d => d.delivered_qty
                },
                {
                  Header: "Set Delv Qty",
                  id: "edit_delivered_qty",
                  accessor: d => d.edit_delivered_qty
                },
                {
                  Header: "Order#",
                  id: "order_no",
                  accessor: d => d.order_no
                },
                {
                  Header: "notes",
                  id: "notes",
                  accessor: d => d.notes,

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
          getTdProps={(state, rowInfo, column, instance) => {
             return {

               onClick: (e, handleOriginal) => {
                 console.log("A Td Element was clicked!");
                 console.log("it produced this event:", e);
                 console.log("It was in this column:", column);
                 console.log("It was in this row:", rowInfo);
                 console.log("It was in this table instance:", instance);
                 console.log('VALUE==>', rowInfo.row[column.id])

                 this.copyToClipboard(e, rowInfo.row[column.id])
                // this.setState({ oldVal: rowInfo.row[column.id] })

                 // IMPORTANT! React-Table uses onClick internally to trigger
                 // events like expanding SubComponents and pivots.
                 // By default a custom 'onClick' handler will override this functionality.
                 // If you want to fire the original onClick handler, call the
                 // 'handleOriginal' function.
                  if (handleOriginal || true) {
                    handleOriginal();
                 }
               }
             };
           }}

          defaultPageSize={5}
          noDataText="nothing selected"
          className="-striped -highlight"
        />
       }


        <div className="flex-auto px1 lightblue ">
          <form  className="ml2" onSubmit={this.handleAction} autoComplete="off">


            <div className="flex flex-wrap ml2">

            <TextField
              name="edit_notes"
              type="String"
              label="Customer Note"
              value={edit_notes}
              onChange={this.handleChange}
              margin="dense"
              className="col-4 ml2"
            />
            <FormControl required className={classes.formControl}>
            <InputLabel htmlFor="status-required">Status</InputLabel>
            <Select
              value={edit_status}
              onChange={this.handleChange}
              name="edit_status"
              inputProps={{
                id: 'status-required',
              }}
              className={classes.selectEmpty}
            >
              <MenuItem value={"active"}>active</MenuItem>
              <MenuItem value={"awaiting_payment"}>awaiting_payment</MenuItem>
              <MenuItem value={"cancelled"}>cancelled</MenuItem>
              <MenuItem value={"delivered"}>delivered</MenuItem>
              <MenuItem value={"closed"}>close PO</MenuItem>
            </Select>
            <FormHelperText>Required</FormHelperText>
          </FormControl>
          <TextField
            name="edit_delivered_qty"
            type="String"
            label="Delivered Qty"
            disabled={edit_status == "delivered" || edit_status == "active" ?
            bulkUpdate :true}
            value={edit_delivered_qty}
            onChange={this.handleChange}
            margin="dense"
            className="col-1 ml2"
          />
            <Button
              disabled={this.state.allowSave? (bulkUpdate &&  !validBulkUpdate)? true:false :true}
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

          <div className="flex flex-wrap col3 ml2">
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

        </div> {/* close div which includes Fabs, form and message */}
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
  mutation cancelPurchaseOrder($updateStatusInput: UpdateStatusInput!) {
    cancelPurchaseOrder (input: $updateStatusInput) {
     _id
      message
      status
      delivered_qty
      closed
   }
  }
`;

const OrderCancelFormWithMutation =
graphql( cancelPurchaseOrder)
(OrderCancelForm);

export default withStyles(styles)(OrderCancelFormWithMutation)
