// File: js/tombol-keranjang-plus-fixed.js
// Script untuk memperbaiki tombol keranjang plus di semua halaman

document.addEventListener("DOMContentLoaded", function () {
  // Temukan semua tombol keranjang dan order
  setupProductButtons();

  // Tambahkan event listener untuk tombol cart
  setupCartButtonListeners();

  // Tambahkan event listener untuk tombol order
  setupOrderButtonListeners();
});

// Fungsi untuk setup tombol-tombol produk
function setupProductButtons() {
  // Pastikan bahwa setiap tombol product-buttons memiliki struktur yang benar
  const productButtons = document.querySelectorAll(".product-buttons");

  productButtons.forEach((buttonContainer) => {
    // Dapatkan data-id, data-nama, dan data-harga dari container atau tombol di dalamnya
    let id, nama, harga;

    // Coba dapatkan dari container
    id = buttonContainer.getAttribute("data-id");
    nama = buttonContainer.getAttribute("data-nama");
    harga = buttonContainer.getAttribute("data-harga");

    // Jika tidak ada di container, coba dapatkan dari tombol order
    if (!id || !nama || !harga) {
      const orderButton = buttonContainer.querySelector(".btn-order");
      if (orderButton) {
        id = orderButton.getAttribute("data-id");
        nama = orderButton.getAttribute("data-nama");
        harga = orderButton.getAttribute("data-harga");
      }
    }

    // Jika masih tidak ada, coba dapatkan dari tombol cart
    if (!id || !nama || !harga) {
      const cartButton = buttonContainer.querySelector(".btn-cart");
      if (cartButton) {
        id = cartButton.getAttribute("data-id");
        nama = cartButton.getAttribute("data-nama");
        harga = cartButton.getAttribute("data-harga");
      }
    }

    // Jika data ditemukan, pastikan kedua tombol memiliki atribut data yang sama
    if (id && nama && harga) {
      const cartButton = buttonContainer.querySelector(".btn-cart");
      const orderButton = buttonContainer.querySelector(".btn-order");

      if (cartButton) {
        cartButton.setAttribute("data-id", id);
        cartButton.setAttribute("data-nama", nama);
        cartButton.setAttribute("data-harga", harga);
      }

      if (orderButton) {
        orderButton.setAttribute("data-id", id);
        orderButton.setAttribute("data-nama", nama);
        orderButton.setAttribute("data-harga", harga);
      }
    }
  });
}

// Fungsi untuk setup tombol cart listeners
function setupCartButtonListeners() {
  const cartButtons = document.querySelectorAll(".btn-cart");

  cartButtons.forEach((button) => {
    // Hapus event listeners lama
    const newButton = button.cloneNode(true);
    if (button.parentNode) {
      button.parentNode.replaceChild(newButton, button);
    }

    // Tambahkan event listener baru
    newButton.addEventListener("click", function () {
      const id = this.getAttribute("data-id");
      const nama = this.getAttribute("data-nama");
      const harga = parseInt(this.getAttribute("data-harga"));

      if (id && nama && harga) {
        // Cek apakah fungsi tambahKeKeranjang tersedia
        if (typeof tambahKeKeranjang === "function") {
          tambahKeKeranjang(id, nama, harga);

          // Tampilkan notifikasi
          if (typeof tampilkanNotifikasi === "function") {
            tampilkanNotifikasi(
              `${nama} berhasil ditambahkan ke keranjang!`,
              "success"
            );
          } else {
            alert(`${nama} berhasil ditambahkan ke keranjang!`);
          }
        } else {
          // Fallback jika fungsi tidak tersedia
          alert(`${nama} berhasil ditambahkan ke keranjang!`);
        }
      } else {
        console.error("Data produk tidak lengkap:", id, nama, harga);
      }
    });
  });
}

// Fungsi untuk setup tombol order listeners
function setupOrderButtonListeners() {
  const orderButtons = document.querySelectorAll(".btn-order");

  orderButtons.forEach((button) => {
    // Hapus event listeners lama
    const newButton = button.cloneNode(true);
    if (button.parentNode) {
      button.parentNode.replaceChild(newButton, button);
    }

    // Tambahkan event listener baru
    newButton.addEventListener("click", function () {
      const id = this.getAttribute("data-id");
      const nama = this.getAttribute("data-nama");
      const harga = parseInt(this.getAttribute("data-harga"));

      if (id && nama && harga) {
        // Cek login terlebih dahulu
        const isLoggedIn = checkLoginStatus();

        if (isLoggedIn) {
          if (typeof pesanProduk === "function") {
            pesanProduk(id, nama, harga);
          } else {
            alert(`Memesan ${nama} - Rp ${harga}`);
          }
        } else {
          // Tampilkan pesan login
          alert("Silakan login terlebih dahulu untuk melanjutkan pembelian");

          // Redirect ke halaman login
          setTimeout(() => {
            window.location.href = "login.html?redirect=kategori-produk";
          }, 1000);
        }
      } else {
        console.error("Data produk tidak lengkap:", id, nama, harga);
      }
    });
  });
}

// Fungsi untuk memeriksa status login
function checkLoginStatus() {
  // Cek apakah ada fungsi global untuk memeriksa login
  if (typeof cekLogin === "function") {
    return cekLogin();
  }

  // Fallback jika tidak ada fungsi global
  const userData = JSON.parse(localStorage.getItem("user"));
  return userData !== null && userData.isLoggedIn === true;
}
