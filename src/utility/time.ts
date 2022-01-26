export function toDay(date: Date) {
  return [
    date.getFullYear().toString().padStart(4, '0'),
    date.getMonth().toString().padStart(2, '0'),
    date.getDate().toString().padStart(2, '0'),
  ].join('-')
}
