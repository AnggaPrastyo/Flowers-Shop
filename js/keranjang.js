// File: js/keranjang.js - Script untuk halaman keranjang belanja

// Data gambar produk berdasarkan ID produk (untuk demo)
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

// Format angka sebagai mata uang Rupiah
function formatRupiah(angka) {
  return "Rp " + angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Konversi format Rupiah ke angka
function parseRupiah(rupiah) {
  return parseInt(rupiah.replace(/[^\d]/g, ""));
}

// Fungsi untuk menampilkan item keranjang
function tampilkanKeranjang() {
  // Ambil data keranjang dari localStorage
  const keranjang = JSON.parse(localStorage.getItem("keranjang")) || [];

  // Ambil container untuk item keranjang
  const containerKeranjang = document.getElementById("daftar-item-keranjang");
  const containerKeranjangKosong = document.getElementById("keranjang-kosong");
  const containerKeranjangItems = document.getElementById("keranjang-items");

  // Kosongkan container
  containerKeranjang.innerHTML = "";

  // Jika keranjang kosong, tampilkan pesan
  if (keranjang.length === 0) {
    containerKeranjangKosong.style.display = "block";
    containerKeranjangItems.style.display = "none";
    return;
  }

  // Jika ada item di keranjang, sembunyikan pesan keranjang kosong
  containerKeranjangKosong.style.display = "none";
  containerKeranjangItems.style.display = "block";

  // Ambil template item keranjang
  const template = document.getElementById("template-item-keranjang");

  // Variabel untuk menghitung total
  let subtotal = 0;

  // Loop untuk setiap item di keranjang
  keranjang.forEach((item, index) => {
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
    itemContainer.dataset.id = item.id;

    // Update value
    namaProduk.textContent = item.nama;
    hargaSatuan.textContent = formatRupiah(item.harga);
    quantityInput.value = item.jumlah;
    hargaTotal.textContent = formatRupiah(item.harga * item.jumlah);

    // Set sumber gambar berdasarkan ID produk
    gambarElement.src = gambarProduk[item.id] || gambarProduk.default;
    gambarElement.alt = item.nama;

    // Event handler untuk tombol hapus
    tombolHapus.addEventListener("click", () => {
      hapusItemKeranjang(item.id);
    });

    // Event handler untuk tombol minus
    tombolMinus.addEventListener("click", () => {
      if (quantityInput.value > 1) {
        quantityInput.value--;
        updateQuantityItem(item.id, parseInt(quantityInput.value));
      }
    });

    // Event handler untuk tombol plus
    tombolPlus.addEventListener("click", () => {
      quantityInput.value++;
      updateQuantityItem(item.id, parseInt(quantityInput.value));
    });

    // Event handler untuk input quantity
    quantityInput.addEventListener("change", () => {
      let jumlah = parseInt(quantityInput.value);

      // Validasi jumlah minimal 1
      if (jumlah < 1) {
        jumlah = 1;
        quantityInput.value = 1;
      }

      updateQuantityItem(item.id, jumlah);
    });

    // Tambahkan item ke container
    containerKeranjang.appendChild(itemKeranjang);

    // Tambahkan ke subtotal
    subtotal += item.harga * item.jumlah;
  });

  // Update ringkasan pesanan
  updateRingkasanPesanan(subtotal);
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
  tampilkanPesan("Produk berhasil dihapus dari keranjang", "success");
}

// Fungsi untuk update quantity item
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

  // Update subtotal
  subtotalElement.textContent = formatRupiah(subtotal);

  // Hitung total (untuk saat ini sama dengan subtotal,
  // ongkir akan dihitung saat checkout)
  const total = subtotal;
  totalElement.textContent = formatRupiah(total);
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
    tampilkanPesan("Keranjang belanja telah dikosongkan", "success");
  }
}

// Fungsi untuk update keranjang
function updateKeranjang() {
  tampilkanPesan("Keranjang belanja telah diperbarui", "success");
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
    tampilkanPesan(
      "Silakan login terlebih dahulu untuk melanjutkan ke checkout",
      "error"
    );

    // Redirect ke halaman login dengan query parameter untuk redirect kembali
    setTimeout(() => {
      window.location.href = "login.html?redirect=keranjang";
    }, 2000);
  }
}

// Fungsi untuk tampilkan pesan
function tampilkanPesan(pesan, tipe) {
  // Cek apakah function tampilkanPesan sudah ada di script.js
  if (typeof window.tampilkanPesan === "function") {
    window.tampilkanPesan(pesan, tipe);
  } else {
    // Jika belum ada, tampilkan dengan alert sederhana
    if (tipe === "error") {
      alert("Error: " + pesan);
    } else {
      alert(pesan);
    }
  }
}

// Jalankan saat halaman dimuat
document.addEventListener("DOMContentLoaded", function () {
  // Tampilkan keranjang
  tampilkanKeranjang();

  // Update badge jumlah keranjang
  updateJumlahKeranjang();

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
});
