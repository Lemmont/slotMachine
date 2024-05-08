export function updateWallet(betAmount) {
  const currentMoney = parseFloat(document.querySelector("#money").innerHTML);
  const newMoney = currentMoney + parseFloat(betAmount);

  document.querySelector("#money").innerHTML = parseFloat(newMoney);
}

export function checkWallet(betAmount) {
  if (
    typeof parseFloat(betAmount) != "number" ||
    isNaN(parseFloat(betAmount)) ||
    parseFloat(betAmount) <= 0
  ) {
    return "invalid";
  }

  if (
    parseFloat(betAmount) >
    parseFloat(document.querySelector("#money").innerHTML)
  ) {
    return "minus";
  }

  return "true";
}
