var aqabaRate = [
4.00,
3.60 ,
3.20 ,
2.80 ,
2.40 ,
2.32 ,
2.20 ,
2.00 ,
1.60 ,
1.20 ,
1.04 ,
0.96 ,
0.80 ,
0.72 ,
0.68 ,
0.64 ,
0.60
];

var aqabaRateWt = [
  0,
0.50,
0.75 ,
1.00 ,
2.00 ,
5.00 ,
10.00 ,
15.00 ,
25.00 ,
30.00 ,
50.00 ,
90.00 ,
100.00 ,
120.00 ,
150.00 ,
170.00 ,
180.00 ,
1000000000
];

var DHLLargeShipRate = [
  4.01715,
4.01715,
8.0343,
8.0343,
12.05145,
12.05145,
16.0686,
16.0686,
20.08575,
20.08575,
24.1029,
24.1029,
28.12005,
28.12005,
32.1372,
32.1372,
36.15435,
36.15435,
40.1715,
40.1715,
44.18865,
44.18865,
48.2058,
48.2058,
52.22295,
52.22295,
56.2401,
56.2401,
60.25725,
60.25725,
64.2744,
64.2744,
68.29155,
68.29155,
72.3087,
72.3087,
76.32585,
76.32585,
80.343,
80.343,
84.36015,
84.36015,
88.3773,
88.3773,
92.39445,
92.39445,
96.4116,
96.4116,
100.42875,
100.42875,
104.4459,
104.4459,
108.46305,
108.46305,
112.4802,
112.4802,
116.49735,
116.49735,
120.5145,
120.5145,
124.53165,
124.53165,
128.5488,
128.5488,
132.56595,
132.56595,
136.5831,
136.5831,
140.60025,
140.60025,
144.6174,
144.6174,
148.63455,
148.63455,
152.6517,
152.6517,
156.66885,
156.66885,



// 9.223,
// 13.334,
// 20.334,
// 27.334,
// 33.334,
// 35.334,
// 37.334,
// 39.334,
// 41.334,
// 43.334,
// 45.334,
// 47.334,
// 49.334,
// 51.334,
// 53.334,
// 55.334,
// 57.334,
// 59.334,
// 61.334,
// 63.334,
// 67.334,
// 71.334,
// 75.334,
// 79.334,
// 83.334,
// 87.334,
// 91.334,
// 95.334,
// 99.334,
// 103.334,
// 107.334,
// 111.334,
// 115.334,
// 119.334,
// 123.334,
// 127.334,
// 131.334,
// 135.334,
// 139.334,
// 143.334
];

var DHLLargeShipRateWT = [50.0,70.0,300.0,10000000000];
var DHLLargeShipRate1 = [4.1,4.08,4.05,4.0];
var DHLExpressRate = [
  // includes 13% surcharge and w/o 16% tax
  7.4084608,
  7.4084608,
  10.9340608,
  14.4596608,
  17.9852608,
  21.5108608,
  25.0364608,
  28.5620608,
  32.0876608,
  35.6132608,

  // 6.304,
  // 6.304,
  // 9.304,
  // 12.304,
  // 15.304,
  // 18.304,
  // 21.304,
  // 24.304,
  // 27.304,
  // 30.304
];

module.exports = {
    getAqabaRate: function( weight ) { // weight in KG
      for (i=1 ; i <aqabaRateWt.length; i++ ) {
        if (2.2*weight < aqabaRateWt[i]) { // aqabaRateWt in pounds
          console.log("****** Aqaba Rate:",aqabaRate[i-1])
          return aqabaRate[i-1];
        }
    }
  },

  aramexShipRate: function(weightKG) {
    console.log("<aramexShipRate> weightKG:",weightKG)
    if (weightKG <=0) weightKG=0.01
    v = Math.floor(weightKG/0.5)

    m = Math.ceil(weightKG % 0.5)
   var aramexFirst05 = 8.40; // JD
    var aramexMultiple = 6.80; // JD per 1/2 KG
    var price = (aramexFirst05+ (v+m-1)*aramexMultiple);

    return parseFloat(price.toFixed(2))
  },

  getDHLRate: function( weight ) {
 // weight in KG
 console.log("====> In getDHLRate ")
  if (weight <= 0 ) return 0;
    var index = weight * 2 ;
   index = Math.ceil(index)-1;

  if (weight > 5) {
    if (index < DHLLargeShipRate.length ) {
      return DHLLargeShipRate[index];
    } else {
      // no rate in DHLLargeShipRate - compute based on
      for (i=1 ; i <DHLLargeShipRateWT.length; i++ ) {
        if (weight < DHLLargeShipRateWT[i]) {

          return DHLLargeShipRate1[i-1]*weight;
        }
      }
    }
  } else {
    // weight less than or equal to 5
    return DHLExpressRate[index]; // includes surcharge and tax
  }

  }
}
// end of dhlrate.js
