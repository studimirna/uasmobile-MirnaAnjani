"use client";
import { useState, useEffect } from "react";
import { QRCode } from "react-qrcode-logo";

export default function PerpustakaanApp() {
  const credentials = {
    mahasiswa: { username: "mahasiswa", password: "1234" },
    pustakawan: { username: "pustakawan", password: "1234" },
    dosen: { username: "dosen", password: "1234" }
  };

  const [role, setRole] = useState("");
  const [qrData, setQrData] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState("");
  const [absensi, setAbsensi] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("absensi");
        return saved ? JSON.parse(saved) : {};
      } catch (e) {
        console.error("Gagal parse absensi:", e);
        return {};
      }
    }
    return {};
  });

  const [daftarBuku, setDaftarBuku] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("daftarBuku");
      return saved
        ? JSON.parse(saved)
        : [
            { judul: "Pemrograman JavaScript", stok: 5 },
            { judul: "Belajar React", stok: 3 },
            { judul: "Pemrograman Python", stok: 4 },
            { judul: "Algoritma dan Struktur Data", stok: 2 },
            { judul: "Database MySQL", stok: 6 },
            { judul: "Machine Learning Dasar", stok: 3 },
            { judul: "Kecerdasan Buatan", stok: 2 },
            { judul: "Desain UI/UX", stok: 4 },
            { judul: "Pemrograman Mobile", stok: 5 },
            { judul: "Data Science dengan Python", stok: 3 },
            { judul: "Cyber Security", stok: 4 },
            { judul: "Jaringan Komputer", stok: 6 },
            { judul: "Sistem Operasi", stok: 3 },
            { judul: "Pemrograman C++", stok: 2 },
            { judul: "Pemrograman Web", stok: 5 },
            { judul: "Statistika Dasar", stok: 4 },
            { judul: "Manajemen Proyek TI", stok: 3 },
            { judul: "Etika Profesi TI", stok: 6 },
            { judul: "Pemrograman Go", stok: 2 },
            { judul: "Big Data", stok: 3 },
            { judul: "Cloud Computing", stok: 5 },
            { judul: "Pemrograman Java", stok: 4 },
            { judul: "Manajemen Akuntansi", stok: 5 },
            { judul: "Kalkulus Dasar", stok: 4 },
            { judul: "Ekonomi Mikro", stok: 3 },
          ];
    }
    return [];
  });

  const [peminjaman, setPeminjaman] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("peminjaman");
        return saved ? JSON.parse(saved) : [];
      } catch (e) {
        console.error("Gagal parse peminjaman:", e);
        return [];
      }
    }
    return [];
  });

  const [rekomendasi, setRekomendasi] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("rekomendasi");
        return saved ? JSON.parse(saved) : [];
      } catch (e) {
        console.error("Gagal parse rekomendasi:", e);
        return [];
      }
    }
    return [];
  });

  // LocalStorage syncs
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("absensi", JSON.stringify(absensi));
    }
  }, [absensi]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("daftarBuku", JSON.stringify(daftarBuku));
    }
  }, [daftarBuku]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("peminjaman", JSON.stringify(peminjaman));
    }
  }, [peminjaman]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("rekomendasi", JSON.stringify(rekomendasi));
    }
  }, [rekomendasi]);

  const pustakawanList = ["Dewi", "Adit", "Sari", "Rangga", "Wulan"];

  const [loginData, setLoginData] = useState({username: "", password: ""});
  const [loginError, setLoginError] = useState("");

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError("");
    let loggedInRole = null;
    Object.entries(credentials).forEach(([r, creds]) => {
      if (creds.username === loginData.username && creds.password === loginData.password) {
        loggedInRole = r;
      }
    });
    if (loggedInRole) {
      setRole(loggedInRole);
      setLoginData({username: "", password: ""});
    } else {
      setLoginError("Username atau password salah");
    }
  };

  const handlePeminjaman = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    const qr =
      "Nama: " +
      data.nama +
      ", NIM: " +
      data.nim +
      ", Prodi: " +
      data.prodi +
      ", Buku: " +
      data.judul +
      ", Tanggal: " +
      data.tanggal;
    setPeminjaman((prev) => [...prev, data]);
    setQrData(qr);
    e.target.reset();
  };

  const handleTambahBuku = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    setDaftarBuku((prev) => [...prev, { judul: data.judul, stok: Number(data.stok) }]);
    e.target.reset();
  };

  const handleAbsensi = (nama, status) => {
    setAbsensi((prev) => ({ ...prev, [nama]: status }));
  };

  const handleRekomendasi = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    const recommendation = { ...data, status: "Dalam Proses" };
    setRekomendasi((prev) => [...prev, recommendation]);
    e.target.reset();
  };

  const handleAccRekomendasi = (index) => {
    const rec = rekomendasi[index];
    if (!rec) return;
    if (rec.status === "Tersedia") return;
    const updatedRekomendasi = [...rekomendasi];
    updatedRekomendasi[index] = { ...rec, status: "Tersedia" };
    setRekomendasi(updatedRekomendasi);
    const bukuSudahAda = daftarBuku.some(b => b.judul === rec.judul);
    if (!bukuSudahAda) {
      setDaftarBuku(prev => [...prev, { judul: rec.judul, stok: 1 }]);
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-gray-50">
      {!role ? (
        <div className="flex justify-center items-center min-h-screen px-4">
          <div className="bg-white p-8 rounded shadow text-center max-w-sm w-full">
            <h1 className="text-2xl font-bold mb-6">Login Perpustakaan</h1>
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <input
                type="text"
                className="input"
                placeholder="Username"
                value={loginData.username}
                onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                required
              />
              <input
                type="password"
                className="input"
                placeholder="Password"
                value={loginData.password}
                onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                required
              />
              {loginError && <p className="text-red-600">{loginError}</p>}
              <button type="submit" className="btn-red w-full">
                Login
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 min-h-0">
          {/* Sidebar */}
          {sidebarOpen && (
            <aside className="w-64 bg-red-600 text-white p-4 space-y-3 flex-shrink-0 overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">Menu</h2>
              {role === "mahasiswa" && (
                <button
                  onClick={() => setActiveMenu("peminjaman")}
                  className={
                    "block w-full text-left px-3 py-2 rounded " +
                    (activeMenu === "peminjaman" ? "bg-red-700 font-semibold" : "hover:bg-red-700")
                  }
                >
                  Form Peminjaman
                </button>
              )}
              {role === "pustakawan" && (
                <>
                  <button
                    onClick={() => setActiveMenu("absensi")}
                    className={
                      "block w-full text-left px-3 py-2 rounded " +
                      (activeMenu === "absensi" ? "bg-red-700 font-semibold" : "hover:bg-red-700")
                    }
                  >
                    Absensi
                  </button>
                  <button
                    onClick={() => setActiveMenu("daftarBuku")}
                    className={
                      "block w-full text-left px-3 py-2 rounded " +
                      (activeMenu === "daftarBuku" ? "bg-red-700 font-semibold" : "hover:bg-red-700")
                    }
                  >
                    Daftar Buku
                  </button>
                  <button
                    onClick={() => setActiveMenu("tambahBuku")}
                    className={
                      "block w-full text-left px-3 py-2 rounded " +
                      (activeMenu === "tambahBuku" ? "bg-red-700 font-semibold" : "hover:bg-red-700")
                    }
                  >
                    Tambah Buku
                  </button>
                  <button
                    onClick={() => setActiveMenu("dataPeminjam")}
                    className={
                      "block w-full text-left px-3 py-2 rounded " +
                      (activeMenu === "dataPeminjam" ? "bg-red-700 font-semibold" : "hover:bg-red-700")
                    }
                  >
                    Data Peminjam
                  </button>
                  <button
                    onClick={() => setActiveMenu("rekomendasiPustakawan")}
                    className={
                      "block w-full text-left px-3 py-2 rounded " +
                      (activeMenu === "rekomendasiPustakawan" ? "bg-red-700 font-semibold" : "hover:bg-red-700")
                    }
                  >
                    Rekomendasi Buku
                  </button>
                </>
              )}
              {role === "dosen" && (
                <>
                  <button
                    onClick={() => setActiveMenu("laporanAbsensi")}
                    className={
                      "block w-full text-left px-3 py-2 rounded " +
                      (activeMenu === "laporanAbsensi" ? "bg-red-700 font-semibold" : "hover:bg-red-700")
                    }
                  >
                    Laporan Absensi
                  </button>
                  <button
                    onClick={() => setActiveMenu("rekomendasi")}
                    className={
                      "block w-full text-left px-3 py-2 rounded " +
                      (activeMenu === "rekomendasi" ? "bg-red-700 font-semibold" : "hover:bg-red-700")
                    }
                  >
                    Rekomendasi Buku
                  </button>
                  <button
                    onClick={() => setActiveMenu("daftarBukuDosen")}
                    className={
                      "block w-full text-left px-3 py-2 rounded " +
                      (activeMenu === "daftarBukuDosen" ? "bg-red-700 font-semibold" : "hover:bg-red-700")
                    }
                  >
                    Daftar Buku
                  </button>
                </>
              )}
            </aside>
          )}

          <div className="flex-1 p-6 overflow-auto min-h-0">
            <div className="flex justify-between items-center mb-6">
              <button
                className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300 transition"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-label="Toggle sidebar"
              >
                ☰
              </button>
              <h2 className="text-lg font-semibold capitalize">Dashboard {role}</h2>
              <button
                onClick={() => {
                  setRole("");
                  setActiveMenu("");
                  setQrData(null);
                }}
                className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400 transition"
              >
                Logout
              </button>
            </div>

            {role === "mahasiswa" && activeMenu === "peminjaman" && (
              <>
                <form onSubmit={handlePeminjaman} className="space-y-4 bg-white p-6 rounded shadow max-w-md">
                  <h3 className="text-lg font-semibold">Form Peminjaman Buku</h3>
                  <input name="nama" required placeholder="Nama" className="input" />
                  <input name="nim" required placeholder="NIM" className="input" />
                  <input name="prodi" required placeholder="Prodi" className="input" />
                  <select name="judul" required className="input">
                    <option value="" disabled defaultValue>
                      Pilih Judul Buku
                    </option>
                    {daftarBuku.map((buku, idx) => (
                      <option key={idx} value={buku.judul}>
                        {buku.judul}
                      </option>
                    ))}
                  </select>
                  <input name="tanggal" type="date" required className="input" />
                  <button type="submit" className="btn-red">
                    Pinjam
                  </button>
                </form>

                {qrData && (
                  <div className="mt-6 text-center border p-4 rounded shadow bg-white max-w-md mx-auto">
                    <h3 className="text-lg font-semibold mb-4">QR Code Peminjaman</h3>
                    <QRCode value={qrData} size={180} />
                    <pre className="mt-4 text-left text-xs whitespace-pre-wrap">{qrData}</pre>
                  </div>
                )}
              </>
            )}

            {role === "pustakawan" && activeMenu === "absensi" && (
              <div className="bg-white p-6 rounded shadow max-w-md">
                <h3 className="text-lg font-semibold mb-4">Absensi Pustakawan</h3>
                {pustakawanList.map((nama) => (
                  <div key={nama} className="flex justify-between items-center mb-3">
                    <span>{nama}</span>
                    <select
                      aria-label={"Status absensi " + nama}
                      value={absensi[nama] || ""}
                      onChange={(e) => handleAbsensi(nama, e.target.value)}
                      className="input max-w-[120px]"
                    >
                      <option value="" disabled>
                        Pilih Status
                      </option>
                      <option value="Hadir">Hadir</option>
                      <option value="Izin">Izin</option>
                      <option value="Sakit">Sakit</option>
                    </select>
                  </div>
                ))}
              </div>
            )}

            {role === "pustakawan" && activeMenu === "daftarBuku" && (
              <div className="p-4 bg-white rounded shadow overflow-auto max-w-xl">
                <h2 className="text-lg font-bold mb-4">Judul Buku dan Stok</h2>
                <table className="w-full border border-collapse border-gray-400 text-center">
                  <thead>
                    <tr className="bg-gray-200 dark:bg-gray-700">
                      <th className="border px-4 py-2">No</th>
                      <th className="border px-4 py-2">Judul Buku</th>
                      <th className="border px-4 py-2">Stok</th>
                    </tr>
                  </thead>
                  <tbody>
                    {daftarBuku.map((buku, index) => (
                      <tr key={index}>
                        <td className="border px-4 py-2">{index + 1}</td>
                        <td className="border px-4 py-2">{buku.judul}</td>
                        <td className="border px-4 py-2">{buku.stok}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {role === "pustakawan" && activeMenu === "tambahBuku" && (
              <form onSubmit={handleTambahBuku} className="bg-white p-6 rounded shadow max-w-md space-y-4">
                <h3 className="text-lg font-semibold mb-2">Tambah Buku</h3>
                <input name="judul" required placeholder="Judul Buku" className="input" />
                <input name="stok" type="number" min="0" required placeholder="Stok" className="input" />
                <button type="submit" className="btn-red">
                  Tambah
                </button>
              </form>
            )}

            {role === "pustakawan" && activeMenu === "dataPeminjam" && (
              <div className="p-4 bg-white rounded shadow max-w-xl overflow-auto">
                <h2 className="text-lg font-bold mb-4">Data Peminjaman Buku</h2>
                {peminjaman.length === 0 ? (
                  <p className="text-center text-gray-600">Belum ada data peminjaman.</p>
                ) : (
                  <table className="w-full border border-collapse border-gray-400 text-center">
                    <thead>
                      <tr className="bg-gray-200 dark:bg-gray-700">
                        <th className="border px-4 py-2">No</th>
                        <th className="border px-4 py-2">Nama</th>
                        <th className="border px-4 py-2">NIM</th>
                        <th className="border px-4 py-2">Prodi</th>
                        <th className="border px-4 py-2">Judul Buku</th>
                        <th className="border px-4 py-2">Tanggal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {peminjaman.map((data, index) => (
                        <tr key={index}>
                          <td className="border px-4 py-2">{index + 1}</td>
                          <td className="border px-4 py-2">{data.nama}</td>
                          <td className="border px-4 py-2">{data.nim}</td>
                          <td className="border px-4 py-2">{data.prodi}</td>
                          <td className="border px-4 py-2">{data.judul}</td>
                          <td className="border px-4 py-2">{data.tanggal}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {role === "pustakawan" && activeMenu === "rekomendasiPustakawan" && (
              <div className="p-4 bg-white rounded shadow max-w-xl overflow-auto">
                <h2 className="text-lg font-bold mb-4">Rekomendasi Buku dari Dosen</h2>
                {rekomendasi.length === 0 ? (
                  <p className="text-center text-gray-600">Belum ada rekomendasi buku.</p>
                ) : (
                  <table className="w-full border border-collapse border-gray-400 text-center">
                    <thead>
                      <tr className="bg-gray-200 dark:bg-gray-700">
                        <th className="border px-4 py-2">No</th>
                        <th className="border px-4 py-2">Judul Buku</th>
                        <th className="border px-4 py-2">Alasan</th>
                        <th className="border px-4 py-2">Status</th>
                        <th className="border px-4 py-2">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rekomendasi.map((item, index) => (
                        <tr key={index}>
                          <td className="border px-4 py-2">{index + 1}</td>
                          <td className="border px-4 py-2">{item.judul}</td>
                          <td className="border px-4 py-2">{item.alasan}</td>
                          <td className="border px-4 py-2">{item.status || "Dalam Proses"}</td>
                          <td className="border px-4 py-2">
                            {item.status === "Tersedia" ? (
                              <span className="text-green-600 font-semibold">Sudah ACC</span>
                            ) : (
                              <button
                                onClick={() => handleAccRekomendasi(index)}
                                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                              >
                                ACC Tersedia
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {role === "dosen" && activeMenu === "laporanAbsensi" && (
              <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md mx-auto border border-gray-300 backdrop-blur bg-white/70">
                <h3 className="text-3xl font-extrabold mb-6 text-center text-gray-900 tracking-tight">
                  Laporan Absensi Pustakawan
                </h3>
                <ul className="divide-y divide-gray-300 max-w-sm mx-auto rounded-lg border border-gray-300 shadow-md overflow-hidden">
                  {pustakawanList.map((nama) => {
                    const status = absensi[nama] || "Belum absen";
                    const color =
                      status === "Hadir"
                        ? "text-green-700 bg-green-100"
                        : status === "Izin"
                        ? "text-yellow-700 bg-yellow-100"
                        : status === "Sakit"
                        ? "text-red-700 bg-red-100"
                        : "text-gray-700 bg-gray-100";

                    return (
                      <li
                        key={nama}
                        className={"flex justify-between px-6 py-4 items-center " + color + " font-semibold text-lg transition-colors duration-300"}
                      >
                        <span>{nama}</span>
                        <span>{status}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {role === "dosen" && activeMenu === "rekomendasi" && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const data = Object.fromEntries(new FormData(e.target));
                  const recommendation = { ...data, status: "Dalam Proses" };
                  setRekomendasi((prev) => [...prev, recommendation]);
                  e.target.reset();
                }}
                className="bg-white p-6 rounded shadow max-w-md space-y-4"
              >
                <h3 className="text-lg font-semibold mb-2">Rekomendasi Buku</h3>
                <input name="judul" required placeholder="Judul Buku" className="input" />
                <input name="alasan" required placeholder="Alasan" className="input" />
                <button type="submit" className="btn-red">
                  Kirim Rekomendasi
                </button>
              </form>
            )}

            {role === "dosen" && activeMenu === "daftarBukuDosen" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {daftarBuku.map((buku, index) => (
                  <div key={index} className="border rounded p-4 shadow bg-white text-black">
                    <h3 className="font-semibold text-lg">{buku.judul}</h3>
                    <p>Stok tersedia: {buku.stok}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <footer className="bg-gray-200 text-center text-sm py-3 mt-auto">
        © 2025 Perpustakaan Universitas Ma'soem
      </footer>

      <style jsx>{`
        .input {
          display: block;
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 0.5rem;
          margin-top: 0.25rem;
          margin-bottom: 0.5rem;
          font-size: 1rem;
          font-family: inherit;
          color: #111;
          transition: border-color 0.3s ease;
        }
        .input:focus {
          border-color: #ef4444;
          outline: none;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.3);
        }
        .btn-red {
          background-color: #ef4444;
          color: white;
          padding: 0.6rem 1.25rem;
          border-radius: 0.5rem;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: background-color 0.3s ease;
          border: none;
          display: inline-block;
        }
        .btn-red:hover {
          background-color: #dc2626;
        }
        select.input {
          max-width: 12rem;
        }
      `}</style>
    </main>
  );
}

