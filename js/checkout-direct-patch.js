// File: checkout-direct-patch.js
// Script untuk menangani pembelian langsung di halaman checkout

document.addEventListener("DOMContentLoaded", function () {
  // Cek apakah kita berada di halaman checkout
  if (window.location.href.includes("checkout.html")) {
    // Cek apakah ada parameter direct=true di URL
    const urlParams = new URLSearchParams(window.location.search);
    const isDirect = urlParams.get("direct") === "true";

    if (isDirect) {
      console.log("Mode checkout langsung terdeteksi");

      // Jika ini adalah checkout langsung, gunakan data dari checkoutDirect
      const directItem =
        JSON.parse(localStorage.getItem("checkoutDirect")) || [];

      // Hanya jika ada data langsung
      if (directItem.length > 0) {
        console.log("Data checkout langsung ditemukan:", directItem);

        // Simpan sementara keranjang asli jika ada
        const originalCart = localStorage.getItem("keranjang");
        if (originalCart) {
          console.log("Menyimpan backup keranjang asli");
          localStorage.setItem("keranjangBackup", originalCart);
        }

        // Gunakan item langsung untuk checkout
        localStorage.setItem("keranjang", JSON.stringify(directItem));

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

            // Pulihkan keranjang asli setelah 2 detik (memberi waktu untuk menyelesaikan checkout)
            setTimeout(function () {
              console.log("Memulihkan keranjang asli");
              const backupCart = localStorage.getItem("keranjangBackup");
              if (backupCart) {
                localStorage.setItem("keranjang", backupCart);
                localStorage.removeItem("keranjangBackup");
              } else {
                // Jika tidak ada backup, berarti keranjang sebelumnya kosong
                localStorage.removeItem("keranjang");
              }

              // Bersihkan data checkout langsung
              localStorage.removeItem("checkoutDirect");
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
          localStorage.removeItem("checkoutDirect");
        });
      }
    }
  }
});
