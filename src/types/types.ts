// export interface data {
//   type: "FeatureCollection",
//     metadata: {
//     generated: Long Integer,
//     url: String,
//     title: String,
//     api: String,
//     count: Integer,
//     status: Integer
// },
//   bbox: [
//     minimum longitude,
//     minimum latitude,
//     minimum depth,
//     maximum longitude,
//     maximum latitude,
//     maximum depth
//   ],
//     features: [
//   {
//     type: "Feature",
//     properties: {
//       mag: Decimal,
//       place: String,
//       time: Long Integer,
//       updated: Long Integer,
//       tz: Integer,
//       url: String,
//       detail: String,
//       felt:Integer,
//       cdi: Decimal,
//       mmi: Decimal,
//       alert: String,
//       status: String,
//       tsunami: Integer,
//       sig:Integer,
//       net: String,
//       code: String,
//       ids: String,
//       sources: String,
//       types: String,
//       nst: Integer,
//       dmin: Decimal,
//       rms: Decimal,
//       gap: Decimal,
//       magType: String,
//       type: String
//     },
//     geometry: {
//       type: "Point",
//       coordinates: [
//         longitude,
//         latitude,
//         depth
//       ]
//     },
//     id: String
//   }
// ]
// }

export interface Earthquake {
  id: string;
  place: string;
  time: number;
  magnitude: number;
  coordinates: number[];
  tsunami: number;
  title: string;
  hypocenter: number;
  url: string;
}
