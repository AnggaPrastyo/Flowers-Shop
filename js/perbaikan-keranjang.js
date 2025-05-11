// Fungsi untuk memperbaiki link keranjang
function perbaikiLinkKeranjang() {
  console.log("Memperbaiki link keranjang...");

  // Dapatkan semua link keranjang (desktop dan mobile)
  const keranjangLinks = document.querySelectorAll(
    'a[href="#"], a[href="keranjang.html"], a[href=""], a[href=""], .nav-link.position-relative'
  );

  // Periksa semua elemen dengan ikon keranjang
  keranjangLinks.forEach((link) => {
    // Cek apakah elemen ini mengandung ikon keranjang
    const iconKeranjang = link.querySelector(".bi-cart2");
    if (iconKeranjang || link.classList.contains("position-relative")) {
      // Tetapkan href yang benar ke keranjang.html
      link.href = "keranjang.html";
      console.log("Link keranjang diperbaiki:", link);

      // Tambahkan event click untuk memastikan navigasi terjadi
      link.addEventListener("click", function (e) {
        // Tidak perlu prevent default, biarkan navigasi normal terjadi
        console.log("Navigasi ke keranjang...");
      });
    }
  });

  // Juga perbaiki tombol dropdown jika ada
  const dropdownToggles = document.querySelectorAll(".dropdown-toggle");
  dropdownToggles.forEach((toggle) => {
    toggle.addEventListener("click", function (e) {
      e.preventDefault();
      const dropdownMenu = this.nextElementSibling;
      if (dropdownMenu && dropdownMenu.classList.contains("dropdown-menu")) {
        dropdownMenu.classList.toggle("show");
      }
    });
  });
}

// Fungsi untuk menampilkan notifikasi
function tampilkanNotifikasi(pesan, tipe = "success") {
  console.log("Menampilkan notifikasi:", pesan, tipe);

  // Buat elemen notifikasi
  const notifikasi = document.createElement("div");
  notifikasi.className = `notifikasi ${tipe}`;
  notifikasi.style.position = "fixed";
  notifikasi.style.top = "20px";
  notifikasi.style.right = "20px";
  notifikasi.style.padding = "15px 20px";
  notifikasi.style.background = tipe === "success" ? "#d4edda" : "#f8d7da";
  notifikasi.style.color = tipe === "success" ? "#155724" : "#721c24";
  notifikasi.style.border = `1px solid ${
    tipe === "success" ? "#c3e6cb" : "#f5c6cb"
  }`;
  notifikasi.style.borderRadius = "4px";
  notifikasi.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
  notifikasi.style.zIndex = "9999";
  notifikasi.style.maxWidth = "300px";
  notifikasi.style.transition = "opacity 0.5s ease-out";

  // Tambahkan ikon dan pesan
  notifikasi.innerHTML = `
      <div style="display: flex; align-items: center;">
        <i class="bi ${
          tipe === "success" ? "bi-check-circle" : "bi-exclamation-circle"
        }" 
           style="margin-right: 10px; font-size: 1.2rem;"></i>
        <span>${pesan}</span>
      </div>
      <button style="position: absolute; top: 5px; right: 10px; background: none; border: none; cursor: pointer; font-size: 1rem;">×</button>
    `;

  // Tambahkan ke body
  document.body.appendChild(notifikasi);

  // Tambahkan event listener untuk tombol tutup
  const btnClose = notifikasi.querySelector("button");
  if (btnClose) {
    btnClose.addEventListener("click", function () {
      notifikasi.style.opacity = "0";
      setTimeout(() => {
        notifikasi.remove();
      }, 500);
    });
  }

  // Otomatis hilangkan setelah 5 detik
  setTimeout(() => {
    notifikasi.style.opacity = "0";
    setTimeout(() => {
      notifikasi.remove();
    }, 500);
  }, 5000);
}
