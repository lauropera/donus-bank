// export default function formatFloatNumber(number) {
//   const splittedNumber = String(number).split('.');
//   const firstDecimalPlace = splittedNumber[1][0];
//   const secondDecimalPlace = splittedNumber[1][1];

//   if (firstDecimalPlace === '0' && !secondDecimalPlace) {
//     return `${splittedNumber[0]}.0`;
//   }
//   if (secondDecimalPlace) {
//     return `${splittedNumber[0]}.${firstDecimalPlace}${secondDecimalPlace}`;
//     console.log(
//       `${splittedNumber[0]}.${firstDecimalPlace}${secondDecimalPlace}`
//     );
//   }
// }
