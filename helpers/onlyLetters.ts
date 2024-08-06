export function onlyLetters(value: string) {
   return value.replace(/[^A-Za-z\s]/g, '')
}
