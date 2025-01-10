const units = [
  "",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
];
const tens = [
  "",
  "Ten",
  "Twenty",
  "Thirty",
  "Forty",
  "Fifty",
  "Sixty",
  "Seventy",
  "Eighty",
  "Ninety",
];
const teens = [
  "Ten",
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
  "Seventeen",
  "Eighteen",
  "Nineteen",
];

const zero = "Zero";
const arab = "Arab";
const crore = "Crore";
const lakh = "Lakh";
const thousand = "Thousand";
const hundred = "Hundred";
const currency = "Rupees";
const paisa = "Paisa";
const only = "Only";

export function convertNumberToWords(amount: number) {
  if (amount === 0) return `${zero} ${currency} ${only}`;

  function convert(num: number): string {
    let parts = [];
    if (num >= 1e9) {
      parts.push(`${convert(Math.floor(num / 1e9))} ${arab}`);
      num %= 1e9;
    }
    if (num >= 1e7) {
      parts.push(`${convert(Math.floor(num / 1e7))} ${crore}`);
      num %= 1e7;
    }
    if (num >= 1e5) {
      parts.push(`${convert(Math.floor(num / 1e5))} ${lakh}`);
      num %= 1e5;
    }
    if (num >= 1000) {
      parts.push(`${convert(Math.floor(num / 1000))} ${thousand}`);
      num %= 1000;
    }
    if (num >= 100) {
      parts.push(`${convert(Math.floor(num / 100))} ${hundred}`);
      num %= 100;
    }
    if (num >= 20) {
      parts.push(`${tens[Math.floor(num / 10)]}`);
      if (num % 10 > 0) parts.push(units[num % 10]);
    } else if (num >= 10) {
      parts.push(`${teens[num - 10]}`);
    } else if (num > 0) {
      parts.push(`${units[num]}`);
    }
    return parts.join(" ");
  }

  let integerPart = Math.floor(amount);
  let wholeWordPart = convert(integerPart);
  let result = wholeWordPart ? `${wholeWordPart} ${currency}` : "";

  let decimalPart = Math.round((amount - integerPart) * 100);
  if (decimalPart > 0) {
    if (wholeWordPart) {
      result += " and ";
    }
    result += `${convert(decimalPart)} ${paisa}`;
  }

  return result.trim() !== "" ? `${result} ${only}` : "";
}
