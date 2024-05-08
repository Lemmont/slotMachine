// Show popup with related message based on action
export function showPopUp(message, type) {
  const popup = document.querySelector("#popup");
  popup.innerHTML = message;

  if (popup.classList.contains("show")) {
    return;
  }

  if (type == "error") {
    popup.classList.add("error");
  }
  popup.classList.remove("init");
  popup.classList.add("show");

  setTimeout(() => {
    popup.classList.remove("show");
    popup.classList.add("init");
    clearStyle(popup);
  }, 3000);
}

function clearStyle(popup) {
  popup.classList.remove("error");
  popup.classList.remove("success");
}
