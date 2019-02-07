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
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Select from '@material-ui/core/Select';

import Checkbox from "@material-ui/core/Checkbox";


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
  datePickers: {
    display: 'flex',
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    'justify-content': 'space-around',
  },
  button: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    marginTop: 19,
    width: 120,
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 350,
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
  boxElementPad: {
      padding: "16px 24px 16px 24px",
      height:'auto'
  },

  formGroup: {
      marginTop: "8px",
  },

  checkbox: {
      width: "12px",
      height: "12px",
  },
  // checkboxColor: {
  //     "&$checked": {
  //         color: "#027cb5",
  //     },
  // },
  checked: {},
  label: {
      fontSize: "15px",
      marginLeft: "5px",
      color: "green",
      fontFamily: "seriff"
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
    edit_delivered_qty:'',
    edit_first_payment:'',
    edit_first_payment_date:'',
    edit_final_payment:'',
    edit_final_payment_date:'',
    edit_discount: '',
    edit_accounting_note:'',
    edit_customer_delivery_date: '',
    edit_closed: false,
    edit_paid_in_full:false,
    edit_booked: false,
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
    first_payment_date:'',
    final_payment:'',
    final_payment_date:'',
    accounting_note:'',
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
    order_date:  '',
    customer_delivery_date: '',
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
    console.log(">> bulkUpdate <<  selection:",selection)
    var tmpStatus = '';

    selection.map(key => {
      console.log('build update list key:', key)
      var row = getRow(key)
      if (row) {
        row.message = ""
        // to do bulk update, all selected items must share the same status

        row.closed = row.closed != null?  row.closed:false,
        row.paid_in_full =row.paid_in_full != null?  row.paid_in_full:false,
        row.booked= row.booked != null?  row.booked:false,
        row.discount = row.discount != null?  parseFloat(row.discount):0,
      //  row.edit_delivered_qty = parseInt(row.po_qty) - parseInt(row.delivered_qty?row.delivered_qty:0)
        row.edit_delivered_qty =  parseInt(row.po_qty);
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
  console.log("findIndex says =>  bulkUpdate:",bulkUpdate)
  console.log("findIndex says =>  listChanged:",changedList)
  console.log("findIndex says =>  state.refresh:",state.refresh)
  var returnState = {}
    if ( bulkUpdate && (changedList || state.refresh) ) {
      console.log("bulkUpdate (chnagedList or refresh requested)")
      var selectedPoList;
      try {
        if (changedList) {
        returnState =  {
          ...returnState,
          bulkUpdate: bulkUpdate,
          selectedPoList: tmpSelectedPoList,
        }
        selectedPoList = tmpSelectedPoList;
      } else {
        selectedPoList = state.selectedPoList;
      }
        // if all closed the same then enable Closed



        console.log("* setState for bulkUpdate selectedPoList:",selectedPoList)
        console.log("*** setState for bulkUpdate selectedPoList[0]:",selectedPoList[0])
        var firstSelectedPo = selectedPoList[0];
          console.log("*** setState for bulkUpdate firstSelectedPo:",firstSelectedPo)
          console.log("1 selectedPoList[0]._id:",firstSelectedPo._id)
          console.log("1 selectedPoList[0].paid_in_full:",firstSelectedPo.paid_in_full)
            console.log("1 firstSelectedPo.booked:",firstSelectedPo.booked)
        var disableClosed = !selectedPoList.every(po => po.closed == firstSelectedPo.closed )
        var disablePaid = !selectedPoList.every(po => po.paid_in_full == firstSelectedPo.paid_in_full )
        var disableBooked = !selectedPoList.every(po => po.booked == firstSelectedPo.booked )
        var disableStatus = !selectedPoList.every(po => po.status == firstSelectedPo.status )
        console.log('disableClosed:',disableClosed)
        console.log('disablePaid:',disablePaid)
        console.log('disableBooked:',disableBooked)
        console.log('disableStatus:',disableStatus)
          console.log("** setState for bulkUpdate selectedPoList:",selectedPoList)
        console.log("firstSelectedPo.status:",firstSelectedPo.status)
        console.log("firstSelectedPo.closed:",firstSelectedPo.closed)
        console.log("firstSelectedPo.paid_in_full:",firstSelectedPo.paid_in_full)
        console.log("firstSelectedPo.booked:",firstSelectedPo.booked)
        console.log("*** setState for bulkUpdate selectedPoList:",firstSelectedPo)
        console.log("**** setState for bulkUpdate selectedPoList:",selectedPoList)
        returnState =  {
          ...returnState,
            validBulkUpdate:!disableClosed || !disablePaid || !disableBooked || !disableStatus,
            formEditInfo: {
              edit_status: disableStatus? null: firstSelectedPo.status,
              edit_closed: disableClosed? null:firstSelectedPo.closed ,
              edit_paid_in_full: disablePaid?null: firstSelectedPo.paid_in_full ,
              edit_booked: disableBooked? null: firstSelectedPo.booked,
          }
        }
        console.log("Last firstSelectedPo.paid_in_full:",firstSelectedPo.paid_in_full)
    } catch(err) {
      console.log("!!!ERROR setting bulkUpdate state  err:",err)
    }
    }
    if (state.refresh ) {
      returnState =  {
        ...returnState,
        refresh: false,

      }
    }
    if (props.poInfo && state.poInfo && props.poInfo._id !== state.poInfo._id && !bulkUpdate) {
      console.log("PO _id changed => Update state")
      returnState =  {
        ...returnState,
        message:props.poInfo.po_no?'Loaded PO#'+props.poInfo.po_no:'',
        poInfo: props.poInfo ,
        formEditInfo: {
          po_no:props.poInfo.po_no,
          edit_notes:props.poInfo.notes? props.poInfo.notes:'',
          edit_delivered_qty: props.poInfo.delivered_qty? parseInt(props.poInfo.delivered_qty):0,
          edit_first_payment:props.poInfo.first_payment? parseFloat(props.poInfo.first_payment):0,
          edit_first_payment_date: props.poInfo.first_payment_date &&
              props.poInfo.first_payment_date!='0' ?
              props.poInfo.first_payment_date:
              moment(props.poInfo.order_date,'DD/MM/YYYY').add(0,'day'),
          edit_final_payment:props.poInfo.final_payment? parseFloat(props.poInfo.final_payment):0,
          edit_final_payment_date: props.poInfo.final_payment_date &&
              props.poInfo.final_payment_date!='0' ?
              props.poInfo.final_payment_date:
              moment(props.poInfo.order_date,'DD/MM/YYYY').add(0,'day'),
          edit_accounting_note: props.poInfo.accounting_note? props.poInfo.accounting_note:'',
          edit_customer_delivery_date: props.poInfo.customer_delivery_date &&props.poInfo.customer_delivery_date!='0' ?
            moment(props.poInfo.customer_delivery_date,'DD/MM/YYYY').toDate():
            moment(props.poInfo.order_date,'DD/MM/YYYY').add(14,'day'),

          edit_status:props.poInfo.status?props.poInfo.status:'' ,
          edit_closed: props.poInfo.closed != null?  props.poInfo.closed:false,
          edit_paid_in_full:props.poInfo.paid_in_full != null?  props.poInfo.paid_in_full:false,
          edit_booked: props.poInfo.booked != null?  props.poInfo.booked:false,
          edit_discount: props.poInfo.discount != null?  parseFloat(props.poInfo.discount):0,

        },

      };
    }

    var finalState = returnState!={}? returnState: null
    console.log('<><><><> finalState:',finalState)
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
          edit_customer_delivery_date: date
        },
        allowSave: true
      });
  };
  handleFirstPaymentDateChange = date => {
    console.log("date:",date)
        this.setState({
            formEditInfo: {
            ...this.state.formEditInfo,
            edit_first_payment_date: date
          },
          allowSave: true
        });
  };

  handleFinalPaymentDateChange = date => {

        this.setState({
            formEditInfo: {
            ...this.state.formEditInfo,
            edit_final_payment_date: date
          },
          allowSave: true
        });
  };

  handleChange = ({ target }) => {
    console.log('in handleChange ',target)
    if (!target) return;
    const { value, name } = target;

    this.setState(
          {
          formEditInfo: {
          ...this.state.formEditInfo,
            [name]: value
        },
        allowSave: true
      });

    console.log('updatePurchaseOrder handleChange',this.state)
    //let order-detail-page set the state so when page filter is
    // used the form values are correct
    // this means we actually don't need to pass form values onSubmit (but we do!)
    // if (typeof this.props.onChange === 'function') {
    //        this.props.onChange({target});
    //    }
  }



    handleCheckbox = name => event => {

      console.log('>handleCheckbox name:',name)
      console.log('>handleCheckbox  event.target:',event.target)
      console.log('>handleCheckbox  event.target.checked:',event.target.checked)
      this.setState({
        formEditInfo: {
        ...this.state.formEditInfo,
         [name]: event.target.checked },
       allowSave:true
     });
    };

   handleAction = async (evt) => {
    evt.preventDefault();
    console.log('OrderCancelForm handleAction:',evt)
    console.log('=> OrderCancelForm in handleAction props==>\n',this.props)
    console.log('=> OrderCancelForm in handleAction state\n',this.state)
    const { closePopup } = this.props;
    this.setState({message:"Updating ...",
                allowSave: false})


     const {  bulkUpdate,  validBulkUpdate } = this.state
     var newSelectedPoList = []
     var selectedPoList = this.state.selectedPoList;
     var newPoInfo ;
     if (bulkUpdate) {
       // creating multiple orders
       console.log("--> Do bulkUpdate - selectedPoList:",selectedPoList);
        selectedPoList = selectedPoList.map(async poInfo => {
         console.log("call mutateAction for poInfo:",poInfo)
        //console.log('update=>',poInfo)
         newPoInfo = await this.mutateAction(poInfo).then(response => {

           console.log("=======>  After bulkUpdate line mutateAction response:",response)
           console.log("=======>  After mutateAction newPoInfo:",newPoInfo)
           poInfo.closed = response.closed;
           poInfo.booked = response.booked;
           poInfo.paid_in_full = response.paid_in_full;
           poInfo.accounting_note = response.accounting_note;
           poInfo.customer_delivery_date = response.customer_delivery_date != 'Invalid date' && response.customer_delivery_date?
              response.customer_delivery_date:'';
           poInfo.delivered_qty = response.delivered_qty? response.delivered_qty:0;
           poInfo.discount = response.discount?response.discount:0;
           poInfo.final_payment= response.final_payment? response.final_payment:0;
           poInfo.final_payment_date= response.final_payment_date? response.final_payment_date:''
           poInfo.first_payment= response.first_payment? response.first_payment:0;
           poInfo.first_payment_date= response.first_payment_date? response.first_payment_date:''
           poInfo.message = response.message? response.message:''
           poInfo.status =     response.status
           // update after every step
           //  console.log("*** After mutateAction - set State selectedPoList: ",newSelectedPoList)
           // this.setState({
           //   refresh: true,
           //   message:  "check messages above for bulk update results" ,
           //   selectedPoList: newSelectedPoList
           // })

         })

           // console.log("** newPoInfo returned:",newPoInfo)
           // if (newPoInfo) {
           //   console.log("** Push newPoInfo",newPoInfo)
           //   newSelectedPoList.push(newPoInfo)
           // }   else {
           //   console.log("!!!Keep old poInfo:",poInfo)
           //   newSelectedPoList.push(poInfo)
           //    console.log("setState with latest selectedPoList")
           //   this.setState({
           //     refresh: true,
           //     message:  "check messages above for bulk update results" ,
        //   //     selectedPoList: newSelectedPoList
           //   })
           // }
      //  })
         //poInfo.message = res.message;

       })
          this.setState({
          //    refresh: true,
              message:  "Check messages in list table above for update results" ,
          })
         // console.log("*******All mutations are completed - set State  selectedPoList: ",selectedPoList)
         //  this.setState({
         //   refresh: true,
         //   message:  "Check messages in list table above for update results" ,
         //   selectedPoList: selectedPoList
         // })





     } else {
          newPoInfo = await this.mutateAction(this.state.poInfo).then(resp => {
            console.log("=======>  After single mutateAction resp:",resp)
            console.log("=======>  After mutateAction newPoInfo:",newPoInfo)
          this.setState(
            { message:  resp.message ,
              refresh: true,
              poInfo: {
                  ...this.state.poInfo,

                    status:resp.status,
                    notes:resp.notes?resp.notes:'',
                    delivered_qty:resp.delivered_qty?
                       parseInt(resp.delivered_qty):0,
                    customer_delivery_date:resp.customer_delivery_date?
                     resp.customer_delivery_date:'',
                    first_payment:resp.first_payment  ?
                       parseFloat(resp.first_payment):0,
                    first_payment_date:resp.first_payment_date  ?
                       resp.first_payment_date:null,
                   final_payment:resp.final_payment  ?
                       parseFloat(resp.final_payment):0,
                   final_payment_date:resp.final_payment_date  ?
                        resp.final_payment_date:null,
                   accounting_note:resp.accounting_note?
                       resp.accounting_note:'',

                   closed: resp.closed != null?  resp.closed:false,
                   paid_in_full:resp.paid_in_full != null?  resp.paid_in_full:false,
                   booked: resp.booked != null?resp.booked:false,
                   discount: resp.discount != null?  resp.discount:0,
              },
              formEditInfo: {
                ...this.state.formEditInfo,
                 edit_status: resp.status,
                 edit_notes:resp.notes?resp.notes:'',
                 edit_delivered_qty:resp.delivered_qty!=null?
                    parseInt(resp.delivered_qty):0,
                 edit_customer_delivery_date: resp.customer_delivery_date != null?
                     moment(resp.customer_delivery_date,"DD/MM/YYYY").toDate():
                     this.state.formEditInfo.edit_customer_delivery_date,
                 edit_first_payment:resp.first_payment  ?
                   parseFloat(resp.first_payment):0,
                 edit_first_payment_date:resp.first_payment_date  ?
                   moment(parseInt(resp.first_payment_date)).toDate():null,
                 edit_final_payment:resp.final_payment  ?
                    parseFloat(resp.final_payment):0,
                 edit_final_payment_date:resp.final_payment_date  ?
                     moment(parseInt(resp.final_payment_date)).toDate():null,

                 edit_accounting_note: resp.accounting_note?       resp.accounting_note:'',
                 edit_closed: resp.closed != null?  resp.closed:false,
                 edit_paid_in_full:resp.paid_in_full != null?  resp.paid_in_full:false,
                 edit_booked: resp.booked != null?resp.booked:false,
                 edit_discount: resp.discount != null?  parseFloat(resp.discount):0,
               },
              allowSave: true
              }

            );
          }).catch((err) => {
            console.log("Error setting state:",stateErr)
          })
     }


  }

  async mutateAction (selectedPo)  {
    console.log('=> mutateAction selectedPo:', selectedPo)
    var message =  ""
    var sucess = false
    var rtnPoInfo = selectedPo;
    const { mutate, setRow} = this.props
    if (mutate) {

      console.log("+>>>selectedPo.edit_delivered_qty:",selectedPo.edit_delivered_qty)
      try {
      var updateInfo = this.state.bulkUpdate?
       {
         // fiels that come from the list of PO to be changed
        po_no: selectedPo.po_no,
        delivered:selectedPo.delivered!= null? selectedPo.delivered:null,
        delivered_qty:
              // can set delivered_qty in bulk only if setting status to delivered
              selectedPo.edit_delivered_qty != null && this.state.formEditInfo.edit_status == 'delivered'  ?
               selectedPo.edit_delivered_qty:null,

      }:
      {
        po_no: this.state.formEditInfo.po_no,
        delivered:this.state.poInfo.delivered,
        delivered_qty: this.state.formEditInfo.edit_delivered_qty!=null &&
              this.state.formEditInfo.edit_delivered_qty!='' ?
          parseInt(this.state.formEditInfo.edit_delivered_qty):null,
      }
     }  catch(err) {
        console.log("!!!ERROR setting updateInfo")
        rtnPoInfo.message = "Internal Error. Error setting bulk update"
          return rtnPoInfo;
      }
      console.log('***** updateInfo:',updateInfo)
      console.log("+++ before calling propos.mutate ")
      const response = await mutate({
         variables: {
           "updateStatusInput": {
            "po_no": updateInfo.po_no,
            "notes":this.state.formEditInfo.edit_notes,
            "status":this.state.formEditInfo.edit_status &&this.state.formEditInfo.edit_status!=''? this.state.formEditInfo.edit_status:null ,
            "delivered_qty":updateInfo.delivered_qty,
            "customer_delivery_date":this.state.formEditInfo.edit_customer_delivery_date && updateInfo.delivered_qty> 0?
              moment(this.state.formEditInfo.edit_customer_delivery_date).format('DD/MM/YYYY'):null,
            "first_payment":this.state.formEditInfo.edit_first_payment &&
                this.state.formEditInfo.edit_first_payment!=''  ?
                parseFloat(this.state.formEditInfo.edit_first_payment):null,
            "first_payment_date":this.state.formEditInfo.edit_first_payment_date &&
                  this.state.formEditInfo.edit_first_payment_date!='' && this.state.formEditInfo.edit_first_payment_date   ?
                    moment(this.state.formEditInfo.edit_first_payment_date).toDate():null,
            "final_payment":this.state.formEditInfo.edit_final_payment &&
                        this.state.formEditInfo.edit_final_payment!='' ?
                        parseFloat(this.state.formEditInfo.edit_final_payment):null,
            "final_payment_date":this.state.formEditInfo.edit_final_payment_date &&
                          this.state.formEditInfo.edit_final_payment_date!='' && this.state.formEditInfo.edit_final_payment_date?
                            moment(this.state.formEditInfo.edit_final_payment_date).toDate():null,
            "accounting_note":this.state.formEditInfo.edit_accounting_note?
                  this.state.formEditInfo.edit_accounting_note:null,
            "delivered":updateInfo.delivered, // if -1 then cannot change status unless cancelled

            closed: this.state.formEditInfo.edit_closed != null?  this.state.formEditInfo.edit_closed:false,
            paid_in_full:this.state.formEditInfo.edit_paid_in_full != null?  this.state.formEditInfo.edit_paid_in_full:false,
            booked: this.state.formEditInfo.edit_booked != null? this.state.formEditInfo.edit_booked:false,
            discount: this.state.formEditInfo.edit_discount != null?  parseFloat(this.state.formEditInfo.edit_discount):0,
          }
        },
        refetchQueries: [
                {
          query: orderDetailsQuery,
          variables:this.props.variables
        }],
     })
     .then( res => {
       console.log("==> MUTATION result:",res)
       if (!res || !res.data || !res.data.updatePurchaseOrder) {
          // this.setState({message: "DB Error",
          // allowSave: true})
            rtnPoInfo.message =   "DB Error";
              return rtnPoInfo;
       } else if (!res.data.updatePurchaseOrder._id ||
             res.data.updatePurchaseOrder._id == -99) {
               console.log('!!!errors result id is -99 ')
          //  this.setState(
          //      {message: res.data.updatePurchaseOrder.message ,
          //      allowSave: true},
          // )
          rtnPoInfo.message = rtnPoInfo.message==""? rtnPoInfo.message:rtnPoInfo.message+'\n'+
                    res.data.updatePurchaseOrder.message;
             return rtnPoInfo;
       }  else     {
         console.log("OK=>got response from mutation - set state and message response")
         console.log("+++++=>res:",res&&res.data)


          // setRow(poInfo)
          // console.log('done with setState =>new state:\n',this.state)

           // console.log("Call registerPurchase in order-details")
           // this.props.registerPurchase(res.data.updatePurchaseOrder._id,
           //   this.props.rowIndex)

         rtnPoInfo.message = rtnPoInfo.message==""? rtnPoInfo.message:rtnPoInfo.message+'\n'+
                     res.data.updatePurchaseOrder.message;
        //  rtnPoInfo.status=res.data.updatePurchaseOrder.status;
          rtnPoInfo = res.data.updatePurchaseOrder;
          console.log("OK > Return rtnPoInfo:",rtnPoInfo)
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
     });
     console.log("?? MUTATION response:",response)
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
      var tmpVal = typeof trackings != 'undefined' || trackings.length>0? trackings:'No trackings'
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
    var tmpVal = typeof orders != 'undefined' || orders.length>0? orders:'No orders'
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


    const {_id, po_no,order_date,po_date,
       title, link, po_qty, total_purchased_qty,
       price,sale_price,first_payment,first_payment_date,final_payment,final_payment_date,accounting_note, total_amount,options
       ,source, notes,orders,trackings,destination,status,username,delivered_qty,customer_delivery_date, closed, paid_in_full,booked,discount,
      } = this.state.poInfo;

    // const rowSelection =  this.props.getRow(_id)
    // console.log("rowSelection:",rowSelection)
     const { edit_notes,edit_status,edit_delivered_qty,edit_first_payment,edit_first_payment_date,
       edit_final_payment,edit_final_payment_date,edit_accounting_note,
        edit_customer_delivery_date,edit_closed,edit_paid_in_full,edit_booked, edit_discount} = this.state.formEditInfo

      const {message, bulkUpdate,validBulkUpdate,selectedPoList} = this.state
     console.log("OrderCancelForm render  message:",message)




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
            {  <a href = { link } target = "_blank" > {'link'  } </a>}
            </div> {/* link */}
          </div>
          <TextField
            name="username"
            type="String"
            label="User"
            value={username}
            onClick={(e) => {this.copyToClipboard(e, title)}}
            InputProps={{
             readOnly: true,
            }}
            margin="dense"

            className="col-1"
          />
          <TextField
            name="po_date"
            type="String"
            label="Po Date"
            value={po_date && po_date!=0?
              moment(po_date,'YYYY-MM-DD').format('DD-MMM-YYYY'):''}
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
            value={price? price.toFixed(2):0}
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
            label="Init. Pymt"
            value={first_payment? first_payment:0}

            InputProps={{
             readOnly: true,
           }}
            margin="dense"
            className="col-1"
          />
          <TextField

            name="final_payment"
            type="Number"
            label="Final Pymt"
            value={final_payment? final_payment:0}

            InputProps={{
             readOnly: true,
           }}
            margin="dense"
            className="col-1"
          />
          <TextField
            name="discount"
            type="Number"
            label="Discount"
            value={discount? discount:0}

            InputProps={{
             readOnly: true,
           }}
            margin="dense"
            className="col-1"
          />
          <TextField
            name="accounting_note"
            type="String"
            label="Acct note"
            value={accounting_note?accounting_note:''}

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
            value={total_amount?total_amount:0}

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
            name="customer_delivery_date"
            type="String"
            label="F. Del Date"
            value={customer_delivery_date && customer_delivery_date!=0?
              moment(customer_delivery_date,'DD/MM/YYYY').format('DD-MMM-YYYY'):''}
            InputProps={{
             readOnly: true,
            }}
            margin="dense"
            width='10em'
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
              Header: "PO Info",
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
                  accessor: d => d.status,
                  width:80,
                },
                {
                  Header: "Qty",
                  id: "po_qty",
                  accessor: d => d.po_qty,
                  width:40,
                },
                {
                  Header: "notes",
                  id: "notes",
                  accessor: d => d.notes,

                },
              ]},
              {
                Header: "Accounting",
                columns: [
                   {
                      Header: "1st Pay",
                      id: "first_payment",
                      accessor: d => d.first_payment,
                      width:60,
                    },
                    {
                      Header: "F. Pay",
                      id: "final_payment",
                      accessor: d => d.final_payment,
                      width:60,
                    },
               ]
             },
              {
                Header: "Vendor Order",
                  columns: [
                 {
                    Header: "Order#",
                    id: "order_no",
                    accessor: d => d.order_no
                  },
                  {
                    Header: "source",
                    id: "source",
                    accessor: d => d.source
                  },
              ]
            },
            {
              Header: "Delivery",
              show: edit_status == 'delivered',
              columns: [
                {
                  Header: "Delv Qty",
                  id: "delivered_qty",
                  accessor: d => d.delivered_qty,
                  show: edit_status == 'delivered',
                  width:60,

                },
                {
                  Header: "Set Del Qty",
                  id: "edit_delivered_qty",
                  accessor: d => d.edit_delivered_qty,
                  show: edit_status == 'delivered',
                  width:80,
                },

            ]
          },
          {
            Header: "Indicators",
            columns: [
                {
                  Header: "Paid?",
                  id: "paid_in_full",
                  accessor: d => d.paid_in_full!=null && d.paid_in_full? "Y":"N",

                },
                {
                  Header: "Booked?",
                  id: "booked",
                  accessor: d => d.booked != null &  d.booked? "Y":"N",

                },
                {
                  Header: "Closed?",
                  id: "closed",
                  accessor: d => d.closed != null & d.closed?  "Y":"N",
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
              className="col-3 ml2"
            />
            <FormControl required className={classes.formControl}>
            <InputLabel htmlFor="status-required">Status</InputLabel>
            <Select
              disabled={edit_status==null}
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

            </Select>
            <FormHelperText>Required</FormHelperText>
          </FormControl>
          <TextField
            name="edit_delivered_qty"
            type="String"
            label="Delv Qty"
            disabled={edit_status == "delivered" || edit_status == "active" ?
            bulkUpdate :true}
            value={edit_status == "delivered" || edit_status == "active"?  edit_delivered_qty:''}
            onChange={this.handleChange}
            margin="dense"
            className="col-1 ml2"
            width="100px"
          />
          { edit_status=='delivered' ?

          <DatePicker className="datePickers"
                  disabled={bulkUpdate && !validBulkUpdate}
                  autoOk
                  label="Final Delivery Date"
                  disableFuture={false}
                  leftArrowIcon=<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M15.41 16.09l-4.58-4.59 4.58-4.59L14 5.5l-6 6 6 6z"/></svg>
                  rightArrowIcon=<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M8.59 16.34l4.58-4.59-4.58-4.59L10 5.75l6 6-6 6z"/></svg>

                  value={ edit_customer_delivery_date && edit_customer_delivery_date!='0'?
                    edit_customer_delivery_date:moment(order_date).add(14,'day')}
                  onChange={this.handleDateChange}
                  format="DD-MMM-YYYY"
                  invalidLabel="Not Set"
            />:null
          }

          { edit_status !='archived'  ?
          <div className="flex flex-wrap">
          <TextField
            name="edit_first_payment"
            type="Number"
            label="1st Pymt"
            disabled={false}
            value={edit_first_payment }
            onChange={this.handleChange}
            margin="dense"
            className="col-1 ml2"
            width="80px"
          />
          <DatePicker className="datePickers"
                  disabled={false}
                  autoOk
                  label="1st Pymt Date"
                  disableFuture={false}
                  leftArrowIcon=<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M15.41 16.09l-4.58-4.59 4.58-4.59L14 5.5l-6 6 6 6z"/></svg>
                  rightArrowIcon=<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M8.59 16.34l4.58-4.59-4.58-4.59L10 5.75l6 6-6 6z"/></svg>

                  value={ edit_first_payment_date && edit_first_payment_date!='0'?
                    edit_first_payment_date:moment(order_date).add(1,'day')}
                  onChange={this.handleFirstPaymentDateChange}
                  format="DD-MMM-YYYY"
                  invalidLabel="Not Set"
                  width="200px"
            />
            <TextField
              name="edit_final_payment"
              type="Number"
              label="Final Pymt"
              disabled={false}
              value={edit_final_payment}
              onChange={this.handleChange}
              margin="dense"
              className="col-1 ml2"
              width="80px"
            />
            <DatePicker className="datePickers"
                    disabled={false}
                    autoOk
                    label="Final Pymt Date"
                    disableFuture={false}
                    leftArrowIcon=<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M15.41 16.09l-4.58-4.59 4.58-4.59L14 5.5l-6 6 6 6z"/></svg>
                    rightArrowIcon=<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M8.59 16.34l4.58-4.59-4.58-4.59L10 5.75l6 6-6 6z"/></svg>

                    value={ edit_final_payment_date && edit_final_payment_date!='0'?
                      edit_final_payment_date:moment(order_date).add(1,'day')}
                    onChange={this.handleFinalPaymentDateChange}
                    format="DD-MMM-YYYY"
                    invalidLabel="Not Set"
                    width="200px"
              />
              <TextField
                name="edit_discount"
                type="Number"
                label="Discount"
                disabled={false}
                value={edit_discount}
                onChange={this.handleChange}
                margin="dense"
                className="col-1 ml2"
                width="80px"
              />
              <TextField
                name="edit_accounting_note"
                type="String"
                label="Acctg Note"
                disabled={false}
                value={edit_accounting_note}
                onChange={this.handleChange}

                className="col-3 ml2"
                width="440"
              />
              {edit_paid_in_full!=null?
              <FormControlLabel
                control={
                  <Checkbox
                    checked={edit_paid_in_full}
                    onChange={this.handleCheckbox('edit_paid_in_full')}
                    value="edit_paid_in_full"
                    color="primary"
                  />
                }
                label="Paid"
              />:null}
              { edit_booked!=null?
              <FormControlLabel
                control={
                  <Checkbox

                    checked={edit_booked}
                    onChange={this.handleCheckbox('edit_booked')}
                    value="edit_booked"
                    color="primary"
                  />
                }
                label="Booked"
              />:null}
              { edit_closed!=null?
              <FormControlLabel
                control={
                  <Checkbox

                    checked={edit_closed}
                    onChange={this.handleCheckbox('edit_closed')}
                    value="edit_closed"
                    color="primary"
                  />
                }
                label="Closed"
              />:null }
             </div>
            :null
          }
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
                    value={bulkUpdate && !validBulkUpdate? "No updates allowed when selected statuses are not the same":
                      message? message:''}
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
                      'width' : 800,
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

const updatePurchaseOrder = gql`
  mutation updatePurchaseOrder($updateStatusInput: UpdateStatusInput!) {
    updatePurchaseOrder (input: $updateStatusInput) {
     _id
      message
      status
      delivered_qty
      first_payment
      first_payment_date
      final_payment
      final_payment_date
      discount
      accounting_note
      closed
      paid_in_full
      booked

      customer_delivery_date
   }
  }
`;

const OrderCancelFormWithMutation =
graphql( updatePurchaseOrder)
(OrderCancelForm);

export default withStyles(styles)(OrderCancelFormWithMutation)
