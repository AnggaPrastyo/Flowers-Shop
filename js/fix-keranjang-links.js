// File: js/fix-keranjang-links.js
// Script untuk memperbaiki link keranjang di seluruh website

document.addEventListener("DOMContentLoaded", function () {
  // Perbaiki link keranjang di semua halaman
  fixCartLinks();
});

// Fungsi untuk memperbaiki link keranjang
function fixCartLinks() {
  // Cari semua link yang berisi icon keranjang
  const cartIcons = document.querySelectorAll(".bi-cart2");

  // Loop melalui semua icon keranjang
  cartIcons.forEach((icon) => {
    // Dapatkan parent link
    const parentLink = icon.closest("a");

    if (parentLink) {
      // Jika link tidak mengarah ke keranjang.html, perbaiki
      if (!parentLink.href.includes("keranjang.html")) {
        parentLink.href = "keranjang.html";
      }
    }
  });

  // Update jumlah item di keranjang
  updateCartBadges();
}

// Fungsi untuk memperbarui jumlah item di badge keranjang
function updateCartBadges() {
  // Ambil data keranjang dari localStorage
  const keranjang = JSON.parse(localStorage.getItem("keranjang")) || [];

  // Hitung total item
  const totalItems = keranjang.reduce((total, item) => total + item.jumlah, 0);

  // Dapatkan semua badge keranjang
  const badges = document.querySelectorAll(".badge-keranjang");

  // Update semua badge
  badges.forEach((badge) => {
    badge.textContent = totalItems;
    badge.style.display = totalItems > 0 ? "flex" : "none";
  });
}
