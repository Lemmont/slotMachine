// Add spin result to history of bets
export function addSpinResult(res, betAmount) {
  const history = document.querySelector("#items");
  const historyClone = history.cloneNode(true);
  const result = document.createElement("div");

  if (res > 0) {
    result.classList.add("gain");
    result.innerHTML = "+" + res;
  } else {
    result.classList.add("loss");
    result.innerHTML = res;
  }

  const item = document.createElement("div");
  item.classList.add("item");
  const bet = document.createElement("div");
  bet.classList.add("historicalBet");
  bet.innerHTML = betAmount;

  item.appendChild(bet);
  item.appendChild(result);

  historyClone.appendChild(item);

  history.replaceWith(historyClone);
}

/* <div class="item">
            <div class="historicalBet">2</div>
            <div class="gain">+3</div>
          </div>
        </div> */
