export default function RegistrationPage() {
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
            <a href="/profi/prihlaseni" className="text-sm font-medium text-blue-600">
              Přihlášení
            </a>
          </nav>
        </div>
      </header>

      {/* Registration Form */}
      <div className="px-4 py-12">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-bold text-gray-900">Staňte se naším specialistou</h1>
            <p className="text-gray-600">Získejte kvalitní leady a rozšiřte své podnikání</p>
          </div>

          <div className="rounded-lg border bg-white p-8 shadow-sm">
            <form className="space-y-6">
              {/* Personal Info */}
              <div>
                <h2 className="mb-4 text-lg font-semibold text-gray-900">Osobní údaje</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Jméno a příjmení *
                      </label>
                      <input
                        type="text"
                        placeholder="Jan Novák"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Email *
                      </label>
                      <input
                        type="email"
                        placeholder="jan@example.cz"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Telefon *
                      </label>
                      <input
                        type="tel"
                        placeholder="+420 777 123 456"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        IČO (volitelné)
                      </label>
                      <input
                        type="text"
                        placeholder="12345678"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Professional Info */}
              <div className="border-t pt-6">
                <h2 className="mb-4 text-lg font-semibold text-gray-900">Profesní informace</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Obor *
                      </label>
                      <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                        <option value="">Vyberte obor</option>
                        <option value="hypoteky">Hypotéky</option>
                        <option value="pojisteni">Pojištění</option>
                        <option value="investice">Investice</option>
                        <option value="reality">Reality</option>
                        <option value="ucetnictvi">Účetnictví</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Lokalita *
                      </label>
                      <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                        <option value="">Vyberte lokalitu</option>
                        <option value="praha">Praha</option>
                        <option value="brno">Brno</option>
                        <option value="ostrava">Ostrava</option>
                        <option value="plzen">Plzeň</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Roky praxe *
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder="např. 5"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Krátký popis vašich služeb *
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Popište, čím se zabýváte a jak můžete pomoci klientům..."
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Password */}
              <div className="border-t pt-6">
                <h2 className="mb-4 text-lg font-semibold text-gray-900">Nastavení hesla</h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Heslo *
                    </label>
                    <input
                      type="password"
                      placeholder="Minimálně 8 znaků"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Potvrzení hesla *
                    </label>
                    <input
                      type="password"
                      placeholder="Zadejte heslo znovu"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Terms */}
              <div className="border-t pt-6">
                <div className="space-y-3">
                  <label className="flex items-start">
                    <input type="checkbox" className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600" />
                    <span className="ml-2 text-sm text-gray-700">
                      Souhlasím s{' '}
                      <a href="/pravidla" className="text-blue-600 hover:underline">
                        obchodními podmínkami
                      </a>{' '}
                      *
                    </span>
                  </label>
                  <label className="flex items-start">
                    <input type="checkbox" className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600" />
                    <span className="ml-2 text-sm text-gray-700">
                      Souhlasím se{' '}
                      <a href="/ochrana-osobnich-udaju" className="text-blue-600 hover:underline">
                        zpracováním osobních údajů
                      </a>{' '}
                      *
                    </span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-md bg-blue-600 py-3 text-sm font-medium text-white hover:bg-blue-700"
              >
                Zaregistrovat se zdarma
              </button>

              <p className="text-center text-sm text-gray-600">
                Již máte účet?{' '}
                <a href="/profi/prihlaseni" className="font-medium text-blue-600 hover:underline">
                  Přihlaste se
                </a>
              </p>
            </form>
          </div>

          {/* Benefits */}
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-lg bg-white p-4 text-center">
              <div className="mb-2 text-3xl">✓</div>
              <h3 className="mb-1 font-semibold text-gray-900">Kvalitní leady</h3>
              <p className="text-sm text-gray-600">Kontakty od skutečně zajímavých klientů</p>
            </div>
            <div className="rounded-lg bg-white p-4 text-center">
              <div className="mb-2 text-3xl">⭐</div>
              <h3 className="mb-1 font-semibold text-gray-900">Ověřený profil</h3>
              <p className="text-sm text-gray-600">Zvyšte důvěryhodnost vašich služeb</p>
            </div>
            <div className="rounded-lg bg-white p-4 text-center">
              <div className="mb-2 text-3xl">📊</div>
              <h3 className="mb-1 font-semibold text-gray-900">14 dní zdarma</h3>
              <p className="text-sm text-gray-600">Vyzkoušejte bez závazků</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
