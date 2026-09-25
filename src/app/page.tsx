import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-50">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-8">
          Selamat datang di <span className="text-blue-600">DompetKu</span>
        </h1>

        <p className="mt-3 text-2xl text-gray-600 mb-12">
          Atur keuangan Anda dengan mudah dan aman.
        </p>

        <div className="flex flex-wrap items-center justify-around max-w-4xl sm:w-full gap-4">
          <Link
            href="/login"
            className="p-4 w-48 text-center border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl transition-colors"
          >
            <h3 className="text-xl font-bold">Masuk &rarr;</h3>
          </Link>

          <Link
            href="/register"
            className="p-4 w-48 text-center border border-green-600 bg-green-600 text-white hover:bg-green-700 rounded-xl transition-colors"
          >
            <h3 className="text-xl font-bold">Daftar &rarr;</h3>
          </Link>
        </div>
      </main>
    </div>
  )
}
