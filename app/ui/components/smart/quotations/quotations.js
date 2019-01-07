import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { propType } from 'graphql-anywhere';
import quotationFragment from '/app/ui/apollo-client/quotation/fragment/quotation';
import quotationsQuery from '/app/ui/apollo-client/quotation/query/quotations';
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
  const Quotations = (props) => {
    console.log('=> in Quotations component props',props)

  const { quotationsData, classes } = props

  const { loading, error, getQuotation ,variables  } = quotationsData;

  if (!getQuotation) return <p>Search for quotation</p>

  console.log('variables:',variables)

  nvl = (val1, val2) => ( val1 != undefined&& val1 !=null  ? val1:val2)

  const columns = [{
      Header: "Quote No",
      accessor: "quote_no",
      filterMethod: (filter, rows) =>
                  matchSorter(rows, filter.value, { keys: ["quote_no"] }),
      filterAll: true,


      maxWidth: 200
    },
    {
      id: 'quote_date',
      Header: "Date",
      accessor: d => (d.quotation.quote_date? d.quotation.quote_date:d.date_created),
        Cell: row => <span>{row.value? moment(parseInt(row.value)).format('DD-MMM-YYYY HH:mm:ss'):null}</span>,
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
    },
    {
      id: 'username',
      Header: "Username",
      accessor: d => d.quotation.username,
      filterMethod: (filter, rows) =>
                  matchSorter(rows, filter.value, { keys: ["username"] }),
      filterAll: true,
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
      id: 'po_no',
      Header: "PO#",
      accessor: d =>
              d.quotation.po_no?d.quotation.po_no:'',
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
      id: 'po',
      Header: "Active/Final/PO",
      accessor: d =>
        (d.quotation.active != undefined && d.quotation.active ? d.quotation.active:'false')+ '/' +
        (d.quotation.final != undefined && d.quotation.final? d.quotation.final:'false') ,

        filterMethod: (filter, row) => {
                      //console.log(filter)
                      //console.log(row)
                      if (filter.value === "all") {

                        return true;
                      }

                      if (filter.value === "DIS") {
                        return row[filter.id].includes('false/') ;
                      }
                      return row[filter.id].includes('/false/');
                    },
                    Filter: ({ filter, onChange }) =>
                      <select
                        onChange={event => onChange(event.target.value)}
                        style={{ width: "100%" }}
                        value={filter ? filter.value : "all"}
                      >
                        <option value="all">Show All</option>
                        <option value="DIS">Discarded</option>
                        <option value="INC">Incomplete</option>
                      </select>
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
          'width':'540px',
          'height':'4em'
         },
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
        'width':'540px',
        'height':'4em'
       },
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
      accessor: d => nvl(d.quotation.item.MPN,'') +"/"+ nvl(d.quotation.item.asin,''),
      filterMethod: (filter, rows) =>
                  matchSorter(rows, filter.value, { keys: ["mpn"] }),
      filterAll: true,

    }, {
      id: "price",
      Header: "Price ($)",
      accessor: d => d.quotation.item.price? d.quotation.item.price.toFixed(1):0,

      filterMethod: (filter, row) =>
                  row[filter.id] >= filter.value,
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
                row[filter.id] >= filter.value,
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
                  row[filter.id] >= filter.value,
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
      accessor: d => d.quotation.prices? 'amm_exp:' + d.quotation.prices['amm_exp'].price + '\n' +
        'amm_std:' + d.quotation.prices['amm_std'].price + '\n' +
        'aq_std:' + d.quotation.prices['aq_std'].price + '\n':''
    },
    {
      id: "chgWt",
      Header: "Chg Wt",
      accessor: d => d.quotation.item.chargeableWeight? d.quotation.item.chargeableWeight.toFixed(1):'',
      filterMethod: (filter, row) =>
                row[filter.id] >= filter.value,
      filterAll: false,
    },

  ]

      //  console.log("myData:",myData)
        //    {(quotation.quotation? JSON.stringify(quotation.quotation.item,2,null):"")})


  if (error) {
    return <p>{error.message}</p>;
  }


  return (
        <div >
        {loading?
           <Loading />: null
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
        </div>
      );

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
      search: (quotationSearch && quotationSearch.search)
    },
  }),
});
//export default withData(withStyles(styles)(Quotations));
export default withData(Quotations);
