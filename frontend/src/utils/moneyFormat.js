export default function moneyFormat(value) {
  return value.replace(/[^0-9 \.,]/, '').replace(',', '.');
}
