export default function PricingPage() {
  const plans = [
    {
      name: 'Basic',
      price: 300,
      period: 'měsíc',
      features: [
        '10 leadů měsíčně',
        'Základní profil',
        'Recenze od zákazníků',
        'Email podpora',
      ],
      cta: 'Začít zdarma',
      highlighted: false,
    },
    {
      name: 'Pro',
      price: 800,
      period: 'měsíc',
      features: [
        '50 leadů měsíčně',
        'Rozšířený profil',
        'Recenze od zákazníků',
        'Odznak "Ověřený"',
        'Prioritní podpora',
        'Statistiky a analytics',
      ],
      cta: 'Vyzkoušet Pro',
      highlighted: true,
    },
    {
      name: 'Premium',
      price: 1500,
      period: 'měsíc',
      features: [
        'Neomezené leady',
        'Premium profil',
        'Recenze od zákazníků',
        'Odznak "Ověřený"',
        'Možnost topování',
        'VIP podpora',
        'Video profil',
        'Pokročilé statistiky',
      ],
      cta: 'Vyzkoušet Premium',
      highlighted: false,
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <a href="/" className="text-2xl font-bold text-blue-600">
            tvujspecialista.cz
          </a>
          <nav className="flex items-center gap-6">
            <a href="/hledat" className="text-sm font-medium hover:text-blue-600">
              Hledat
            </a>
            <a href="/ceny" className="text-sm font-medium text-blue-600">
              Ceny
            </a>
            <a
              href="/profi/registrace"
              className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
            >
              Registrace zdarma
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">Jednoduché a transparentní ceny</h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Vyberte si plán, který nejlépe vyhovuje vašemu podnikání. Všechny plány zahrnují 14denní
            zkušební dobu zdarma.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-lg border ${
                  plan.highlighted ? 'border-blue-600 shadow-xl' : 'border-gray-200'
                } bg-white p-8`}
              >
                {plan.highlighted && (
                  <div className="mb-4">
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-600">
                      NEJPOPULÁRNĚJŠÍ
                    </span>
                  </div>
                )}

                <h3 className="mb-2 text-2xl font-bold text-gray-900">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">{plan.price} Kč</span>
                  <span className="text-gray-600">/{plan.period}</span>
                </div>

                <ul className="mb-8 space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg
                        className="mr-2 h-5 w-5 flex-shrink-0 text-green-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href="/profi/registrace"
                  className={`block w-full rounded-md py-3 text-center text-sm font-medium ${
                    plan.highlighted
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'border border-blue-600 text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  {plan.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="border-t bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center text-3xl font-bold text-gray-900">Srovnání funkcí</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="py-4 text-left text-sm font-semibold text-gray-900">Funkce</th>
                  <th className="py-4 text-center text-sm font-semibold text-gray-900">Basic</th>
                  <th className="py-4 text-center text-sm font-semibold text-gray-900">Pro</th>
                  <th className="py-4 text-center text-sm font-semibold text-gray-900">Premium</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="py-4 text-sm text-gray-700">Leady měsíčně</td>
                  <td className="py-4 text-center text-sm">10</td>
                  <td className="py-4 text-center text-sm">50</td>
                  <td className="py-4 text-center text-sm">Neomezené</td>
                </tr>
                <tr>
                  <td className="py-4 text-sm text-gray-700">Odznak "Ověřený"</td>
                  <td className="py-4 text-center text-sm">—</td>
                  <td className="py-4 text-center text-sm">✓</td>
                  <td className="py-4 text-center text-sm">✓</td>
                </tr>
                <tr>
                  <td className="py-4 text-sm text-gray-700">Video profil</td>
                  <td className="py-4 text-center text-sm">—</td>
                  <td className="py-4 text-center text-sm">—</td>
                  <td className="py-4 text-center text-sm">✓</td>
                </tr>
                <tr>
                  <td className="py-4 text-sm text-gray-700">Topování v seznamech</td>
                  <td className="py-4 text-center text-sm">—</td>
                  <td className="py-4 text-center text-sm">—</td>
                  <td className="py-4 text-center text-sm">✓</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center text-3xl font-bold text-gray-900">Časté otázky</h2>
          <div className="mx-auto max-w-3xl space-y-6">
            <div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                Jak funguje zkušební doba?
              </h3>
              <p className="text-gray-600">
                Všechny plány zahrnují 14denní zkušební dobu zdarma. Platba se automaticky aktivuje
                po uplynutí zkušební doby.
              </p>
            </div>
            <div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                Mohu změnit plán kdykoli?
              </h3>
              <p className="text-gray-600">
                Ano, plán můžete změnit kdykoli. Rozdíl v ceně bude automaticky přepočítán.
              </p>
            </div>
            <div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                Co se stane, když překročím limit leadů?
              </h3>
              <p className="text-gray-600">
                Budete upozorněni emailem. Můžete si buď upgradovat plán, nebo počkat do dalšího
                měsíce.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
