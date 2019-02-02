import React from 'react';
// Import React Table
import { compose } from 'recompose';
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
import { withApollo } from 'react-apollo';
// refetch option to mutate
import orderDetailsQuery from '/app/ui/apollo-client/order-details/query/order-details';
import packageTrackingQuery from '/app/ui/apollo-client/vendor-tracking/query/package-tracking';



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

class VendorTrackingForm extends React.Component {
  constructor(props) {
    console.log("VendorTrackingForm constructor props:",props)
  super(props);
  this.state = {
    bulkUpdate: false,
    validBulkUpdate: false,
    refresh: false,
    selectedPoList: [],
    allowSave: true,
    message: '',
  vendorTrackingInfo: {
    po_no:'',
    order_no: '',
    purchase_id:-99,
    tracking_no: '',
    shipped_qty: 0,
    ship_date: '',//moment().format("MM-DD-YYYY"),
    seller_ship_id: -99,
    time_in_transit_to:0,
    time_in_transit_from:0,
    message:'',
    purchase_id: -99,
    delivered_qty:0,
    options:'',
    order_date:'',
    status:'',
    notes:''  ,

  },

  poInfo: {
    rowIndex:0,
    po_no: '',
    username:'',
    total_purchased_qty: 0,
    po_qty: 0,
    po_no:'',
    order_no: '',
    purchase_id:-99,
    tracking_no: '',
    shipped_qty: 0,
    ship_date: moment().format("MM-DD-YYYY"),
    seller_ship_id: -99,
    time_in_transit_from:0,
    time_in_transit_to:0,
    _id:'',
     title:'',
     link:'',
     po_qty:0,
     total_purchased_qty:0,
     price:0,
     sale_price:0,
     first_payment:0,
     total_amount:0,
     options: '',
     source:'',
     notes:'',
     trackings:'',
     destination:'',
  }
}
    // TODO: add errors field
    this.mutateVendorTracking = this.mutateVendorTracking.bind(this);
    this.copyToClipboard = this.copyToClipboard.bind(this)
    this.findTracking = this.findTracking.bind(this)
}

static getDerivedStateFromProps(props, state) {
  console.log("***vendorTrackingForm getDerivedStateFromProps \nprops",props, "\nstate",state)
  const {selection,getRow} = props
  const bulkUpdate = selection && selection.length > 1
  var validUpdate = true;
  var tmpSelectedPoList = []
  var changedList = false;
  if (bulkUpdate  && props.poInfo) {
    selection.map(key => {
      console.log('build update list ', key)
      var row = getRow(key)
      if (row) {
        row.message = ""
        // to do bulk update, all selected items should not have an tracking
        if (row.ship_id && parseFloat(row.ship_id)>0) validUpdate = false;
        row.set_shipped_qty = parseInt(row.purchased_qty) - parseInt(row.total_order_shipped_qty)
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
        validBulkUpdate: validUpdate,
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
        vendorTrackingInfo: {
          seller_ship_id: props.poInfo.seller_ship_id,
          po_no:props.poInfo.po_no,
          order_no: props.poInfo.order_no,
          purchase_id: parseFloat(props.poInfo.purchase_id),
          tracking_no: props.poInfo.tracking_no?props.poInfo.tracking_no:'',
          shipped_qty:  props.poInfo.seller_ship_id && parseInt(props.poInfo.seller_ship_id)>0?
             parseInt(props.poInfo.shipped_qty):
            parseInt(props.poInfo.purchased_qty)-parseInt(props.poInfo.total_order_shipped_qty) ,
          time_in_transit_from: props.poInfo.time_in_transit_from?props.poInfo.time_in_transit_from:3,
          time_in_transit_to: props.poInfo.time_in_transit_to?props.poInfo.time_in_transit_to:7,
          ship_date: props.poInfo.ship_date && props.poInfo.ship_date!=''?
           moment(props.poInfo.ship_date,'DD/MM/YYYY').format("MM-DD-YYYY"):
           moment().format("MM-DD-YYYY"),
          // moment(props.poInfo.order_date,'DD/MM/YYYY').format('DD-MM-YYYY') :
          //   moment().format("DD-MM-YYYY"),
          carrier: props.poInfo.carrier?props.poInfo.carrier:'',
          tracking_notes:props.poInfo.tracking_notes?props.poInfo.tracking_notes:'',
        },

      };
    }
    console.log('returnState:',returnState)
    var finalState = returnState!={}? returnState: null
    console.log('finalState:',finalState)
    // Return null to indicate no change to state.
   return finalState;
  }
// componentWillReceiveProps(nextProps) {
//  //here u might want to check if u are currently editing but u get the idea -- maybe u want to reset it to the current prop on some cancelEdit method instead
//  console.log("vendorTrackingForm componentWillReceiveProps nextProps\n",nextProps)
//  this.setState({ship_id: nextProps.poInfo.ship_id})
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
  console.log('=>handleDateChange:',date)

      this.setState({
          vendorTrackingInfo: {
          ...this.state.vendorTrackingInfo,
          ship_date: date
        },
        allowSave: true
      });
  };

   async findTracking (e)  {
    var trackingNo = e && e.target? e.target.value:""
    console.log('**in findTracking trackingNo:',trackingNo)
    if (trackingNo && trackingNo.length > 8) {

      console.log('+++>>> call query packageTrackingQuery')
    const resp =  await this.props.client.query({
        query: packageTrackingQuery,
        variables: { tracking_no: trackingNo},
      });
      console.log("resp:",resp)
      if (resp.data && resp.data.getPackageTracking) {
      this.setState({
          vendorTrackingInfo: {
          ...this.state.vendorTrackingInfo,
          time_in_transit_to: resp.data.getPackageTracking.time_in_transit_to,
          time_in_transit_from: resp.data.getPackageTracking.time_in_transit_from,
          ship_date: moment(resp.data.getPackageTracking.ship_date,'DD/MM/YYYY').format('MM-DD-YYYY'),
          carrier: resp.data.getPackageTracking.carrier,
          tracking_notes: resp.data.getPackageTracking.notes,
          tracking_no: trackingNo,
        },
        allowSave: true
      });
      return;
      }

    }
      this.setState({
          vendorTrackingInfo: {
          ...this.state.vendorTrackingInfo,
          tracking_no: trackingNo,
        },
        allowSave: true
      });
    }

    // const { packageTrackingQuery} = this.props
    // if (packageTrackingQuery) {
    //       const resp = await packageTrackingQuery({
    //          variables: {
    //            tracking_no: this.state.vendorTrackingInfo.tracking_no
    //          }
    //       }).then(res => {
    //         console.log("packageTrackingQuery result:", JSON.stringify(res, null,2))
    //       }).catch(err => {
    //         console.log("Error ", JSON.stringify(err, null,2))
    //       })
    //       console.log("packageTrackingQuery resp:", JSON.stringify(resp, null,2))
    //  }

//  }

  handleChange = ({ target }) => {
    console.log('in handleChange ',target)
    const { value, name } = target;

    this.setState(
        {
          vendorTrackingInfo: {
          ...this.state.vendorTrackingInfo,
            [name]: value
        },
        allowSave: true
      });

    console.log('vendorTracking handleChange',this.state)
    //let order-detail-page set the state so when page filter is
    // used the form values are correct
    // this means we actually don't need to pass form values onSubmit (but we do!)
    // if (typeof this.props.onChange === 'function') {
    //        this.props.onChange({target});
    //    }
  }

  addNew = (evt) => {
    console.log("=> addNew")
    //reset vendorTrackingInfo
    this.setState({
      vendorTrackingInfo: {
        po_no:this.props.poInfo.po_no,
        order_no: this.props.poInfo.order_no,
        purchase_id: this.props.poInfo.purchase_id,
        tracking_no: '',
        shipped_qty: parseInt(this.props.poInfo.purchased_qty)-
          parseInt(this.props.poInfo.total_order_shipped_qty),
        time_in_transit_from: '',
        time_in_transit_to: '',
        seller_ship_id: -99,
        ship_date:   moment().format("MM-DD-YYYY"),
        carrier: '',

        notes:'',
      },
      allowSave: true,
    })
    }

  cancelAddNew = (evt) => {
    console.log("=> cancelAddNew")
    setState({
    vendorTrackingInfo: {
      seller_ship_id: this.state.poInfo.seller_ship_id,
      po_no:this.state.poInfo.po_no,
      order_no: this.state.poInfo.order_no,
      purchase_id: parseFloat(this.state.poInfo.purchase_id),
      tracking_no: this.state.poInfo.tracking_no,
      shipped_qty:  this.state.poInfo.seller_ship_id && parseFloat(this.state.poInfo.seller_ship_id)>0 ?
       parseInt(props.poInfo.shipped_qty):
       parseInt(props.poInfo.purchased_qty) - parseInt(props.poInfo.total_order_shipped_qty),
      time_in_transit_from: this.state.poInfo.time_in_transit_from,
      time_in_transit_to: this.state.poInfo.time_in_transit_to,
      seller_ship_id: this.state.poInfo.seller_ship_id,
      ship_date: this.state.poInfo.seller_ship_id && parseFloat(this.state.poInfo.seller_ship_id)>0?
       moment(this.state.poInfo.ship_date,'DD/MM/YYYY').format('MM-DD-YYYY'):
        moment().format('MM-DD-YYYY'),
      // moment(this.state.poInfo.order_date,'DD/MM/YYYY').format('MM-DD-YYYY'):
      //   moment().format('MM-DD-YYYY') ,
      carrier: this.state.poInfo.carrier,
      tracking_notes:this.state.poInfo.tracking_notes,
    },
    allowSave: true
      })
  }

  deleteRecord = (evt) => {
    console.log("=> deleteRecord")
    // simply clear the ship_id!
    this.setState({message:"not working yet Call me if you need it!"}) // revert back to existing ship_id
  }

  handleTracking = (evt) => {
    evt.preventDefault();
    console.log('VendorTrackingForm handleTracking:',evt)
    console.log('=> VendorTrackingForm in handleTracking props==>\n',this.props)
    console.log('=> VendorTrackingForm in handleTracking state\n',this.state)
    const { closePopup } = this.props;
    this.setState({message:"Updating ...",
                allowSave: false})

  //  const { poNo, orderNo } = this.state;
    //const {po_no} = this.props.location.state
    // TODO: disable btn on submit
    // TODO: validate fields
    // Pass event up to parent component
  //  const modifiedRow = { poNo,orderNo,trackingNo};
  //   console.log('before onSubmit VendorTrackingForm:',pageSearch)
     // calling on Submit on VendorTrackingForm
     //const { selection, getRow } = this.props
     // if (selection && selection.length>0 ) {
     //   // creating multiple orders
     //   selection.map(key => {
     //     var poInfo = getRow(key)
     //     console.log('update=>',poInfo)
     //     this.mutateVendorTracking(poInfo)
     //   })
     // } else {
     //      this.mutateVendorTracking(this.state.poInfo)
     // }
        const { selectedPoList, bulkUpdate } = this.state
        var newSelectedPoList = []
     if (bulkUpdate) {
       // creating multiple orders
       selectedPoList.map(selectedPo => {

        //console.log('update=>',poInfo)
        var newPoInfo =  this.mutateVendorTracking(selectedPo)
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
          this.mutateVendorTracking(this.state.poInfo)
     }
  }

  async mutateVendorTracking (selectedPo) {
    console.log('===>> mutateVendorTracking selectedPo\n', selectedPo)
    console.log('===>> mutateVendorTracking vendorTrackingInfo\n', this.state.vendorTrackingInfo)
    var message =  ""
    var sucess = false;
    var rtnPoInfo = selectedPo;

    const { mutate, setRow} = this.props
    if (mutate) {
      var updateInfo = this.state.bulkUpdate?
       {
        po_no: selectedPo.po_no,
        purchase_id: parseFloat(selectedPo.purchase_id),
        order_no: selectedPo.order_no,
        _id:  selectedPo.seller_ship_id && parseInt(selectedPo.seller_ship_id)>0?
            parseInt(selectedPo.seller_ship_id):null,
        shipped_qty:    parseInt(selectedPo.set_shipped_qty),
      }:
      {
        po_no: this.state.vendorTrackingInfo.po_no,
        purchase_id: parseFloat(this.state.vendorTrackingInfo.purchase_id),
        _id: this.state.vendorTrackingInfo.seller_ship_id &&
          parseInt(this.state.vendorTrackingInfo.seller_ship_id)>0?
         parseFloat(this.state.vendorTrackingInfo.seller_ship_id):null,
         order_no: this.state.vendorTrackingInfo.order_no,
         shipped_qty:   this.state.vendorTrackingInfo.shipped_qty &&
               parseInt(this.state.vendorTrackingInfo.shipped_qty)>0 ?
                parseInt(this.state.vendorTrackingInfo.shipped_qty) :
                parseInt(this.state.vendorTrackingInfo.purchased_qty)-
                parseInt(this.state.vendorTrackingInfo.total_order_shipped_qty),

      }
        console.log('updateInfo:',updateInfo)

     const response = await mutate({
         variables: {
           "vendorTracking": {
            "po_no": updateInfo.po_no,
            "_id":updateInfo._id,
            "order_no": updateInfo.order_no,
            "purchase_id": updateInfo.purchase_id,
            "tracking_no": this.state.vendorTrackingInfo.tracking_no,
            // "source": this.state.vendorTrackingInfo.source != this.props.selectedPo.source?
            //   this.state.vendorTrackingInfo.source:   null,
            "shipped_qty":  updateInfo.shipped_qty,
            "time_in_transit_from": parseInt(this.state.vendorTrackingInfo.time_in_transit_from),
            "time_in_transit_to":  parseInt(this.state.vendorTrackingInfo.time_in_transit_to),
            "carrier": this.state.vendorTrackingInfo.carrier,
            "ship_date":   this.state.vendorTrackingInfo.ship_date?
            moment(this.state.vendorTrackingInfo.ship_date,'MM-DD-YYYY').
                format('DD/MM/YYYY'):moment().format('DD/MM/YYYY'),
            "notes":this.state.vendorTrackingInfo.tracking_notes,
          }
        },
        refetchQueries: [
        {
          query: orderDetailsQuery,
        // fetchPolicy: 'cache-and-network',
          variables: this.props.variables,
          // variables: { poNo: updateInfo.po_no ,
          //             orderNo:updateInfo.order_no,
          //             trackingNo: this.state.vendorTrackingInfo.tracking_no},
        }],

     })
     .then( res => {
       console.log("mutation result:",res)
       if (!res || !res.data || !res.data.createVendorTracking) {
          this.setState({message: "DB Error",
          allowSave: true})
            rtnPoInfo.message = rtnPoInfo.message==""? rtnPoInfo.message:rtnPoInfo.message+'\n'+
             "DB Error";
              return rtnPoInfo;
       } else if (!res.data.createVendorTracking._id ||
             res.data.createVendorTracking._id == -99) {
           this.setState(
               {message: res.data.createVendorTracking.message ,
               allowSave: true},
             )
               rtnPoInfo.message = rtnPoInfo.message==""? rtnPoInfo.message:rtnPoInfo.message+'\n'+
                    res.data.createVendorTracking.message;
             return rtnPoInfo;
       }  else     {
         console.log("created/updated vendor tracking - now setting state")
         try {
         this.setState(
           { message: "Updated Successfully.Tracking Id is " +
                 res.data.createVendorTracking._id + " info:"+
                 res.data.createVendorTracking.message ,
             // poInfo: {
             //     ...this.state.poInfo,
             //    order_no: this.state.vendorTrackingInfo.order_no,
             //    purchased_qty: this.state.vendorTrackingInfo.purchased_qty,
             //    delivery_days_from: this.state.vendorTrackingInfo.delivery_days_from,
             //    delivery_days_to: this.state.vendorTrackingInfo.delivery_days_to,
             //
             //    order_date: this.state.vendorTrackingInfo.order_date,
             //    source: this.state.vendorTrackingInfo.source,
             //    order_notes:this.state.poInfo.order_notes,
             //    purchase_id: parseFloat(this.state.poInfo.purchase_id),
             //    seller_ship_id: res.data.createVendorTracking._id
             //
             // },
             vendorTrackingInfo: {
               ...this.state.vendorTrackingInfo,
                seller_ship_id: res.data.createVendorTracking._id
             },
             allowSave: true
             }
           );
         } catch(stateErr) {
           console.log("Error setting state:",stateErr)
         }

        //   setRow(poInfo)
           console.log('new state:',this.state)

           // console.log("Call registerTracking in order-details")
           // this.props.registerTracking(res.data.createVendorTracking._id,
           //   this.props.rowIndex)

         rtnPoInfo.message = rtnPoInfo.message==""? rtnPoInfo.message:rtnPoInfo.message+'\n'+
                "Updated Successfully.Tracking Id is " +
                   res.data.createVendorTracking._id + " info:"+
                   res.data.createVendorTracking.message;
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

       rtnPoInfo.message = rtnPoInfo.message==""?
            rtnPoInfo.message:rtnPoInfo.message+'\n'+ errMsg
       return rtnPoInfo;
     });
     console.log("MUTATION response:",response)

     return response
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

        // This is just personal preference.
        // I prefer to not show the the whole text area selected.
      //  e.target.focus();
      //  this.setState({ copySuccess: 'Copied!' });
      };

  renderExistingTrackings(trackingList){
      console.log('=> in renderExistingTrackings trackingList:',trackingList)
    const {trackings} = trackingList
    console.log('=> in renderExistingTrackings:',trackings)
    var tmpVal = typeof trackings != 'undefined'? trackings:'No trackings'
       return  tmpVal!='' &&
              typeof tmpVal !== 'string'?
          trackings.map(trackingNo => {
              return <ListItem button key={trackingNo}   onClick={(e) => {this.copyToClipboard(e, trackingNo)}}  >
                <ListItemText primary={trackingNo}    onClick={(e) => {this.copyToClipboard(e, trackingNo)}}  />
                </ListItem>

      }):
      <ListItem button   onClick={(e) => {this.copyToClipboard(e, trackingNo)}} >
        <ListItemText primary={tmpVal} key={tmpVal}   onClick={(e) => {this.copyToClipboard(e, tmpVal)}}  />
        </ListItem>

  }

  render() {
    console.log('render vendorTrackingForm props:',this.props)
    console.log('render vendorTrackingForm state:',this.state)
    const columnDefaults = { ...ReactTableDefaults.column, headerClassName: 'wordwrap' }
    const { classes, history, selection, getRow} = this.props;
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
       title, link, po_qty, total_purchased_qty,purchased_qty,
       price,sale_price,first_payment,total_amount,options
       ,source, notes,trackings,destination,total_order_shipped_qty,po_date
    } = this.state.poInfo;

    // const rowSelection =  this.props.getRow(_id)
    // console.log("rowSelection:",rowSelection)
     const { shipped_qty,seller_ship_id,tracking_notes,ship_date,
          order_no,purchase_id,tracking_no,
          time_in_transit_from,time_in_transit_to,carrier} = this.state.vendorTrackingInfo

      console.log("ship_date:",ship_date)
      const {message, bulkUpdate,validBulkUpdate,selectedPoList} = this.state
     console.log("new message:",message,
              " seller_ship_id:",seller_ship_id)

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
        {   !bulkUpdate ?
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
                 'fontWeight':'bold',
                'width' : '8em',
              }}
              onClick={(e) => {this.copyToClipboard(e, po_no)}}

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
                 'fontWeight':'bold',
                'width' : '32em',
              }}
              className={classes.textField}
              onClick={(e) => {this.copyToClipboard(e, title)}}
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
              name="po_date"
              type="String"
              label="PO Date"
              value={moment(po_date).format('DD-MMM-YYYY')}
              margin="dense"
              className={classes.textField}
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
            width= "4em"

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
            width= "100px"

          />
          <TextField
            name="order_no"
            type="String"
            label="Order#"
            value={order_no}
            InputProps={{
             readOnly: true,
            }}
            margin="dense"
            className="col-3"
             onClick={(e) => {this.copyToClipboard(e, order_no)}}
          />
          <TextField
            name="purchased_qty"
            type="Number"
            label="Purch Qty"
            value={purchased_qty}
            InputProps={{
             readOnly: true,
            }}
            margin="dense"
            width= "4em"
            className="col-1"
          />
          <TextField
            name="total_order_shipped_qty"
            type="Number"
            label="T. O. Shipped Qty"
            value={total_order_shipped_qty}
            InputProps={{
             readOnly: true,
            }}
            margin="dense"
              width= "4em"
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
            onClick={(e) => {this.copyToClipboard(e, notes)}}
            margin="dense"
            className="col-3 ml2"
          />

            <List
            className="col-3 border "
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
              Header: "Selected Tracking Orders",
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
                  Header: "source",
                  id: "source",
                  accessor: d => d.source
                },
                {
                  Header: "Order#",
                  id: "order_no",
                  accessor: d =>d.order_no,
                },
                {
                  Header: "Tracking#",
                  id: "tracking_no",
                  accessor: d =>d.tracking_no,
                },
                {
                  Header: "O.Date",
                  id: "order_date",
                  accessor: d => d.order_date
                },
              ]
            },
            {
              Header: "Quantities",
               columns: [    {
                  Header: "PO",
                  id: "po_qty",
                  accessor: d => d.po_qty
                },

                {
                  Header: "Order",
                  id: "purchased_qty",
                  accessor: d => d.purchased_qty
                },
                {
                  Header: "T. Pur",
                  id: "total_purchased_qty",
                  accessor: d => parseInt(d.total_purchased_qty)
                },
                {
                  Header: "Set Ship Qty",
                  id: "set_shipped_qty",
                  accessor: d => parseInt(d.set_shipped_qty),
                  style: {
                    backgroundColor: 'lightblue',
                    font: "bold"

                  }
                },
                {
                  Header: "T.O. Ship",
                  id: "total_order_shipped_qty",
                  accessor: d => parseInt(d.total_order_shipped_qty)
                },
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
          <form  className="ml2" onSubmit={this.handleTracking} autoComplete="off">

            <div className="flex flex-row ml2 ">
            <TextField
              name="tracking_no"
              disabled={bulkUpdate && !validBulkUpdate}
              required
              type="String"
              label={"Tracking # [" + (!seller_ship_id||seller_ship_id==-99? "New":"Edit")+"]"}
              autoFocus={true}
              value={tracking_no}
              onChange={this.findTracking}
              margin="dense"
              style={{
                 width : '30em',
              }}
              className="col-4 ml2"
            />
            <TextField
              name="shipped_qty"
                disabled={bulkUpdate }
              required
              type="Number"
              label="Ship Qty"
              value={shipped_qty}
              onChange={this.handleChange}
              margin="dense"
              style={{
                 width : '8em',
                 font: 'bold',
              }}
              className="col-1 ml2"
            />
            <DatePicker className="pickers"
              disabled={bulkUpdate && !validBulkUpdate}
                    autoOk
                    disableFuture
                    leftArrowIcon=<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M15.41 16.09l-4.58-4.59 4.58-4.59L14 5.5l-6 6 6 6z"/></svg>
                    rightArrowIcon=<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M8.59 16.34l4.58-4.59-4.58-4.59L10 5.75l6 6-6 6z"/></svg>

                    value={ship_date}
                    onChange={this.handleDateChange}
                    format="DD-MMM-YYYY"
              />
            </div> {/* div for order_no and purchased_qty */}

            <div className="flex flex-wrap ml2">
            <TextField
              name="time_in_transit_from"
                disabled={bulkUpdate && !validBulkUpdate}
              required
              type="Number"
              label="Days from"
              value={time_in_transit_from}
              onChange={this.handleChange}
              margin="dense"
              style={{
                 width : '6em',
                 fontWeight: 500
              }}
              className="col-1"
            />
             -
            <TextField
              name="time_in_transit_to"
                disabled={bulkUpdate && !validBulkUpdate}
              required
              type="Number"
              label="Days to"

              value={time_in_transit_to}
              onChange={this.handleChange}
              margin="dense"
              style={{
                 width : '6em',
                 fontWeight: 500
              }}
              className="col-1 ml2"
            />

            <TextField
              name="tracking_notes"
                disabled={bulkUpdate && !validBulkUpdate}
              type="String"
              label="Tracking Cust Note"

              value={tracking_notes}
              onChange={this.handleChange}
              margin="dense"
              style={{
                width : '24m',
                fontWeight: 500
              }}
              className="col-3 ml2"
            />
            <TextField
              name="carrier"
                disabled={bulkUpdate && !validBulkUpdate}
              type="String"
              label="Carrier"
              value={carrier}
              onChange={this.handleChange}
              margin="dense"
              style={{
                width : '15em',
                fontWeight: 500
              }}
              className="col-2 ml2"
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
                        'fontSize': '10px' ,
                        'font': 'bold',
                      'width' : 800,
                    }}

                    margin="dense"

            />
            <Button size="small"  variant="contained"
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

VendorTrackingForm.propTypes = {
  onSubmit: PropTypes.func,

};

VendorTrackingForm.defaultProps = {
  onSubmit: () => {},
};

const createVendorTracking = gql`
  mutation createVendorTracking($vendorTracking: VendorTrackingInput!) {
    createVendorTracking (input: $vendorTracking) {
     _id
      message
   }
  }
`;

const VendorTrackingFormWithMutation = graphql(
  createVendorTracking
)(VendorTrackingForm);

// const VendorTrackingGraphql =  compose(
//    graphql(createVendorTracking, {
//       name: "createVendorTracking"
//    }),
//    graphql(packageTrackingQuery,
//      {
//      name: 'packageTrackingQuery',
//      // options are props passed from order-details-page
//      options: ({tracking_no} ) => ({
//        variables: {
//          tracking_no: tracking_no,
//
//        },
//      }),
//    })
// )(VendorTrackingForm);
//const VendorTrackingComp = withStyles(styles)(VendorTrackingGraphql)

//export default withStyles(styles)(VendorTrackingForm)
const VendorTrackingComp = withStyles(styles)(VendorTrackingFormWithMutation)
export default withApollo(VendorTrackingComp);
