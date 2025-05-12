// Data gambar produk berdasarkan ID produk
const gambarProduk = {
  1: "img/Produk/bunga.jpeg", // Bunga Mawar
  2: "img/Produk/bunga4.jpeg", // Bunga Lily
  3: "img/Produk/bunga5.jpeg", // Bunga Matahari
  4: "img/Produk/Bunga1.jpg", // Bunga Tulip
  5: "img/Produk/Bunga2.jpg", // Bunga Anggrek
  6: "img/Produk/bunga4.jpeg", // Bunga Krisan
  // Default jika produk ID tidak ditemukan
  default: "img/Produk/bunga.jpeg",
};

// Inisialisasi saat halaman dimuat
document.addEventListener("DOMContentLoaded", function () {
  console.log("Inisialisasi keranjangBelanja.js");

  // Perbaiki link keranjang
  perbaikiLinkKeranjang();

  // Tambahkan tombol keranjang jika di halaman produk
  if (detectPageType() === "product" || detectPageType() === "productDetail") {
    tambahTombolKeranjang();
  }

  // Tampilkan keranjang jika di halaman keranjang
  if (detectPageType() === "cart") {
    tampilkanKeranjang();
  }

  // Update tampilan jumlah item
  updateJumlahKeranjang();

  // Periksa login
  updateUISetelahLogin();

  // Setup untuk checkout langsung jika di halaman checkout
  if (detectPageType() === "checkout") {
    setupCheckoutLangsung();
  }
});

// Deteksi tipe halaman berdasarkan URL
function detectPageType() {
  const url = window.location.href;

  if (url.includes("keranjang.html")) {
    return "cart";
  } else if (url.includes("checkout.html")) {
    return "checkout";
  } else if (url.includes("produk-detail.html")) {
    return "productDetail";
  } else if (url.includes("index.html") || url.endsWith("/")) {
    return "product";
  } else {
    return "other";
  }
}

/**
 * =======================================
 * FUNGSI KERANJANG BELANJA
 * =======================================
 */

// Format angka sebagai mata uang Rupiah
function formatRupiah(angka) {
  return "Rp " + angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Konversi format Rupiah ke angka
function parseRupiah(rupiah) {
  return parseInt(rupiah.replace(/[^\d]/g, ""));
}

// Fungsi untuk menampilkan item keranjang di halaman keranjang.html
function tampilkanKeranjang() {
  // Ambil data keranjang dari localStorage
  const keranjang = JSON.parse(localStorage.getItem("keranjang")) || [];

  // Ambil container untuk item keranjang
  const containerKeranjang = document.getElementById("daftar-item-keranjang");
  const containerKeranjangKosong = document.getElementById("keranjang-kosong");
  const containerKeranjangItems = document.getElementById("keranjang-items");

  // Periksa jika elemen-elemen diperlukan ada di halaman
  if (!containerKeranjang) {
    console.warn("Element daftar-item-keranjang tidak ditemukan");
    return;
  }

  // Kosongkan container
  containerKeranjang.innerHTML = "";

  // Jika keranjang kosong, tampilkan pesan
  if (keranjang.length === 0) {
    if (containerKeranjangKosong)
      containerKeranjangKosong.style.display = "block";
    if (containerKeranjangItems) containerKeranjangItems.style.display = "none";
    return;
  }

  // Jika ada item di keranjang, sembunyikan pesan keranjang kosong
  if (containerKeranjangKosong) containerKeranjangKosong.style.display = "none";
  if (containerKeranjangItems) containerKeranjangItems.style.display = "block";

  // Ambil template item keranjang
  const template = document.getElementById("template-item-keranjang");
  if (!template) {
    console.warn("Template item keranjang tidak ditemukan");
    return;
  }

  // Variabel untuk menghitung total
  let subtotal = 0;

  // Loop untuk setiap item di keranjang
  keranjang.forEach((item) => {
    // Clone template
    const itemKeranjang = document.importNode(template.content, true);

    // Ambil elemen-elemen yang perlu diupdate
    const namaProduk = itemKeranjang.querySelector(".produk-nama");
    const gambarElement = itemKeranjang.querySelector(".produk-image img");
    const hargaSatuan = itemKeranjang.querySelector(".harga-satuan");
    const quantityInput = itemKeranjang.querySelector(".quantity-input");
    const hargaTotal = itemKeranjang.querySelector(".harga-total");
    const tombolHapus = itemKeranjang.querySelector(".hapus-item");
    const tombolMinus = itemKeranjang.querySelector(".quantity-btn.minus");
    const tombolPlus = itemKeranjang.querySelector(".quantity-btn.plus");

    // Set atribut data-id pada item untuk keperluan update/hapus
    const itemContainer = itemKeranjang.querySelector(".keranjang-item");
    if (itemContainer) {
      itemContainer.dataset.id = item.id;
    }

    // Update nilai
    if (namaProduk) namaProduk.textContent = item.nama;
    if (hargaSatuan) hargaSatuan.textContent = formatRupiah(item.harga);
    if (quantityInput) quantityInput.value = item.jumlah;
    if (hargaTotal)
      hargaTotal.textContent = formatRupiah(item.harga * item.jumlah);

    // Set sumber gambar berdasarkan ID produk
    if (gambarElement) {
      gambarElement.src = gambarProduk[item.id] || gambarProduk.default;
      gambarElement.alt = item.nama;
    }

    // Event handler untuk tombol hapus
    if (tombolHapus) {
      tombolHapus.addEventListener("click", () => {
        hapusItemKeranjang(item.id);
      });
    }

    // Event handler untuk tombol minus
    if (tombolMinus) {
      tombolMinus.addEventListener("click", () => {
        if (quantityInput && parseInt(quantityInput.value) > 1) {
          quantityInput.value = parseInt(quantityInput.value) - 1;
          updateQuantityItem(item.id, parseInt(quantityInput.value));
        }
      });
    }

    // Event handler untuk tombol plus
    if (tombolPlus) {
      tombolPlus.addEventListener("click", () => {
        if (quantityInput) {
          quantityInput.value = parseInt(quantityInput.value) + 1;
          updateQuantityItem(item.id, parseInt(quantityInput.value));
        }
      });
    }

    // Event handler untuk input quantity
    if (quantityInput) {
      quantityInput.addEventListener("change", () => {
        let jumlah = parseInt(quantityInput.value);

        // Validasi jumlah minimal 1
        if (jumlah < 1 || isNaN(jumlah)) {
          jumlah = 1;
          quantityInput.value = 1;
        }

        updateQuantityItem(item.id, jumlah);
      });
    }

    // Tambahkan item ke container
    containerKeranjang.appendChild(itemKeranjang);

    // Tambahkan ke subtotal
    subtotal += item.harga * item.jumlah;
  });

  // Update ringkasan pesanan
  updateRingkasanPesanan(subtotal);

  // Setup event handlers untuk tombol aksi
  setupTombolAksi();
}

// Fungsi untuk setup tombol aksi di halaman keranjang
function setupTombolAksi() {
  // Setup event listener untuk tombol update keranjang
  const tombolUpdate = document.getElementById("update-keranjang");
  if (tombolUpdate) {
    tombolUpdate.addEventListener("click", updateKeranjang);
  }

  // Setup event listener untuk tombol kosongkan keranjang
  const tombolKosongkan = document.getElementById("hapus-keranjang");
  if (tombolKosongkan) {
    tombolKosongkan.addEventListener("click", kosongkanKeranjang);
  }

  // Setup event listener untuk tombol checkout
  const tombolCheckout = document.getElementById("btn-checkout");
  if (tombolCheckout) {
    tombolCheckout.addEventListener("click", lanjutCheckout);
  }
}

// Fungsi untuk hapus item dari keranjang
function hapusItemKeranjang(id) {
  // Ambil data keranjang dari localStorage
  let keranjang = JSON.parse(localStorage.getItem("keranjang")) || [];

  // Filter out item yang akan dihapus
  keranjang = keranjang.filter((item) => item.id !== id);

  // Simpan kembali ke localStorage
  localStorage.setItem("keranjang", JSON.stringify(keranjang));

  // Update tampilan
  tampilkanKeranjang();
  updateJumlahKeranjang();

  // Tampilkan notifikasi
  tampilkanNotifikasi("Produk berhasil dihapus dari keranjang", "success");
}

// Fungsi untuk update quantity item di keranjang
function updateQuantityItem(id, jumlah) {
  // Ambil data keranjang dari localStorage
  let keranjang = JSON.parse(localStorage.getItem("keranjang")) || [];

  // Cari item dengan id yang sesuai
  const itemIndex = keranjang.findIndex((item) => item.id === id);

  if (itemIndex !== -1) {
    // Update jumlah
    keranjang[itemIndex].jumlah = jumlah;

    // Simpan kembali ke localStorage
    localStorage.setItem("keranjang", JSON.stringify(keranjang));

    // Update tampilan item
    const itemContainer = document.querySelector(
      `.keranjang-item[data-id="${id}"]`
    );
    if (itemContainer) {
      const hargaSatuan = parseRupiah(
        itemContainer.querySelector(".harga-satuan").textContent
      );
      const hargaTotal = itemContainer.querySelector(".harga-total");
      hargaTotal.textContent = formatRupiah(hargaSatuan * jumlah);
    }

    // Update tampilan ringkasan
    updateSubtotal();

    // Update badge keranjang
    updateJumlahKeranjang();
  }
}

// Fungsi untuk update subtotal
function updateSubtotal() {
  // Ambil data keranjang dari localStorage
  const keranjang = JSON.parse(localStorage.getItem("keranjang")) || [];

  // Hitung subtotal
  let subtotal = 0;
  keranjang.forEach((item) => {
    subtotal += item.harga * item.jumlah;
  });

  // Update ringkasan pesanan
  updateRingkasanPesanan(subtotal);
}

// Fungsi untuk update ringkasan pesanan
function updateRingkasanPesanan(subtotal) {
  const subtotalElement = document.getElementById("subtotal");
  const totalElement = document.getElementById("total-pesanan");

  if (subtotalElement) {
    subtotalElement.textContent = formatRupiah(subtotal);
  }

  if (totalElement) {
    // Hitung total (untuk saat ini sama dengan subtotal,
    // ongkir akan dihitung saat checkout)
    const total = subtotal;
    totalElement.textContent = formatRupiah(total);
  }
}

// Fungsi untuk menambahkan produk ke keranjang
function tambahKeKeranjang(id, nama, harga, jumlah = 1) {
  // Ambil data keranjang dari localStorage
  let keranjang = JSON.parse(localStorage.getItem("keranjang")) || [];

  // Cek apakah produk sudah ada di keranjang
  const index = keranjang.findIndex((item) => item.id === id);

  if (index !== -1) {
    // Jika produk sudah ada, tambah jumlahnya
    keranjang[index].jumlah += jumlah;
  } else {
    // Jika produk belum ada, tambahkan produk baru
    keranjang.push({
      id: id,
      nama: nama,
      harga: parseInt(harga),
      jumlah: jumlah,
    });
  }

  // Simpan keranjang yang sudah diupdate
  localStorage.setItem("keranjang", JSON.stringify(keranjang));

  // Update tampilan jumlah item di keranjang
  updateJumlahKeranjang();

  return keranjang;
}

// Fungsi untuk hapus semua item keranjang
function kosongkanKeranjang() {
  if (confirm("Apakah Anda yakin ingin mengosongkan keranjang belanja?")) {
    // Kosongkan keranjang di localStorage
    localStorage.removeItem("keranjang");

    // Update tampilan
    tampilkanKeranjang();
    updateJumlahKeranjang();

    // Tampilkan notifikasi
    tampilkanNotifikasi("Keranjang belanja telah dikosongkan", "success");
  }
}

// Fungsi untuk update keranjang
function updateKeranjang() {
  // Dalam versi sederhana ini, kita hanya menampilkan notifikasi
  tampilkanNotifikasi("Keranjang belanja telah diperbarui", "success");

  // Anda bisa menambahkan logika tambahan di sini
  // Misalnya memperbarui stok atau menyinkronkan dengan server
}

// Fungsi untuk lanjut ke checkout
function lanjutCheckout() {
  // Cek apakah user sudah login
  const isLoggedIn = cekLogin();

  if (isLoggedIn) {
    // Arahkan ke halaman checkout
    window.location.href = "checkout.html";
  } else {
    // Jika belum login, tampilkan pesan login
    tampilkanNotifikasi(
      "Silakan login terlebih dahulu untuk melanjutkan ke checkout",
      "error"
    );

    // Redirect ke halaman login dengan query parameter untuk redirect kembali
    setTimeout(() => {
      window.location.href = "login.html?redirect=keranjang";
    }, 2000);
  }
}

// Fungsi untuk memeriksa status login
function cekLogin() {
  // Untuk demo, gunakan localStorage untuk menyimpan status login
  const userData = JSON.parse(localStorage.getItem("user"));
  return userData && userData.isLoggedIn === true;
}

// Fungsi untuk update UI berdasarkan status login
function updateUISetelahLogin() {
  const userData = JSON.parse(localStorage.getItem("user")) || {};
  const tombolLogin = document.getElementById("tombol-login");
  const mobileLogin = document.getElementById("mobile-login");
  const tombolUser = document.getElementById("tombol-user");
  const namaUser = document.querySelector(".nama-user");

  if (userData.isLoggedIn) {
    // User sudah login
    if (tombolLogin) tombolLogin.style.display = "none";
    if (mobileLogin) mobileLogin.style.display = "none";
    if (tombolUser) {
      tombolUser.style.display = "block";
      if (namaUser) {
        namaUser.textContent = userData.nama || "Pengguna";
      }
    }
  } else {
    // User belum login
    if (tombolLogin) tombolLogin.style.display = "block";
    if (mobileLogin) mobileLogin.style.display = "block";
    if (tombolUser) tombolUser.style.display = "none";
  }
}

/**
 * =======================================
 * FUNGSI PERBAIKAN LINK KERANJANG DAN UI
 * =======================================
 */

// Fungsi untuk memperbaiki semua link keranjang
function perbaikiLinkKeranjang() {
  // Cari semua link keranjang
  const semuaLink = document.querySelectorAll("a");

  // Periksa setiap link
  semuaLink.forEach((link) => {
    // Cek apakah link ini adalah link keranjang
    const memilikiIconKeranjang = link.querySelector(".bi-cart2") !== null;
    const memilikiBadgeKeranjang =
      link.querySelector(".badge-keranjang") !== null;

    if (memilikiIconKeranjang || memilikiBadgeKeranjang) {
      // Hapus event listener yang ada dengan cloning
      const newLink = link.cloneNode(true);
      if (link.parentNode) {
        link.parentNode.replaceChild(newLink, link);
      }

      // Set href ke keranjang.html
      newLink.href = "keranjang.html";

      // Tambahkan event listener baru
      newLink.addEventListener("click", function (e) {
        window.location.href = "keranjang.html";
      });
    }
  });

  // Perbaiki tombol pesan di halaman produk
  const tombolPesan = document.querySelectorAll(".cta-pesan");
  tombolPesan.forEach((tombol) => {
    // Clone tombol untuk menghapus event listener lama
    const newTombol = tombol.cloneNode(true);
    if (tombol.parentNode) {
      tombol.parentNode.replaceChild(newTombol, tombol);
    }

    // Tambahkan event listener baru
    newTombol.addEventListener("click", function (e) {
      e.preventDefault();

      // Ambil data produk
      const id = this.getAttribute("data-id") || "1";
      const nama = this.getAttribute("data-nama") || "Produk Bunga";
      const harga = parseInt(this.getAttribute("data-harga") || "100000");

      // Tambahkan ke keranjang
      tambahKeKeranjang(id, nama, harga, 1);

      // Tampilkan notifikasi
      tampilkanNotifikasi(
        `${nama} berhasil ditambahkan ke keranjang!`,
        "success"
      );
    });
  });
}

// Fungsi untuk update jumlah item di badge keranjang
function updateJumlahKeranjang() {
  const keranjang = JSON.parse(localStorage.getItem("keranjang")) || [];
  const totalItems = keranjang.reduce((total, item) => total + item.jumlah, 0);

  // Update semua badge keranjang
  const badgeElements = document.querySelectorAll(".badge-keranjang");

  badgeElements.forEach((badge) => {
    badge.textContent = totalItems;
    badge.style.display = totalItems > 0 ? "flex" : "none";
  });
}

// Fungsi untuk menampilkan notifikasi
function tampilkanNotifikasi(pesan, tipe = "info") {
  // Hapus notifikasi yang sudah ada jika ada
  const notifikasiLama = document.querySelector(".notifikasi-floating");
  if (notifikasiLama) {
    notifikasiLama.remove();
  }

  // Buat elemen notifikasi baru
  const notifikasi = document.createElement("div");
  notifikasi.className = `notifikasi-floating ${tipe}`;
  notifikasi.innerHTML = `
    <div class="notifikasi-content">
      <span class="notifikasi-icon">
        <i class="bi ${
          tipe === "success"
            ? "bi-check-circle"
            : tipe === "error"
            ? "bi-exclamation-circle"
            : "bi-info-circle"
        }"></i>
      </span>
      <span class="notifikasi-text">${pesan}</span>
      <button class="notifikasi-close">&times;</button>
    </div>
  `;

  // Style untuk notifikasi
  notifikasi.style.position = "fixed";
  notifikasi.style.top = "20px";
  notifikasi.style.right = "20px";
  notifikasi.style.backgroundColor =
    tipe === "success" ? "#d4edda" : tipe === "error" ? "#f8d7da" : "#cce5ff";
  notifikasi.style.color =
    tipe === "success" ? "#155724" : tipe === "error" ? "#721c24" : "#004085";
  notifikasi.style.border = `1px solid ${
    tipe === "success" ? "#c3e6cb" : tipe === "error" ? "#f5c6cb" : "#b8daff"
  }`;
  notifikasi.style.borderRadius = "5px";
  notifikasi.style.padding = "12px 20px";
  notifikasi.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
  notifikasi.style.zIndex = "9999";
  notifikasi.style.minWidth = "300px";
  notifikasi.style.transition = "opacity 0.3s ease-out";

  // Style untuk content
  const content = notifikasi.querySelector(".notifikasi-content");
  content.style.display = "flex";
  content.style.alignItems = "center";

  // Style untuk icon
  const icon = notifikasi.querySelector(".notifikasi-icon");
  icon.style.marginRight = "10px";
  icon.style.fontSize = "1.2rem";

  // Style untuk tombol close
  const closeBtn = notifikasi.querySelector(".notifikasi-close");
  closeBtn.style.background = "none";
  closeBtn.style.border = "none";
  closeBtn.style.marginLeft = "auto";
  closeBtn.style.cursor = "pointer";
  closeBtn.style.fontSize = "1.2rem";
  closeBtn.style.padding = "0 0 0 10px";

  // Tambahkan ke dokumen
  document.body.appendChild(notifikasi);

  // Event listener untuk tombol close
  closeBtn.addEventListener("click", function () {
    notifikasi.style.opacity = "0";
    setTimeout(() => notifikasi.remove(), 300);
  });

  // Auto-dismiss setelah 5 detik
  setTimeout(() => {
    notifikasi.style.opacity = "0";
    setTimeout(() => notifikasi.remove(), 300);
  }, 5000);
}

/**
 * =======================================
 * FUNGSI TOMBOL CEPAT KERANJANG
 * =======================================
 */

// Fungsi untuk menambahkan tombol keranjang di sebelah tombol pesan
function tambahTombolKeranjang() {
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

        // Tambahkan ke keranjang
        tambahKeKeranjang(productId, productName, productPrice);

        // Tampilkan notifikasi
        tampilkanNotifikasi(
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
          "pembelianLangsung",
          JSON.stringify(singleItemCart)
        );

        // Redirect ke halaman checkout
        window.location.href = "checkout.html?mode=langsung";
      });
    }
  });
}

/**
 * =======================================
 * FUNGSI CHECKOUT LANGSUNG
 * =======================================
 */

// Fungsi untuk setup checkout langsung
function setupCheckoutLangsung() {
  // Deteksi mode checkout: langsung atau keranjang
  const urlParams = new URLSearchParams(window.location.search);
  const checkoutMode = urlParams.get("mode");

  if (checkoutMode === "langsung") {
    // Mode checkout langsung: gunakan data dari pembelianLangsung
    const directData =
      JSON.parse(localStorage.getItem("pembelianLangsung")) || [];

    // Jika ada data pembelian langsung
    if (directData.length > 0) {
      // Simpan sementara keranjang asli jika ada
      const originalCart = localStorage.getItem("keranjang");
      if (originalCart) {
        localStorage.setItem("keranjangBackup", originalCart);
      }

      // Gunakan item langsung untuk checkout
      localStorage.setItem("keranjang", JSON.stringify(directData));

      // Tambahkan event listener untuk tombol "Konfirmasi & Selesai"
      const btnSubmitOrder = document.getElementById("btn-submit-order");
      if (btnSubmitOrder) {
        // Simpan handler asli jika ada
        const originalClickHandler = btnSubmitOrder.onclick;

        // Tambahkan handler baru
        btnSubmitOrder.addEventListener("click", function (e) {
          // Proses pesanan seperti biasa
          if (originalClickHandler) {
            originalClickHandler.call(this, e);
          }

          // Pulihkan keranjang asli setelah 2 detik
          setTimeout(function () {
            const backupCart = localStorage.getItem("keranjangBackup");
            if (backupCart) {
              localStorage.setItem("keranjang", backupCart);
              localStorage.removeItem("keranjangBackup");
            } else {
              // Jika tidak ada backup, berarti keranjang sebelumnya kosong
              localStorage.removeItem("keranjang");
            }

            // Bersihkan data checkout langsung
            localStorage.removeItem("pembelianLangsung");
          }, 2000);
        });
      }

      // Pastikan keranjang dipulihkan saat pengguna membatalkan checkout
      window.addEventListener("beforeunload", function () {
        // Jika halaman akan ditinggalkan dan pesanan belum selesai, pulihkan keranjang
        const backupCart = localStorage.getItem("keranjangBackup");
        if (backupCart) {
          localStorage.setItem("keranjang", backupCart);
          localStorage.removeItem("keranjangBackup");
        }
        localStorage.removeItem("pembelianLangsung");
      });
    }
  }
}
