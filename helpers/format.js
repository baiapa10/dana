function formatCurrency(amount, currency = 'IDR') {
  if (amount === null || amount === undefined) return '-';

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency
  }).format(amount);
}

module.exports = {
  formatCurrency
};
