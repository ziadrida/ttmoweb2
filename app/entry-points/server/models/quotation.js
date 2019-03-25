import mongoose  from 'mongoose';

console.log('Importing quotation')
const PriceDest = mongoose.Schema({
  destination: String,
  type: String,
  delivery: String,
  price: Number
})

// const QuoteInput = mongoose.Schema({
//   ownderId: String,
//   url: String,
//   thumbnailImage: String,
//   source: String,
//   price: Number,
//   qty: Number,
//   shipping: Number,
//   category: [String],
//   title: String,
//   weight: Number,
//   height: Number,
//   length: Number,
//   width: Number,
//   language: String,
//   username: String,
//   chargeableWeight: Number,
//   final: Boolean,
//   requestor: String,
//   quote_no: Number,
// })

const PriceOptions = mongoose.Schema({
        amm_exp: PriceDest,
        amm_std: PriceDest,
        aq_std: PriceDest,
//  aq_exp: PriceDest,
})

const schema = mongoose.Schema({
  _id: String,
  quote_no: Number,
  senderId: String,
  sales_person: String,


  quotation: {
    ownderId: String,
    url: String,
    thumbnailImage: String,
    source: String,
    price: Number,
    qty: Number,
    shipping: Number,
    category: [String],
    title: String,
    weight: Number,
    height: Number,
    length: Number,
    width: Number,
    language: String,
    username: String,
    chargeableWeight: Number,
    active: Boolean,
    deleted: Boolean,
    final: Boolean,
    requestor: String,
    quote_no: Number,
    quote_date: Date,
    price_selection: String,
    prices: PriceOptions,
    notes: String,


    po_no: String,

    sales_person: String,
    message: String,
    reason: String,

    item: {

          recipientID: String,
          ownderId: String,
          source: String,
          title: String,
          url: String,
          thumbnailImage: String,
          MPN: String,
          asin: String,
          availability: String,
          condition: String,
          price: Number,
          qty: Number,
          shipping: Number,
          category: [String],
          weight: Number,
          height: Number,
          length: Number,
          width: Number,
          language: String,
          username: String,
          chargeableWeight: Number,
          final: Boolean,
          requestor: String,
          quote_no: Number,
          category_info: {
              _id: String,
              category_name: String,
              category_name_ar: String,
              customs: Number,
              tax_aqaba: Number,
              tax_amm: Number,
              margin_amm: Number,
              margin_aqaba: Number,
              special_tax: Number,
              us_tax: Number,
              cap_aqaba: Number,
              cap_amm: Number,
              min_side_length: Number,
              keywords: String,
              min_lonng_side: Number,
              score: Number,
              match_score: Number
          },
              recipentID: String
          }
    },
    date_created:{ type: Date, default: Date.now },
    create_by: String,
    last_updated: Date,
    updated_by: String,
  }
,{ collection: 'quotation' });

const Quotation = mongoose.model('quotation', schema);
schema.statics.findOneAndUpdate = function (query, sort, doc, options, callback) {
  return this.collection.findOneAndUpdate(query, sort, doc, options, callback);
};
console.log('NEW Quotation collection:',Quotation)
if (!Quotation) console.log("quotation.js Quotation is null!")

export default Quotation;
