
import  PurchaseOrder  from '/app/entry-points/server/models/purchase-order';
const debugOn = true
const  regexNum = /([0-9]*\.[0-9]+|[0-9]+)/g;
const parseRow = (rowVal) => {

  if (!rowVal || !isNaN(rowVal) ) return rowVal;
  var numValsArray = rowVal.match(regexNum);
  var tot=0
  tot = numValsArray.reduce((tot,v)=> {
    //console.log(tot,'-',v)
    return parseFloat(tot) + parseFloat(v)}
  )
  //console.log('converted ',rowVal ,' to => ', tot)
  return  parseFloat(tot);

}
const getOrderDetails = async (root, args, context) => {
  console.log('=>resolver  in getOrderDetails args', args)
  //const { quotation: usr } = context;
  matchArray = []
      existsArray = []
        sortOpt =  { _id :  -1 }
    if (!args.sort || args.sort == undefined || isNaN(args.sort) ) {
      sortOpt =  { _id :  1 }
    } else {
        sortOpt = { _id :  args.sort }
    }
    console.log("*sortOpt:",sortOpt)
      if (args.username) {
        matchArray.push (  {username: { $regex: args.username, $options: 'i' }  })
        //Field2: { $regex: 'Value_2', $options: 'g' }
      } else if (args.senderID ) {

            matchArray.push (   {userId: args.senderID })
      }

      //  start = moment().subtract(args.days_from,'day').format('DD/MM/YYYY')
      //  end = moment().subtract(args.days_to,'day').format('DD/MM/YYYY')
      // if (debugOn) console.log("start:",start)
      // if (debugOn) console.log("end:",end)
      //  matchArray.push (  {po_date:{
        //                   $gte: start,
          //                 $lte: end
            //           }  })
            var searchField;
            var searchTrim
            andOr = "$and"
              if (args.search && args.searchField && args.searchField!= '') {
                  searchTrim = args.search.trim()
                 searchField = args.searchField
                 matchArray.push({
                   "$or": [{
                       [searchField]: {
                         "$regex": searchTrim,
                         "$options": "i"
                       }
                     }]
                   })
              }
            if (args.search && (searchField == null || searchField == '' || searchField == 'all')) {
              searchTrim = args.search.trim()
              matchArray.push({
                "$or": [{
                    "sales_person": {
                      "$regex": searchTrim,
                      "$options": "i"
                    }
                  },{
                    "username": {
                      "$regex": searchTrim,
                      "$options": "i"
                    }
                  },{
                    "MPN": {
                      "$regex": searchTrim,
                      "$options": "i"
                    }
                  },
                  {
                      "asin": {
                        "$regex": searchTrim,
                        "$options": "i"
                      }
                    },
                  {
                    "title": {
                      "$regex": searchTrim,
                      "$options": "i"
                    }
                  },
                  {
                    "category": {
                      "$regex": searchTrim,
                      "$options": "i"
                    }
                  },
                  {
                    "carrier": {
                      "$regex": searchTrim,
                      "$options": "i"
                    }
                  },

                  {
                    "seller": {
                      "$regex": searchTrim,
                      "$options": "i"
                    }
                  },
                  {
                    "url": {
                      "$regex": searchTrim,
                      "$options": "i"
                    }
                  },
                  {
                    "source": {
                      "$regex": searchTrim,
                      "$options": "i"
                    }
                  },
                  {
                    "shipment_ref": {
                      "$regex": searchTrim,
                      "$options": "i"
                    }
                  },
                  {
                    "destination": {
                      "$regex": searchTrim,
                      "$options": "i"
                    }
                  },
                  {
                    "box_id": {
                      "$regex": searchTrim,
                      "$options": "i"
                    }
                  },
                  {
                    "final_box_id": {
                      "$regex": searchTrim,
                      "$options": "i"
                    }
                  },


                ]
              }
            )
            }


      if (args.condition)   andOr = "$" + args.condition
      if (args.po_no)   matchArray.push (  {po_no: { $regex: args.po_no, $options: 'i' }  })
        if (args.sales_person)   matchArray.push (  {sales_person: { $regex: args.sales_person, $options: 'i' }  })
      if (args.username)   matchArray.push (  {username: { $regex: args.username, $options: 'i' }  })
      if (args.source)   matchArray.push (  {source: { $regex: args.source, $options: 'i' }  })
      if (args.shipment_ref)   matchArray.push ({shipment_ref: { $regex: args.shipment_ref, $options: 'i' }  })
     if (args.order_type)   matchArray.push ({shipment_ref: { $regex: args.order_type, $options: 'i' }  })

      //replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
        if (args.destination)   matchArray.push (  {destination: { $regex: args.destination, $options: 'i' }  })
        if (args.address)   matchArray.push ( {address: { $regex: args.address, $options: 'i' }  })


       if (debugOn) console.log("args.first_payment:",args.first_payment)
       if (args.first_payment != undefined)   matchArray.push ( {first_payment:{ $lte: args.first_payment }  }  )

       if (debugOn) console.log("args.payment_method:",args.payment_method)
       if (args.payment_method != undefined)   matchArray.push ( {payment_method:{ $lte: args.payment_method }  }  )

   if (args.category_name)   matchArray.push ({category_name: { $regex: args.category_name, $options: 'i' }  })
    if (args.category)   matchArray.push ({category: { $regex: args.category, $options: 'i' }  })
       if (args.po_qty!= undefined)   matchArray.push ( {po_qty:{ $gte: args.po_qty }  }  )
         if (args.seller)   matchArray.push ({seller: { $regex: args.seller, $options: 'i' }  })
       if (args.purchased_qty!= undefined)   matchArray.push ( {purchased_qty:{ $gte: args.purchased_qty }  }  )
       if (args.shipped_qty!= undefined)   matchArray.push ( {shipped_qty:{ $gte: args.shipped_qty }  }  )
       if (args.price!= undefined)   matchArray.push ( {price:{ $gte: args.price }  }  )
       if (args.sale_price!= undefined)   matchArray.push ( {sale_price:{ $gte: args.sale_price }  }  )
       if (args.total_amount!= undefined)   matchArray.push ( {total_amount:{ $gte: args.total_amount }  }  )



      if (debugOn) console.log("args.vip:",args.vip)
       if (args.trc!= undefined)   matchArray.push ( {trc: args.trc }    )
       if (args.vip!= undefined)   matchArray.push ( {vip: args.vip }    )
       if (args.membership_amount!= undefined)   matchArray.push ( {membership_amount:{ $gte: args.membership_amount }  }  )

      var lookupStatus = []
      var lookupRegex = [];
       if (args.status && args.status != "")  {
         if( typeof args.status === 'string' ) {

          lookupStatus = args.status.toLowerCase().split(",") ;

        } else {
          // status is an array
          lookupStatus = args.status
        }
        lookupRegex = lookupStatus.map(function (e) { return new RegExp(e, "i"); });
      } else {
        if (args.stage == 'purchase') {
          // for not purchased get active if no status is specified
          lookupRegex = [ new RegExp ("active","i")]
        } //else if (args && args.option == 'not_shipped' || args.option == 'ns') {
        //  lookupRegex = [ new RegExp ('active')]
        //}
      }
        console.log("** lookupStatus:", lookupStatus )
        console.log("** lookupRegex :", lookupRegex )
        console.log("** lookupRegex.length :", lookupRegex.length )

      if (lookupRegex && lookupRegex.length > 0)  {
       matchArray.push (
          {
            "$or":
            [
              {status:  { $exists: false} },
              {status:  { $in : lookupRegex  }}
           ]
        }
        )
      }
      console.log('matchArray [1]:\n',JSON.stringify(matchArray))

      if (args.title)   matchArray.push (  {title: { $regex: args.title.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'), $options: 'i' }  })

    if (args.box_id)   {
      matchArray.push (  {box_id: { $regex: args.box_id, $options: 'i' }  })
     }
  // if (args.final_box_id === "" || args.final_box_id == "null" || args.final_box_id == "x") {
  //       if (debugOn) console.log("get where box_id does not exists :",args.final_box_id+"|")
  //         existsArray.push ( { final_box_id : { $exists: false } })
  //   } else if (args.final_box_id)   {
  //       matchArray.push (  {final_box_id: { $regex: args.final_box_id, $options: 'i' }  })
  //     }


    // if (args.awb_no === null || args.awb_no == "null" || args.awb_no == "x") {
    //       if (debugOn) console.log("get where box_id does not exists :",args.awb_no+"|")
    //         existsArray.push ( { awb_no : { $exists: false } })
    //   } else if (args.awb_no)   { matchArray.push (  {awb_no: { $regex: args.awb_no, $options: 'i' }  }) }
      if (args.company)   matchArray.push (  {company: { $regex: args.company, $options: 'i' }  })
      if (args.real_name)   matchArray.push (  {real_name: { $regex: args.real_name, $options: 'i' }  })

  if (args.phone_no) matchArray.push({
      phone_no: {
        $regex: args.phone_no.trim(),
        $options: 'i'
      }
  })
  if (args.tracking_no) matchArray.push({
      tracking_no: {
        $regex: args.tracking_no.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'),
        $options: 'i'
      }
  })
  if (args.carrier) matchArray.push({
      carrier: {
        $regex: args.carrier.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'),
        $options: 'i'
      }
  })
  if (args.order_no) matchArray.push({
    order_no: {
      $regex: args.order_no.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'),
      $options: 'i'
    }
  })
  if (args.awb_no) matchArray.push({
    awb_no: {
      $regex: args.awb_no,
      $options: 'i'
    }
  })

  if (args.received != undefined) {
    matchArray.push({
      received: args.received
    })
  }
  console.log('args.closed:',args.closed)
  if (args.closed!= null)   {
      matchArray.push ( {closed: args.closed  }  )
  }
  if (args.paid_in_full != undefined)   {
      matchArray.push ( {paid_in_full: args.paid_in_full  }  )
  }
  if (args.booked != undefined)   {
      matchArray.push ( {booked: args.booked  }  )
  }

    if (args && args.stage) {
      if (args.stage == 'close'  || args.stage == 'book' ) {
        // do not filter for closed
        console.log('do not add closed check')
      } else //if (args.stage == 'all' && args.closed== undefined)
      {

        matchArray.push ( {closed: false  }  )
      }
      if (args.stage == 'book') {
          matchArray.push (
             {
               "$or":
               [
                 {paid_in_full:  { $exists: false} },
                 {booked:  { $exists: false} },
                 {paid_in_full:  false},
                  {booked:  false}
              ]
           })
         } else  if (args.stage == 'payment') {

        matchArray.push({
          "status": {
            "$regex": "awaiting",
            "$options": "i"
          }
        })

      } else if (args.stage == 'purchase') {

        matchArray.push({
          purchased: -1
        })

      } else if (args.stage == 'track') {
        //  existsArray.push ( { po_tracking : { $exists: false } })
        matchArray.push({
          needsTracking: -1
        })


      } else if (args.stage == 'arrive') {
          existsArray.push({
            "$and": [{
                box_id: {
                  $exists: false
                }
              },
              {
                tracking_no: {
                  $exists: true
                }
              },
            ]
          })
        } else if (args.stage == 'pack') {
          existsArray.push({
            "$and": [{
                final_box_id: {
                  $exists: false
                }
              },
              {
                  box_id: {
                  $exists: true
                }
              },
            ]
          })

      } else if (args.stage == 'ship') {

        existsArray.push({
          "$and": [{
              awb_no: {
                $exists: false
              }
            },
            { "$or": [
              {
                  final_box_id: {
                  $exists: true
                }
              },
              {
                  box_id: {
                  $exists: true
                }
              },
            ] }

          ]
        })
      } else if (args.stage == 'final_dest') {
        existsArray.push(
          {
              awb_no: {
                $exists: true
              }
            }
          )
     } else if (args.stage == 'deliver') {
       existsArray.push(
         {
             awb_no: {
               $exists: true
             }
           }
         )

         matchArray.push({
           delivered: -1 // not fully delivered
         })

     } else if (args.stage == 'booked') {
       existsArray.push(
           {
             booked: {
               $exists: false
             }
           }
         )

         matchArray.push({
           booked: true // not fully booked
         })
     }
  }

  if (debugOn) console.log("matchArray:",JSON.stringify(matchArray,null,2))
      andOr = andOr.toLowerCase()
      query = {}

      query[andOr] = matchArray.length == 0? [{ _id : { $exists: true } }]:matchArray
      whereExists = {}
      whereExists["$or"] = existsArray.length == 0? [{ _id : { $exists: true } }]:existsArray
      //  if (debugOn) console.log("matchArray:",JSON.stringify(matchArray,null,2))
            if (debugOn) console.log("*whereExists:",JSON.stringify(whereExists,null,2))
          if (debugOn) console.log("*query:",JSON.stringify(query,null,2))



  try {
    //console.log('getOrderDetails queryStr:',queryStr)

  //  const curOrderDetails = // await PurchaseOrder.find(queryStr,{'quotation.price':0}).
    //sort({"quote_no":-1}).limit(100).exec();

    const curOrderDetails = await PurchaseOrder.aggregate([
        // check purchases
         {
          $lookup: {
            from: "vendor_purchases",
            localField: "_id",
            foreignField: "po_no",
            as: "po_purchases"
          }
        },
        { $sort : sortOpt }
        ,
         { "$addFields": { "total_purchased_qty": { $sum: "$po_purchases.purchased_qty"} } }
         ,
        { "$addFields": { "orders": "$po_purchases.order_no" }  }
        ,{
          $unwind: {
            "path": "$po_purchases",
            "preserveNullAndEmptyArrays": true
          }
        },
        // {      $match: { }     } ,
        {
          $project: {
            _id: 1,
            po_date_created: "$date_created",
            purchase_date_created: "$po_purchases.date_created",
            purchase_id:  { $ifNull: [ "$po_purchases._id", -99 ] } ,
          //  po_order_no: { $concat: [ "$_id", "-", "$po_purchases.order_no" ] },
            po_no: "$_id",
            po_date:1,
            po_qty: 1,
            price:1,
            sale_price:1,
            destination: 1,
            address:1,
            order_no: "$po_purchases.order_no",
            orders:1,
            order_type: 1,
            delivery_days_from: "$po_purchases.delivery_days_from",
            delivery_days_to: "$po_purchases.delivery_days_to",
            order_date: "$po_purchases.order_date",
            username: 1,
            phone_no:1,
            email:1,
            sales_person:1,
            purchase_last_updated:  "$po_purchases.last_updated",
            last_updated: {
              $cond: {
                if: {
                  $gte: ["$po_purchases.last_updated", "$last_updated"]
                },
                then: "$po_purchases.last_updated",
                else: "$last_updated",
              }
            },
            userId: 1,
            title: 1,
            options:1,
            link:  { $ifNull: [ "$po_purchases.link", "$link" ] } ,
            source:  { $ifNull: [ "$po_purchases.source", "$source" ] } ,
            category: 1,


                        first_payment:1,
                        first_payment_date:1,
                        final_payment:1,
                        final_payment_date:1,
                        total_amount:1,
                        payment_method:1,
                        paid_in_full:1,
                        booked:1,
                        accounting_note:1,
                        payment_status:1,
                        discount:1,
            vip:1,
            trc:1,
            membership_amount:1,

            customer_delivery_date:1,
            delivered_qty:1,
            status:"$status",
            purchase_status:"$po_purchases.status",
            closed:1,

            purchase_notes: "$po_purchases.notes",
            notes: {
              $cond: {
                if: { $and:[{ "$gt": ["$notes", null] },{ "$gt": ["$po_purchases.notes", null] }]},
                then:{ $concat: [ "$notes", "/", "$po_purchases.notes" ] },
                else:
                  {  $cond: { if: { $and:[{ "$gt": ["$po_purchases.notes", null] }]},
                      then: "$po_purchases.notes",
                      else: "$notes"
                    }
                    }
              }
            },
            purchased_qty: "$po_purchases.purchased_qty",
            seller: "$po_purchases.seller",
            total_purchased_qty: 1,
            purchase_notes: "$po_purchases.notes"

          }
        }
        // check tracking no from sellers
        , {
          $lookup: {
            from: "vendor_order_tracking",
            localField: "purchase_id",
            foreignField: "purchase_id",
            as: "po_tracking"
          }
        },
        { "$addFields": { "total_order_shipped_qty": { $sum: "$po_tracking.shipped_qty"} } },
          { "$addFields": { "trackings": "$po_tracking.tracking_no" }  }
       , {
          $unwind: {
            "path": "$po_tracking",
            "preserveNullAndEmptyArrays": true
          }
        }, {
          $project: {
            _id: 1,
            po_date_created:1,
            purchase_date_created:1,
            tracking_date_created:"$po_tracking.date_created",
            seller_ship_id: "$po_tracking._id",
            purchase_id: 1,
            userId: 1,
            po_no: 1,
            po_date:1,
            po_qty: 1,
            price:1,
            sale_price:1,
            destination:1,
            address:1,
            username: 1,
            phone_no:1,
            email:1,
            sales_person:1,
            title: 1,
            options:1,
            link: 1,
            source:1,
            category: 1,

            first_payment:1,
            first_payment_date:1,
            final_payment:1,
            final_payment_date:1,
            total_amount:1,
            payment_method:1,
            paid_in_full:1,
            booked:1,
            accounting_note:1,
            payment_status:1,
            discount:1,

            vip:1,
            trc:1,
            membership_amount:1,

            status:1,
            purchase_status:1,
            tracking_status:"$po_tracking.status",
            closed:1,

            order_no: 1,
            orders:1,
            trackings:1,
            order_type: 1,
            delivery_days_from: 1,
            delivery_days_to: 1,
            order_date: 1,
            seller:1,
            purchased_qty: 1,
            total_purchased_qty: 1,
            customer_delivery_date:1,
            delivered_qty:1,
            purchase_last_updated:1,
            tracking_last_updated: "$po_tracking.last_updated",
            last_updated: {
              $cond: {
                if: {
                  $gte: ["$po_tracking.last_updated", "$last_updated"]
                },
                then: "$po_tracking.last_updated",
                else: "$last_updated",
              }
            },

            notes: {
              $cond: {
                if: { $and:[{ "$gt": ["$notes", null] },{ "$gt": ["$po_tracking.notes", null] }]},
                then:{ $concat: [ "$notes", "/", "$po_tracking.notes" ] },
                else:
                  {  $cond: { if: { $and:[{ "$gt": ["$po_tracking.notes", null] }]},
                      then: "$po_tracking.notes",
                      else: "$notes"
                    }
                    }
              }
            },
            tracking_no: "$po_tracking.tracking_no",
            ship_date: "$po_tracking.ship_date",
            time_in_transit_from: "$po_tracking.time_in_transit_from",
            time_in_transit_to: "$po_tracking.time_in_transit_to",
            shipped_qty: "$po_tracking.shipped_qty",

            total_order_shipped_qty:1,

            purchase_notes: 1,
            tracking_notes: "$po_tracking.notes"
          }
        }

          // get box ID for this tracking number. If box_id whereExists then it arrived at USF
      , {
        $lookup: {
          from: "package_tracking",
          localField: "tracking_no",
          foreignField: "_id",
          as: "received_packages"
        }
      }, {
        $unwind: {
          "path": "$received_packages",
          "preserveNullAndEmptyArrays": true
        }
      }, {
        $project: {
          _id: 1,
          po_date_created:1,
          purchase_date_created:1,
          tracking_date_created:1,
          received_date_created:"$received_packages.dateCreated",
          seller_ship_id:1,
          purchase_id: 1,
          userId: 1,
          po_no: 1,
          po_date:1,
          po_qty: 1,
          price:1,
          sale_price:1,
          destination:1,
            address:1,
          username: 1,
          phone_no:1,
          email:1,
          sales_person:1,
          title: 1,
          options:1,
          link: 1,
          source:1,
          category: 1,



                      first_payment:1,
                      first_payment_date:1,
                      final_payment:1,
                      final_payment_date:1,
                      total_amount:1,
                      payment_method:1,
                      paid_in_full:1,
                      booked:1,
                      accounting_note:1,
                          payment_status:1,
                      discount:1,
          vip:1,
          trc:1,
          membership_amount:1,

          status:1,
          purchase_status:1,
          tracking_status:1,
          closed:1,

          order_no: 1,
          orders:1,
          trackings:1,
          order_date:1,
          order_type: 1,
          delivery_days_from: 1,
          delivery_days_to: 1,
          seller:1,
          purchased_qty: 1,
          total_purchased_qty: 1,
          customer_delivery_date:1,
          delivered_qty:1,
          tracking_no: 1,
          shipped_qty: 1,
          carrier: 1,
          total_order_shipped_qty:1,
          ship_date: 1,
          time_in_transit_from: 1,
          time_in_transit_to: 1,
          purchase_last_updated:1,
          tracking_last_updated: 1,
          received_packages_last_updated: "$received_packages.last_updated",
          last_updated: {
            $cond: {
              if: {
                $gte: ["$received_packages.last_updated", "$last_updated"]
              },
              then: "$received_packages.last_updated",
              else: "$last_updated",
            }
          },

          notes: {
            $cond: {
              if: { $and:[{ "$gt": ["$notes", null] },{ "$gt": ["$received_packages.notes", null] }]},
              then:{ $concat: [ "$notes", "/", "$received_packages.notes" ] },
              else:
                {  $cond: { if: { $and:[{ "$gt": ["$received_packages.notes", null] }]},
                    then: "$received_packages.notes",
                    else: "$notes"
                  }
                  }
            }
          },
          box_id: "$received_packages.box_id",
          date_received: "$received_packages.date_received",
          carrier: "$received_packages.carrier",
          purchase_notes: 1,
          tracking_notes:1,

        }
      }
      , {
        $lookup: {
          from: "minor_shipments",
          localField: "box_id",
          foreignField: "packing.box_id",
          as: "packed_packages"
        }
      }, {
        $unwind: {
          "path": "$packed_packages",
          "preserveNullAndEmptyArrays": true
        }
      }, {
        $project: {
          _id: 1,
          po_date_created:1,
          purchase_date_created:1,
          tracking_date_created:1,
          received_date_created:1,
          packed_date_created:"$packed_packages.date_created",
          seller_ship_id:1,
          purchase_id: 1,
          userId: 1,
          po_no: 1,
          po_date:1,
          po_qty: 1,
          price:1,
          sale_price:1,
          destination:1,
            address:1,
          username: 1,
          phone_no:1,
          email:1,
          sales_person:1,
          title: 1,
          options:1,
          link: 1,
          source:1,
          category: 1,

          first_payment:1,
          first_payment_date:1,
          final_payment:1,
          final_payment_date:1,
          total_amount:1,
          payment_method:1,
          paid_in_full:1,
          booked:1,
          accounting_note:1,
          payment_status:1,
          discount:1,

          vip:1,
            trc:1,
            membership_amount:1,

            status:1,
            purchase_status:1,
            tracking_status:1,
            closed:1,


            discount:1,
          order_no: 1,
          orders:1,
          trackings:1,
          order_date:1,
          order_type: 1,
          delivery_days_from: 1,
          delivery_days_to: 1,
          seller:1,
          purchased_qty: 1,
          total_purchased_qty: 1,
          customer_delivery_date:1,
          delivered_qty:1,
          tracking_no: 1,
          shipped_qty: 1,
          carrier: 1,
          total_order_shipped_qty:1,
          ship_date: 1,
          time_in_transit_from: 1,
          time_in_transit_to: 1,
          box_id: 1,
          date_received: 1,
          purchase_last_updated:1,
          tracking_last_updated: 1,
          received_packages_last_updated: 1,
          last_updated: {
            $cond: {
              if: {
                $gte: ["$packed_packages.last_updated", "$last_updated"]
              },
              then: "$packed_packages.last_updated",
              else: "$last_updated",
            }
          },
          recent_date_created: { "$ifNull":["$packed_date_created",
                  { "$ifNull":["$received_date_created",
                  { "$ifNull":["$tracking_date_created",
                { "$ifNull":["$purchase_date_created",
                { "$ifNull":["$po_date_created","???"]}]}]}]}]},
          notes: {
            $cond: {
              if: { $and:[{ "$gt": ["$notes", null] },{ "$gt": ["$packed_packages.notes", null] }]},
              then:{ $concat: [ "$notes", "/", "$packed_packages.notes" ] },
              else:
                {  $cond: { if: { $and:[{ "$gt": ["$packed_packages.notes", null] }]},
                    then: "$packed_packages.notes",
                    else: "$notes"
                  }
                  }
            }
          },
          ship_id: "$packed_packages._id",

          packing: "$packed_packages.packing",
          //      packed_box_id: "$packed_packages.packing.box_id",
          final_box_id: "$packed_packages.packing.final_box_id",
          purchase_notes: 1,
          tracking_notes:1,
        }
      },
      {
             $unwind: {
               "path":"$final_box_id",
               "preserveNullAndEmptyArrays": true
             }
      },
      {
        $lookup: {
          from: "major_shipments",
          localField: "final_box_id",
          foreignField: "final_box_id",
          as: "awb_pos"
        }
      }, {
        $unwind: {
          "path": "$awb_pos",
          "preserveNullAndEmptyArrays": true
        }
      }, {
        $project: {
          _id:  { $concat: [ "$po_no", "-",
               { "$ifNull":["$order_no",""]},
                   { "$ifNull":["$tracking_no",""]}


                  ] } ,
          // _id: { $concat: [
          //       "$po_no","-",
          //       {"$ifNull" :[
          //         { $dateToString: { format: "%Y-%m-%d-%H:%M:%S:%L", date: "$recent_date_created" }
          //         },     "$title"]
          //       }
          //       ]
          //       } ,
          po_date_created:1,
          tracking_date_created:1,
          purchase_date_created:1,
          received_date_created:1,
          packed_date_created:1,
          awb_date_created: "$awb_pos.dateCreated",
          seller_ship_id:1,
          purchase_id: 1,
          userId: 1,
          po_no: 1,
          po_date:1,
          po_qty: 1,
          price:1,
          sale_price:1,
          destination:1,
            address:1,
          username: 1,
          phone_no:1,
          email:1,
          sales_person:1,
          title: 1,
          options:1,
          link: 1,
          source:1,
          category: 1,

          first_payment:1,
          first_payment_date:1,
          final_payment:1,
          final_payment_date:1,
          total_amount:1,
          payment_method:1,
          paid_in_full:1,
          booked:1,
          accounting_note:1,
          payment_status:1,
          discount:1,
          vip:1,
          trc:1,
          membership_amount:1,
          status:1,
          purchase_status:1,
          tracking_status:1,
          closed:1,
          order_no: 1,
          orders:1,
          trackings:1,
          order_type: 1,
          delivery_days_from: 1,
          delivery_days_to: 1,
          order_date: 1,
          seller:1,
          purchased_qty: 1,
          total_purchased_qty: 1,
          purchased: {$cmp: ['$total_purchased_qty','$po_qty']},
          needsTracking: {$cmp: ['$total_order_shipped_qty','$purchased_qty']},
          customer_delivery_date:1,
          delivered_qty:1,
          delivered: {$cmp: ['$delivered_qty','$purchased_qty']},
          tracking_no: 1,
          shipped_qty: 1,
          carrier: 1,
          total_order_shipped_qty:1,
          ship_date: 1,
          time_in_transit_from: 1,
          time_in_transit_to: 1,
          box_id: 1,
          final_box_id:1,
          date_received: 1,
          ship_id: 1,
          packing: 1,
          purchase_last_updated:1,
          tracking_last_updated: 1,
          received_packages_last_updated: 1,
          last_updated: {
          $cond: {
              if: {
                $gte: ["$awb_pos.last_updated", "$last_updated"]
              },
              then: "$awb_pos.last_updated",
              else: "$last_updated",
            }
          },
          notes: 1,
          tracking_notes:1,
          purchaes_notes:1,
          departure_date:"$awb_pos.departure_date",
          amm_showroom_arrival_date:"$awb_pos.amm_showroom_arrival_date",
          aq_showroom_arrival_date: "$awb_pos.aq_showroom_arrival_date",
          amm_customs_arrival_date:"$awb_pos.amm_customs_arrival_date",
          aq_customs_arrival_date:"$awb_pos.aq_customs_arrival_date",
          customer_address_arrival_date:"$awb_pos.customer_address_arrival_date",
          awb_destination: "$awb_pos.destination",
          shipment_ref: "$awb_pos.shipment_ref",
          awb_status:"$awb_pos.awb_status",
          awb_no: "$awb_pos._id",
          received: {
          $cond: { if: { $and:[{ "$ne": ["$awb_pos.amm_showroom_arrival_date", 0] },{ "$gt": ["$awb_pos.amm_showroom_arrival_date", null] }]},
          then: true, else: {
             $cond: { if: { $and:[{ "$ne": ["$awb_pos.aq_showroom_arrival_date", 0] },{ "$gt": ["$awb_pos.aq_showroom_arrival_date", null] }]},
             then: true, else: {
                $cond: { if: { $and:[{ "$ne": ["$awb_pos.customer_address_arrival_date", 0] },{ "$gt": ["$awb_pos.customer_address_arrival_date", null] }]} ,
                then: true, else: false
             } }
          } }
       } }
  //  "date": { "$dateToString": { "format": "%Y-%m-%d", "date": "$followers.ts" } }
        }
      },
      {
        $match:
          whereExists
      },
      {
          $match: query
      }
  //___END OF aggregate_______

]).limit(200).exec()
    console.log("curOrderDetails.length:",curOrderDetails.length)
   //console.log("curOrderDetails:",JSON.stringify(curOrderDetails))
   // cleanup wrong field values

   result = curOrderDetails.map(row=> {
     // check shipping price

     if (row.shipping) row.shipping = parseRow(row.shipping)
     if (row.price) row.price = parseRow(row.price)
     if (row.closed != null && row.closed == "true" ) row.closed = true;
     if (row.closed != null && row.closed == "false" ) row.closed = false;
     if (!Array.isArray(row.final_box_id) ) row.final_box_id = new Array(row.final_box_id)
     if (!Array.isArray(row.packing) ) row.packing = new Array(row.packing)
        //console.log('po_date:',row.po_date)
          return row
   })
   console.log("curOrderDetails.result.length:",result.length)
  // console.log("curOrderDetails.result:",JSON.stringify(result))
   return result;
  } catch (exc) {
    console.log(exc);
    return null;
  }
};

export default getOrderDetails;
