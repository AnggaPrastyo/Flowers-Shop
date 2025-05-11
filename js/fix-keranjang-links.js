// File: fix-keranjang-links.js
// Script khusus untuk memperbaiki masalah link keranjang

// Jalankan segera setelah DOM dimuat
document.addEventListener("DOMContentLoaded", function () {
  console.log("⚡ Menjalankan perbaikan khusus untuk link keranjang...");

  // Fungsi untuk memperbaiki semua link keranjang
  function perbaikiLinkKeranjang() {
    // Cari semua elemen link dengan class position-relative (yang biasanya digunakan untuk link keranjang)
    const semuaLink = document.querySelectorAll("a");

    // Periksa setiap link
    semuaLink.forEach((link) => {
      // Cek apakah link ini adalah link keranjang
      const memilikiIconKeranjang = link.querySelector(".bi-cart2") !== null;
      const memilikiBadgeKeranjang =
        link.querySelector(".badge-keranjang") !== null;

      if (memilikiIconKeranjang || memilikiBadgeKeranjang) {
        console.log("🛒 Menemukan link keranjang:", link);

        // Hapus event listener yang ada dengan cloning
        const newLink = link.cloneNode(true);
        if (link.parentNode) {
          link.parentNode.replaceChild(newLink, link);
        }

        // Set href ke keranjang.html
        newLink.href = "keranjang.html";

        // Tambahkan event listener baru
        newLink.addEventListener("click", function (e) {
          console.log("🔗 Mengarahkan ke halaman keranjang...");
          window.location.href = "keranjang.html";
        });

        console.log("✅ Link keranjang berhasil diperbaiki:", newLink);
      }
    });

    // Terapkan perbaikan untuk link keranjang mobile
    const mobileIconKeranjang = document.querySelectorAll(".mobile-icons a");
    mobileIconKeranjang.forEach((link) => {
      const memilikiIconKeranjang = link.querySelector(".bi-cart2") !== null;

      if (memilikiIconKeranjang) {
        console.log("📱 Menemukan link keranjang mobile:", link);

        // Hapus event listener yang ada dengan cloning
        const newLink = link.cloneNode(true);
        if (link.parentNode) {
          link.parentNode.replaceChild(newLink, link);
        }

        // Set href ke keranjang.html
        newLink.href = "keranjang.html";

        // Tambahkan event listener baru
        newLink.addEventListener("click", function (e) {
          console.log("🔗 Mengarahkan ke halaman keranjang dari mobile...");
          window.location.href = "keranjang.html";
        });

        console.log("✅ Link keranjang mobile berhasil diperbaiki:", newLink);
      }
    });
  }

  // Fungsi untuk memperbaiki link di halaman index
  function perbaikiLinkKeranjangIndex() {
    // Khusus untuk halaman index, link keranjang menggunakan href="#"
    const indexKeranjangLinks = document.querySelectorAll('a[href="#"]');

    indexKeranjangLinks.forEach((link) => {
      const memilikiIconKeranjang = link.querySelector(".bi-cart2") !== null;

      if (memilikiIconKeranjang) {
        console.log("🏠 Menemukan link keranjang di halaman index:", link);

        // Hapus event listener yang ada dengan cloning
        const newLink = link.cloneNode(true);
        if (link.parentNode) {
          link.parentNode.replaceChild(newLink, link);
        }

        // Set href ke keranjang.html
        newLink.href = "keranjang.html";

        // Tambahkan atribut tambahan untuk memastikan navigasi bekerja
        newLink.setAttribute("data-link", "keranjang");

        // Tambahkan event listener baru
        newLink.addEventListener("click", function (e) {
          console.log("🔗 Mengarahkan ke keranjang.html dari halaman index...");
          window.location.href = "keranjang.html";
        });

        console.log("✅ Link keranjang index berhasil diperbaiki:", newLink);
      }
    });
  }

  // Fungsi untuk memperbaiki tombol di halaman produk
  function perbaikiTombolProduk() {
    // Perbaiki tombol "Tambahkan ke Keranjang" di halaman produk detail
    const btnAddToCart = document.querySelector(".btn-add-to-cart");
    if (btnAddToCart) {
      console.log("🛍️ Menemukan tombol tambah ke keranjang:", btnAddToCart);

      // Clone tombol untuk menghapus event listener lama
      const newBtn = btnAddToCart.cloneNode(true);
      if (btnAddToCart.parentNode) {
        btnAddToCart.parentNode.replaceChild(newBtn, btnAddToCart);
      }

      // Tambahkan event listener baru
      newBtn.addEventListener("click", function (e) {
        e.preventDefault();

        // Ambil ID, nama, dan harga produk dari atribut data atau parameter fungsi onclick
        let id = "1";
        let nama = "Produk Bunga";
        let harga = 100000;

        // Coba ekstrak dari atribut onclick
        const onclickAttr = newBtn.getAttribute("onclick");
        if (onclickAttr) {
          const match = onclickAttr.match(
            /addToCart\(['"](.*?)['"]\s*,\s*['"](.*?)['"]\s*,\s*(\d+)\)/
          );
          if (match) {
            id = match[1];
            nama = match[2];
            harga = parseInt(match[3]);
          }
        }

        // Dapatkan jumlah
        let jumlah = 1;
        const quantityInput = document.getElementById("quantity");
        if (quantityInput) {
          jumlah = parseInt(quantityInput.value) || 1;
        }

        // Tambahkan ke keranjang
        tambahKeKeranjang(id, nama, harga, jumlah);

        // Tampilkan notifikasi
        tampilkanNotifikasi(
          `${nama} berhasil ditambahkan ke keranjang!`,
          "success"
        );

        console.log("🛍️ Produk ditambahkan ke keranjang:", {
          id,
          nama,
          harga,
          jumlah,
        });
      });

      console.log("✅ Tombol tambah ke keranjang berhasil diperbaiki");
    }

    // Perbaiki tombol "Beli Sekarang"
    const btnBuyNow = document.querySelector(".btn-buy-now");
    if (btnBuyNow) {
      console.log("💰 Menemukan tombol beli sekarang:", btnBuyNow);

      // Clone tombol untuk menghapus event listener lama
      const newBtn = btnBuyNow.cloneNode(true);
      if (btnBuyNow.parentNode) {
        btnBuyNow.parentNode.replaceChild(newBtn, btnBuyNow);
      }

      // Tambahkan event listener baru
      newBtn.addEventListener("click", function (e) {
        e.preventDefault();

        // Ambil ID, nama, dan harga produk dari atribut data atau parameter fungsi onclick
        let id = "1";
        let nama = "Produk Bunga";
        let harga = 100000;

        // Coba ekstrak dari atribut onclick
        const onclickAttr = newBtn.getAttribute("onclick");
        if (onclickAttr) {
          const match = onclickAttr.match(
            /buyNow\(['"](.*?)['"]\s*,\s*['"](.*?)['"]\s*,\s*(\d+)\)/
          );
          if (match) {
            id = match[1];
            nama = match[2];
            harga = parseInt(match[3]);
          }
        }

        // Dapatkan jumlah
        let jumlah = 1;
        const quantityInput = document.getElementById("quantity");
        if (quantityInput) {
          jumlah = parseInt(quantityInput.value) || 1;
        }

        // Tambahkan ke keranjang
        tambahKeKeranjang(id, nama, harga, jumlah);

        // Redirect ke halaman keranjang
        console.log("💰 Mengalihkan ke halaman keranjang...");
        window.location.href = "keranjang.html";
      });

      console.log("✅ Tombol beli sekarang berhasil diperbaiki");
    }
  }

  // Fungsi untuk tambah ke keranjang
  function tambahKeKeranjang(id, nama, harga, jumlah = 1) {
    // Dapatkan data keranjang dari localStorage
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

    // Update tampilan badge keranjang
    updateJumlahKeranjang();

    console.log("📦 Data keranjang diperbarui:", keranjang);
    return keranjang;
  }

  // Fungsi untuk memperbarui jumlah item di badge keranjang
  function updateJumlahKeranjang() {
    const keranjang = JSON.parse(localStorage.getItem("keranjang")) || [];
    const totalItems = keranjang.reduce(
      (total, item) => total + item.jumlah,
      0
    );

    // Update semua badge keranjang
    const badgeElements = document.querySelectorAll(".badge-keranjang");

    badgeElements.forEach((badge) => {
      badge.textContent = totalItems;
      badge.style.display = totalItems > 0 ? "flex" : "none";
    });

    console.log("🔢 Jumlah item di keranjang:", totalItems);
  }

  // Fungsi untuk menampilkan notifikasi
  function tampilkanNotifikasi(pesan, tipe) {
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
              tipe === "success" ? "bi-check-circle" : "bi-exclamation-circle"
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
      tipe === "success" ? "#d4edda" : "#f8d7da";
    notifikasi.style.color = tipe === "success" ? "#155724" : "#721c24";
    notifikasi.style.border = `1px solid ${
      tipe === "success" ? "#c3e6cb" : "#f5c6cb"
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

    console.log("🔔 Menampilkan notifikasi:", pesan, tipe);
  }

  // Jalankan semua perbaikan
  perbaikiLinkKeranjang();
  perbaikiLinkKeranjangIndex();
  perbaikiTombolProduk();
  updateJumlahKeranjang();

  // Tambahkan event listener untuk tombol "Pesan Sekarang" di halaman index
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

      console.log("🛍️ Produk ditambahkan ke keranjang dari halaman index:", {
        id,
        nama,
        harga,
      });
    });
  });

  console.log("✅ Perbaikan khusus link keranjang selesai");
});

// Tambahkan event listener ke window untuk memastikan perbaikan berjalan setelah semua script dimuat
window.addEventListener("load", function () {
  console.log(
    "🔄 Menjalankan pemeriksaan ulang setelah semua resource dimuat..."
  );

  // Periksa apakah ada link keranjang yang masih menggunakan href="#"
  const linkKeranjangBermasalah = document.querySelectorAll(
    'a[href="#"] .bi-cart2'
  );
  if (linkKeranjangBermasalah.length > 0) {
    console.log("⚠️ Masih ada link keranjang bermasalah, memperbaiki lagi...");

    linkKeranjangBermasalah.forEach((icon) => {
      const link = icon.closest("a");
      if (link) {
        link.href = "keranjang.html";
        console.log("🔧 Memperbaiki link keranjang:", link);
      }
    });
  }

  // Pastikan badge keranjang menampilkan jumlah yang benar
  const keranjang = JSON.parse(localStorage.getItem("keranjang")) || [];
  const totalItems = keranjang.reduce((total, item) => total + item.jumlah, 0);

  console.log("📊 Total item di keranjang:", totalItems);
  console.log("📦 Data keranjang:", keranjang);

  // Log status link keranjang
  const linkKeranjang = document.querySelectorAll('a[href="keranjang.html"]');
  console.log(
    "🔗 Jumlah link keranjang yang sudah diperbaiki:",
    linkKeranjang.length
  );
});
