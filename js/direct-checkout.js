// File: direct-checkout.js
// Script untuk menangani pembelian langsung tanpa mencampur keranjang

document.addEventListener("DOMContentLoaded", function () {
  console.log("Direct checkout script loaded");

  // ----- BAGIAN 1: HALAMAN INDEX/PRODUK -----

  // Fungsi untuk menangani tombol "Pesan Sekarang" di halaman produk
  function setupDirectOrderButtons() {
    const orderButtons = document.querySelectorAll(
      'a.cta-pesan, a.btn-order, a[href="javascript:void(0)"].cta-pesan, .btn-order'
    );

    orderButtons.forEach((button) => {
      // Clone tombol untuk menghapus event handler lama
      const newButton = button.cloneNode(true);
      if (button.parentNode) {
        button.parentNode.replaceChild(newButton, button);
      }

      // Tambahkan event handler baru
      newButton.addEventListener("click", function (e) {
        e.preventDefault();

        // Dapatkan data produk
        const id = this.getAttribute("data-id");
        const nama = this.getAttribute("data-nama");
        const harga = parseInt(this.getAttribute("data-harga"));

        if (id && nama && harga) {
          console.log(`Pesan langsung produk: ${nama}`);

          // Buat objek produk tunggal untuk checkout
          const singleProduct = [
            {
              id: id,
              nama: nama,
              harga: harga,
              jumlah: 1,
            },
          ];

          // Simpan ke localStorage dengan key berbeda
          localStorage.setItem("directCheckout", JSON.stringify(singleProduct));

          // Redirect ke checkout dengan parameter mode
          window.location.href = "checkout.html?mode=direct";
        }
      });
    });
  }

  // Jika kita berada di halaman produk/index, setup tombol pesan langsung
  if (!window.location.href.includes("checkout.html")) {
    setupDirectOrderButtons();
  }

  // ----- BAGIAN 2: HALAMAN CHECKOUT -----

  // Jika kita berada di halaman checkout
  if (window.location.href.includes("checkout.html")) {
    // Deteksi mode checkout: direct atau cart
    const urlParams = new URLSearchParams(window.location.search);
    const checkoutMode = urlParams.get("mode");

    console.log(`Mode checkout: ${checkoutMode}`);

    // Step 1: Override fungsi tampilan keranjang pada halaman checkout
    if (typeof window.loadKeranjang === "function") {
      const originalLoadKeranjang = window.loadKeranjang;

      window.loadKeranjang = function () {
        if (checkoutMode === "direct") {
          // Mode checkout langsung: gunakan data dari directCheckout
          const directData =
            JSON.parse(localStorage.getItem("directCheckout")) || [];

          // Ganti keranjang hanya untuk tampilan, tidak menyimpan ke localStorage
          processCheckoutItems(directData);

          console.log("Checkout langsung dengan item:", directData);
        } else {
          // Mode keranjang reguler: lanjutkan dengan fungsi asli
          originalLoadKeranjang.apply(this, arguments);
        }
      };
    }

    // Fungsi untuk memproses item checkout tanpa menyimpan ke localStorage
    function processCheckoutItems(items) {
      // Ambil elemen yang perlu diupdate
      const keranjangKosong = document.getElementById("keranjang-kosong");
      const keranjangItems = document.getElementById("keranjang-items");
      const keranjangBody = document.getElementById("keranjang-body");

      // Cek apakah ada item
      if (!items || items.length === 0) {
        if (keranjangKosong) keranjangKosong.style.display = "block";
        if (keranjangItems) keranjangItems.style.display = "none";

        // Disable tombol next jika ada
        const btnNextStep1 = document.getElementById("btn-next-step1");
        if (btnNextStep1) {
          btnNextStep1.disabled = true;
          btnNextStep1.classList.add("disabled");
        }
        return;
      }

      // Tampilkan item
      if (keranjangKosong) keranjangKosong.style.display = "none";
      if (keranjangItems) keranjangItems.style.display = "block";

      // Clear keranjang body
      if (keranjangBody) keranjangBody.innerHTML = "";

      // Untuk setiap item
      let subtotal = 0;

      items.forEach((item) => {
        // Buat row baru
        const row = document.createElement("tr");
        row.classList.add("keranjang-item");

        // Format harga
        const hargaFormatted = formatRupiah(item.harga);
        const totalFormatted = formatRupiah(item.harga * item.jumlah);

        // Row content
        row.innerHTML = `
            <td>
              <div class="d-flex align-items-center">
                <img src="img/Produk/bunga${item.id}.jpeg" alt="${item.nama}" class="item-image" style="width: 70px; height: 70px; object-fit: cover; margin-right: 10px;">
                <div class="item-details">
                  <div class="item-name">${item.nama}</div>
                </div>
              </div>
            </td>
            <td>${hargaFormatted}</td>
            <td>
              <div class="quantity-control" style="display: flex; justify-content: center;">
                <button type="button" class="quantity-btn btn-decrease" disabled>-</button>
                <input type="number" class="quantity-input" value="${item.jumlah}" min="1" max="99" readonly style="width: 40px; text-align: center;">
                <button type="button" class="quantity-btn btn-increase" disabled>+</button>
              </div>
            </td>
            <td class="item-total">${totalFormatted}</td>
            <td></td>
          `;

        // Tambahkan ke keranjang body
        if (keranjangBody) keranjangBody.appendChild(row);

        // Update subtotal
        subtotal += item.harga * item.jumlah;
      });

      // Update summary di semua step
      updateSummaryInAllSteps(subtotal, items.length);
    }

    // Fungsi untuk update ringkasan di semua langkah
    function updateSummaryInAllSteps(subtotal, totalItems) {
      // Format harga
      const subtotalFormatted = formatRupiah(subtotal);

      // Cari biaya pengiriman (akan dihitung saat memilih kota)
      let shippingCost = 0;
      const kotaSelect = document.getElementById("kota");
      if (kotaSelect && kotaSelect.value) {
        shippingCost = calculateShippingCost(kotaSelect.value);
      }

      const shippingFormatted = formatRupiah(shippingCost);

      // Total payment
      const totalPayment = subtotal + shippingCost;
      const totalFormatted = formatRupiah(totalPayment);

      // Update untuk setiap step (1-4)
      for (let i = 1; i <= 4; i++) {
        // Update jumlah item
        const totalItemsEl = document.getElementById(
          `total-items${i > 1 ? "-step" + i : ""}`
        );
        if (totalItemsEl) totalItemsEl.textContent = totalItems;

        // Update subtotal
        const subtotalEl = document.getElementById(
          `subtotal${i > 1 ? "-step" + i : ""}`
        );
        if (subtotalEl) subtotalEl.textContent = subtotalFormatted;

        // Update biaya pengiriman
        const shippingEl = document.getElementById(
          `biaya-pengiriman${i > 1 ? "-step" + i : ""}`
        );
        if (shippingEl && shippingCost > 0) {
          shippingEl.textContent = shippingFormatted;
        }

        // Update total pembayaran
        const totalEl = document.getElementById(
          `total-pembayaran${i > 1 ? "-step" + i : ""}`
        );
        if (totalEl) totalEl.textContent = totalFormatted;
      }
    }

    // Helper function untuk menghitung biaya pengiriman
    function calculateShippingCost(city) {
      switch (city) {
        case "Samarinda Seberang":
          return 15000;
        case "Samarinda Kota":
          return 25000;
        case "Tenggarong":
          // Untuk Tenggarong, tergantung berat (asumsi 1kg)
          return 15000;
        case "Luar Kota":
          return 45000;
        default:
          return 0;
      }
    }

    // Helper function untuk format Rupiah
    function formatRupiah(number) {
      return "Rp " + number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    // Tangkap form submission checkout
    const checkoutForm = document.getElementById("checkoutForm");
    if (checkoutForm) {
      checkoutForm.addEventListener("submit", function (e) {
        // Mode direct checkout: hapus data setelah checkout berhasil
        if (checkoutMode === "direct") {
          localStorage.removeItem("directCheckout");
        }
      });
    }
  }
});
