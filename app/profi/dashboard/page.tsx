export default function DashboardPage() {
  // Mock data
  const stats = {
    newLeads: 12,
    totalLeads: 145,
    rating: 4.8,
    successRate: 72,
  }

  const recentLeads = [
    { id: '1', customer: 'Marie Procházková', date: '28.01.2025', status: 'new' },
    { id: '2', customer: 'Petr Novák', date: '27.01.2025', status: 'contacted' },
    { id: '3', customer: 'Jana Svobodová', date: '26.01.2025', status: 'scheduled' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <a href="/" className="text-2xl font-bold text-blue-600">
            tvujspecialista.cz
          </a>
          <nav className="flex items-center gap-6">
            <a href="/profi/dashboard" className="text-sm font-medium text-blue-600">
              Dashboard
            </a>
            <a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              Odhlásit se
            </a>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">Vítejte zpět, Jan Nováku!</h1>
          <p className="text-gray-600">Zde je přehled vaší aktivity</p>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border bg-white p-6">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Nové leady</span>
              <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-600">
                Tento měsíc
              </span>
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats.newLeads}</div>
            <p className="mt-2 text-sm text-green-600">+3 oproti minulému měsíci</p>
          </div>

          <div className="rounded-lg border bg-white p-6">
            <div className="mb-2 text-sm font-medium text-gray-600">Celkem leadů</div>
            <div className="text-3xl font-bold text-gray-900">{stats.totalLeads}</div>
            <p className="mt-2 text-sm text-gray-500">Od začátku spolupráce</p>
          </div>

          <div className="rounded-lg border bg-white p-6">
            <div className="mb-2 text-sm font-medium text-gray-600">Průměrné hodnocení</div>
            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-bold text-gray-900">{stats.rating}</div>
              <div className="text-xl text-yellow-400">★</div>
            </div>
            <p className="mt-2 text-sm text-gray-500">Z 47 recenzí</p>
          </div>

          <div className="rounded-lg border bg-white p-6">
            <div className="mb-2 text-sm font-medium text-gray-600">Úspěšnost</div>
            <div className="text-3xl font-bold text-gray-900">{stats.successRate}%</div>
            <p className="mt-2 text-sm text-gray-500">Úspěšně uzavřené leady</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Recent Leads */}
          <div className="lg:col-span-2">
            <div className="rounded-lg border bg-white">
              <div className="border-b p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Poslední leady</h2>
                  <a href="#" className="text-sm font-medium text-blue-600 hover:underline">
                    Zobrazit vše
                  </a>
                </div>
              </div>
              <div className="divide-y">
                {recentLeads.map((lead) => (
                  <div key={lead.id} className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{lead.customer}</h3>
                        <p className="text-sm text-gray-500">{lead.date}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        {lead.status === 'new' && (
                          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                            Nový
                          </span>
                        )}
                        {lead.status === 'contacted' && (
                          <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                            Kontaktován
                          </span>
                        )}
                        {lead.status === 'scheduled' && (
                          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                            Dohodnuto
                          </span>
                        )}
                        <button className="rounded border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50">
                          Detail
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="rounded-lg border bg-white p-6">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">Rychlé akce</h2>
              <div className="space-y-3">
                <a
                  href="#"
                  className="block rounded-md border border-gray-300 p-3 text-sm font-medium text-gray-900 hover:bg-gray-50"
                >
                  📝 Upravit profil
                </a>
                <a
                  href="#"
                  className="block rounded-md border border-gray-300 p-3 text-sm font-medium text-gray-900 hover:bg-gray-50"
                >
                  💬 Správa recenzí
                </a>
                <a
                  href="/ceny"
                  className="block rounded-md border border-gray-300 p-3 text-sm font-medium text-gray-900 hover:bg-gray-50"
                >
                  💳 Upgrade plánu
                </a>
                <a
                  href="#"
                  className="block rounded-md border border-gray-300 p-3 text-sm font-medium text-gray-900 hover:bg-gray-50"
                >
                  📊 Statistiky
                </a>
              </div>
            </div>

            {/* Subscription Status */}
            <div className="mt-6 rounded-lg border bg-blue-50 p-6">
              <h3 className="mb-2 font-semibold text-blue-900">Váš plán: Pro</h3>
              <p className="mb-4 text-sm text-blue-700">
                Zbývá 18 leadů do konce měsíce
              </p>
              <a
                href="/ceny"
                className="block rounded-md bg-blue-600 py-2 text-center text-sm font-medium text-white hover:bg-blue-700"
              >
                Upgradovat na Premium
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
