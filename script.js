(function () {
  "use strict";
  let wallet = 200;
  const items = ["💰", "🍒", "🍀", "🎰", "🎲", "🍇", "🍉", "🍋", "🍓"];

  document.querySelector(".info").textContent = items.join(" ");

  const slots = document.querySelectorAll(".slot");

  document.querySelector("#spinner").addEventListener("click", spin);
  document.querySelector("#money").textContent = wallet;

  function showPopUp(message) {
    const popup = document.querySelector("#popup");
    popup.innerHTML = message;
    popup.classList.remove("init");
    popup.classList.add("show");

    setTimeout(() => {
      popup.classList.remove("show");
      popup.classList.add("init");
    }, 3000);
  }

  /* Check result of spin */
  function check(pools) {
    const arr = [[]];
    for (const pool of pools) {
      console.log(pool.slice(-1));
    }
  }

  function updateWallet(betAmount) {
    const currentMoney = parseFloat(document.querySelector("#money").innerHTML);
    const newMoney = currentMoney - parseFloat(betAmount);

    document.querySelector("#popup").innerHTML = `Betted ${betAmount}`;
    showPopUp(`Betted $${betAmount}`);

    console.log(currentMoney, parseFloat(betAmount), newMoney);
    document.querySelector("#money").innerHTML = parseFloat(newMoney);
  }

  function checkWallet(betAmount) {
    if (
      typeof parseFloat(betAmount) != "number" ||
      isNaN(parseFloat(betAmount))
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

  async function spin() {
    // get bet size
    const betAmount = document.querySelector("#bet").value;
    const status = checkWallet(betAmount);
    if (status == "true") {
      updateWallet(betAmount);
    } else if (status == "invalid") {
      showPopUp(`Invalid bet`);
      return;
    } else if (status == "minus") {
      showPopUp(`Insufficient funds`);
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
      check(pools);
      document.querySelector("#spinner").disabled = false;
    });
  }

  function initSlots(firstInit = true, groups = 1, duration = 1) {
    const pools = [];
    for (const slot of slots) {
      // reset button
      //   if (firstInit) {
      //     slot.dataset.spinned = "0";
      //   } else if (slot.dataset.spinned === "1") {
      //     return
      //   }

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
