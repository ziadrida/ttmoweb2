import  DHL from  './dhlrate.js';
import moment from 'moment';

var debugOn = true;
var doDebugOn = true;
var errorOn = true;
const MAX_TITLE_LENGTH = 500;
isArabicLang = (senderID) => {
  return false;
}

var getChargeableWeight = function(weight,length,width,height) {
  chargeableWt = -1
  if(!weight || !length || !width || !height) return chargeableWt;

  var volWeightKG = (Math.max(length*1.05,length + 1.00) *
          Math.max(width*1.05,width + 1.00) *
          Math.max(height*1.05,height + 1.00) *
          Math.pow(2.54, 3)) / (5000.00);
  if (debugOn) console.log("<calculatePrice> volWeightKG:", volWeightKG);
  if (volWeightKG > 10000) volWeightKG = -1 // avoid wrong units calculation
  var chargeableWt = 1 * Math.max(volWeightKG * 1, weight/2.20).toFixed(2);
  if (debugOn) console.log("<calculatePrice> x volWeight:", volWeightKG.toFixed(2));
  if (debugOn) console.log("<calculatePrice> x chargeableWt:", chargeableWt.toFixed(2));
  if (chargeableWt < 0.1 ) chargeableWt=0.1 // min weight
  return chargeableWt;
}


// **************************************
validateItem = async function(editItem) {
  console.log("in <validateItem> editItem:",editItem)
  item ={}

    // recipientID:'',
    // ownderId:'',
    // title:'',
    // MPN:'',
    // asin:'',
    // url:'',
    // thumbnailImage:'',
    // source:'',
    // price:'',
    // qty:'',
    // shipping:'',
    // category:'',
    // condition:'',
    // weight:'',
    // height:'',
    // length:'',
    // width:'',
    // language:'',
    // username:'',
    // chargeableWeight:'',
    // final:'',
    // requestor:'',
    // quote_no:'',
    // recipentID:'',

  if (editItem.edit_title == null || editItem.edit_title.length < 10) {
    console.log("<validateItem > ERROR title too short")
  //  await Promise.reject(new Error("Title is too short. Has to be more than 10 characters long"));
    throw new Error("Title is too short. Has to be more than 10 characters long")
  }
  item.title = editItem.edit_title
  console.log("<validateItem >  #qty:", editItem.edit_qty)
  if (!editItem.edit_qty || editItem.edit_qty <= 0) {
    //  await Promise.reject(new Error("PO quantity has to be more than 0!"));
      throw new Error("PO quantity has to be more than 0!");
  }
  console.log("<validateItem > set title")
  item.qty = editItem.edit_qty;

  console.log('<validateItem > editItem.edit_shipping:[', editItem.edit_shipping,']')

    console.log('<validateItem > editItem.edit_shipping:[', parseFloat(editItem.edit_shipping),']')

  if ( editItem.edit_shipping == null ||
    editItem.edit_shipping==='' ||
    isNaN(editItem.edit_shipping) ||
    parseFloat(editItem.edit_shipping) < 0) {

      throw new Error("Shipping cost at country of origin is required. (but it can be 0)")
  }
  item.shipping = editItem.edit_shipping ==null || isNaN(editItem.edit_shipping) ? 0:parseFloat(editItem.edit_shipping);

  console.log('<validateItem > editItem.edit_weight:[', editItem.edit_weight_kg,']')
  console.log('<validateItem > editItem.edit_length_inch:[', editItem.edit_length_inch,']')
  console.log('<validateItem > editItem.edit_width_inch:[', editItem.edit_width_inch,']')
  console.log('<validateItem > editItem.edit_height_inch:[', editItem.edit_height_inch,']')
  if (( editItem.edit_weight_kg == null || editItem.edit_weight_kg ==='' || isNaN(editItem.edit_weight_kg) || parseFloat(editItem.edit_weight_kg) <= 0) &&
    (( editItem.edit_length_inch == null ||editItem.edit_length_inch ==='' || isNaN(editItem.edit_length_inch)|| parseFloat(editItem.edit_length_inch) <= 0) ||
      ( editItem.edit_width_inch == null ||editItem.edit_width_inch ===''|| isNaN(editItem.edit_width_inch) || parseFloat(editItem.edit_width_inch) <= 0) ||
      ( editItem.edit_height_inch == null ||editItem.edit_height_inch ==='' || isNaN(editItem.edit_height_inch)|| parseFloat(editItem.edit_height_inch) <= 0))) { // }&&  editItem.edit_chargeableWeight <= 0) {
    if (debugOn) console.log( "<validateItem >  ---->No chargeableWeight");
    // cannot compute weight
    //  await Promise.reject(new Error("Missing weight and/or dimensions information"));
      throw new Error("Item Weight and/or dimensions are required");
    //
  } // chargeableWeight
  item.weight =  editItem.edit_weight_lb == null ||isNaN(editItem.edit_weight_lb)? 0:parseFloat(editItem.edit_weight_lb);
  item.length = editItem.edit_length_inch == null || isNaN(editItem.edit_length_inch)? 0: parseFloat(editItem.edit_length_inch);
  item.width =  editItem.edit_width_inch == null ||isNaN(editItem.edit_width_inch)? 0:parseFloat(editItem.edit_width_inch);
  item.height = editItem.edit_height_inch == null || isNaN(editItem.edit_height_inch)? 0:parseFloat(editItem.edit_height_inch);

  console.log('<validateItem > editItem.edit_price:', editItem.edit_price)
  if ( editItem.edit_price == null || editItem.edit_price ==='' ||isNaN(editItem.edit_price)||
    parseFloat(editItem.edit_price) <= 0) {
    console.log('<validateItem > ask for editItem.edit_price:')
    //  await Promise.reject(new Error("Enter item price in USD"));
      throw new Error("Item price in USD is required")
  }

  item.price =parseFloat(editItem.edit_price)

  if (editItem.edit_category_info == null || editItem.edit_category_info._id == null) {

    //await Promise.reject(new Error("Enter category."));
    throw new Error("Category is required")
  }
  item.category_info = editItem.edit_category_info;

  //return await Promise.resolve(item);
    return item;
}


// calculatePrice = async function(senderID,editItem) {
//   if (debugOn) console.log( "<calculatePrice>  editItem:\n", JSON.stringify(editItem, null, 2))
//   if (editItem == null) {
//    await Promise.reject(new Error("<calculatePrice> Internal error. Item is null!"));
//   }
//   console.log("<calculatePrice>  editItem exists")
//   try {
//     console.log("<calculatePrice>****  call  doCalculate")
//
//     quote_obj =  await doCalculate(editItem);
//      console.log("<calculatePrice> after doCalculate returned quote_obj2:", JSON.stringify(quote_obj, null, 2))
//      return quote_obj;
//
//  } catch(err) {
//    return await Promise.reject(new Error(err));
//
//  }

//
//   if (debugOn) console.log( "<calculatePrice> NO RETURN FROM HERE ")
//
//
// } // calculatePrice

doCalculate =  async function(editItem) {
  if (doDebugOn) console.log("==> In <doCalculate> ")
  var quote_obj = { message:'Nothing done'}
  if (editItem == null) {
  //  return  Promise.reject(new Error('Internal error. editItem is null'));
    throw new Error('Internal error. editItem is null')
  }
  const pricing_params = { // get from DB.
    shippingCostPerKgJDParam: 5.80, // JD raized from 5.42 to 5.80 June 13
    O2_AmmanDeliveryJDParam: 0.5, // JD - reduced from 1.5 to 0.5  July 11
    AI2_clearancePercentParam: 0.01, // raised from 1% to 2% - reduced to 1% July 11
    AI2_clearanceMaxParam: 10, // JD
    AI2_clearanceMinParam: 0.5, // JD
    AI2_clearanceIncomeTax: 0.025, // income tax 2.5%
    handlingPerPackageUSDParam: 1.125, // USD reduced from 2.25 to 1.125
    heavyWeightSurchargeParam: 12, // USD
    heavyWeightThresholdParam: 44, // pounds
    J9_unedrCostPercentageParam: 0.7, // percentage drop to 0.7 July 9
    min_aqaba_marginParam: 0.02,
    min_taxable_amountParam: 180, // minimum tabable amount raised to 180 from 140 on June 4
    BN2_paperAWBFeesParam: 2.5 + 1.85,
    expressClearanceFeeParam: 60 / 0.71, // USD
    expressMarginParam: 0.11, // reduced from .12 to .1 July 11
    minExpressFeeParam: 4, // USD reduced from 5 to 4 July 11
    aqabaCleranceRateParam: 0.02, //
    minValueToCapPrice: 30,
    aqabaExpressAddedMargin: 0.1,
    minMargin: 0.055, // 4.5% minimum margin allowed
    marginAdjPriceIncrement: 50,
    marginPriceDiscount: 0.02,
    qtyPriceDiscount: 0.005,
    qtyAdjIncrement: 1,
    minMargin: 0.055 // 2.5% income tax + 3% insurance

  }
  var item;
  try {
      console.log("<doCalculate> call validateItem with editItem:",editItem)
   item = await validateItem(editItem);  // .then(item  => {
    console.log("<doCalculate> after validateItem  item:",item)

  // user pricing formula
  console.log("<doCalculate> calculate price since all should be valid now")
  pricingMessage = "NOTES:"
  console.log("<doCalculate> #qty:", item.qty)
  // if (!item.qty || item.qty <= 0) {
  //   throw new Error('PO quantity is required');
  // }
  console.log('<doCalculate> item.shipping:', item.shipping)
  // if ( item.shipping == null || item.shipping < 0) {
  //     throw new Error("Shipping cost is required");
  // } else {
  C2_shipping = item.shipping * 1.00;
  //}

  console.log('<doCalculate> item.weight:', item.weight)
  console.log('<doCalculate> item.length:', item.length)
  console.log('<doCalculate> item.width:', item.width)
  console.log('<doCalculate> item.height:', item.height)
  if (( item.weight == null || item.weight <= 0) &&
    (( item.length == null || item.length <= 0) ||
      ( item.width == null || item.width <= 0) ||
      ( item.height == null || item.height <= 0))) { // }&&  item.chargeableWeight <= 0) {
    if (doDebugOn) console.log( "<doCalculate>------->No chargeableWeight");
    // cannot compute weight
      throw new Error("Shipping dimensions and weight are required");
    //


  } // chargeableWeight
  console.log('<doCalculate> item.price:', item.price)
  // if ( item.price == null || item.price <= 0) {
  //   console.log('<doCalculate> ask for item.price:')
  //   throw new Error("Item's price in USD is required");
  // }


  if (item.category_info == null ) {

    //  return  Promise.reject(new Error("Internal error in calulcatePrice. No category information!. Contact Admin"));
    throw new Error("Internal error in calulcatePrice. No category information!. Contact Admin");

  }

      if (doDebugOn) console.log( "in doCalculate ")

      item.length = Math.max(item.category_info.min_side_length, item.length).toFixed(2)
      item.width = Math.max(item.category_info.min_side_length, item.width).toFixed(2)
      item.height = Math.max(item.category_info.min_side_length, item.height).toFixed(2)

      tmpChargableWeight = getChargeableWeight(item.weight, item.length, item.width, item.height)
      if (doDebugOn) console.log( "in doCalculate -   item.length:", item.length)
      if (doDebugOn) console.log( "in doCalculate -   item.width:", item.width)
      if (doDebugOn) console.log( "in doCalculate -   item.height:", item.height)
      if (doDebugOn) console.log( "in doCalculate -   item.weight:", item.weight)
      if (doDebugOn) console.log( "in doCalculate - tmpChargableWeight:", tmpChargableWeight)
      if (!item.chargeableWeight || (item.chargeableWeight && item.chargeableWeight < tmpChargableWeight)) {
        item.chargeableWeight = tmpChargableWeight
      }
      if (doDebugOn) console.log( "in doCalculate - chargableWeight should be:",
        item.chargeableWeight)

      I2_quantity = item.qty ? item.qty : 1;
      // compute capacity per box_id
      typicalShippingBoxVol = Math.ceil(32 * 18 * 12)
      // current vol
      itemVolume = item.length * item.height * item.width
      if (isNaN(itemVolume) || !itemVolume || itemVolume < 1) {
        itemVolume = item.weight * 5000 / (2.54 * 2.54 * 2.54)
      }
      itemVolume = Math.ceil(itemVolume)
      console.log("<doCalculate> cost_breakdown itemVolume:", itemVolume)
      J2_unitCapacityPerBox = Math.ceil(typicalShippingBoxVol / itemVolume);

      console.log("<doCalculate> cost_breakdown J2_unitCapacityPerBox:", J2_unitCapacityPerBox)
      numberOfPackages = Math.max(1, Math.ceil((I2_quantity / J2_unitCapacityPerBox) * 100) / 100);

      if (doDebugOn) console.log('<doCalculate> cost_breakdown numberOfPackages', numberOfPackages)
      K2_localWarranty = false;
      L2_Prime = false;
      H2_seller = "Amazon";
      F2_numberOfSeller = 1;
      M2_AmmanCost = -1;

      //
      priceIncrementMultiple = 50
      multipleOfPriceIncrement = item.price / priceIncrementMultiple
      priceDropMultiplier = 5 // the LOWER the higher the drop per increment exponantially
      decayCoefficient = 0.5 // higher value means shartper drops
      effectiveMarginultiplier = (1 - decayCoefficient * Math.exp(-1 * priceDropMultiplier / multipleOfPriceIncrement))
      V2_marginAdjBasedOnPrice = effectiveMarginultiplier // 1;
      console.log("<doCalculate> cost_breakdown effectiveMarginultiplier:", effectiveMarginultiplier)
      W2_marginAdjBasedOnWeight = 1;

      X2_marginAdjBasedOnQty = 1;
      if (doDebugOn) console.log( "in doCalculate - min_side_length:", item.category_info.min_side_length)


      var Z2_chargeableWeight = item.chargeableWeight * 1.00; // kg
      var AA2_weightRateAdjust = 1; // no adjustment for now
      var AB2_adjustedShippingCost = AA2_weightRateAdjust * pricing_params.shippingCostPerKgJDParam / 0.71;
      var AD2_HandlingCostUSD = pricing_params.handlingPerPackageUSDParam * numberOfPackages / I2_quantity;
      console.log("<doCalculate> cost_breakdown AD2_HandlingCostUSD:", AD2_HandlingCostUSD)
      if (Z2_chargeableWeight * 2.2 > pricing_params.heavyWeightThresholdParam) {
        AD2_HandlingCostUSD = AD2_HandlingCostUSD + pricing_params.heavyWeightSurchargeParam;
      }
      // user discount or margup
      markup = 0

      var T2_AmmanCatMargin = item.category_info.margin_amm * 1.00 + markup
      U2_AqabaCatMargin = item.category_info.margin_aqaba * 1.00 + markup
      Q2_NetAqabaMargin = Math.max(pricing_params.min_aqaba_marginParam, U2_AqabaCatMargin *
        W2_marginAdjBasedOnWeight *
        X2_marginAdjBasedOnQty *
        V2_marginAdjBasedOnPrice);
      Q2_netAqabaMargin = Math.max(Q2_NetAqabaMargin, pricing_params.minMargin)
      console.log("<doCalculate> cost_breakdown U2_AqabaCatMargin:", U2_AqabaCatMargin)
      console.log("<doCalculate> cost_breakdown Q2_NetAqabaMargin:", Q2_NetAqabaMargin)
      B2_price = item.price * 1.00;

      packageDimensions = item.length + 'x' + item.width + 'x' + item.height + 'inch';

      Y2_volumnWeight = -1; // already have chargeableWeight
      if (doDebugOn) console.log('<doCalculate> Z2_chargeableWeight/AD2_HandlingCostUSD:',
        Z2_chargeableWeight.toFixed(2) + '/' + AD2_HandlingCostUSD.toFixed(2));
      AC2_ShipAndHandCostUSD = ((AB2_adjustedShippingCost * Z2_chargeableWeight)) + AD2_HandlingCostUSD;
      if (doDebugOn) console.log("<doCalculate> AC2_ShipAndHandCostUSD:", AC2_ShipAndHandCostUSD.toFixed(2));

      // B2 is item.price
      // C2 is item.shipping
      if (doDebugOn) console.log( "<doCalculate> item.price +  item.shipping + AC2_ShipAndHandCostUSD:",
        item.price + "/" + item.shipping + "/" + AC2_ShipAndHandCostUSD);
      AE2_itemCostUSD = item.price + C2_shipping + AC2_ShipAndHandCostUSD;
      if (doDebugOn) console.log( "<doCalculate> AE2_itemCostUSD:", AE2_itemCostUSD)
      // AF2 is item.customs Percent
      // customs USD =AF2*(B2+C2+AC2*0.5)*J9
      AF2_ammCustoms = item.category_info.customs * 1.00
      AG2_customsUSD = item.category_info.customs *
        (item.price + C2_shipping + AC2_ShipAndHandCostUSD * .5) * pricing_params.J9_unedrCostPercentageParam;
      // AH2 =AE2+AG2
      AH2_costWithCustomsUSD = AE2_itemCostUSD + AG2_customsUSD;
      // AJ2 = =AI2*AE2
      AJ2_clearanceCost = Math.max(pricing_params.AI2_clearancePercentParam * AE2_itemCostUSD, pricing_params.AI2_clearanceMinParam);
      AJ2_clearanceCost = Math.min(AJ2_clearanceCost, pricing_params.AI2_clearanceMaxParam)

      console.log("<doCalculate> cost_breakdown AJ2_clearanceCost:", AJ2_clearanceCost)
      // AK2 =AJ2+AH2
      if (doDebugOn) console.log( '<doCalculate> AJ2_clearanceCost /AH2_costWithCustomsUSD',
        AJ2_clearanceCost + '/' + AH2_costWithCustomsUSD);
      AK2_loadedCost = AJ2_clearanceCost + AH2_costWithCustomsUSD;
      AL2_ammanSalesTax = 1.0 * item.category_info.tax_amm.toFixed(2);
      P2_netAmmanMargin = U2_AqabaCatMargin *
        W2_marginAdjBasedOnWeight *
        X2_marginAdjBasedOnQty *
        V2_marginAdjBasedOnPrice;
      P2_netAmmanMargin = Math.max(P2_netAmmanMargin, pricing_params.minMargin)
      console.log("<doCalculate> cost_breakdown U2_AqabaCatMargin:", U2_AqabaCatMargin)
      console.log("<doCalculate> cost_breakdown P2_netAmmanMargin:", P2_netAmmanMargin)
      // M2_AmmanCost = =AK2*0.71+O2
      if (doDebugOn) console.log( '<doCalculate> AK2_loadedCost / pricing_params.O2_AmmanDeliveryJDParam:',
        AK2_loadedCost + '/' + pricing_params.O2_AmmanDeliveryJDParam.toFixed(2))
      M2_AmmanCost = AK2_loadedCost * 0.71 + pricing_params.O2_AmmanDeliveryJDParam / I2_quantity;
      if (doDebugOn) console.log( "<doCalculate> M2_AmmanCost/(1- P2_netAmmanMargin):", M2_AmmanCost.toFixed(2) + '/' + P2_netAmmanMargin.toFixed(2));
      AN2_ammanSalePricewoTax = M2_AmmanCost / (1 - P2_netAmmanMargin);
      if (doDebugOn) console.log( "<doCalculate> AN2_ammanSalePricewoTax:", AN2_ammanSalePricewoTax.toFixed(2));
      AO2_ammStdPriceWTax = AN2_ammanSalePricewoTax * (1 + AL2_ammanSalesTax);
      AP2_capPrice = 9999999.00;
      if ((B2_price + C2_shipping) > pricing_params.minValueToCapPrice) {
        AP2_capPrice = item.category_info.cap_amm * (B2_price + C2_shipping);
      }
      AR2_usSalesTax = item.category_info.us_tax;
      AQ2_usPriceWithUsTax = ((B2_price + C2_shipping) * (1 + AR2_usSalesTax));

      AS2_aramexShippingCost = DHL.aramexShipRate(Z2_chargeableWeight) / 0.71; // iN USD
      // AT2 = =IF(B2+C2+(B2+C2)*AR2>140,"Y","N")

      if (doDebugOn) console.log( "<doCalculate> AP2_capPrice,AO2_ammStdPriceWTax", AP2_capPrice.toFixed(2) + '/' + AO2_ammStdPriceWTax.toFixed(2))
      finalAmmanPriceStdwTax = Math.min(AP2_capPrice, AO2_ammStdPriceWTax);
      // BQ2  = =IF(BL2+BM2>140,AF2,0)

      // BL2 = =B2+C2
      BL2_itemPriceandShip = B2_price + C2_shipping;
      // BM2 = =INDEX(DHL!L:L,MATCH(Z2*1.05,DHL!A:A))/0.71
      BM2_DHLExpressRate = DHL.getDHLRate(Z2_chargeableWeight * 1.05) / 0.71;
      if (doDebugOn) console.log( "<doCalculate> ***** DHLRate:", BM2_DHLExpressRate);

      BO2_usHandling = AD2_HandlingCostUSD + pricing_params.BN2_paperAWBFeesParam;
      BP2_ShipHandling = BM2_DHLExpressRate + BO2_usHandling;
      AT2_personalWithNoTax = ((BL2_itemPriceandShip + BM2_DHLExpressRate) <= pricing_params.min_taxable_amountParam &&
        (item.category_info.personal_allowed == undefined || item.category_info.personal_allowed) ? true : false)

      console.log("<doCalculate> AT2_personalWithNoTax:", AT2_personalWithNoTax)
      //BQ2_customs = (BL2_itemPriceandShip+BM2_DHLExpressRate>pricing_params.min_taxable_amountParam?
      //  AF2_ammCustoms:0);

      BQ2_customs = (AT2_personalWithNoTax ? 0 : AF2_ammCustoms);
      console.log("<doCalculate> cost_breakdown BQ2_customs:", BQ2_customs);

      // AU2 =
      AU2_Customs = BQ2_customs;
      // BR2 = =IF(BL2+BM2>140,AL2,0)
      BR2_salesTax = (AT2_personalWithNoTax ?
        0 : AL2_ammanSalesTax)

      AV2_salesTax = BR2_salesTax;
      //BS2 = =(BL2+BM2)*(BQ2)

      BS2_customsAmount = (BL2_itemPriceandShip + BM2_DHLExpressRate) * BQ2_customs;
      // BT2 = =(BS2+BL2+BM2)*BR2
      BT2_salesTaxAmount = (BS2_customsAmount + BL2_itemPriceandShip + BM2_DHLExpressRate) * BR2_salesTax;
      AY2_clearanceFee = pricing_params.expressClearanceFeeParam;
      BU2_clearanceFee = AY2_clearanceFee;
      BV2_expressMargin = pricing_params.expressMarginParam;
      // BW2_ =MAX(5,BV2*(BL2+BP2))
      BW2_marginNRisk = Math.max(pricing_params.minExpressFeeParam,
        (BV2_expressMargin * (BL2_itemPriceandShip + BP2_ShipHandling)));
      BX2_marginNRiskJD = BW2_marginNRisk * 0.71;
      // BY2 =BL2+BP2+BW2+BS2+BT2+IF(AT2="Y",AY2,0)

      BY2_finalExpPriceUSD = (BL2_itemPriceandShip + BP2_ShipHandling +
        BW2_marginNRisk + BS2_customsAmount + BT2_salesTaxAmount +
        (AT2_personalWithNoTax ? 0 : AY2_clearanceFee));
      if (doDebugOn) console.log( "<doCalculate> *** BY2_finalExpPriceUSD:", BY2_finalExpPriceUSD)
      BZ2_finalExpPriceJD = BY2_finalExpPriceUSD * 0.71;
      finalExpPriceJD = BZ2_finalExpPriceJD;

      // CA2 = =IF(H2="Amazon", MIN(BC2*0.99,BZ2),BZ2)
      // AW2 = =AQ2*AU2
      AW2_customs = AQ2_usPriceWithUsTax * AU2_Customs;

      // AX2 = =(AQ2+AW2)*AV2
      AX2_salesTaxAmount = (AQ2_usPriceWithUsTax + AW2_customs) * AV2_salesTax;
      // BA2 = =MAX(5,(B2+C2)*(1+AR2)*0.1)
      BA2_cashBashaFees = Math.max(pricing_params.minExpressFeeParam, (B2_price + C2_shipping) * (1 + AR2_usSalesTax) * 0.1);
      // BB2 ==((B2)*(1+AR2)+C2)+AS2+AZ2+BA2+AW2+AX2+IF(AT2="Y",AY2,0)
      AZ2_usFees = 0; // fees charged by competitors in the USA
      BB2_expressPricing = ((B2_price) * (1 + AR2_usSalesTax) + C2_shipping) +
        AS2_aramexShippingCost + AZ2_usFees + BA2_cashBashaFees + AW2_customs + AX2_salesTaxAmount +
        (AT2_personalWithNoTax ? 0 : AY2_clearanceFee);
      BC2_competitorsExpPricingJD = BB2_expressPricing * 0.71;

      BD2_aqabaTax = 1.0 * item.category_info.tax_aqaba.toFixed(2);
      BE2_aqabaClerance = pricing_params.aqabaCleranceRateParam * 1.0;
      BF2_aqabaShipRate = DHL.getAqabaRate(Z2_chargeableWeight) * 1.0

      CA2_finalExpPriceMinJD = (H2_seller == "Amazon" ?
        Math.min(BC2_competitorsExpPricingJD * 0.99, BZ2_finalExpPriceJD) : BZ2_finalExpPriceJD);

      if (doDebugOn) console.log( "<doCalculate> +++ CA2_finalExpPriceMinJD:", CA2_finalExpPriceMinJD);
      if (doDebugOn) console.log( "<doCalculate> H2_seller/BC2_competitorsExpPricingJD/BZ2_finalExpPriceJD\n",
        H2_seller + '/' + BC2_competitorsExpPricingJD + '/' + BZ2_finalExpPriceJD)

      finalExpPriceAmmJD = 1.00 * CA2_finalExpPriceMinJD;
      if (doDebugOn) console.log( "<doCalculate> ******** Final Express Price:", finalExpPriceAmmJD + '/' );
      // BG2 = =AA2*BF2/0.71
      BG2_aqabaShipRate = AA2_weightRateAdjust * BF2_aqabaShipRate * 1.0 / 0.71
      // BH2 = =BG2*Z2
      BH2_aqabaShipping = BG2_aqabaShipRate * Z2_chargeableWeight;
      // BI2 = =(BH2+AE2)*0.71*(1+BE2)

      BI2_aqabaCostwoTaxJD = (BH2_aqabaShipping + AE2_itemCostUSD) * 0.71 * (1.0 + BE2_aqabaClerance);
      // BJ2 =BI2*(1+BD2)
      // BK2 = (BJ2/(1-q2))

      if (doDebugOn) console.log( "<doCalculate> BH2_aqabaShipping/AE2_itemCostUSD/BE2_aqabaClerance:\n",
        BH2_aqabaShipping + '/' + AE2_itemCostUSD + '/' + BE2_aqabaClerance);
      if (doDebugOn) console.log( "<doCalculate> BI2_aqabaCostwoTaxJD/BD2_aqabaTax:", BI2_aqabaCostwoTaxJD + '/' + BD2_aqabaTax);
      BJ2_aqabaCostwTaxJD = 1.0 * BI2_aqabaCostwoTaxJD * (1 + BD2_aqabaTax);
      BK2_AqabaPrice = BJ2_aqabaCostwTaxJD / (1 - Q2_NetAqabaMargin)
      //
      // AqabaPrice
      //=IF(B4<>"",B4,IF(MIN(AO2,AP2)>15+(B2+C2)*0.71*J10,
      //IF(B7="English","Too big or heavy, not cost effective to ship",
      //"  هذه القطعة وزنها الحجمي كبير جدا نسبة الى سعر القطعة.  وقد لا يكون طلبها مجدى"),
      //BJ2/(1-Q2)*IF(K2="Yes",(1+Options!B2),1)))
      if (doDebugOn) console.log( "<doCalculate> BJ2_aqabaCostwTaxJD/Q2_NetAqabaMargin:",
        BJ2_aqabaCostwTaxJD + "/" + Q2_NetAqabaMargin);
      E14_finalStdAqabaPriceJD = 1.0 * BK2_AqabaPrice;
      var finalStdAqabaPriceJD = 1.0 * E14_finalStdAqabaPriceJD.toFixed(2);
      if (doDebugOn) console.log( "<doCalculate> Final Aqaba price: ", E14_finalStdAqabaPriceJD);
      if (doDebugOn) console.log( "<doCalculate> Final standard Amman Price:", finalAmmanPriceStdwTax.toFixed(2));
      if (doDebugOn) console.log( "<doCalculate> ++++ - item:", JSON.stringify(item));
      //pricingMessage = pricingMessage + packageDimensions;
      //pricingMessage = pricingMessage + "\n price in USD:"+item.price + '\n';


      //E13 - MIN(MIN(AO2,AP2),9999)

      E13_finalAmmStdPrice = Math.min(AO2_ammStdPriceWTax * 1.0, AP2_capPrice * 1.0);

      var finalStandardAmmPrice = 1.00 * E13_finalAmmStdPrice.toFixed(2);

      finalExpPriceMinAqabaJD = (1 + pricing_params.aqabaExpressAddedMargin) * finalExpPriceAmmJD.toFixed(2);
      if (doDebugOn) console.log( "<doCalculate> ****** finalStandardAmmPrice:", finalStandardAmmPrice);

      lowestPrice = Math.min(finalExpPriceAmmJD.toFixed(2),
        finalStandardAmmPrice.toFixed(2),
        finalStdAqabaPriceJD.toFixed(2));

      if (doDebugOn) console.log( "<doCalculate> M2_AmmanCost/O2_AmmanDeliveryJDParam/" +
        "P2_netAmmanMargin/Q2_NetAqabaMargin/T2_AmmanCatMargin/" +
        "U2_AqabaCatMargin/V2_marginAdjBasedOnPrice/W2_marginAdjBasedOnWeight/" +
        "X2_marginAdjBasedOnQty/Y2_volumnWeight/Z2_chargeableWeight\n",
        M2_AmmanCost + '/' + pricing_params.O2_AmmanDeliveryJDParam + '/' + P2_netAmmanMargin + '/' + Q2_NetAqabaMargin + '/' + T2_AmmanCatMargin + '/' +
        U2_AqabaCatMargin + '/' + V2_marginAdjBasedOnPrice + '/' + W2_marginAdjBasedOnWeight + '/' + X2_marginAdjBasedOnQty + '/' +
        Y2_volumnWeight + '/' + Z2_chargeableWeight);

      if (doDebugOn) console.log( "<doCalculate> BL2_itemPriceandShip/BM2_DHLExpressRate:\n", BL2_itemPriceandShip + '/' + BM2_DHLExpressRate);
      if (doDebugOn) console.log( "<doCalculate> BN2_paperAWBFeesParam/BO2_usHandling/BP2_ShipHandling/BQ2_customs:\n",
        '/' + pricing_params.BN2_paperAWBFeesParam + '/' + BO2_usHandling + '/' + BP2_ShipHandling + '/' + BQ2_customs);
      if (doDebugOn) console.log( "<doCalculate> BR2_salesTax/BS2_customsAmount/BT2_salesTaxAmount:\n",
        BR2_salesTax + '/' + BS2_customsAmount + '/' + BT2_salesTaxAmount)
      if (doDebugOn) console.log( "<doCalculate> BU2_clearanceFee/BV2_expressMargin/BW2_marginNRisk/BX2_marginNRiskJD:\n",
        BU2_clearanceFee + '/' + BV2_expressMargin + '/' + BW2_marginNRisk)
      if (doDebugOn) console.log( "<doCalculate> BY2_finalExpPriceUSD/BZ2_finalExpPriceJD/CA2_finalExpPriceMinJD:\n",
        BX2_marginNRiskJD + '/' + BY2_finalExpPriceUSD + '/' +
        BZ2_finalExpPriceJD + '/' + CA2_finalExpPriceMinJD);
      if (doDebugOn) console.log( "<doCalculate> AA2_weightRateAdjust/AB2_adjustedShippingCost/" +
        "AC2_ShipAndHandCostUSD/AD2_HandlingCostUSD/AE2_itemCostUSD/" +
        "AF2_ammCustoms/AG2_customsUSD/AH2_costWithCustomsUSD/AI2_clearancePercentParam/" +
        "AJ2_clearanceCost/AK2_loadedCost/AL2_ammanSalesTax\n",
        AA2_weightRateAdjust + '/' + AB2_adjustedShippingCost + '/' +
        AC2_ShipAndHandCostUSD + '/' + AD2_HandlingCostUSD + '/' + AE2_itemCostUSD + '/' +
        AF2_ammCustoms + '/' + AG2_customsUSD + '/' + AH2_costWithCustomsUSD + '/' +
        pricing_params.AI2_clearancePercentParam + '/' + AJ2_clearanceCost + '/' + AK2_loadedCost + '/' +
        AL2_ammanSalesTax);

      if (doDebugOn) console.log( "<doCalculate> AN2_ammanSalePricewoTax/AO2_ammStdPriceWTax/AP2_capPrice\n",
        AN2_ammanSalePricewoTax + '/' + AO2_ammStdPriceWTax + '/' + AP2_capPrice);

      if (doDebugOn) console.log( "<doCalculate> AQ2_usPriceWithUsTax/AR2_usSalesTax/AS2_aramexShippingCost",
        AQ2_usPriceWithUsTax + '/' + AR2_usSalesTax + '/' + AS2_aramexShippingCost);
      if (doDebugOn) console.log( "<doCalculate> AT2_personalWithNoTax/AU2_Customs/AV2_salesTax,AW2_customs",
        AT2_personalWithNoTax + '/' + AU2_Customs + '/' + AV2_salesTax + '/' + AW2_customs);
      if (doDebugOn) console.log( "<doCalculate> AX2_salesTaxAmount/AY2_clearanceFee/AZ2_usFees,BA2_cashBashaFees",
        AX2_salesTaxAmount + '/' + AY2_clearanceFee + '/' + AZ2_usFees, BA2_cashBashaFees);
      if (doDebugOn) console.log( "<doCalculate> BB2_expressPricing/BC2_competitorsExpPricingJD",
        BB2_expressPricing + '/' + BC2_competitorsExpPricingJD)

      //btnTxt = item.title.substring(0,80) + "\n" + btnTxt;

     quote_obj = {
      //  valid:false,
        final: true,
        active: true,
      //  quote_no: item.quote_no ? item.quote_no : -1,
        quote_date: moment().format('x') ,
        item: item,
        prices: {
          amm_exp: {
            destination: "amman",
            type: "personal",
            delivery: "3-5 days Aft Arv",
            price: 1 * Math.ceil(1 * finalExpPriceAmmJD).toFixed(0)
          },
          amm_std: {
            destination: "amman",
            type: "standard",
            delivery: "7-14 days Aft Arv",
            price: 1 * Math.ceil(1 * finalStandardAmmPrice).toFixed(0)
          },
          // aq_exp: {
          //   destination: "aqaba",
          //   type: "personal",
          //   delivery: "14-24 days Aft Arv",
          //   price: 1 * Math.ceil(1 * finalExpPriceMinAqabaJD).toFixed(0)
          // },
          aq_std: {
            destination: "aqaba",
            type: "standard",
            delivery: "11-18 days Aft Arv",
            price: 1 * Math.ceil(1 * finalStdAqabaPriceJD).toFixed(0)
          },
        },
        price_selection: Math.ceil(1 * finalExpPriceAmmJD) < Math.ceil(1 * finalStandardAmmPrice) ? "amm_exp" : "amm_std",
        price: {
          amm_exp: 1 * finalExpPriceAmmJD.toFixed(2),
          amm_std: 1 * finalStandardAmmPrice.toFixed(2),
          aq_exp: 1 * finalExpPriceMinAqabaJD.toFixed(2),
          aq_std: 1 * finalStdAqabaPriceJD.toFixed(2),
          min_price: Math.min(finalExpPriceAmmJD,
            finalStandardAmmPrice,
            finalExpPriceMinAqabaJD,
            finalStdAqabaPriceJD)
        },
        notes: pricingMessage
      }
      if (doDebugOn) console.log("<doCalculate> quote_obj:", JSON.stringify(quote_obj, null, 2))

      if (doDebugOn) console.log("<doCalculate> price selection:", quote_obj.price_selection)
      // reduce size of title
      if (quote_obj.item.title == undefined) quote_obj.item.title = quote_obj.item.url
      quote_obj.item.title = quote_obj.item.title.substring(0, MAX_TITLE_LENGTH);
      // insert new quotation in the database
      // TODO
      if (doDebugOn) console.log( "<doCalculate><> Amman Exp Price - ceil + fixed(2)", Math.ceil(quote_obj.price.amm_exp * 1).toFixed(2))
      //quote_obj.valid = true;
      quote_obj.active = true; // active = should load in customer cart when final
      quote_obj.final = true; // final = pricing complete
      quote_obj.message = "Sales prices calculation completed."
      if (debugOn) console.log("<doCalculate> return quote_obj:", JSON.stringify(quote_obj))
      return quote_obj;

  // }  ,error => {
  //     console.log("<doCalculate> error:",error);
  //      return  Promise.reject(new Error(error));
  // }).catch(err1 => {
  //     console.log("<doCalculate> err1:",err1);
  //     return  Promise.reject(new Error(err1));
  // });
  } catch(err) {
      console.log("<doCalculate> err:",err);
        console.log("<doCalculate> err.message:",err && err.message);
  //  return await Promise.reject(new Error(err));
      throw new Error(err && err.message? err.message:err);
  }
}
export {
  calculatePrice,
  validateItem
} ;
