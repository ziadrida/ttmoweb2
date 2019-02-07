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
import quotationsQuery from '/app/ui/apollo-client/quotation/query/quotations';

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

class QuoteForm extends React.Component {
  constructor(props) {
    console.log("QuoteForm constructor props:",props)
  super(props);
  this.state = {
    copySuccess: '',
    bulkUpdate: false,
    validBulkUpdate: false,
    refresh: false,
    selectedQuoteList: [],
    allowSave: true,
    message: '',
  formEditInfo: {

  },

  quoteInfo: {
    _id:'',
    quote_no:'',
    senderId:'',
    sales_person:'',
    date_created:'',
    created_by:'',

    quotation :{
      quote_no:'',
      quote_date:'',
      ownderId:'',
      url:'',
      thumbnailImage:'',
      source:'',
      price:'',
      qty:'',
      shipping:'',
      category:'',
      title:'',
      weight:'',
      height:'',
      length:'',
      width:'',
      username:'',
      chargeableWeight:'',
      final:'',
      requestor:'',


      price_selection:'',
      notes:'',
      final:'',
      active:'',
      po_no:'',

      sales_person:'',
      message:'',
      reason:'',

      item :{
        recipientID:'',
        ownderId:'',
        title:'',
        MPN:'',
        asin:'',
        url:'',
        thumbnailImage:'',
        source:'',
        price:'',
        qty:'',
        shipping:'',
        category:'',
        condition:'',
        weight:'',
        height:'',
        length:'',
        width:'',
        language:'',
        username:'',
        chargeableWeight:'',
        final:'',
        requestor:'',
        quote_no:'',
        recipentID:'',

      },
      prices: {
        amm_exp: {
          destination:'',
          type:'',
          delivery:'',
          price:'',
        },
        amm_std :{
          destination:'',
          type:'',
          delivery:'',
          price:'',
        },
        aq_std :{
          destination:'',
          type:'',
          delivery:'',
          price:'',
        },

      }
    }
  }
}
    // TODO: add errors field
    this.mutateAction = this.mutateAction.bind(this)
}

static getDerivedStateFromProps(props, state) {
  console.log("QuoteForm getDerivedStateFromProps \nprops",props, "\nstate",state)
  const {selection,getRow} = props
  const bulkUpdate = selection && selection.length > 1

  var tmpselectedQuoteList = []
  var changedList = false;

  // if (bulkUpdate && props.quoteInfo) {
  //   console.log(">> bulkUpdate <<  selection:",selection)
  //   var tmpStatus = '';
  //
  //   selection.map(key => {
  //     console.log('build update list key:', key)
  //     var row = getRow(key)
  //     if (row) {
  //       row.message = ""
  //       // to do bulk update, all selected items must share the same status
  //
  //       row.closed = row.closed != null?  row.closed:false,
  //       row.paid_in_full =row.paid_in_full != null?  row.paid_in_full:false,
  //       row.booked= row.booked != null?  row.booked:false,
  //       row.discount = row.discount != null?  parseFloat(row.discount):0,
  //     //  row.edit_delivered_qty = parseInt(row.po_qty) - parseInt(row.delivered_qty?row.delivered_qty:0)
  //       row.edit_delivered_qty =  parseInt(row.po_qty);
  //       tmpselectedQuoteList.push(row)
  //       if (!changedList)  {
  //       changedList = state.selectedQuoteList.length == 0 ||
  //                     (state.selectedQuoteList.length>0 &&
  //                       state.selectedQuoteList[0] != undefined &&
  //                       state.selectedQuoteList.findIndex(x=> x._id === key) < 0);
  //       console.log("selectedQuoteList changedList",changedList)
  //     }
  //    }
  //   })
  //
  // }
  // console.log("findIndex says =>  bulkUpdate:",bulkUpdate)
  // console.log("findIndex says =>  listChanged:",changedList)
  // console.log("findIndex says =>  state.refresh:",state.refresh)
  var returnState = {}
    // if ( bulkUpdate && (changedList || state.refresh) ) {
    //   console.log("bulkUpdate (chnagedList or refresh requested)")
    //   var selectedQuoteList;
    //   try {
    //     if (changedList) {
    //     returnState =  {
    //       ...returnState,
    //       bulkUpdate: bulkUpdate,
    //       selectedQuoteList: tmpselectedQuoteList,
    //     }
    //     selectedQuoteList = tmpselectedQuoteList;
    //   } else {
    //     selectedQuoteList = state.selectedQuoteList;
    //   }
    //     // if all closed the same then enable Closed
    //
    //
    //
    //     console.log("* setState for bulkUpdate selectedQuoteList:",selectedQuoteList)
    //     console.log("*** setState for bulkUpdate selectedQuoteList[0]:",selectedQuoteList[0])
    //     var firstSelectedPo = selectedQuoteList[0];
    //       console.log("*** setState for bulkUpdate firstSelectedPo:",firstSelectedPo)
    //       console.log("1 selectedQuoteList[0]._id:",firstSelectedPo._id)
    //       console.log("1 selectedQuoteList[0].paid_in_full:",firstSelectedPo.paid_in_full)
    //         console.log("1 firstSelectedPo.booked:",firstSelectedPo.booked)
    //     var disableClosed = !selectedQuoteList.every(po => po.closed == firstSelectedPo.closed )
    //     var disablePaid = !selectedQuoteList.every(po => po.paid_in_full == firstSelectedPo.paid_in_full )
    //     var disableBooked = !selectedQuoteList.every(po => po.booked == firstSelectedPo.booked )
    //     var disableStatus = !selectedQuoteList.every(po => po.status == firstSelectedPo.status )
    //     console.log('disableClosed:',disableClosed)
    //     console.log('disablePaid:',disablePaid)
    //     console.log('disableBooked:',disableBooked)
    //     console.log('disableStatus:',disableStatus)
    //       console.log("** setState for bulkUpdate selectedQuoteList:",selectedQuoteList)
    //     console.log("firstSelectedPo.status:",firstSelectedPo.status)
    //     console.log("firstSelectedPo.closed:",firstSelectedPo.closed)
    //     console.log("firstSelectedPo.paid_in_full:",firstSelectedPo.paid_in_full)
    //     console.log("firstSelectedPo.booked:",firstSelectedPo.booked)
    //     console.log("*** setState for bulkUpdate selectedQuoteList:",firstSelectedPo)
    //     console.log("**** setState for bulkUpdate selectedQuoteList:",selectedQuoteList)
    //     returnState =  {
    //       ...returnState,
    //         validBulkUpdate:!disableClosed || !disablePaid || !disableBooked || !disableStatus,
    //         formEditInfo: {
    //           edit_status: disableStatus? null: firstSelectedPo.status,
    //           edit_closed: disableClosed? null:firstSelectedPo.closed ,
    //           edit_paid_in_full: disablePaid?null: firstSelectedPo.paid_in_full ,
    //           edit_booked: disableBooked? null: firstSelectedPo.booked,
    //       }
    //     }
    //     console.log("Last firstSelectedPo.paid_in_full:",firstSelectedPo.paid_in_full)
    // } catch(err) {
    //   console.log("!!!ERROR setting bulkUpdate state  err:",err)
    // }
    // }
    if (state.refresh ) {
      returnState =  {
        ...returnState,
        refresh: false,

      }
    }
    if (props.quoteInfo && state.quoteInfo && props.quoteInfo._id !== state.quoteInfo._id && !bulkUpdate) {
      console.log("Quote _id changed => Update state")
      const { quotation  } = props.quoteInfo
      const {item} = quotation
      returnState =  {
        ...returnState,
        message:props.quoteInfo.quote_no?'Loaded Quote#'+props.quoteInfo.quote_no:'',
        quoteInfo: props.quoteInfo ,
        formEditInfo: {
          quote_no:props.quoteInfo.quote_no,
          edit_senderId:props.quoteInfo.senderId,
          edit_notes:props.quoteInfo.notes? props.quoteInfo.notes:'',

          edit_title: quotation.title? quotation.title:   item.title?item.title:'',
          edit_url: quotation.url? quotation.url:
              item.url?item.url:'',
          edit_username: quotation.username? quotation.username:item.username? item.username:'',

          edit_MPN: item.MPM? item.MPN:'',
          edit_asin: item.asin? item.asin:'',
          edit_category: item.category && item.category.length>0? item.category[0]:'',
          edit_chargeableWeight: item.chargeableWeight? item.chargeableWeight:'',
          edit_condition: item.conditio? item.conditio:'',
          edit_final: item.final!=null? item.final:false,
          edit_height_cm: item.height? item.height.toFixed(2):'',
          edit_length_cm: item.length? item.length:'',
          edit_width_cm: item.width? item.width.toFixed(2):'',
          edit_weight_kg: item.weight? item.weight.toFixed(2):'',
          edit_dimensions_cm: item.height &&  item.width &&  item.weight?
              item.height.toFixed(2) + ' x ' +
              item.width.toFixed(2) + ' x ' +
              item.weight.toFixed(2):'',

          edit_height_inch: item.height? (item.height/2.54).toFixed(2):'',
          edit_length_inch: item.length? (item.length/2.54).toFixed(2):'',
          edit_width_inch: item.width? (item.width/2.54).toFixed(2):'',
          edit_dimensions_inch: item.height &&  item.width &&  item.weight?
            (item.height/2.54).toFixed(2) + ' x ' +
             (item.width/2.54).toFixed(2)  + ' x ' +
            (item.weight/2.54).toFixed(2) :'',

          edit_weight_lb: item.weight? (item.weight*2.2).toFixed(2):'',

          edit_language: item.language? item.language:'en',

          edit_ownderId: item.ownderId? item.ownderId:'',
          edit_price: item.price? item.price.toFixed(2):'',
          edit_qty: item.qty? item.qty:'',

          edit_recipientID: item.recipientID? item.recipientID:'',
          edit_requestor: item.requestor? item.requestor:'',
          edit_shipping: item.shipping? item.shipping.toFixed(2):'',
          edit_source: item.source? item.source:'',

          edit_thumbnailImage: item.thumbnailImage? item.thumbnailImage:null,





        },

      };
    }

    var finalState = returnState!={}? returnState: null
    console.log('<><><><> finalState:',finalState)
    // Return null to indicate no change to state.
   return finalState;
  }

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

  // handle_change function
  handleChange = ({ target }) => {
    console.log('in handleChange ',target)
    if (!target) return;
    const { value, name } = target;
    console.log("name:",name,"  value:",value)
    this.setState(
          {
          formEditInfo: {
          ...this.state.formEditInfo,
            [name]: value
        },
        allowSave: true
      });

    console.log('genQuote handleChange',this.state)

  }

  handleWtChange = ({ target }) => {
    console.log('in handleWtChange ',target)
    if (!target) return;
    const { value, name } = target;
    console.log("name:",name,"  value:",value)
    // recompute chargeableWeight
    var newState = {
      formEditInfo: {
        ...this.state.formEditInfo,
        [name]: value
      }
    }
    console.log('newState:',newState)
    switch (name) {

      // weight
      case 'edit_weight_lb':
        newState.formEditInfo.
          edit_weight_kg = (value/2.2).toFixed(2)

        break;
        case 'edit_weight_kg':
            newState.formEditInfo.
            edit_weight_lb = (value*2.2).toFixed(2)

            break;
        //length
        case 'edit_length_cm':
            newState.formEditInfo.
              edit_length_inch =(value/2.54).toFixed(2)

          break;
        case 'edit_length_inch':
                  newState.formEditInfo.
                  edit_length_cm =(value*2.54).toFixed(2)

        break;

        // width
        case 'edit_width_cm':
            newState.formEditInfo.
              edit_width_inch = (value/2.54).toFixed(2)

          break;
        case 'edit_width_inch':
                newState.formEditInfo.
                  edit_width_cm= (value*2.54).toFixed(2)

          break;

        // height
        case 'edit_height_cm':
              newState.formEditInfo.
              edit_height_inch = (value/2.54).toFixed(2)

          break;
        case 'edit_height_inch':
                  newState.formEditInfo.
                  edit_height_cm= (value*2.54).toFixed(2)

          break;

      default:

    }

    newState.formEditInfo.edit_chargeableWeight = Math.max((newState.formEditInfo.edit_width_cm *
            newState.formEditInfo.edit_length_cm * newState.formEditInfo.edit_height_cm / 5000).toFixed(2),
        newState.formEditInfo.edit_weight_kg)

    console.log('**newState:',newState)
    this.setState({
        ...newState,
        allowSave: true
      });



    console.log('genQuote handleChange',this.state)

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
    console.log('QuoteForm handleAction:',evt)
    console.log('=> QuoteForm in handleAction props==>\n',this.props)
    console.log('=> QuoteForm in handleAction state\n',this.state)
    const { closePopup } = this.props;
    this.setState({message:"Updating ...",
                allowSave: false})


     const {  bulkUpdate,  validBulkUpdate } = this.state
     var newselectedQuoteList = []
     var selectedQuoteList = this.state.selectedQuoteList;
     var newquoteInfo ;
     if (bulkUpdate) {
       // creating multiple quotes
       console.log("--> Do bulkUpdate - selectedQuoteList:",selectedQuoteList);
        selectedQuoteList = selectedQuoteList.map(async quoteInfo => {
         console.log("call mutateAction for quoteInfo:",quoteInfo)
        //console.log('update=>',quoteInfo)
         newquoteInfo = await this.mutateAction(quoteInfo).then(response => {

           console.log("=======>  After bulkUpdate line mutateAction response:",response)
           console.log("=======>  After mutateAction newquoteInfo:",newquoteInfo)
           quoteInfo.closed = response.closed;

           quoteInfo.status =     response.status

         })



       })
          this.setState({
          //    refresh: true,
              message:  "Check messages in list table above for update results" ,
          })



     } else {
          newquoteInfo = await this.mutateAction(this.state.quoteInfo).then(resp => {
            console.log("=======>  After single mutateAction resp:",resp)
            console.log("=======>  After mutateAction newquoteInfo:",newquoteInfo)
          this.setState(
            { message:  resp.message ,
              refresh: true,
              quoteInfo: {
                  ...this.state.quoteInfo,


                   accounting_note:resp.accounting_note?
                       resp.accounting_note:'',


                   booked: resp.booked != null?resp.booked:false,
                   discount: resp.discount != null?  resp.discount:0,
              },
              formEditInfo: {
                ...this.state.formEditInfo,
                 edit_status: resp.status,


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
    var rtnquoteInfo = selectedPo;
    const { mutate, setRow} = this.props
    if (mutate) {

      console.log("+>>>selectedPo.edit_delivered_qty:",selectedPo.edit_delivered_qty)
      var updateInfo ;
      try {
      //  updateInfo = this.state.bulkUpdate?
      //  {
      //    // fiels that come from the list of PO to be changed
      //   po_no: selectedPo.po_no,
      //   delivered:selectedPo.delivered!= null? selectedPo.delivered:null,
      //   delivered_qty:
      //         // can set delivered_qty in bulk only if setting status to delivered
      //         selectedPo.edit_delivered_qty != null && this.state.formEditInfo.edit_status == 'delivered'  ?
      //          selectedPo.edit_delivered_qty:null,
      //
      // }:
      updateInfo = {
        title: this.state.formEditInfo.title,
        delivered:this.state.quoteInfo.delivered,
        delivered_qty: this.state.formEditInfo.edit_delivered_qty!=null &&
              this.state.formEditInfo.edit_delivered_qty!='' ?
          parseInt(this.state.formEditInfo.edit_delivered_qty):null,
      }
     }  catch(err) {
        console.log("!!!ERROR setting updateInfo")
        rtnquoteInfo.message = "Internal Error. Error setting bulk update"
          return rtnquoteInfo;
      }
      console.log('***** updateInfo:',updateInfo)
      console.log("+++ before calling propos.mutate ")
      const response = await mutate({
         variables: {
           "quoteInput": {
            "title": updateInfo.title,
            "notes":this.state.formEditInfo.edit_notes,

          }
        },
        refetchQueries: [
                {
          query: quotationsQuery,
          variables:this.props.variables
        }],
     })
     .then( res => {
       console.log("==> MUTATION result:",res)
       if (!res || !res.data || !res.data.genQuote) {
          // this.setState({message: "DB Error",
          // allowSave: true})
            rtnquoteInfo.message =   "DB Error";
              return rtnquoteInfo;
       } else if (!res.data.genQuote._id ||
             res.data.genQuote._id == -99) {
               console.log('!!!errors result id is -99 ')
          //  this.setState(
          //      {message: res.data.genQuote.message ,
          //      allowSave: true},
          // )
          rtnquoteInfo.message = rtnquoteInfo.message==""? rtnquoteInfo.message:rtnquoteInfo.message+'\n'+
                    res.data.genQuote.message;
             return rtnquoteInfo;
       }  else     {
         console.log("OK=>got response from mutation - set state and message response")
         console.log("+++++=>res:",res&&res.data)




         rtnquoteInfo.message = rtnquoteInfo.message==""? rtnquoteInfo.message:rtnquoteInfo.message+'\n'+
                     res.data.genQuote.message;
        //  rtnquoteInfo.status=res.data.genQuote.status;
          rtnquoteInfo = res.data.genQuote;
          console.log("OK > Return rtnquoteInfo:",rtnquoteInfo)
        return rtnquoteInfo;
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
       rtnquoteInfo.message = rtnquoteInfo.message==""? rtnquoteInfo.message:rtnquoteInfo.message+'\n'+
                errMsg
       return rtnquoteInfo;
     });
     console.log("?? MUTATION response:",response)
    return response;
   } else {
     console.log("ERROR - No mutate funtion!!!")
     return rtnquoteInfo
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

  render() {
    console.log('render QuoteForm props:',this.props)
    console.log('render QuoteForm state:',this.state)
    const columnDefaults = { ...ReactTableDefaults.column, headerClassName: 'wordwrap' }
    const { classes, history, selection, getRow} = this.props;
    //const { classes, history, selection, getRow, notPurchased} = this.props;
  //  console.log('notPurchased:',notPurchased)
    // const bulkUpdate = selection && selection.length > 1
    // var selectedQuoteList = []
    // if (bulkUpdate) {
    //   selection.map(key => {
    //     var row = getRow(key)
    //     row.message = ""
    //     selectedQuoteList.push(row)
    //   })
    // }


    const { created_by, date_created, quotation,quote_no, sales_person, senderId, _id} =  this.state.quoteInfo;
    // const {title,url,quotation, active, category, chargeableWeight, final, height, item, length, message, notes,
    //   ownderId, po_no, price, price_selection, prices, qty, quote_date, reason, requestor, sales_person, shipping,
    //   source, thumbnailImage, username, weight, width, senderId } = quotation;
    const {item, prices, price_selection,quote_date} = quotation;
    const {category} = item;
    //const { amm_exp, amm_std, aq_std} = prices

    // const rowSelection =  this.props.getRow(_id)
    // console.log("rowSelection:",rowSelection)
     const { edit_title, edit_url, edit_username,edit_senderId,
        edit_weight_kg, edit_height_cm, edit_length_cm, edit_width_cm,edit_dimensions_cm,
        edit_weight_lb, edit_height_inch, edit_length_inch, edit_width_inch,edit_dimensions_inch,
           edit_category,
        edit_price,edit_shipping, edit_chargeableWeight,edit_qty, edit_source, edit_notes,
      edit_destination, edit_priceType} = this.state.formEditInfo

      const {message, bulkUpdate,validBulkUpdate,selectedQuoteList} = this.state
     console.log("QuoteForm render  message:",message)




    return (
    <div className="popup">
      <div className="popup_inner">

        <div className=" flex flex-wrap   p1 m1 border">
        <form  className="ml2" onSubmit={this.handleAction} autoComplete="off">
          <div className="flex flex-wrap  ml2">
            <TextField
              disabled={bulkUpdate}
              name="quote_no"
              type="String"
              label="Quote#"
              value={quote_no}
              onClick={(e) => {this.copyToClipboard(e, quote_no)}}
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
            <FormControlLabel
              control={
                <Checkbox
                  checked={quotation.active}

                  value="quotation.active"
                  color="primary"
                />
              }
              label="Active"
            />

            <FormControlLabel
              control={
                <Checkbox

                  checked={quotation.final}

                  value="quotation.final"
                  color="primary"
                />
              }
              label="Final"
            />
            <TextField
              disabled={bulkUpdate}
              name="edit_username"
              type="String"
              label="Username"
              value={edit_username}
              onChange={this.handleChange}
              onClick={(e) => {this.copyToClipboard(e, edit_username)}}
              margin="dense"
              className={classes.textField}

            />
            <TextField
              disabled={bulkUpdate}
              name="edit_senderId"
              type="String"
              label="User ID"
              value={edit_senderId}
              onChange={this.handleChange}

              margin="dense"
              className={classes.textField}

            />
            <TextField
              disabled={bulkUpdate}
              name="edit_title"
              type="String"
              label="Title"
              value={edit_title}
              onChange={this.handleChange}

              margin="dense"
              className={classes.textField}
              style={{
                //backgroundColor:'pink',
                'whiteSpace': 'unset',
                 'fontSize': '10px' ,
                 'fontWeight':'bold',
                'width' : '42em',
              }}
            />
            <TextField
              disabled={bulkUpdate}
              name="edit_url"
              type="String"
              label="URL"
              value={edit_url}
              onChange={this.handleChange}

              margin="dense"
              className={classes.textField}
              style={{
                //backgroundColor:'pink',
                'whiteSpace': 'unset',
                 'fontSize': '10px' ,

                'width' : '42em',
              }}
            />
            <div className="border"
              style={{'overflowX': 'hidden',
              'overflowY':'scroll',
              'fontSize': '10px' ,
               width:'10em',height:'3em'}}>
            {  <a href = { edit_url } target = "_blank" > {'click here for item link'  } </a>}
            </div>


          </div>
          <TextField
            disabled={bulkUpdate}
            name="sales_person"
            type="String"
            label="Sales Person"
            value={sales_person}

            margin="dense"
            className={classes.textField}
            />
            <TextField
              disabled={bulkUpdate}
              name="quote_date"
              type="String"
              label="Date"
              value={quote_date? moment(parseInt(quote_date)).format('DD-MMM-YYYY'):moment(parseInt(date_created)).format('DD-MMM-YYYY')}

              margin="dense"
              className={classes.textField}
              />
              <TextField
                disabled={bulkUpdate}
                name="created_by"
                type="String"
                label="Created By"
                value={created_by}

                margin="dense"
                className={classes.textField}
                />


                  <TextField
                    disabled={bulkUpdate}
                    name="edit_category"
                    type="String"
                    label="Category"
                    value={edit_category}
                    onChange={this.handleChange}
                    margin="dense"
                    className={classes.textField}
                    />
                    <TextField
                      disabled={bulkUpdate}
                      name="edit_price"
                      type="Number"
                      label="Price USD"
                      value={edit_price}
                      onChange={this.handleChange}
                      margin="dense"
                      className={classes.textField}
                      />
                      <TextField
                        disabled={bulkUpdate}
                        name="edit_shipping"
                        type="Number"
                        label="Shipping USD"
                        value={edit_shipping}
                        onChange={this.handleChange}
                        margin="dense"
                        className={classes.textField}
                        />
                        <TextField
                          disabled={bulkUpdate}
                          name="edit_source"
                          type="String"
                          label="Source"
                          value={edit_source}
                          onChange={this.handleChange}
                          margin="dense"
                          className={classes.textField}
                          />


                    <div className="flex flex-wrap">
                    <TextField
                      disabled={bulkUpdate}
                      name="edit_weight_kg"
                      type="Number"
                      label="Weigh(kg)"
                      onChange={this.handleWtChange}
                      value={edit_weight_kg}
                      margin="dense"
                      className={classes.textField}
                      />
                      <TextField
                          disabled={bulkUpdate}
                          name="edit_length_cm"
                          type="Number"
                          label="length(cm)"
                          value={edit_length_cm}
                            onChange={this.handleWtChange}
                          margin="dense"
                          className={classes.textField}
                          />
                        <TextField
                          disabled={bulkUpdate}
                          name="edit_width_cm"
                          type="Number"
                          label="width(cm)"
                          value={edit_width_cm}
                            onChange={this.handleWtChange}
                          margin="dense"
                          className={classes.textField}
                          />
                          <TextField
                            disabled={bulkUpdate}
                            name="edit_height_cm"
                            type="Number"
                            label="height(cm)"
                            value={edit_height_cm}
                            onChange={this.handleWtChange}
                            margin="dense"
                            className={classes.textField}
                            />

                          </div>
                          <div className="flex flex-wrap">
                          <TextField
                            disabled={bulkUpdate}
                            name="edit_weight_lb"
                            type="Number"
                            label="Weigh(lb)"
                            onChange={this.handleWtChange}
                            value={edit_weight_lb}
                            margin="dense"
                            className={classes.textField}
                            />
                            <TextField
                                disabled={bulkUpdate}
                                name="edit_length_inch"
                                type="Number"
                                label="length(inch)"
                                value={edit_length_inch}
                                  onChange={this.handleWtChange}
                                margin="dense"
                                className={classes.textField}
                                />
                              <TextField
                                disabled={bulkUpdate}
                                name="edit_width_inch"
                                type="Number"
                                label="width(inch)"
                                value={edit_width_inch}
                                  onChange={this.handleWtChange}
                                margin="dense"
                                className={classes.textField}
                                />
                                <TextField
                                  disabled={bulkUpdate}
                                  name="edit_height_inch"
                                  type="Number"
                                  label="height(inch)"
                                  value={edit_height_inch}
                                    onChange={this.handleWtChange}
                                  margin="dense"
                                  className={classes.textField}
                                  />

                                </div>
                                <TextField
                                  disabled={bulkUpdate}
                                  name="edit_chargeableWeight"
                                  type="Number"
                                  label="Chargable Weight"
                                  value={edit_chargeableWeight}
                                    onChange={this.handleChange}
                                  margin="dense"
                                  className={classes.textField}
                                  />
                                  <TextField
                                    disabled={bulkUpdate}
                                    name="edit_destination"
                                    type="String"
                                    label="Destination"
                                    value={edit_destination}
                                    onChange={this.handleChange}
                                    margin="dense"
                                    className={classes.textField}
                                    />
                                    <FormControl required className={classes.formControl}>
                                    <InputLabel htmlFor="destination-required">Destination</InputLabel>
                                    <Select
                                      disabled={false}
                                      value={edit_destination}
                                      onChange={this.handleChange}
                                      name="edit_destination"
                                      inputProps={{
                                        id: 'destination-required',
                                      }}
                                      className={classes.selectEmpty}
                                    >
                                      <MenuItem value={"amman"}>Amman</MenuItem>
                                      <MenuItem value={"aqaba"}>Aqaba</MenuItem>
                                    </Select>
                                    <FormHelperText>Required</FormHelperText>
                                  </FormControl>
                                  <FormControl required className={classes.formControl}>
                                  <InputLabel htmlFor="priceType-required">Price Type</InputLabel>
                                  <Select
                                    disabled={false}
                                    value={edit_priceType}
                                    onChange={this.handleChange}
                                    name="edit_priceType"
                                    inputProps={{
                                      id: 'priceType-required',
                                    }}
                                    className={classes.selectEmpty}
                                  >
                                    <MenuItem value={"reg"}>Regular</MenuItem>
                                    <MenuItem value={"exp"}>Express</MenuItem>
                                  </Select>
                                  <FormHelperText>Required</FormHelperText>
                                </FormControl>
                                <FormControl required className={classes.formControl}>
                                <InputLabel htmlFor="sale_price-required">Sale Price</InputLabel>
                                <Select
                                  disabled={false}
                                  value={price_selection}
                                  onChange={this.handleChange}
                                  name="price_selection"
                                  inputProps={{
                                    id: 'sale_price-required',
                                  }}
                                  className={classes.selectEmpty}
                                >
                                  <MenuItem value={"amm_exp"}>{"Amman Personal "+prices['amm_exp'].price + " JD"}</MenuItem>
                                  <MenuItem value={"amm_std"}>Amman Regular</MenuItem>
                                  <MenuItem value={"aq_std"}>Aqaba Regular</MenuItem>
                                </Select>
                                <FormHelperText>Required</FormHelperText>
                              </FormControl>
                              <TextField
                                disabled={bulkUpdate}
                                name="sale_price"
                                type="Number"
                                label="Sale Price"
                                value={prices[price_selection].price}

                                margin="dense"
                                className={classes.textField}
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

QuoteForm.propTypes = {
  onSubmit: PropTypes.func,

};

QuoteForm.defaultProps = {
  onSubmit: () => {},
};

const genQuote = gql`
  mutation genQuote($quoteInput: quoteInput!) {
    genQuote (input: $quoteInput) {
     _id
     quote_no

   }
  }
`;

const QuoteWithMutation =
graphql( genQuote)
(QuoteForm);

export default withStyles(styles)(QuoteWithMutation)
//
// quoteInfo:
// created_by: null
// date_created: "1549442534122"
// quotation:
// active: true
// category: []
// chargeableWeight: null
// final: true
// height: null
// item: {recipientID: "1337250176375855", ownderId: "1337250176375855", title: "/gp/product/B002DWA2NI/ref=ox_sc_act_title_2", MPN: null, asin: null, …}
// length: null
// message: null
// notes: "NOTES:"
// ownderId: null
// po_no: null
// price: null
// price_selection: "amm_std"
// prices: {amm_exp: {…}, amm_std: {…}, aq_std: {…}, __typename: "PriceOptions"}
// qty: null
// quote_date: "1549442578979"
// quote_no: 89181
// reason: null
// requestor: null
// sales_person: "ROBOT"
// shipping: null
// source: null
// thumbnailImage: null
// title: null
// url: null
// username: "Batool Aref Al-Halasa"
// weight: null
// width: null
// __typename: "QuotationInstance"
// __proto__: Object
// quote_no: 89181
// sales_person: "ROBOT"
// senderId: "1337250176375855"
// __typename: "Quotation"
// _id: "5c5a9de6314d7800165420dc"
