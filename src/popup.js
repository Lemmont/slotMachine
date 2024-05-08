// Show popup with related message based on action
export function showPopUp(message) {
  const popup = document.querySelector("#popup");
  popup.innerHTML = message;
  popup.classList.remove("init");
  popup.classList.add("show");

  setTimeout(() => {
    popup.classList.remove("show");
    popup.classList.add("init");
  }, 3000);
}
