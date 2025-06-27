export function formatDate(date) {
  return new Date(date)
    .toLocaleString('vi', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'Asia/Ho_Chi_Minh',
    })
    .split(' ')
    .reverse()
    .join(' ');
}
export function formatDate2(date) {
  return new Date(date).toLocaleDateString('vi', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'Asia/Ho_Chi_Minh',
  })
  // .split(' ')
  // .reverse()
  // .join(' ');
}

export function formatNumber(number) {
  return new Intl.NumberFormat('vi-VN').format(number);
}