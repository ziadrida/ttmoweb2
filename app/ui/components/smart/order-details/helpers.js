const view = {
  all: 0,
  payment: 1,
  purchase: 2,
  track: 3,
  arrive: 4,
  pack: 5,
  ship: 6,
  deliver: 7,
  book:8,
  close: 9,

}
const stages = [
   {name:"all",view:view.all},
   {name:"payment",view:view.payment},
   {name:"purchase",view:view.purchase},
   {name:"track",view:view.track},
   {name:"arrive",view:view.arrive},

   {name:"pack",view:view.pack},
   {name:"ship",view:view.ship},
   {name:"deliver",view:view.deliver},
   {name:"book",view:view.book},
   {name:"close",view:view.close},

]

const detailViews = [{
    Header: "All",
    id: "all",
    show: true,
    view:view.all,
  },

  {
    Header: "Payment View",
    id: "payment",
    show: false,
    view:view.payment,
  },
  {
    Header: "Purchasing View",
    id: "purchase",
    show: false,
    view:view.purchase,
  },
   {
    Header: "VendorTracking",
    id: "track",
    show: false,
    view:view.track,
  }, {
    Header: "Arriving View",
    id: "arrive",
    show: false,
    view:view.arrive,
  }, {
    Header: "Packing View",
    show: false,
    view:view.pack,
  }
  , {
    Header: "Shipment View",
    id: "ship",
    show: false,
    view:view.ship,
  },
   {
    Header: "Customer Delivery View",
    id: "deliver",
    show: false,
    view:view.deliver,
  },
 {
  Header: "Book View",
  id: "book",
  show: false,
  view:view.book,
},
 {
  Header: "Close PO View",
  id: "close",
  show: false,
  view:view.close,
},

]

export { stages, view, detailViews}
//material-ui save code

    // {
    //   id: 'po',
    //   Header: "Active/Final/PO",
    //   accessor: d =>
    //     (d.active != undefined && d.active ? d.active:'false')+ '/' +
    //     (d.final != undefined && d.final? d.final:'false') + '/' +
    //     (d.po_no?d.po_no:'-'),
    //     filterMethod: (filter, row) => {
    //                   //console.log(filter)
    //                   //console.log(row)
    //                   if (filter.value === "all") {
    //
    //                     return true;
    //                   }
    //                   if (filter.value === "PO") {
    //                     return row[filter.id].includes('T') ;
    //                   }
    //                   if (filter.value === "DIS") {
    //                     return row[filter.id].includes('false/') ;
    //                   }
    //                   return row[filter.id].includes('/false/');
    //                 },
    //                 Filter: ({ filter, onChange }) =>
    //                   <select
    //                     onChange={event => onChange(event.target.value)}
    //                     style={{ width: "100%" }}
    //                     value={filter ? filter.value : "all"}
    //                   >
    //                     <option value="all">Show All</option>
    //                     <option value="PO">PO Created</option>
    //                     <option value="DIS">Discarded</option>
    //                     <option value="INC">Incomplete</option>
    //                   </select>
    //                   },
    //

    // {
    //   id: "priceOpt",
    //   Header: "Price Opts",
    //   accessor: d => 'amm_exp:' + d.prices['amm_exp'].price + '\n' +
    //     'amm_std:' + d.prices['amm_std'].price + '\n' +
    //     'aq_std:' + d.prices['aq_std'].price + '\n'
    // },
    // {
    //   id: "chgWt",
    //   Header: "Chg Wt",
    //   accessor: d => d.chargeableWeight.toFixed(1),
    //   filterMethod: (filter, rows) =>
    //             row[filter.id] >= filter.value,
    //   filterAll: true,
    // },
    // {
    //   id: "salesPerson",
    //   Header: "Sales Person",
    //   accessor: d => d.sales_person,
    //   filterMethod: (filter, rows) =>
    //               matchSorter(rows, filter.value, { keys: ["salesPerson"] }),
    //   filterAll: true,
    // }
  //]

    // const columns = ["quote_no","Quote Date","username", "Reason","Active/Final/PO",
    //        {
    //        name: "URL/HTTP link",
    //        options: {
    //          filter: true,
    //          customBodyRender: (value, tableMeta, updateValue) => {
    //            return (
    //              <a href={value} target="_blank">{value} </a>
    //            );
    //          }
    //        }
    //      },
    //      "source","MPN[ASIN]","price","Qty","Sale Price","Dest","Price Opts","Chg Wt","sales_person"];
