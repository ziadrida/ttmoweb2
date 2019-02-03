import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { propType } from 'graphql-anywhere';
import { withStyles } from '@material-ui/core/styles';
//import { withTracker } from 'meteor/react-meteor-data';
import orderDetailsFragment from '/app/ui/apollo-client/order-details/fragment/order-details';
import orderDetailsQuery from '/app/ui/apollo-client/order-details/query/order-details';

import Icon from '@material-ui/core/Icon';
import CancelIcon from '@material-ui/icons/Cancel';
import DeleteIcon from '@material-ui/icons/Delete';
import Fab from '@material-ui/core/Fab';
import Loading from '/app/ui/components/dumb/loading';
import moment from 'moment'
import CustomPagination from './custom-pagination'
import matchSorter from 'match-sorter'
import {view, stages, detailViews } from './helpers';
import VendorPurchaseFormWithMutation from '/app/ui/components/smart/vendor-purchase/vendor-purchase-form';
import VendorTrackingFormWithMutation from '/app/ui/components/smart/vendor-tracking/vendor-tracking-form';
import OrderCancelFormWithMutation from '/app/ui/components/smart/purchase-order/order-cancel-form';

// Import React Table
import ReactTable,{ReactTableDefaults} from "react-table";
import selectTableHOC from 'react-table/lib/hoc/selectTable'
const SelectTable=selectTableHOC(ReactTable)

  const styles = theme => ({
    root: {
      width: '100%',
      marginTop: theme.spacing.unit * 2,
      overflowX: 'auto',
      overflowY: 'auto',
    },
    table: {
      minWidth: 500,
    },

  icon: {
    margin: theme.spacing.unit * 2,
  },
  iconHover: {
    margin: theme.spacing.unit * 2,
    '&:hover': {
      color: 'red',
    },
  },
  statusline: {
    width: "15px",
    height: "15px",
    margin: 0,
    align: 'center',
  },

  });

  const FabStyle = {
      height: 15,
      lineHeight: '15px',
      verticalAlign: 'middle',
      width: 15,
  };


  const getColumnWidth = (data, accessor, headerText) => {
    if (typeof accessor === 'string' || accessor instanceof String) {
      accessor = d => d[accessor]; // eslint-disable-line no-param-reassign
    }
    const maxWidth = 600;
    const magicSpacing = 10;
    const cellLength = Math.max(
      ...data.map(row => (`${accessor(row)}` || '').length),
      headerText.length,
    );
    return Math.min(maxWidth, cellLength * magicSpacing);
  }



  nvl = (val1, val2) => ( val1 != undefined&& val1 !=null  ? val1:val2)



  // amm_customs_arrival_date: "1536019200000"
  // amm_showroom_arrival_date: "1536192000000"
  // aq_customs_arrival_date: "0"
  // aq_showroom_arrival_date: "0"
  // awb_destination: null
  // customer_address_arrival_date: "0"
  // customer_delivery_date: "0"
  // date_received: "1533686400000"
  // delivered_qty: "0"
  // delivery_days_from: "25"
  // delivery_days_to: "27"
  // departure_date: "1535587200000"
  //.... destination: "Amman"
  // email: null
  // final_box_id: ["3CF4"]
  // first_payment: "200"
  // last_updated: "1536390339957"
  // ....link: "https://www.amazon.com/All-New-Amazon-Fire-7-Tablet/dp/B01GEW27DA/ref=redir_mobile_desktop?_encoding=UTF8&ref_=ods_mfs_an#"
  // membership_amount: "0"
  // notes: " تم دفع شك باقي المبلغ 840  "
  // options: "Digital Storage Capacity: 8 GB Offer Type: With Special Offers Color: Black"
  // order_date: "17/07/2018"
  // order_no: "111-7603228-6946630"
  // order_type: "reg"
  // orders: ["111-7603228-6946630"]
  // packing: [{…}]
  // payment_method: null
  // payment_status: null

  // price: 29.99
  // purchase_id: "2860"
  //... purchased_qty: "25"
  // received: "true"


  // seller_ship_id: "3084"
  // ship_date: "07/08/2018"
  // ship_id: "30652"
  // shipment_ref: "SHIP312-AMM"
  // shipped_qty: "2"
  // source: "AMAZON"
  // status: "active"
  // time_in_transit_from: "2"
  // time_in_transit_to: "2"
  //.... title: "Fire 7 Tablet with Alexa, 7" Display, 8 GB, Black - with Special Offers"
  // total_amount: "850"
  // total_order_shipped_qty: "25"
  // total_purchased_qty: "25"
  // tracking_no: "1Z0W646F0316248038"
  // trc: null
  // userId: "1737727762934177"
  // ....username: "Abdullah Ashi"
  // vip: "false"


  //************************************************************
  class OrderDetails extends React.Component {
      constructor(props) {
        super(props);
        console.log('=> in OrderDetails constructor component props', this.props)
        this.state = {
          selection: [],
          selectRows:[],
          selectAll: false,
          showPurchase:false,
          showTracking:false,
          showCancel: false,
          refreshData: false,
          currentRow: {},
          currentKey: "",
          rowIndex:-1,
          data: [],
          columns: [],
          views: detailViews,
          filter: true,
          modified: null,
          origVal: null,
          newVal: null,
          stage: '',
        }
        this.renderEditable = this.renderEditable.bind(this);
        this.changeFilter = this.changeFilter.bind(this);
        this.handleRowChange = this.handleRowChange.bind(this);
        this.handleRowClick = this.handleRowClick.bind(this);
        this.toggleViewChooser = this.toggleViewChooser.bind(this);
        this.configColumns = this.configColumns.bind(this);
        this.escFunction = this.escFunction.bind(this);
        this.handlePurchase = this.handlePurchase.bind(this);
        this.handleTracking = this.handleTracking.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.toggleSelection = this.toggleSelection.bind(this);
        this.getRow = this.getRow.bind(this);
        this.orderNoColumn = this.orderNoColumn.bind(this);
      }

      toggleSelection = (key, shift, row) => {
        console.log('toggleSelection row',row)
          console.log('toggleSelection key',key)
          console.log('toggleSelection shift',shift)
        // start off with the existing state
        let selection = [...this.state.selection];
        const keyIndex = selection.indexOf(key);
        // check to see if the key exists
        if (keyIndex >= 0) {
          // it does exist so we will remove it using destructing
          selection = [
            ...selection.slice(0, keyIndex),
            ...selection.slice(keyIndex + 1)
          ];

        } else {
          // it does not exist so add it
          selection.push(key);
        }
        // update the state
        this.setState({ selection });
      };

      toggleAll = () => {
        // select filtered rows only
       const selectAll = this.state.selectAll ? false : true;
       const selection = [];
       if (selectAll) {
         // we need to get at the internals of ReactTable
         const wrappedInstance = this.selectTable.getWrappedInstance();
         // the 'sortedData' property contains the currently accessible records based on the filter and sort
         const currentRecords = wrappedInstance.getResolvedState().sortedData;
         // we just push all the IDs onto the selection array
         currentRecords.forEach(item => {
           console.log('item',item)
           selection.push(item._original._id);
         });
       }
       this.setState({ selectAll, selection });
     };

     isSelected = key => {

  return this.state.selection.includes(key);
};
    escFunction(event, sender) {
         if (event.keyCode === 27) {
           console.log('sender:', sender)
          console.log("Escape!:",event)
          console.log("Escape oldValue:",this.state.oldVal)
           console.log("Escape newValue:", this.state.newVal)
       }
    }

  static getDerivedStateFromProps(props, state) {
         console.log("orderDetails-Data getDerivedStateFromProps \nprops",props,
         "\nstate",state)
         const { orderDetailsData, stage } = props
         const { loading, error, getOrderDetails ,variables  } = orderDetailsData;
         if (state.refreshData) {
           console.log("reset data and query again")
           return {
             data: [],
             selection:[],
             selectRows:[],
             selectAll: false,
             currentRow: {},
             currentKey: "",
             rowIndex:-1,
             refreshData: false,
           }
         } else   if (!loading && !error && state.data != getOrderDetails ) {
           console.log(">>>RESET DATA")
           return {
             data: getOrderDetails,
             // selection:[],
             // selectRows:[],
             // selectAll: false,
             // currentRow: {},
             // currentKey: "",
             // rowIndex:-1,
           }
         }
         return null;
  }


       componentDidMount() {
         console.log(">>>>>>>>>>>>>> order-details componentDidMount")
        this.setState({ columns: this.configColumns() })
         document.addEventListener("keydown", this.escFunction, false);
         this.setState({ columns: this.configColumns() })
         // this.toggleViewChooser(
         //   stages[
         //     stages.indexOf(stages.find(i=> (i.name == this.state.stage) ))
         //   ].view)
       }


       componentWillUnmount() {
         document.removeEventListener("keydown", this.escFunction, false);
       }


       orderNoColumn = () => {

         return       ({
                 id: "order_no",
                 Header: "Order No",
                 accessor: d => d.order_no,
               //  Cell: this.renderEditable,
               Cell: (row) => (
                   <div >

                    <button style={{ align: 'center', 'backgroundColor': 'lightblue' }}
                       onClick={() => this.handlePurchase(row)}>{row.value? row.value:"Purchase"}
                   </button>


                   </div>
                 ),
                 filterMethod: (filter, rows) =>
                             matchSorter(rows, filter.value, { keys: ["order_no"] }),
                 filterAll: true,
                 views:[view.all,view.payment,view.purchase,view.track,view.arrive,],
                 width:200,
               })
       }

      configColumns = () => { return  [{
        Header: "Order Information",
        id: "oderInfo",
        show:true,
        columns: [

          {
            id: "po_no",
            Header: "PO No",
            accessor:  d => {  var p = d.po_no.split('-');
              return d.po_no? p[0]+'-'+ "00".substring(p[1].length) + p[1]:''
            },
            filterMethod: (filter, rows) =>
              matchSorter(rows, filter.value, {
                keys: ["po_no"]
              }),
            filterAll: true,
            maxWidth: 120,
            views:[view.all,view.payment,view.purchase,view.track,view.arrive,view.pack,view.ship,view.deliver,view.book,view.close]

          },
          {
                  id: "set_status",
                  Header: "",
                  accessor: d => d.po_no,
                //  Cell: this.renderEditable,
                Cell: (row) => (
                  <div>

                  <svg  onClick={() => this.handleCancel(row)} color='gray' width="24" height="24"
                    viewBox="0 0 24 24">
        <path xmlns="http://www.w3.org/2000/svg" d="M21.886 14.303c-1.259-2.181-0.502-4.976 1.691-6.246l-2.358-4.085c-0.674 0.395-1.457 0.622-2.293 0.622-2.52 0-4.563-2.057-4.563-4.594h-4.717c0.006 0.783-0.189 1.577-0.608 2.303-1.259 2.181-4.058 2.923-6.255 1.658l-2.358 4.085c0.679 0.386 1.267 0.951 1.685 1.675 1.257 2.178 0.504 4.967-1.681 6.24l2.358 4.085c0.671-0.391 1.451-0.615 2.283-0.615 2.512 0 4.55 2.044 4.563 4.569h4.717c-0.002-0.775 0.194-1.56 0.609-2.279 1.257-2.177 4.049-2.92 6.244-1.664l2.358-4.085c-0.675-0.386-1.258-0.949-1.674-1.669zM12 16.859c-2.684 0-4.859-2.176-4.859-4.859s2.176-4.859 4.859-4.859c2.684 0 4.859 2.176 4.859 4.859s-2.176 4.859-4.859 4.859z"/>
                  </svg>

                    </div>
                  ),
                    filterable:false,
                  width:32,
                  views:[view.all,view.payment,view.purchase,view.track,view.arrive,view.pack,view.ship,view.deliver,view.book,view.close]

          },
          {

            Header: "Type",
            id: "order_type",
            accessor: d => d.order_type? d.order_type.toLowerCase():'',
            filterMethod: (filter, rows) =>
                        matchSorter(rows, filter.value, { keys: ["order_type"] }),
            filterAll: true,
            views:[view.all,view.payment,view.purchase,view.track,
              view.arrive,view.pack,view.ship,view.deliver,view.book,view.close],
            width:40,
          },
          {

            Header: "Status",
            accessor: "status",
            filterMethod: (filter, rows) =>
                        matchSorter(rows, filter.value, { keys: ["status"] }),
            filterAll: true,
            views:[view.all,view.payment,view.deliver,view.book,view.close],
          },
          {

            Header: "Sales person",
            accessor: "sales_person",
            filterMethod: (filter, rows) =>
                        matchSorter(rows, filter.value, { keys: ["sales_person"] }),
            filterAll: true,
            views:[view.all,view.payment,view.purchase,view.deliver,view.book,view.close],
            width:70,
          },

          {
                  id: "order_no",
                  Header: "Order No",
                  accessor: d => d.order_no,
                //  Cell: this.renderEditable,
                Cell: (row) => (
                    <div >

                     <button style={{ align: 'center', backgroundColor: 'lightblue' }}
                        onClick={() => this.handlePurchase(row)}>{row.value? row.value:"Purchase"}
                    </button>


                    </div>
                  ),
                  filterMethod: (filter, rows) =>
                              matchSorter(rows, filter.value, { keys: ["order_no"] }),
                  filterAll: true,

                  views:[view.all,view.payment,view.purchase,view.track,view.arrive,],
                  width:200,
                },
          {
            id: "tracking_no",
            Header: "Tracking No",
            accessor: d => d.tracking_no,
          //  Cell: this.renderEditable,
          Cell: (row) => (
              <div >

               <button style={{ align: 'center', 'backgroundColor': 'lightblue' }}
                  onClick={() => this.handleTracking(row)}>{row.value? row.value:"Track"}
              </button>


              </div>
            ),
            filterMethod: (filter, rows) =>
                        matchSorter(rows, filter.value, { keys: ["tracking_no"] }),
            filterAll: true,
            views:[view.all,view.track,view.arrive,view.pack,view.ship],
            width:220,
          },
          {
            id: 'po_date',
            Header: "PO Date",
            accessor: d => d.po_date? moment(d.po_date, 'YYYY-MM-DD').toDate():"",

            Cell: row => <span>{row.value && row.value!='0'? moment(row.value).format('DD-MMM-YY'):''}</span>,

            filterMethod: (filter, rows) =>
              matchSorter(rows, filter.value, {
                keys: ["po_date"]
              }),
            filterAll: true,
            maxWidth: 100,

            views:[view.all,view.payment,view.purchase,view.track,view.arrive,view.pack,view.ship,view.deliver,view.book,view.close],
          },
        ]
        },
        {
            Header: "Accounting Info",
            id: "accountingInfo",
              show:true,
            columns: [
              {
                id: "first_payment",
                Header: "Init Pymnt",
                accessor: d => d.first_payment?  parseFloat(d.first_payment):0,
                getProps:  (state, rowInfo) => ({
                 style: {
                     backgroundColor: (rowInfo && rowInfo.row &&
                        parseFloat(rowInfo.row.first_payment) == 0 ? 'orange' : null),

                          textAlign: 'right'

                 }
                }),
                width: 70,
                filterMethod: (filter, row) =>
                  row[filter.id] >= filter.value,
                filterAll: false,
                views: [view.all,view.payment, view.purchase, view.deliver, view.book,view.close],
              },
              {
                Header: "T Amount",
                id: "total_amount",
                accessor: d => parseFloat(d.total_amount) ,
                Cell: ({ value }) => (value >= 9999 ? 0 : value),
                filterMethod: (filter, row) =>
                          row[filter.id] >= filter.value,
                filterAll:false,
                style: {
                  textAlign: 'right'
                },
                width: 70,
                views:[view.all,view.payment,view.purchase,view.deliver,view.book,view.close],
              },
              {
                id: 'first_payment_date',
                Header: "Int Pymt Date",

               accessor: d => d.first_payment_date &&  d.first_payment_date!='0'? d.first_payment_date:
               d.last_updated,
               Cell: row => <span>{row.value?moment(row.value).format('DD-MMM-YY'):null}</span>,
              //  Cell: this.renderEditable,
                filterMethod: (filter, rows) =>
                  matchSorter(rows, filter.value, {
                    keys: ["first_payment_date"]
                  }),
                filterAll: true,
                width: 100,
              //  width:(d) => getColumnWidth(this.state.data, d.order, "Order No."),
                  views: [view.all,view.payment, view.purchase, view.deliver, view.book,view.close],
              },
              {
                id: "final_payment",
                Header: "Final Pymnt",
                accessor: d => d.final_payment? parseFloat(d.final_payment):0,
                getProps:  (state, rowInfo) => ({
                 style: {
                     backgroundColor: (rowInfo && rowInfo.row &&
                        parseFloat(rowInfo.row.final_payment) == 0 ? 'orange' : null),

                          textAlign: 'right'

                 }
                }),
                width: 70,
                filterMethod: (filter, row) =>
                  row[filter.id] >= filter.value,
                filterAll: false,
                views: [view.all,view.payment, view.purchase, view.deliver, view.book,view.close],
              },
              {
                id: 'final_payment_date',
                Header: "Final Pymt Date",

               accessor: d => d.final_payment_date &&  d.final_payment_date!='0'? d.final_payment_date:
                null,
               Cell: row => <span>{row.value?moment(row.value).format('DD-MMM-YY'):null}</span>,
              //  Cell: this.renderEditable,
                filterMethod: (filter, rows) =>
                  matchSorter(rows, filter.value, {
                    keys: ["first_payment_date"]
                  }),
                filterAll: true,
                width: 100,
              //  width:(d) => getColumnWidth(this.state.data, d.order, "Order No."),
                  views: [view.all,view.payment, view.purchase, view.deliver, view.book,view.close],
              },
              {
                id: 'paid_in_full',
                Header: "Paid",
                accessor: d =>  d.paid_in_full != null ?d.paid_in_full: false,
                filterMethod: (filter, rows) =>
                            matchSorter(rows, filter.value, { keys: ["paid_in_full"] }),
                filterAll: true,
                views:[view.all,view.payment,view.purchase,view.deliver,view.book,view.close],
              },
              {

                Header: "Booked",
                id:"booked",
                accessor: d =>  d.booked != null ?d.booked: false,
                filterMethod: (filter, rows) =>
                            matchSorter(rows, filter.value, { keys: ["booked"] }),
                filterAll: true,
                  views:[view.all,view.payment,view.purchase,view.deliver,view.book,view.close],
              },
              {
                id: 'accounting_note',
                Header: "RV/Inv/notes",
                accessor: d => d.accounting_note,
                filterMethod: (filter, rows) =>
                            matchSorter(rows, filter.value, { keys: ["accounting_note"] }),
                filterAll: true,
                views:[view.all,view.payment,view.purchase,view.deliver,view.book,view.close],
              },
          ]
        }, // end of accounting
        {
            Header: "Customer Info",
            id: "custInfo",
              show:true,
            columns: [
              {
                id: 'username',
                Header: "Username",
                accessor: d => d.username,
                filterMethod: (filter, rows) =>
                            matchSorter(rows, filter.value, { keys: ["username"] }),
                filterAll: true,
                views:[view.all,view.payment,view.purchase,view.deliver,view.book,view.close],
              },
              {
                Header: "Address",
                accessor: "address",
                filterMethod: (filter, rows) =>
                          matchSorter(rows, filter.value, { keys: ["address"] }),
                filterAll: true,
                views:[view.all,view.payment,view.deliver,view.book,view.close],
            },
            {
              Header: "Phone",
              accessor: "phone_no",
              filterMethod: (filter, rows) => {
              console.log('filter:',filter)
              console.log('rows:',rows)
                        return  matchSorter(rows, filter.value, { keys: ["phone_no"] })
                        },
              filterAll: true,
              views:[view.all,view.payment,view.deliver,view.book,view.close],
            },
          ]
        },
        {
            Header: "Purchasing Info",
            id: "purchInfo",
            show:true,
            columns: [

            {
              id: "sale_price",
              Header: "Sale Price",
              accessor: d => d.sale_price,
              filterMethod: (filter, row) =>
                row[filter.id] >= filter.value,
              filterAll: false,
              style: {
                textAlign: 'right'
              },
              views: [view.all,view.payment,  view.ship, view.deliver, view.book,view.close],
            },

            {
              Header: "Title",
              accessor: "title",
              filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, {
                  keys: ["title"]
                }),
              filterAll: true,
              views:[view.all,view.payment,
                view.purchase,view.track,view.arrive,
                view.pack,view.ship,view.deliver,view.book,view.close],
                style: { 'whiteSpace': 'unset',
                  'fontSize': '10px',
                  'overflowY':'scroll',
                  'width':'440px',
                  'height':'3em'
                 },
                width:300,
            },
            {
              id: 'link',
              Header: "URL/HTTP Link",
              accessor: d =>
              <a href = { d.link } target = "_blank" > {d.link  } </a>,
              filterMethod: (filter, rows) => {
                console.log('rows:',rows)
                console.log('filter:',filter)

                return matchSorter(rows, filter.value, {keys: ["link.props.href"] })
              },
              filterAll: true,
              style: { 'whiteSpace': 'unset',
                'fontSize': '10px',
                'overflowY':'scroll',
                'width':'440px',
                'height':'3em'
               },
              width:350,
              views:[view.all,view.payment,view.purchase,view.track,view.arrive,view.pack,view.ship,view.deliver,view.book,view.close],
            },
            {
              Header: "Options",
              accessor: "options",
              filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, {
                  keys: ["options"]
                }),
              filterAll: true,
              views:[view.all,view.payment,view.purchase,view.deliver],
              //maxWidth: 200
            },


             {
              id: "price",
              Header: "Price USD",
              accessor: d => d.price? parseFloat(d.price).toFixed(2):0,
              filterMethod: (filter, row) =>
                        parseFloat(row[filter.id]) >= parseFloat(filter.value),
              filterAll: false,
              style: {
                textAlign: 'right'
              },
              width: 70,
              views:[view.all,view.payment,view.purchase,view.pack,view.ship,view.deliver,view.book,view.close],
            },
            {
              Header: "category",
              accessor: "category",
              filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, {
                  keys: ["category"]
                }),
              filterAll: true,
              style: {
                textAlign: 'right'
              },
              views:[view.all,view.payment,view.purchase,view.arrive,view.pack,view.ship,view.deliver,view.book,view.close],
              //maxWidth: 200
            },
            {
              id: "source",
              Header: "Source",
              accessor: d => d.source,
              filterMethod: (filter, rows) =>
                          matchSorter(rows, filter.value, { keys: ["source"] }),
              filterAll: true,
              views:[view.all,view.payment,view.purchase,view.track,view.arrive,],
            },
            {
              id: "destination",
              Header: "Dest",
              accessor: d => d.destination,
              filterMethod: (filter, rows) =>
                          matchSorter(rows, filter.value, { keys: ["destination"] }),
              filterAll: true,
              views:[view.all,view.payment,view.purchase,view.pack,view.ship,view.deliver,view.book,view.close],
              width:70,
            },
            {
            Header: "PO Qty",
            id: "po_qty",
            accessor:  d => parseInt(d.po_qty),
            getProps:  (state, rowInfo) => ({
             style: {
                 backgroundColor: (rowInfo && rowInfo.row &&
                    parseFloat(rowInfo.row.po_qty) > 1 ? 'orange' : null)
             }
            }),
            Cell: ({ value }) => (value >= 9999 ? 0 : value),
            filterMethod: (filter, row) =>
                      row[filter.id] >= filter.value,
            filterAll: false,
            style: {
              textAlign: 'right',
              width: '4em',
            },
            width: 50,
            views:[view.all,view.payment,view.purchase,view.track,view.pack,view.ship,view.deliver,view.book,view.close],
          },
          {
            Header: "Order Notes",
            accessor: "notes",
            filterMethod: (filter, rows) =>
              matchSorter(rows, filter.value, {
                keys: ["notes"]
              }),
            filterAll: true,
            views:[view.all,view.payment,view.purchase,view.deliver],
            style: {
              textAlign: 'right',
              width: '10em',
            },
          },
        ] },
        {
            Header: "Vendor Orders",
            id: "vendoInfo",
              show:true,
            columns: [
              {
                Header: "Purchase Id",
                accessor: "purchase_id",
                //width: 35,
                views:[-1],
              },
              {
                Header: "T Purch Qty",
                accessor: "total_purchased_qty",
                filterMethod: (filter, row) =>
                          parseFloat(row[filter.id]) >= parseFloat(filter.value),
                filterAll: false,
                style: {
                  textAlign: 'right',
                  width: '5em',
                },
                width:60,
                getProps:  (state, rowInfo) => ({
                 style: {
                     backgroundColor: (rowInfo && rowInfo.row &&
                        parseFloat(rowInfo.row.total_purchased_qty)<
                        parseFloat(rowInfo.row.po_qty) ? 'orange' : 'lightgreen')
                 }
                }),

                views:[view.all,view.payment,view.purchase,view.track],

              },
            {
              id: "order_no",
              Header: "Order No",
              accessor: d => d.order_no,
            //  Cell: this.renderEditable,
            Cell: (row) => (
                <div >

                 <button style={{ align: 'center', 'backgroundColor': 'lightblue' }}
                    onClick={() => this.handlePurchase(row)}>{row.value? row.value:"Purchase"}
                </button>


                </div>
              ),
              filterMethod: (filter, rows) =>
                          matchSorter(rows, filter.value, { keys: ["order_no"] }),
              filterAll: true,
              views:[view.all,view.payment,view.purchase,view.track,view.arrive,],
              width:200,
            },

            {
              id: "seller",
              Header: "Seller Info",
              accessor: d => d.seller,

              filterMethod: (filter, rows) =>
                          matchSorter(rows, filter.value, { keys: ["seller"] }),
              filterAll: true,
              views:[view.track,view.arrive],
              width:200,
            },

            {
              id: 'order_date',
              Header: "Order Date",

             accessor: d => d.order_date? moment(d.order_date, 'DD/MM/YYYY').toDate():null,
             Cell: row => <span>{row.value?moment(row.value).format('DD-MMM-YY'):null}</span>,
            //  Cell: this.renderEditable,
              filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, {
                  keys: ["order_date"]
                }),
              filterAll: true,
              width: 100,
            //  width:(d) => getColumnWidth(this.state.data, d.order, "Order No."),
              views:[view.all,view.payment,view.purchase,view.track,],
            },
            {
              Header: "Order Qty",
              accessor: "purchased_qty",
            //  Cell: this.renderEditable,
              filterMethod: (filter, row) =>
                        row[filter.id] >= filter.value,
              filterAll: false,
              getProps:  (state, rowInfo) => ({
               style: {
                   backgroundColor: (rowInfo && rowInfo.row &&
                      parseFloat(rowInfo.row.total_purchased_qty)<
                      parseFloat(rowInfo.row.po_qty) ? 'orange' : 'lightgreen')
               }
              }),
              style: {
                textAlign: 'right',
                width: '4em'
              },
            //  width: 35,
              views:[view.all,view.payment,view.purchase,view.track],

            },

            {
              id: "delivery_days_from",
              Header: "from",
              accessor: d => d.delivery_days_from,
            //  Cell: this.renderEditable,
                filterMethod: (filter, rows) =>
                            matchSorter(rows, filter.value, { keys: ["delivery_days_from"] }),
              filterAll: true,
              style: {
                textAlign: 'right',
                width: '3em'
              },
              width: 40,
              views:[view.all,view.payment,view.purchase,view.track],

            },
            {
              id: "delivery_days_to",
              Header: "to",
              accessor: d => d.delivery_days_to,
            //  Cell: this.renderEditable,
              filterMethod: (filter, rows) =>
                            matchSorter(rows, filter.value, { keys: ["delivery_days_to"] }),
              filterAll: true,
              style: {
                textAlign: 'right',
                width: '3em'
              },
                width: 40,
              views:[view.all,view.payment,view.purchase,view.track],

            },
            // accessor: d =>
            //     d.order_date? moment(d.order_date,'DD/MM/YYYY').add(d.delivery_days_from,'day').format('DD/MM') +
            //      " to " +
            //     moment(d.order_date,'DD/MM/YYYY').add(d.delivery_days_to,'day').format('DD/MM'):""
            // ,
        ] },
        {
            Header: "Tracking Info",
            id: "trackInfo",
              show:true,
            columns: [

            {
              id: "tracking_no",
              Header: "Tracking No",
              accessor: d => d.tracking_no,
            //  Cell: this.renderEditable,
            Cell: (row) => (
                <div >

                 <button style={{ align: 'center', 'backgroundColor': 'lightblue' }}
                    onClick={() => this.handleTracking(row)}>{row.value? row.value:"Track"}
                </button>


                </div>
              ),
              filterMethod: (filter, rows) =>
                          matchSorter(rows, filter.value, { keys: ["tracking_no"] }),
              filterAll: true,
              views:[view.all,view.track,view.arrive,view.pack,view.ship],
              width:220,
            },
            {
              id: 'ship_date',
              Header: "Packg Ship Date",
              accessor: d => d.ship_date? moment(d.ship_date, 'DD/MM/YYYY').toDate():null,
                Cell: row => <span>{row.value?moment(row.value,'DD/MM/YYYY').format('DD-MMM-YY'):null}</span>,
              filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, {
                  keys: ["ship_date"]
                }),
              filterAll: true,
              maxWidth: 100,
              views:[view.all,view.track,view.arrive,],
            },
            {
              Header: "Ship Qty",
              accessor: "shipped_qty",
              filterMethod: (filter, row) =>
                        row[filter.id] >= filter.value,
              filterAll: false,
              style: {
                textAlign: 'right'
              },
              //width: 35,
              views:[view.all,view.track,view.arrive,view.pack,view.ship,view.deliver,view.book,view.close],

            },
            {
              Header: "O.Ship Qty",
              id: "total_order_shipped_qty",
              accessor: d => d.total_order_shipped_qty ,
              filterMethod: (filter, row) =>
                        row[filter.id] >= filter.value,
              filterAll: false,
              getProps:  (state, rowInfo) => ({
               style: {
                   backgroundColor: (rowInfo && rowInfo.row &&

                      parseFloat(rowInfo.row.total_order_shipped_qty)<
                      parseFloat(rowInfo.row.purchased_qty) ? 'orange' :
                      rowInfo && rowInfo.row &&  parseFloat(rowInfo.row.total_order_shipped_qty)>parseFloat(rowInfo.row.purchased_qty)?
                        'red':'lightgreen' )
               }
              }),
              style: {
                textAlign: 'right'
              },
            //  width: 35,
              views:[view.all,view.track,view.arrive,view.pack,view.ship,view.deliver,view.book,view.close],

            },

            {
              id: "time_in_transit_from",
              Header: "from",
              accessor: d =>  d.time_in_transit_from,
              filterMethod: (filter, rows) =>
                            matchSorter(rows, filter.value, { keys: ["time_in_transit_from"] }),
              filterAll: true,
              style: {
                textAlign: 'right'
              },
              //width: 35,
              views:[view.all,view.arrive,view.track,view.pack,view.ship],

            },
            {
              id: "time_in_transit_to",
              Header: "to",
              accessor: d =>  d.time_in_transit_to,
              filterMethod: (filter, rows) =>
                            matchSorter(rows, filter.value, { keys: ["time_in_transit_to"] }),
              filterAll: true,
              style: {
                textAlign: 'right'
              },
              //width: 35,
              views:[view.all,view.arrive,view.track,view.pack,view.ship],

            },
            {
              id: "expected_date",
              Header: "Pkg Est Arrival",
                accessor: d => {
                    return
                    moment(d.ship_date,'DD/MM/YYYY').
                    add(d.time_in_transit_to,'day').toDate()
                },
                Cell: row => <span>{row.value && row.value!='0'? moment(row.value).format('DD-MMM-YY'):''}</span>,

                filterMethod: (filter, rows) =>
                            matchSorter(rows, filter.value, { keys: ["expected_date"] }),
              filterAll: true,
              //width: 35,
              views:[view.all,view.arrive,view.track,view.pack,view.ship],

            },
          ]
        },
        {
            Header: "Packing Info",
            id: "packInfo",
              show:true,
            columns: [

            {
              Header: "Box Id",
              id:"box_id",
              accessor: d => d.box_id,
              filterMethod: (filter, rows) =>
                          matchSorter(rows, filter.value, { keys: ["box_id"] }),
              filterAll: true,
              //width:40,
              views:[view.all,view.arrive,view.pack,view.ship],
            },
            {
              Header: "Final Box Id",
              id: "final_box_id",
              accessor: d => d.final_box_id,
              filterMethod: (filter, rows) =>
                          matchSorter(rows, filter.value, { keys: ["final_box_id"] }),
              filterAll: true,
              //width:40,
              views:[view.all,view.pack,view.ship],
            },
          ]
        },
        {
            Header: "Shipping Info",
            id: "shipInfo",
              show:true,
            columns: [

            {
              Header: "AWB No",
              accessor: "awb_no",
              filterMethod: (filter, rows) =>
                          matchSorter(rows, filter.value, { keys: ["awb_no"] }),
              filterAll: true,
              views:[view.all,view.ship,view.deliver,view.book,view.close],
              width: 100,
            },
            {
              Header: "AWB Dest",
              accessor: "awb_destination",
              filterMethod: (filter, rows) =>
                          matchSorter(rows, filter.value, { keys: ["awb_destination"] }),
              filterAll: true,
              views:[view.all,view.ship,view.deliver,view.book,view.close],
              width: 100,
            },
            {
              Header: "Shipment Ref",
              accessor: "shipment_ref",
              filterMethod: (filter, rows) =>
                          matchSorter(rows, filter.value, { keys: ["shipment_ref"] }),
              filterAll: true,
              views:[view.all,view.ship,view.deliver,view.book,view.close],
              width: 120,
            },
          ]
        },
        {
            Header: "Delivery Info",
            id: "deliverInfo",
              show:true,
            columns: [

            {
              Header: "Delv Qty",
              accessor: "delivered_qty",
              filterMethod: (filter, rows) =>
                          matchSorter(rows, filter.value, { keys: ["delivered_qty"] }),
              filterAll: true,
              style: {
                textAlign: 'right'
              },
            //  width: 35,
              views:[view.all,view.ship,view.deliver,view.book,view.close],
            },
            {
              Header: "Delivery Date",
              id: "customer_delivery_date",
              accessor: d => d.customer_delivery_date&&d.customer_delivery_date!='0'?
                  moment(d.customer_delivery_date, 'DD/MM/YYYY').toDate():"",
              Cell: row => <span>{row.value && row.value!='0'? moment(row.value).format('DD-MMM-YY'):''}</span>,

              filterMethod: (filter, rows) =>
                          matchSorter(rows, filter.value, { keys: ["customer_delivery_date"] }),
              filterAll: true,
            //  width: 80,
              views:[view.all,view.ship,view.deliver,view.book,view.close],
            },
            {
              Header: "Amm Customs",
              id: "amm_customs_arrival_date",
              accessor: d => parseInt(d.amm_customs_arrival_date) ,
               Cell: row => <span>{row.value && row.value!='0'? moment(row.value).format('DD-MMM-YY'):''}</span>,
              filterMethod: (filter, rows) =>
                          matchSorter(rows, filter.value, { keys: ["amm_customs_arrival_date"] }),
              filterAll: true,
            //  width: 80,
              views:[view.all,view.ship,view.deliver,view.book,view.close],
            },
            {
              Header: "Aq Customs",
              id: "aq_customs_arrival_date",
              accessor: d => parseInt(d.aq_customs_arrival_date),
               Cell: row => <span>{row.value && row.value!='0'? moment(row.value).format('DD-MMM-YY'):''}</span>,
              filterMethod: (filter, rows) =>
                          matchSorter(rows, filter.value, { keys: ["aq_customs_arrival_date"] }),
              filterAll: true,
            //  width: 80,
              views:[view.all,view.ship,view.deliver,view.book,view.close],
            },
            {
              Header: "Amm Showroom",
              id: "amm_showroom_arrival_date",
              accessor: d => parseInt(d.amm_showroom_arrival_date),
              Cell: row => <span>{row.value && row.value!='0'? moment(row.value).format('DD-MMM-YY'):''}</span>,

              filterMethod: (filter, rows) =>
                          matchSorter(rows, filter.value, { keys: ["amm_showroom_arrival_date"] }),
              filterAll: true,
            //  width: 80,
              views:[view.all,view.ship,view.deliver,view.book,view.close],
            },
            {
              Header: "Aq Showroom",
              id: "aq_showroom_arrival_date",
              accessor: d => parseInt(d.aq_showroom_arrival_date),
              Cell: row => <span>{row.value && row.value!='0'? moment(row.value).format('DD-MMM-YY'):''}</span>,

              filterMethod: (filter, rows) =>
                          matchSorter(rows, filter.value, { keys: ["aq_showroom_arrival_date"] }),
              filterAll: true,
            //  width: 80,
              views:[view.all,view.ship,view.deliver,view.book,view.close],
            },

            {
              Header: "Closed",
              accessor: "closed",
              filterMethod: (filter, rows) =>
                          matchSorter(rows, filter.value, { keys: ["closed"] }),
              filterAll: true,
              views:[view.all,view.payment,view.close],
            },


          ]
        },
      ] }

      renderEditable(cellInfo) {
        return (
          <div
            style={{ backgroundColor: "lightblue" }}
            contentEditable
            //suppressContentEditableWarning
            onBlur={e => {

              var rowold = this.state.data[cellInfo.index];
              const data = [...this.state.data];
              data[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
                  this.setState({ data });
              var row = this.state.data[cellInfo.index]
              this.state.data[cellInfo.index].mod = true
              this.setState({ modified: cellInfo.index})
              console.log('cellInfo.column.id:',cellInfo.column.id)
              console.log('this.state.columns[cellInfo.index]:',
              this.state.columns[cellInfo.index].accessor);

              if(this.state.columns[cellInfo.index])
              this.state.columns[cellInfo.index].style
               =          { backgroundColor: "lightblue" }
              console.log("mutate table ",
                cellInfo.index, " row-old:", rowold,
                "\nrow[cellInfo.column.id]:",
                row[this.state.columns[cellInfo.index].accessor])
              this.setState({ newVal: row[cellInfo.column.id]})
            }}
            dangerouslySetInnerHTML={{
              __html: this.state.data[cellInfo.index][cellInfo.column.id]
            }}
          />
        );
      }

      getRow(key) {
        console.log('getRow key:',key)
        // find the row in this.state.data
        var index = this.state.data.findIndex(x=> x._id === key);
        const row = this.state.data[index]
        console.log('getRow: row',row)
        return row;
      }

    setRow( poInfo) {
      /*
      const key = poInfo._id;
      console.log('=> setRow ', key, poInfo)
      var index = this.state.data.findIndex(x=> x._id === key);
      if (index === -1)
        // handle error
        {  console.log(" cannot find po!")}
      else {
        console.log("update data values")
        this.setState({
          data: [
             ...this.state.data.slice(0,index),
             Object.assign({}, this.state.data[index], poInfo),
             ...this.state.data.slice(index+1)
          ]
        });
      }
      */
    }

    handleCancel(rowInfo) {
      console.log("handleCancel rowInfo:", rowInfo)
      if (rowInfo && rowInfo.row) {
        this.setState({
          showCancel: !this.state.showCancel,
          currentRow: rowInfo.row,
          rowIndex: rowInfo.index,
          currentKey: rowInfo.row._id
        });
      } else {
        this.setState({
          showCancel: !this.state.showCancel,
        });
      }
    }
    handlePurchase (rowInfo ) {
      //const { history } = this.props

      console.log("handlePurchase rowInfo:", rowInfo)
      if (rowInfo && rowInfo.row) {
      console.log("PO#", rowInfo.row.po_no)
      console.log("row index", rowInfo.index)
        console.log("row _id", rowInfo.original._id)
      //console.log("vendorPurchaseUrl", vendorPurchaseUrl())
      this.setState({
        showPurchase: !this.state.showPurchase,
        currentRow: rowInfo.row,
        rowIndex: rowInfo.index,
        currentKey: rowInfo.row._id
      });
    } else {
      this.setState({
        showPurchase: !this.state.showPurchase,
      });
    }



      // history.push({
      //   pathname: vendorPurchaseUrl(),
      //   state: {
      //     po_no: rowInfo.row.po_no,
      //     title: rowInfo.row.title,
      //     link: rowInfo.row.link.props.href,
      //     options: rowInfo.row.options,
      //     po_qty: rowInfo.row.po_qty,
      //     total_purchased_qty: rowInfo.row.total_purchased_qty,
      //     price: rowInfo.row.price,
      //     sale_price: rowInfo.row.sale_price,
      //     first_payment: rowInfo.row.first_payment,
      //     destination: rowInfo.row.destination,
      //     username: rowInfo.row.username,
      //     total_amount: rowInfo.row.total_amount,
      //   }
      // });
    }

    handleTracking (rowInfo ) {
    //const { history } = this.props

    console.log("handleTracking rowInfo:", rowInfo)
    if (rowInfo && rowInfo.row) {
    console.log("PO#", rowInfo.row.po_no)
    console.log("row index", rowInfo.index)
      console.log("row _id", rowInfo.original._id)
    //console.log("vendorPurchaseUrl", vendorPurchaseUrl())
    this.setState({
      showTracking: !this.state.showTracking,
      currentRow: rowInfo.row,
      rowIndex: rowInfo.index,
      currentKey: rowInfo.row._id
    });
  } else {
    this.setState({
      showTracking: !this.state.showTracking,
    });
  }

  }


    registerPurchase (purchase_id,rowIndex) {
      console.log("=> in registerPurchase props\n",this.props)
          console.log("=> in registerPurchase purchase_id:",
          purchase_id, " rowIndex:",rowIndex )
          console.log("call refetch")
    //      this.props.orderDetailsData.refetch()
          // newData = this.state.data
          // newData[rowIndex].purchase_id = purchase_id
          // this.setState({refreshData: !this.state.refreshData,
          // data: []})

    }

    registerTracking (ship_id,rowIndex) {
      console.log("=> in registerTracking props\n",this.props)
      console.log("=> in registerTracking state\n",this.state)
          console.log("=> in registerTracking ship_id:",
          ship_id, " rowIndex:",rowIndex )
          //
          // if (this.props&& this.props.orderDetailsData && this.props.orderDetailsData.refetch)  {
          //     console.log("call refetch")
          //   this.props.orderDetailsData.refetch()
          // }
          // newData = this.state.data
          // newData[rowIndex].purchase_id = purchase_id
          // this.setState({refreshData: !this.state.refreshData,
          // data: []})
          // this.setState({refreshData: true,
          //   data: []})

    }

    handleRowChange = row => event => {
        if (event.target.value !== 0) {
          this.setState({
            row: event.target.value,

          });
          //console.log(this.state.data);
        }
    };


  handleRowClick() {
    console.log("=>handleRowClick")
    rowSize = parseInt(this.state.row);

    //console.log(parseInt(rowSize)); console.log(typeof rowSize);
  }

  changeFilter() {
    this.setState({
      filter: !this.state.filter,
    })
  }

    toggleColumnChooser = (index,chooserColumns) => {
    //   console.log('=> columnChooser:',index)
    console.log("toggleColumnChooser: index",index)
  //  console.log("toggleColumnChooser: checked",checked)
    console.log(" toggleColumnChooserchooserColumns:",chooserColumns)
      this.setState(
        prevState => {
          const columns1 = [];
          columns1.push(...this.state.columns);
          console.log(columns1);
          // hide all columns first_payment
          columns1.forEach(h=> {
            //  h.show=false;
            h.columns.forEach(c=> {
              c.show=false
            })
          })
          chooserColumns[index].show = !chooserColumns[index].show;
          for (var i=1; i< chooserColumns.length;i++) {

           columns1[i-1].show = chooserColumns[i].show;
           if (columns1[i-1].columns) {
            // set all columns under this header
            columns1[i-1].columns.forEach(item => {
              // do not hide columns due to overlaps (we already hid all columns)
              if (chooserColumns[i].show)   item.show = true; // only set to true
            })
           }
          }

          return {
            columns: columns1,
          };
        }, () => {
          console.log(this.state.columns)
        }
      );
    };

    toggleViewChooser = (index) => {
    console.log("=> toggleViewChooser:", index);
    if (!index) index  = 0
    this.setState(
      prevState => {
        const columns1 = [];
        const views1 = [];
        columns1.push(...this.state.columns);
        views1.push(...this.state.views);
        console.log(columns1);
        views1.forEach(view => {
          if (views1[index].show != view.show) view.show = false;
        });
        views1[index].show = true;
        columns1.forEach(item => {
          if (item && item.columns) {
            item.show = false; // hide main header (will show if any of its columns is needed at least once)
            item.columns.forEach(col => {
            //  console.log('show view ', views1[index].view, ' for column:',col.Header, " which views:", col.views)
              if ( col.views.includes(views1[index].view)) {
                //console.log('show ',col) ;
                item.show = true; // show main header (needed once)
                col.show = true;
              }
              else {
                //console.log('hide ',col) ;
               col.show = false};
            });
          }
        });
        return {
          columns: columns1,
          views: views1
        };
      },
      () => {   console.log(this.state.columns);
      }
    );
  };

  componentDidUpdate(prevProps) {
    console.log("order-details componentDidUpdate \nprevProps\n:",prevProps)
      console.log("order-details componentDidUpdate \state\n:",this.state)
    console.log('state stage:',this.state.stage)
    // Typical usage (don't forget to compare props):
    if (this.state.stage !== prevProps.stage || this.state.stage =='' ) {
      const {stage} = prevProps
      console.log('set stage:',stage)
      this.setState({
          stage,}

            );
      var idx = stages.indexOf(stages.find(i=> (i.name== stage) ));
      console.log('stage index:',idx)
      this.toggleViewChooser( stages[idx].view)

     }
     // else if (prevProps&&prevProps.orderDetailsData&&
     //            !prevProps.orderDetailsData.loading &&
     //            !prevProps.orderDetailsData.error) {
     //    this.setState({data:
     //      prevProps.orderDetailsData.getOrderDetails
     //      })
     //    }

  }

// render component
render() {
  const { toggleSelection, toggleAll, isSelected } = this;
  const {  selectAll } = this.state;

    const { orderDetailsData, classes, stage, ...otherProps } = this.props

  //  this.state.stage = stage;
  console.log("--->>>>> Render order-details -> \nnew stage\n: ", stage)
    const { loading, error, getOrderDetails ,variables  } = orderDetailsData;
    const recordCount = getOrderDetails? getOrderDetails.length:0;
    const columnDefaults = { ...ReactTableDefaults.column, headerClassName: 'wordwrap' }


    console.log('in render getOrderDetails:\n',getOrderDetails)

    console.log('variables:',variables)
    console.log('order-details props:',this.props)
    console.log('order-details state:',this.state)
  // if (loading) {
  //    <Loading />;
  // }
  if (error) {
    return <p>{error.message}</p>;
  }
  if (!getOrderDetails) return <p>Search for orders</p>

  if (!variables.poNo &&

  !variables.status &&
  !variables.orderNo &&
  !variables.trackingNo &&
  !variables.awbNo &&
  !variables.username &&
  !variables.stage &&
  !this.state.stage &&
  !variables.search) return <p> Enter search criteria </p>
 // set default view based on curret Stage
 //console.log("view[stage] for stage:",stage," is:",view[stage])
//  this.toggleViewChooser(view[stage]? view[stage]:view.purchase)

//toggleViewChooser( stages[stages.indexOf(stages.find(i=> (i.name== stage) ))].view[0])

    const checkboxProps = {
      selectAll,
      isSelected,
      toggleSelection,
      toggleAll,
      selectType: "checkbox",
      getTrProps: (s, r) => {
        // someone asked for an example of a background color change
        // here it is...
        const selected = r && this.isSelected(r.original._id);
        return {
          style: {
            backgroundColor: selected ? "lightgreen" : "inherit"
            // color: selected ? 'white' : 'inherit',
          }
        };
      }
    };

  return (
        <div className="data">
         {loading?
           <Loading />:
           <div className="statusline">
           <a>Found {recordCount<200? recordCount:'at least '+recordCount} records</a>
           </div>
         }
          <SelectTable { ...otherProps}
           ref={(r) => this.selectTable = r}
            data={this.state.data}
            column={columnDefaults}
            columns={this.state.columns}
            views={this.state.views}

            filterable
            defaultFilterMethod={(filter, row) =>
            String(rows[filter.id]) === filter.value}

          //  pivotBy= {['tracking_no']}

            //pivotBy={['po_no','po_date','status','closed','username','total_amount','address', 'phone_no', 'po_no' ]}
            defaultPageSize={10}

          onColumnUpdate={this.toggleColumnChooser}
          onViewUpdate={this.toggleViewChooser}

          showPageSizeOptions={true}

          showPaginationBottom={true}
          PaginationComponent={CustomPagination}
          filterable={this.state.filter}

          changeFilter={this.changeFilter}
          style={{
            //backgroundColor:'pink',
            //backgroundImage:'url(image)',
            padding: "2px 1px",
            fontFamily: "serif",
            height: "400px" // This will force the table body to overflow and scroll, since there is not enough room
          }}
          getTheadGroupProps={(state, rowInfo, column, rtInstance) => {
            return {
              style: {
                backgroundColor: '#B3E5FC'

                // height:'20px'
              }
            }
          }
        }
          className="-striped -highlight"
          {...checkboxProps}

          // getTdProps={(state, rowInfo, column, instance) => {
          //   return {
          //
          //     onClick: (e, handleOriginal) => {
          //      // console.log("A Td Element was clicked!");
          //       //console.log("it produced this event:", e);
          //       //console.log("It was in this column:", column);
          //       //console.log("It was in this row:", rowInfo);
          //     //  console.log("It was in this table instance:", instance);
          //       console.log('VALUE==>', rowInfo.row[column.id])
          //       console.log("oldVal:",this.state.oldVal)
          //       console.log("newVal:", this.state.newVal)
          //       console.log("modified:", this.state.modified)
          //
          //         this.setState({ oldVal: rowInfo.row[column.id] })
          //
          //       // IMPORTANT! React-Table uses onClick internally to trigger
          //       // events like expanding SubComponents and pivots.
          //       // By default a custom 'onClick' handler will override this functionality.
          //       // If you want to fire the original onClick handler, call the
          //       // 'handleOriginal' function.
          //       if (handleOriginal || true) {
          //         handleOriginal();
          //       }
          //     }
          //   };
          // }}
          />
          {this.state.showPurchase ?
          <VendorPurchaseFormWithMutation
             closePopup={this.handlePurchase}
             registerPurchase={this.registerPurchase}
             poInfo={this.state.data[this.state.rowIndex]}
             selection={this.state.selection}
             rowIndex={this.state.rowIndex}
             currentKey={this.state.currentKey}
             getRow={this.getRow}
             setRow={this.setRow}
             variables={variables}

         />
         : null
        }
        {this.state.showTracking ?
        <VendorTrackingFormWithMutation
           closePopup={this.handleTracking}
           registerTracking={this.registerTracking}
           poInfo={this.state.data[this.state.rowIndex]}
           selection={this.state.selection}
           rowIndex={this.state.rowIndex}
           currentKey={this.state.currentKey}
           getRow={this.getRow}
           setRow={this.setRow}
           variables={variables}
       />
       : null
      }
      {this.state.showCancel ?
      <OrderCancelFormWithMutation
         closePopup={this.handleCancel}
         registerCancel={this.registerCancel}
         poInfo={this.state.data[this.state.rowIndex]}
         selection={this.state.selection}
         rowIndex={this.state.rowIndex}
         currentKey={this.state.currentKey}
         getRow={this.getRow}
         setRow={this.setRow}
         variables={variables}

     />
     : null
    }
        </div>
      );
  }
  };

OrderDetails.propTypes = {
  // classes: PropTypes.object.isRequired,
  //vendorPurchaseUrl:PropTypes.func.isRequired,
  orderDetailsData: PropTypes.shape({
    error: PropTypes.object,
    loading: PropTypes.bool.isRequired,
    orderDetailsData: PropTypes.arrayOf(propType(orderDetailsFragment)),
    refetch: PropTypes.func.isRequired,
  }).isRequired,
};


OrderDetails.defaultProps = {
    poNo: '',
    search: '',
    orderNo:'',
    trackingNo:'',
    awbNo:'',
    username:'',
    search: '',
    stage: 'purchase',
};


const withData = graphql(orderDetailsQuery,
  {
  name: 'orderDetailsData',
  // options are props passed from order-details-page
  options: ({ orderDetailsSearch,stage }) => ({
     fetchPolicy: 'cache-and-network',
    variables: {
      poNo: (orderDetailsSearch && orderDetailsSearch.poNo),
      status: (orderDetailsSearch && orderDetailsSearch.status),
      orderNo: (orderDetailsSearch && orderDetailsSearch.orderNo),
      trackingNo: (orderDetailsSearch && orderDetailsSearch.trackingNo),
      awbNo: (orderDetailsSearch && orderDetailsSearch.awbNo),
      username: (orderDetailsSearch && orderDetailsSearch.username),
      search: (orderDetailsSearch && orderDetailsSearch.search),
      searchField: (orderDetailsSearch && orderDetailsSearch.searchField),
      stage: (stage && stage != ''? stage:"purchase"),
    },
    pollInterval: 1000*60*3
  }),
});

const OrderDetailsWithData = withData(OrderDetails);
export default withStyles(styles)(OrderDetailsWithData)

// const OrderDetailsComp = withStyles(styles)(OrderDetails)
// export default withData(OrderDetailsComp);

//export default withTracker(withData(OrderDetails));
// const OrderDetailsData = compose(
//   connect(...), // some Redux
//   graphql(...), // some GraphQL
//   withTracker(...), // some Tracker data
// )(Foo);
//cancel svg
// <path xmlns="http://www.w3.org/2000/svg" d="M512 0c-282.77 0-512 229.23-512 512s229.23 512 512 512 512-229.23 512-512-229.23-512-512-512zM512 928c-229.75 0-416-186.25-416-416s186.25-416 416-416 416 186.25 416 416-186.25 416-416 416z"/>
// <path xmlns="http://www.w3.org/2000/svg" d="M685.333 234.667l-173.333 173.333-173.333-173.333-104 104 173.333 173.333-173.333 173.333 104 104 173.333-173.333 173.333 173.333 104-104-173.333-173.333 173.333-173.333z"/>
