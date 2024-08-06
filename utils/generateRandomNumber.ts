export function generateRandomNumbers(): number {
   let randomNumber = 0

   while (randomNumber < 1000 || randomNumber > 9999 || /[0]/.test(randomNumber.toString())) {
      randomNumber = Math.floor(Math.random() * 9000) + 1000
   }

   return randomNumber
}
