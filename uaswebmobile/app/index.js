import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6">Sistem Perpustakaan</h1>
      <Link href="/mahasiswa" className="text-white bg-blue-600 px-6 py-3 rounded hover:bg-blue-700">
        Masuk sebagai Mahasiswa
      </Link>
    </div>
  );
}
