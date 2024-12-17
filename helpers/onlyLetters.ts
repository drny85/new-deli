export function onlyLetters(value: string) {
   return value.replace(/[^A-Za-z\s]/g, '')
}

//only numbers
export function onlyNumbers(value: string): string {
   return value
      .replace(/[^0-9.]/g, '') // Allow only numbers and periods
      .replace(/(\..*?)\./g, '$1') // Remove additional periods
}
