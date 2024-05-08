// Show popup with related message based on action
export function showPopUp(message, type) {
  const popup = document.querySelector("#popup");

  if (popup.classList.contains("show") && message == popup.innerHTML) {
    return;
  } else {
    clearStyle(popup);
  }

  popup.innerHTML = message;

  if (type == "error") {
    popup.classList.add("error");
  } else if (type == "success") {
    popup.classList.add("success");
  }
  popup.classList.remove("init");
  popup.classList.add("show");

  setTimeout(() => {
    popup.classList.remove("show");
    popup.classList.add("init");
    clearStyle(popup);
    popup.innerHTML = "";
  }, 3000);
}

function clearStyle(popup) {
  popup.classList.remove("error");
  popup.classList.remove("success");
}
