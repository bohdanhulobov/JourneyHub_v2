function showBanner() {
  const banner = document.querySelector(".promo-banner");
  banner.classList.add("show");
  banner.style.display = "block";
}

function hideBanner() {
  const banner = document.querySelector(".promo-banner");
  banner.classList.remove("show");
  setTimeout(() => {
    banner.style.display = "none";
  }, 500);
}

window.onload = function () {
  setTimeout(showBanner, 2000);
};
