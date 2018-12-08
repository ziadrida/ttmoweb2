import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { propType } from 'graphql-anywhere';
import orderDetailsFragment from '/app/ui/apollo-client/order-details/fragment/order-details';
import orderDetailsQuery from '/app/ui/apollo-client/order-details/query/order-details';


import Loading from '/app/ui/components/dumb/loading';
import moment from 'moment'
import CustomPagination from './custom-pagination'
import matchSorter from 'match-sorter'
import {view, stages, detailViews } from './helpers';
  // Import React Table
  import ReactTable,{ReactTableDefaults} from "react-table";
import VendorPurchaseFormWithMutation from '/app/ui/components/smart/vendor-purchase/vendor-purchase-form';



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

  });


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
  // sale_price: 36
  // sales_person: "IS"
  // seller: null
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
        console.log('=> in OrderDetails component props', this.props)
        this.state = {
          showPurchase:false,
          currentRow: null,
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
      }


       escFunction(event, sender) {
         if (event.keyCode === 27) {
           console.log('sender:', sender)
          console.log("Escape!:",event)
          console.log("Escape oldValue:",this.state.oldVal)
           console.log("Escape newValue:", this.state.newVal)
         }
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
      configColumns = () => { return  [{
        Header: "Order Information",
        id: "oderInfo",
        show:true,
        columns: [
          {
            Header: "PO No",
            accessor: "po_no",
            filterMethod: (filter, rows) =>
              matchSorter(rows, filter.value, {
                keys: ["po_no"]
              }),
            filterAll: true,
            maxWidth: 120,
            views:[view.all,view.order,view.purchase,view.track,view.arrive,view.pack,view.ship,view.deliver,view.close]

          },
          {
            id: 'po_date',
            Header: "PO Date",
            accessor: d => d.po_date? moment(d.po_date, 'YYYY-MM-DD').format('DD/MM/YYYY'):"",
            filterMethod: (filter, rows) =>
              matchSorter(rows, filter.value, {
                keys: ["po_date"]
              }),
            filterAll: true,
            maxWidth: 100,

            views:[view.all,view.order,view.purchase,view.track,view.arrive,view.pack,view.ship,view.deliver,view.close],
          },
          {

            Header: "Status",
            accessor: "status",
            filterMethod: (filter, rows) =>
                        matchSorter(rows, filter.value, { keys: ["status"] }),
            filterAll: true,
            views:[view.all,view.deliver,view.close],
          },
          {

            Header: "Closed",
            accessor: "closed",
            filterMethod: (filter, rows) =>
                        matchSorter(rows, filter.value, { keys: ["closed"] }),
            filterAll: true,
            views:[view.all,view.close],
          },
          {
            id: 'username',
            Header: "Username",
            accessor: d => d.username,
            filterMethod: (filter, rows) =>
                        matchSorter(rows, filter.value, { keys: ["username"] }),
            filterAll: true,
            views:[view.all,view.order,view.purchase,view.deliver,view.close],
          },
          {
            Header: "T Amount",
            accessor: "total_amount" ,
            Cell: ({ value }) => (value >= 9999 ? 0 : value),
            filterMethod: (filter, rows) =>
                      row[filter.id] >= filter.value,
            filterAll: true,
            //width: 50,
            views:[view.all,view.order,view.deliver,view.close],
          },
        ]
        },

        {
            Header: "Customer Info",
            id: "custInfo",
              show:true,
            columns: [
            {
              Header: "Address",
              accessor: "address",
              filterMethod: (filter, rows) =>
                          matchSorter(rows, filter.value, { keys: ["address"] }),
              filterAll: true,
              views:[view.all,view.order,view.deliver,view.close],
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
              views:[view.all,view.order,view.deliver,view.close],
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
              filterMethod: (filter, rows) =>
                row[filter.id] >= filter.value,
              filterAll: true,
              style: {
                textAlign: 'right'
              },
              views: [view.all, view.order, view.ship, view.deliver, view.close],
            },
            {
              id: "first_payment",
              Header: "Init Pymnt",
              accessor: d => d.first_payment,
              filterMethod: (filter, rows) =>
                row[filter.id] >= filter.value,
              filterAll: true,
              views: [view.all, view.order, view.deliver, view.close],
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
              views:[view.all,view.order,view.purchase,view.arrive,view.pack,view.ship,view.deliver,view.close],
              //maxWidth: 200
            },
            {
              Header: "Title",
              accessor: "title",
              filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, {
                  keys: ["title"]
                }),
              filterAll: true,
              views:[view.all,view.order,view.purchase,view.track,view.arrive,view.pack,view.ship,view.deliver,view.close],
              //maxWidth: 200
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
                'overflow-y':'scroll',
                maxWidth:'440px',
                'height':'2.5em'
               },

              minWidth: 300,
              views:[view.all,view.order,view.purchase,view.track,view.arrive,view.pack,view.ship,view.deliver,view.close],
            },
            {
              Header: "Options",
              accessor: "options",
              filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, {
                  keys: ["options"]
                }),
              filterAll: true,
              views:[view.all,view.order,view.purchase,view.deliver],
              //maxWidth: 200
            },
            {
              Header: "Order Notes",
              accessor: "order_notes",
              filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, {
                  keys: ["order_notes"]
                }),
              filterAll: true,
              views:[view.all,view.order,view.purchase,view.deliver],
              //maxWidth: 200
            },

            {
              id: "source",
              Header: "Source",
              accessor: d => d.source,
              filterMethod: (filter, rows) =>
                          matchSorter(rows, filter.value, { keys: ["source"] }),
              filterAll: true,
              views:[view.all,view.order,view.purchase,view.track,view.arrive,],
            },
             {
              id: "price",
              Header: "Price ($)",
              accessor: d => d.price.toFixed(1),
              filterMethod: (filter, rows) =>
                        row[filter.id] >= filter.value,
              filterAll: true,
              style: {
                textAlign: 'right'
              },
              views:[view.all,view.order,view.purchase,view.pack,view.ship,view.deliver,view.close],
            },

            {
              id: "destination",
              Header: "Dest",
              accessor: d => d.destination,
              filterMethod: (filter, rows) =>
                          matchSorter(rows, filter.value, { keys: ["destination"] }),
              filterAll: true,
              views:[view.all,view.order,view.purchase,view.pack,view.ship,view.deliver,view.close],
            },
            {
            Header: "PO Qty",
            accessor: "po_qty" ,
            Cell: ({ value }) => (value >= 9999 ? 0 : value),
            filterMethod: (filter, rows) =>
                      row[filter.id] >= filter.value,
            filterAll: true,
            style: {
              textAlign: 'right'
            },
            //width: 50,
            views:[view.all,view.order,view.purchase,view.track,view.pack,view.ship,view.deliver,view.close],
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
                views:[99],
              },
              {
                Header: "T Purch Qty",
                accessor: "total_purchased_qty",
                filterMethod: (filter, rows) =>
                          row[filter.id] >= filter.value,
                filterAll: true,
                style: {
                  textAlign: 'right'
                },
                //width: 35,
                views:[view.all,view.purchase,view.track],

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
              views:[view.all,view.purchase,view.track,view.arrive,],
              width:200,
            },



            {
              id: 'order_date',
              Header: "Order Date",

              accessor: d => d.order_date? moment(d.order_date, 'DD/MM/YYYY').format('MM/DD/YYYY'):"",
            //  Cell: this.renderEditable,
              filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, {
                  keys: ["order_date"]
                }),
              filterAll: true,
              width: 100,
            //  width:(d) => getColumnWidth(this.state.data, d.order, "Order No."),
              views:[view.all,view.purchase,view.track,],
            },
            {
              Header: "Order Qty",

              accessor: "purchased_qty",
            //  Cell: this.renderEditable,
              filterMethod: (filter, rows) =>
                        row[filter.id] >= filter.value,
              filterAll: true,
              style: {
                textAlign: 'right'
              },
            //  width: 35,
              views:[view.all,view.purchase,view.track],

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
                textAlign: 'right'
              },
              //width: 35,
              views:[view.all,view.purchase,view.track],

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
                textAlign: 'right'
              },
              //width: 35,
              views:[view.all,view.purchase,view.track],

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
              filterMethod: (filter, rows) =>
                          matchSorter(rows, filter.value, { keys: ["tracking_no"] }),
              filterAll: true,
              views:[view.all,view.track,view.arrive,view.pack,view.ship],
              width:180,
            },
            {
              id: 'ship_date',
              Header: "Packg Ship Date",
              accessor: d => d.ship_date? moment(d.ship_date, 'DD/MM/YYYY').format('DD/MM/YYYY'):"",
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
              filterMethod: (filter, rows) =>
                        row[filter.id] >= filter.value,
              filterAll: true,
              style: {
                textAlign: 'right'
              },
              //width: 35,
              views:[view.all,view.track,view.arrive,view.pack,view.ship,view.deliver,view.close],

            },
            {
              Header: "T Ship Qty",
              accessor: "total_order_shipped_qty",
              filterMethod: (filter, rows) =>
                        row[filter.id] >= filter.value,
              filterAll: true,
              style: {
                textAlign: 'right'
              },
            //  width: 35,
              views:[view.all,view.track,view.arrive,view.pack,view.ship,view.deliver,view.close],

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
                    add(d.time_in_transit_to,'day').format('DD/MM')
                },
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
              accessor: "box_id",
              filterMethod: (filter, rows) =>
                          matchSorter(rows, filter.value, { keys: ["box_id"] }),
              filterAll: true,
              //width:40,
              views:[view.all,view.arrive,view.pack,view.ship],
            },
            {
              Header: "Final Box Id",
              accessor: "final_box_id",
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
              views:[view.all,view.ship,view.deliver,view.close],
              width: 100,
            },
            {
              Header: "Shipment Ref",
              accessor: "shipment_ref",
              filterMethod: (filter, rows) =>
                          matchSorter(rows, filter.value, { keys: ["shipment_ref"] }),
              filterAll: true,
              views:[view.all,view.ship,view.deliver,view.close],
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
              views:[view.all,view.ship,view.deliver,view.close],
            },
            {
              Header: "Delivery Date",
              accessor: "customer_delivery_date",
              filterMethod: (filter, rows) =>
                          matchSorter(rows, filter.value, { keys: ["customer_delivery_date"] }),
              filterAll: true,
            //  width: 80,
              views:[view.all,view.ship,view.deliver,view.close],
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
      handlePurchase (rowInfo ) {
      const {vendorPurchaseUrl, history } = this.props

      console.log("handlePurchase rowInfo:", rowInfo)
      if (rowInfo && rowInfo.row) {
      console.log("PO#", rowInfo.row.po_no)
      console.log("row index", rowInfo.index)
      console.log("vendorPurchaseUrl", vendorPurchaseUrl())
      this.setState({
        showPurchase: !this.state.showPurchase,
        currentRow: rowInfo.row
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
      handleRowChange = row => event => {
        if (event.target.value !== 0) {
          this.setState({
            row: event.target.value,

          });
          //console.log(this.state.data);
        }
      };


  handleRowClick() {
    rowSize = parseInt(this.state.row);

    //console.log(parseInt(rowSize)); console.log(typeof rowSize);
  }
  changeFilter() {
    this.setState({
      filter: !this.state.filter,
    })
  }

    toggleColumnChooser = (index) => {
    //   console.log('=> columnChooser:',index)
      this.setState(
        prevState => {
          const columns1 = [];
          columns1.push(...this.state.columns);
          console.log(columns1);
          columns1[index].show = !columns1[index].show;
          if (columns1[index].columns) {
            columns1[index].columns.forEach(item => {
              item.show = !item.show
            })
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
              console.log('show view ', views1[index].view, ' for column:',col.Header, " which views:", col.views)
              if ( col.views.includes(views1[index].view)) {
                console.log('show ',col) ;
                item.show = true; // show main header (needed once)
                col.show = true;
              }
              else {
                console.log('hide ',col) ;
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
    console.log('state stage:',this.state.stage)
    // Typical usage (don't forget to compare props):
    if (this.state.stage !== prevProps.stage || this.state.stage =='') {
      const {stage} = prevProps
      console.log('set stage:',stage)
      this.setState({stage});
      var idx = stages.indexOf(stages.find(i=> (i.name== stage) ));
      console.log('stage index:',idx)
      this.toggleViewChooser( stages[idx].view)

    }
  }
  // static getDerivedStateFromProps(props,state) {
  //   console.log("order-details getDerivedStateFromProps \nprops\n:",props,
  //       "\nstate:\n",state)
  //   if(props.stage != this.state.stage) {
  //      const {stage } = props
  //      console.log('set new stage state')
  //     this.setState({stage: stage});
  //   }
  // }
// render component
render() {
    const { orderDetailsData, classes, stage, ...otherProps } = this.props

  //  this.state.stage = stage;
  console.log("--->>>>> Render order-details -> \nnew stage\n: ",stage,"\ndata size:\n",
  this.state.date? this.state.date.length:"null!!!")
    const { loading, error, getOrderDetails ,variables  } = orderDetailsData;
    const columnDefaults = { ...ReactTableDefaults.column, headerClassName: 'wordwrap' }


    console.log('getOrderDetails:',getOrderDetails)
     getOrderDetails

    console.log('variables:',variables)


  if (loading) {
    return <Loading />;
  }
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


  return (
        <div className="data">
          <ReactTable { ...otherProps}
            data={getOrderDetails}
            column={columnDefaults}
            columns={this.state.columns}
            views={this.state.views}

            filterable
            defaultFilterMethod={(filter, row) =>
            String(row[filter.id]) === filter.value}

            //pivotBy= {['po_no']}
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
          /> // ReactTable
          {this.state.showPurchase ?
          <VendorPurchaseFormWithMutation
             closePopup={this.handlePurchase}
             poInfo={this.state.currentRow?this.state.currentRow:{}}
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

         />
         : null
        }
        </div>
      );
  }
  };



OrderDetails.propTypes = {
//    classes: PropTypes.object.isRequired,
  vendorPurchaseUrl:PropTypes.func.isRequired,
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


const withData = graphql(orderDetailsQuery, {
  name: 'orderDetailsData',
  // options are props passed from order-details-page
  options: ({ orderDetailsSearch,stage }) => ({
    variables: {
      poNo: (orderDetailsSearch && orderDetailsSearch.poNo),
      status: (orderDetailsSearch && orderDetailsSearch.status),
      orderNo: (orderDetailsSearch && orderDetailsSearch.orderNo),
      trackingNo: (orderDetailsSearch && orderDetailsSearch.trackingNo),
      awbNo: (orderDetailsSearch && orderDetailsSearch.awbNo),
      username: (orderDetailsSearch && orderDetailsSearch.username),
      search: (orderDetailsSearch && orderDetailsSearch.search),
      stage: (stage && stage != ''? stage:"purchase"),
    },
  }),
});
//export default withData(withStyles(styles)(OrderDetails));
export default withData(OrderDetails);
