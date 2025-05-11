// File: tombol-keranjang-plus-fixed.js
// Fungsi untuk menambahkan tombol keranjang dan mengatur fungsionalitasnya

document.addEventListener("DOMContentLoaded", function () {
  // Fungsi untuk menambahkan tombol keranjang di sebelah tombol pesan sekarang
  function addCartButtons() {
    // Cari semua tombol "Pesan Sekarang"
    const orderButtons = document.querySelectorAll(
      'a.cta-pesan, a.btn-order, a[href="javascript:void(0)"].cta-pesan'
    );

    // Loop melalui setiap tombol
    orderButtons.forEach((orderButton) => {
      // Dapatkan data produk dari atribut data-*
      const id = orderButton.getAttribute("data-id");
      const nama = orderButton.getAttribute("data-nama");
      const harga = orderButton.getAttribute("data-harga");

      // Pastikan ini adalah tombol pesan sekarang yang valid
      if (id && nama && harga) {
        // Buat container untuk kedua tombol
        const buttonContainer = document.createElement("div");
        buttonContainer.className = "product-buttons";

        // Buat tombol keranjang
        const cartButton = document.createElement("button");
        cartButton.className = "btn-product btn-cart";
        cartButton.innerHTML = '<i class="bi bi-cart-plus"></i>';
        cartButton.setAttribute("data-id", id);
        cartButton.setAttribute("data-nama", nama);
        cartButton.setAttribute("data-harga", harga);
        cartButton.setAttribute("title", "Tambahkan ke keranjang");

        // Ubah tombol pesan sekarang menjadi button
        const newOrderButton = document.createElement("button");
        newOrderButton.className = "btn-product btn-order";
        newOrderButton.innerText = "Pesan Sekarang";
        newOrderButton.setAttribute("data-id", id);
        newOrderButton.setAttribute("data-nama", nama);
        newOrderButton.setAttribute("data-harga", harga);

        // Tambahkan kedua tombol ke container
        buttonContainer.appendChild(cartButton);
        buttonContainer.appendChild(newOrderButton);

        // Ganti tombol lama dengan container
        orderButton.parentNode.replaceChild(buttonContainer, orderButton);

        // Tambahkan event listener untuk tombol keranjang
        cartButton.addEventListener("click", function () {
          const productId = this.getAttribute("data-id");
          const productName = this.getAttribute("data-nama");
          const productPrice = parseInt(this.getAttribute("data-harga"));

          // Tambahkan ke keranjang permanen
          addToCart(productId, productName, productPrice);

          // Tampilkan notifikasi
          showNotification(
            `${productName} berhasil ditambahkan ke keranjang!`,
            "success"
          );
        });

        // Tambahkan event listener untuk tombol pesan sekarang
        newOrderButton.addEventListener("click", function () {
          const productId = this.getAttribute("data-id");
          const productName = this.getAttribute("data-nama");
          const productPrice = parseInt(this.getAttribute("data-harga"));

          // Simpan produk ini saja ke localStorage sementara untuk checkout
          const singleItemCart = [
            {
              id: productId,
              nama: productName,
              harga: productPrice,
              jumlah: 1,
            },
          ];

          // Gunakan localStorage dengan key berbeda untuk produk langsung checkout
          localStorage.setItem(
            "checkoutDirect",
            JSON.stringify(singleItemCart)
          );

          // Redirect ke halaman checkout
          window.location.href = "checkout.html?direct=true";
        });
      }
    });
  }

  // Fungsi untuk menambahkan produk ke keranjang
  function addToCart(id, nama, harga, jumlah = 1) {
    // Ambil data keranjang dari localStorage
    let keranjang = JSON.parse(localStorage.getItem("keranjang")) || [];

    // Cek apakah produk sudah ada di keranjang
    const existingItemIndex = keranjang.findIndex((item) => item.id === id);

    if (existingItemIndex !== -1) {
      // Jika produk sudah ada, tambahkan jumlahnya
      keranjang[existingItemIndex].jumlah += jumlah;
    } else {
      // Jika produk belum ada, tambahkan sebagai item baru
      keranjang.push({
        id: id,
        nama: nama,
        harga: harga,
        jumlah: jumlah,
      });
    }

    // Simpan kembali ke localStorage
    localStorage.setItem("keranjang", JSON.stringify(keranjang));

    // Update tampilan jumlah item di badge keranjang
    updateCartBadge();

    return keranjang;
  }

  // Fungsi untuk update badge keranjang
  function updateCartBadge() {
    const keranjang = JSON.parse(localStorage.getItem("keranjang")) || [];
    const totalItems = keranjang.reduce(
      (total, item) => total + item.jumlah,
      0
    );

    const badgeElements = document.querySelectorAll(".badge-keranjang");
    badgeElements.forEach((badge) => {
      badge.textContent = totalItems;
      badge.style.display = totalItems > 0 ? "flex" : "none";
    });
  }

  // Fungsi untuk menampilkan notifikasi
  function showNotification(message, type = "success") {
    // Hapus notifikasi yang ada
    const existingNotification = document.querySelector(".notification");
    if (existingNotification) {
      existingNotification.remove();
    }

    // Buat elemen notifikasi
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="bi ${
          type === "success" ? "bi-check-circle" : "bi-exclamation-circle"
        }"></i>
        <span>${message}</span>
      `;

    // Tambahkan ke body
    document.body.appendChild(notification);

    // Tampilkan notifikasi dengan animasi
    setTimeout(() => {
      notification.classList.add("show");
    }, 10);

    // Sembunyikan notifikasi setelah beberapa detik
    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 3000);
  }

  // Load CSS untuk tombol
  function loadCSS() {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "css/tombol-keranjang-plus.css";
    document.head.appendChild(link);
  }

  // Jalankan fungsi
  loadCSS();
  addCartButtons();
  updateCartBadge();
});

// Modifikasi untuk checkout.js
// Tambahkan kode ini di awal file checkout.js atau gunakan script berikut di halaman checkout.html
if (window.location.href.includes("checkout.html")) {
  document.addEventListener("DOMContentLoaded", function () {
    // Cek apakah ada parameter direct=true di URL
    const urlParams = new URLSearchParams(window.location.search);
    const isDirect = urlParams.get("direct") === "true";

    if (isDirect) {
      // Jika ini adalah checkout langsung, gunakan data dari checkoutDirect
      const directItem =
        JSON.parse(localStorage.getItem("checkoutDirect")) || [];

      // Hanya jika ada data langsung
      if (directItem.length > 0) {
        // Simpan sementara keranjang asli jika ada
        const originalCart = localStorage.getItem("keranjang");
        if (originalCart) {
          localStorage.setItem("keranjangBackup", originalCart);
        }

        // Gunakan item langsung untuk checkout
        localStorage.setItem("keranjang", JSON.stringify(directItem));

        // Setelah checkout selesai (pada fungsi processOrder), kembalikan keranjang asli
        // Ini perlu ditambahkan ke file checkout.js
        const originalProcessOrder = window.processOrder;
        if (typeof originalProcessOrder === "function") {
          window.processOrder = function () {
            // Panggil fungsi asli
            const result = originalProcessOrder.apply(this, arguments);

            // Kembalikan keranjang asli jika ada
            const backupCart = localStorage.getItem("keranjangBackup");
            if (backupCart) {
              localStorage.setItem("keranjang", backupCart);
              localStorage.removeItem("keranjangBackup");
            }

            // Hapus data checkout langsung
            localStorage.removeItem("checkoutDirect");

            return result;
          };
        }
      }
    }
  });
}
