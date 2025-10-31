export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <a href="/" className="text-2xl font-bold text-blue-600">
            tvujspecialista.cz
          </a>
          <nav className="flex items-center gap-4">
            <a href="/hledat" className="text-sm font-medium hover:text-blue-600">
              Hledat
            </a>
            <a href="/profi/registrace" className="text-sm font-medium text-blue-600">
              Registrace
            </a>
          </nav>
        </div>
      </header>

      {/* Login Form */}
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="rounded-lg border bg-white p-8 shadow-sm">
            <h1 className="mb-2 text-2xl font-bold text-gray-900">Přihlášení pro specialisty</h1>
            <p className="mb-6 text-sm text-gray-600">
              Ještě nemáte účet?{' '}
              <a href="/profi/registrace" className="font-medium text-blue-600 hover:underline">
                Zaregistrujte se zdarma
              </a>
            </p>

            <form className="space-y-4">
              <div>
                <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="vas@email.cz"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
                  Heslo
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600" />
                  <span className="ml-2 text-sm text-gray-700">Zapamatovat si mě</span>
                </label>
                <a href="#" className="text-sm font-medium text-blue-600 hover:underline">
                  Zapomenuté heslo?
                </a>
              </div>

              <button
                type="submit"
                className="w-full rounded-md bg-blue-600 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
              >
                Přihlásit se
              </button>
            </form>

            <div className="mt-6 border-t pt-6">
              <p className="text-center text-sm text-gray-600">
                Přihlášením souhlasíte s{' '}
                <a href="/pravidla" className="text-blue-600 hover:underline">
                  obchodními podmínkami
                </a>{' '}
                a{' '}
                <a href="/ochrana-osobnich-udaju" className="text-blue-600 hover:underline">
                  ochranou údajů
                </a>
                .
              </p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <a href="/" className="text-sm text-gray-600 hover:text-blue-600">
              ← Zpět na hlavní stránku
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
