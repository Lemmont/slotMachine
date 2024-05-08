import { init, slotItems, slotRewards } from "./settings.js";
import { showPopUp } from "./popup.js";
import { updateWallet, checkWallet } from "./wallet.js";
import { addSpinResult } from "./history.js";

(function () {
  ("use strict");

  /* Init some variables */
  let wallet = init;
  const items = slotItems;
  const value = slotRewards;

  document.querySelector(".info").textContent = items.join(" ");
  const slots = document.querySelectorAll(".slot");
  document.querySelector("#spinner").addEventListener("click", spin);
  document.querySelector("#money").textContent = wallet;

  /* Check result of spin */
  function checkSpin(pools) {
    const arrr = [""];
    for (const pool of pools) {
      arrr[0] = arrr[0] + pool.slice(-1)[0];
    }

    const hits = [];
    for (const item of Object.keys(value)) {
      if (arrr[0].includes(item)) {
        hits.push(item);
      }
    }

    const mults = [];
    for (const item of hits) {
      mults.push(value[item]);
    }
    return mults.length > 0 ? Math.max(...mults) : 0.0;
  }

  async function spin() {
    // get bet size
    const betAmount = document.querySelector("#bet").value;
    const status = checkWallet(betAmount);
    if (status == "true") {
      updateWallet("-" + betAmount);
      showPopUp(`Betted $${parseFloat(betAmount)}`, "success");
    } else if (status == "invalid") {
      showPopUp(`Invalid bet`, "error");
      return;
    } else if (status == "minus") {
      showPopUp(`Insufficient funds`, "error");
      return;
    }

    let dur = 3;
    const pools = initSlots(false, 1, dur);
    document.querySelector("#spinner").disabled = true;
    for (const slot of slots) {
      const boxes = slot.querySelector(".boxes");
      const duration = parseInt(boxes.style.transitionDuration);
      boxes.style.transform = "translateY(0)";
      await new Promise((resolve) => setTimeout(resolve, duration * 100));
    }
    await new Promise((resolve) =>
      setTimeout(resolve, dur * slots.length * 300)
    ).then(() => {
      const mult = checkSpin(pools);
      const gain =
        mult > 0.0 ? parseFloat(betAmount) * mult : parseFloat(betAmount) * -1;
      if (gain > 0.0) {
        updateWallet(gain);
      }
      addSpinResult(gain, parseFloat(betAmount));
      document.querySelector("#spinner").disabled = false;
    });
  }

  function initSlots(firstInit = true, groups = 1, duration = 1) {
    const pools = [];
    for (const slot of slots) {
      if (slot.dataset.spinned === "1") {
        slot.dataset.spinned = "0";
      }

      const boxes = slot.querySelector(".boxes");
      const boxesClone = boxes.cloneNode(false);

      const pool = ["❌"];

      if (!firstInit) {
        const arr = [];
        for (let n = 0; n < (groups > 0 ? groups : 1); n++) {
          arr.push(...items);
        }
        pool.push(...shuffle(arr));

        boxesClone.addEventListener(
          "transitionstart",
          function () {
            slot.dataset.spinned = "1";
            this.querySelectorAll(".box").forEach((box) => {
              box.style.filter = "blur(1px)";
            });
          },
          { once: true }
        );

        boxesClone.addEventListener(
          "transitionend",
          function () {
            this.querySelectorAll(".box").forEach((box, index) => {
              box.style.filter = "blur(0)";
              if (index > 0) {
                this.removeChild(box);
              }
            });
          },
          { once: true }
        );
      }
      // if only "❌", then only that element is added
      for (let i = pool.length - 1; i >= 0; i--) {
        const box = document.createElement("div");
        box.classList.add("box");
        box.style.width = slot.clientWidth + "px";
        box.style.height = slot.clientHeight + "px";
        box.textContent = pool[i];
        boxesClone.appendChild(box);
      }

      boxesClone.style.transitionDuration = `${duration > 0 ? duration : 1}s`;
      boxesClone.style.transform = `translateY(-${
        slot.clientHeight * (pool.length - 1)
      }px)`;
      slot.replaceChild(boxesClone, boxes);

      if (!firstInit) {
        pools.push(pool);
      }
    }
    function shuffle([...arr]) {
      let m = arr.length;
      while (m) {
        const i = Math.floor(Math.random() * m--);
        [arr[m], arr[i]] = [arr[i], arr[m]];
      }
      return arr;
    }

    if (!firstInit) {
      return pools;
    }
  }

  initSlots();
})();
