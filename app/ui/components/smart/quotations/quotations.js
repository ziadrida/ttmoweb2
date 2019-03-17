import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { propType } from 'graphql-anywhere';
import quotationFragment from '/app/ui/apollo-client/quotation/fragment/quotation';
import quotationsQuery from '/app/ui/apollo-client/quotation/query/quotations';
import QuoteWithMutation from '/app/ui/components/smart/quotations/quote-form';

import gql from 'graphql-tag';
import Loading from '/app/ui/components/dumb/loading';

import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import matchSorter from 'match-sorter'
import moment from 'moment';

  // Import React Table
  import ReactTable from "react-table";
  //import "react-table/react-table.css";

import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';



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


  //************************************************************


    class Quotations extends React.Component {
        constructor(props) {
          super(props);
          console.log('=> in OrderDetails constructor component props', this.props)
          this.state = {
            selection: [],
            selectRows:[],
            selectAll: false,
            showPurchase:false,
            showTracking:false,
            showQuote: false,
            refreshData: false,
            currentRow: {},
            currentKey: "",
            rowIndex:-1,
            data: [],
            columns: [],

            filter: true,
            modified: null,
            origVal: null,
            newVal: null,
          }
          this.handleQuote = this.handleQuote.bind(this);
      //    this.nvl = this.nvl.bind(this);
        }

    handleQuote(rowInfo) {
      console.log("handleQuote rowInfo:", rowInfo)
      if (rowInfo && rowInfo.row) {
        this.setState({
          showQuote: !this.state.showQuote,
          currentRow: rowInfo.row,
          rowIndex: rowInfo.index,
          currentKey: rowInfo.row.quote_no
        });
      } else {
        this.setState({
          showQuote: !this.state.showQuote,
        });
      }
    }

    componentDidUpdate(prevProps) {
      console.log("Quotations componentDidUpdate \nprevProps\n:",prevProps)
    }

    static getDerivedStateFromProps(props, state) {
             console.log("Quotations getDerivedStateFromProps \nprops",props,
             "\nstate",state)
             return null;
    }

    escFunction(event, sender) {
         if (event.keyCode === 27) {
           console.log('sender:', sender)
          console.log("Escape!:",event)
          console.log("Escape oldValue:",this.state.oldVal)
           console.log("Escape newValue:", this.state.newVal)
       }
    }

    nvl = (val1, val2) => ( val1 != undefined&& val1 !=null  ? val1:val2)

    getRow(key) {
      console.log('<quotations> getRow key:',key)
      // find the row in getQuotation
      const {quotationsData} = this.props
      const {getQuotation} = quotationsData
      var index = getQuotation.findIndex(x=> x.quote_no === key);
      const row = getQuotation[index]
      console.log('<quotations>  getRow: row',row)
      return row;
    }

    render() {
    console.log('=> in Quotations component props',this.props)
    console.log('=> in Quotations component state',this.state)

  const { quotationsData, classes } = this.props

  const { loading, error, getQuotation ,variables  } = quotationsData;
 console.log('quotations loading:',loading)
  if (!getQuotation) return <p>Search for quotation</p>
  const recordCount = getQuotation? getQuotation.length:0;
  console.log('variables:',variables)


  const columns = [{
      Header: "Quote No",
      accessor: "quote_no",
      filterMethod: (filter, rows) =>
                  matchSorter(rows, filter.value, { keys: ["quote_no"] }),
      filterAll: true,
      maxWidth: 200
    },
    {
            id: "do_quote",
            Header: "",
            accessor: d => d.quote_no,
          //  Cell: this.renderEditable,
          Cell: (row) => (
            <div>

            <svg  onClick={() => this.handleQuote(row)} color='gray' width="24" height="24"
              viewBox="0 0 24 24">
  <path xmlns="http://www.w3.org/2000/svg" d="M21.886 14.303c-1.259-2.181-0.502-4.976 1.691-6.246l-2.358-4.085c-0.674 0.395-1.457 0.622-2.293 0.622-2.52 0-4.563-2.057-4.563-4.594h-4.717c0.006 0.783-0.189 1.577-0.608 2.303-1.259 2.181-4.058 2.923-6.255 1.658l-2.358 4.085c0.679 0.386 1.267 0.951 1.685 1.675 1.257 2.178 0.504 4.967-1.681 6.24l2.358 4.085c0.671-0.391 1.451-0.615 2.283-0.615 2.512 0 4.55 2.044 4.563 4.569h4.717c-0.002-0.775 0.194-1.56 0.609-2.279 1.257-2.177 4.049-2.92 6.244-1.664l2.358-4.085c-0.675-0.386-1.258-0.949-1.674-1.669zM12 16.859c-2.684 0-4.859-2.176-4.859-4.859s2.176-4.859 4.859-4.859c2.684 0 4.859 2.176 4.859 4.859s-2.176 4.859-4.859 4.859z"/>
            </svg>

              </div>
            ),
              filterable:false,
            width:32,

    },
    {
      id: 'quote_date',
      Header: "Date",
      accessor: d => (d.quotation.quote_date? d.quotation.quote_date:d.date_created),
        Cell: row => <span style={{ align: 'center'}}>
            {row.value? moment(parseInt(row.value)).format('DD-MMM-YYYY HH:mm:ss'):null}
            </span>,
        getProps:  (state, rowInfo) => ({
             style: {
                 backgroundColor: (rowInfo && rowInfo.row &&
                    moment(parseInt(rowInfo.row.value))>moment().add(-0.1,'day') ? 'green' : null),

                    textAlign: 'center'

             }
            }),
      filterMethod: (filter, rows) =>
                  matchSorter(rows, filter.value, { keys: ["quote_date"] }),
      filterAll: true,
      width: 200,
    },
    {
      id: "sales_person",
      Header: "Sales Person",
      accessor: d => d.sales_person,
      filterMethod: (filter, rows) =>
                  matchSorter(rows, filter.value, { keys: ["sales_person"] }),
      filterAll: true,
    },
    {
      id: 'senderId',
      Header: "User ID",
      accessor: d => d.senderId,
      filterMethod: (filter, rows) =>
                  matchSorter(rows, filter.value, { keys: ["senderId"] }),
      filterAll: true,
      width:150,
    },
    {
      id: 'username',
      Header: "Username",
      accessor: d => d.quotation.username? d.quotation.username:d.quotation.item.username?d.quotation.item.username:'',
      filterMethod: (filter, rows) =>
                  matchSorter(rows, filter.value, { keys: ["username"] }),
      filterAll: true,
    },

    {
      id: 'po_no',
      Header: "PO#",
      accessor: d =>
              d.quotation.po_no?d.quotation.po_no:'',
        filterAll: false,
        filterMethod: (filter, row) => {
                      //console.log(filter)
                      //console.log(row)
                      if (filter.value === "all") {

                        return true;
                      }
                      if (filter.value === "PO") {
                        return row[filter.id].includes('T') ;
                      }

                    },
            Filter: ({ filter, onChange }) =>
                      <select
                        onChange={event => onChange(event.target.value)}
                        style={{ width: "100%" }}
                        value={filter ? filter.value : "all"}
                      >
                        <option value="all">Show All</option>
                        <option value="PO">PO Created</option>

                      </select>
      },
    {
      id: 'status',
      Header: "Status",
        filterAll: false,
      accessor: d =>
      (d.quotation.active != null && d.quotation.final != null?
        d.quotation.po_no &&   d.quotation.po_no!=''? 'PO Created':
        d.quotation.active && d.quotation.final? 'In CART':
        !d.quotation.active && !d.quotation.final? 'Pending':
        !d.quotation.active && d.quotation.final? 'Discarded':
        d.quotation.active && !d.quotation.final? 'Not Quoted':
        'Needs Help':'Incomplete'
      ),

        filterMethod: (filter, row) => {
                      //console.log(filter)
                      //console.log(row)
                      if (filter.value === "all") {

                        return true;
                      } else  if (filter.value === "Attention!") {
                        var regex = /In CART|Needs Quote|Error|Discarded|Needs Help|Incomplete/g;
                        var found = filter.value.match(regex);

                        return found == null ;
                      }
                      else  if (filter.value === "In CART") {
                        return row[filter.id].includes('In CART') ;
                      } else     if (filter.value === "Error") {
                      return row[filter.id].includes('Error');
                    } else     if (filter.value === "Not Quoted") {
                    return row[filter.id].includes('Not Quoted');
                    }  else  if (filter.value === "Discarded") {
                       return row[filter.id].includes('Discarded');
                    }
                    else  if (filter.value === "Needs Help") {
                      return row[filter.id].includes('Needs Help');
                   }
                   else  if (filter.value === "Incomplete") {
                     return row[filter.id].includes('Incomplete');
                  }
                    },
        Filter: ({ filter, onChange }) =>
                      <select
                        onChange={event => onChange(event.target.value)}
                        style={{ width: "100%" }}
                        value={filter ? filter.value : "all"}
                      >
                        <option value="all">Show All</option>
                          <option value="Attention!">Attention!</option>
                        <option value="In CART">In CART!</option>
                        <option value="Error">Error</option>
                        <option value="Not Quoted">Not Quoted</option>
                        <option value="Discarded">Discarded</option>
                        <option value="Needs Help">Needs Help</option>

                        <option value="Incomplete">Incomplete</option>
                      </select>
      },
      {
        id: 'reason',
        Header: "Reason",
        accessor: d => d.quotation.reason,
        filterMethod: (filter, rows) =>
                    matchSorter(rows, filter.value, { keys: ["reason"] }),
        filterAll: true,
      },
      {
        id: 'title',
        Header: "Title",
        accessor: d =>(d.quotation.item && d.quotation.item.title? d.quotation.item.title: d.quotation.title),

        filterMethod: (filter, rows) => {
                  //  console.log('rows:',rows)
                    //console.log('filter:',filter)

                    return matchSorter(rows, filter.value, { keys: ["title"] })
                  },
        filterAll: true,
        style: { 'whiteSpace': 'unset',
          'fontSize': '12px',
          'overflowY':'scroll',
          'width':'340px',
          'height':'3em'
         },
        width:340,
      },
    {
      id: 'url',
      Header: "URL",
      accessor: d => < a href = {d.quotation.item && d.quotation.item.url? d.quotation.item.url: d.quotation.url}
      target = "_blank" > {d.quotation.item && d.quotation.item.url? d.quotation.item.url: d.quotation.url} < /a>,
      filterMethod: (filter, rows) => {
                //  console.log('rows:',rows)
                  //console.log('filter:',filter)

                  return matchSorter(rows, filter.value, { keys: ["url.props.href"] })
                },
      filterAll: true,
      style: { 'whiteSpace': 'unset',
        'fontSize': '12px',
        'overflowY':'scroll',
        'width':'440px',
        'height':'3em'
       },
        width:440,
    },
    {
      id: "category",
      Header: "Category",
      accessor: d => d.quotation.item.category? d.quotation.item.category[0]:'',
      filterMethod: (filter, rows) =>
                  matchSorter(rows, filter.value, { keys: ["category"] }),
      filterAll: true,
    },
    {
      id: "source",
      Header: "Source",
      accessor: d => (d.quotation.item && d.quotation.item.source? d.quotation.item.source: d.quotation.source),
      filterMethod: (filter, rows) =>
                  matchSorter(rows, filter.value, { keys: ["source"] }),
      filterAll: true,
    },
    {
      id: "mpn",
      Header: "MPN/ASIN",
      accessor: d => this.nvl(d.quotation.item.MPN,'') +"/"+ this.nvl(d.quotation.item.asin,''),
      filterMethod: (filter, rows) =>
                  matchSorter(rows, filter.value, { keys: ["mpn"] }),
      filterAll: true,

    }, {
      id: "price",
      Header: "Price ($)",
      accessor: d => d.quotation.item.price? d.quotation.item.price.toFixed(2):'',

      filterMethod: (filter, row) => {
                return    row[filter.id] && row[filter.id] != '' &&
                parseFloat(row[filter.id]) >= parseFloat(filter.value)
              } ,
      filterAll: false,
      style: {
                  textAlign: 'right'
      },

    },
    {
      id: "qty",
      Header: "Qty",
      accessor: d => d.quotation.item.qty ,
      Cell: ({ value }) => (value >= 9999 ? 0 : value),
      filterMethod: (filter, row) =>
                  row[filter.id] && row[filter.id] != '' && parseInt(row[filter.id]) >= parseInt(filter.value),
      filterAll: false,
      style: {
                  textAlign: 'right'
      },
    },
    {
      id: "salePrice",
      Header: "Sale Price",
      accessor: d => d.quotation.price_selection &&d.quotation.prices && d.quotation.prices.amm_exp ?
        d.quotation.prices[d.quotation.price_selection].price : '',
        filterMethod: (filter, row) =>
                    row[filter.id] && row[filter.id] != '' && parseFloat(row[filter.id]) >= parseFloat(filter.value),
        filterAll: false,
        style: {
                    textAlign: 'right'
        },
    },
    {
      id: "dest",
      Header: "Dest",
      accessor: d => d.quotation.price_selection,
      filterMethod: (filter, rows) =>
                  matchSorter(rows, filter.value, { keys: ["dest"] }),
      filterAll: true,

    },
    {
      id: "priceOpt",
      Header: "Price Opts",
      accessor: d => d.quotation.prices? 'amm_exp:' + d.quotation.prices['amm_exp'].price +
        'amm_std:' + d.quotation.prices['amm_std'].price  +
        'aq_std:' + d.quotation.prices['aq_std'].price :'',
      style: { 'whiteSpace': 'unset',
          'fontSize': '12px',
          'overflowY':'scroll',
          'width':'300x',
          'height':'4em'
         },
      width:210,
    },
    {
      id: "chgWt",
      Header: "Chg Wt",
      accessor: d => d.quotation.item.chargeableWeight? d.quotation.item.chargeableWeight.toFixed(2):'',
      filterMethod: (filter, row) =>
                  row[filter.id] && row[filter.id] != '' && parseFloat(row[filter.id]) >= parseFloat(filter.value),
      filterAll: false,
    },

  ]

      //  console.log("myData:",myData)
        //    {(quotation.quotation? JSON.stringify(quotation.quotation.item,2,null):"")})


  if (error) {
    return <p>{error.message}</p>;
  }
  // current rowSelection

  const currentKey = this.state.currentKey
    console.log("<QuoteForm> <render> currentKey:",currentKey)
    const quoteInfo = this.getRow(currentKey)


  // render
  return (
        <div >
        {loading?
          <Loading />:
          <div className="statusline">
          <a>Found {recordCount<200? recordCount:'at least '+recordCount} records</a>
          </div>
        }
          <ReactTable
            data={getQuotation}
            filterable
            defaultFilterMethod={(filter, row) =>
            String(row[filter.id]) === filter.value}
            columns={columns}
            defaultPageSize={10}
            style={{
              height: "360px" // This will force the table body to overflow and scroll, since there is not enough room
            }}
            className="-striped -highlight"
          />
          {this.state.showQuote ?
          <QuoteWithMutation
             closePopup={this.handleQuote}

             quoteInfo={quoteInfo}
             selection={this.state.selection}
             rowIndex={this.state.rowIndex}
             currentKey={currentKey}
             getRow={this.getRow}
             variables={variables}

         />
         : null
        }
        </div>
      );
    } // end of render()
  };


Quotations.propTypes = {
//    classes: PropTypes.object.isRequired,
  quotationsData: PropTypes.shape({
    error: PropTypes.object,
    loading: PropTypes.bool.isRequired,
    quotations: PropTypes.arrayOf(propType(quotationFragment)),
    refetch: PropTypes.func.isRequired,
  }).isRequired,
};


Quotations.defaultProps = {
  quoteNo: '',
  search: '',
};
//console.log("in component quotation.js")

const withData = graphql(quotationsQuery, {
  name: 'quotationsData',
  options: ({ quotationSearch }) => ({
    variables: {
      quoteNo: (quotationSearch && Number(quotationSearch.quoteNo)),
      dateFrom: (quotationSearch && quotationSearch.dateFrom),
      dateTo: (quotationSearch && quotationSearch.dateTo),
      search: (quotationSearch && quotationSearch.search),
      searchField: (quotationSearch && quotationSearch.searchField),
    },
    pollInterval: 1000*60*5
  }),
});
//export default withData(withStyles(styles)(Quotations));
export default withData(Quotations);
