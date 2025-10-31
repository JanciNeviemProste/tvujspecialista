export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="text-2xl font-bold text-blue-600">tvujspecialista.cz</div>
          <nav className="flex items-center gap-6">
            <a href="/hledat" className="text-sm font-medium hover:text-blue-600">Hledat</a>
            <a href="/ceny" className="text-sm font-medium hover:text-blue-600">Ceny</a>
            <a href="/profi/registrace" className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">
              Registrace zdarma
            </a>
          </nav>
        </div>
      </header>

      <main>
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="mb-6 text-5xl font-bold tracking-tight text-gray-900">
              Najděte ověřeného specialistu<br />za 2 minuty
            </h1>
            <p className="mb-8 text-xl text-gray-600">
              Porovnejte specialisty, přečtěte si recenze a kontaktujte ty nejlepší
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="mb-8 text-center text-3xl font-bold">Nejoblíbenější kategorie</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <a href="/hledat?category=hypoteky" className="rounded-lg border bg-white p-6 shadow-sm hover:shadow-md">
                <h3 className="mb-2 text-xl font-semibold">Hypotéky</h3>
                <p className="text-gray-600">Najděte nejlepší hypotéku pro váš domov</p>
              </a>
              <a href="/hledat?category=pojisteni" className="rounded-lg border bg-white p-6 shadow-sm hover:shadow-md">
                <h3 className="mb-2 text-xl font-semibold">Pojištění</h3>
                <p className="text-gray-600">Ochrana pro vás i vaše blízké</p>
              </a>
              <a href="/hledat?category=investice" className="rounded-lg border bg-white p-6 shadow-sm hover:shadow-md">
                <h3 className="mb-2 text-xl font-semibold">Investice</h3>
                <p className="text-gray-600">Zhodnoťte své úspory chytře</p>
              </a>
              <a href="/hledat?category=reality" className="rounded-lg border bg-white p-6 shadow-sm hover:shadow-md">
                <h3 className="mb-2 text-xl font-semibold">Reality</h3>
                <p className="text-gray-600">Najděte svůj nový domov</p>
              </a>
              <a href="/hledat?category=ucetnictvi" className="rounded-lg border bg-white p-6 shadow-sm hover:shadow-md">
                <h3 className="mb-2 text-xl font-semibold">Účetnictví</h3>
                <p className="text-gray-600">Profesionální účetní služby</p>
              </a>
            </div>
          </div>
        </section>

        <section className="border-t bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="mb-2 text-4xl font-bold text-blue-600">2 500+</div>
                <div className="text-gray-600">Ověřených specialistů</div>
              </div>
              <div className="text-center">
                <div className="mb-2 text-4xl font-bold text-blue-600">15 000+</div>
                <div className="text-gray-600">Spokojených zákazníků</div>
              </div>
              <div className="text-center">
                <div className="mb-2 text-4xl font-bold text-blue-600">98%</div>
                <div className="text-gray-600">Úspěšnost zprostředkování</div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-blue-600 py-16 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-4 text-3xl font-bold">Jste specialista?</h2>
            <p className="mb-8 text-xl">Získejte kvalitní leady a rozšiřte své podnikání</p>
            <a href="/profi/registrace" className="inline-block rounded bg-white px-8 py-3 text-blue-600 hover:bg-gray-100">
              Začít zdarma na 14 dní
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div>
              <h3 className="mb-4 font-bold">tvujspecialista.cz</h3>
              <p className="text-sm text-gray-600">Marketplace pro hledání ověřených specialistů</p>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">Pro zákazníky</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/hledat" className="text-gray-600 hover:text-blue-600">Hledat specialistu</a></li>
                <li><a href="/o-nas" className="text-gray-600 hover:text-blue-600">O nás</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">Pro specialisty</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/ceny" className="text-gray-600 hover:text-blue-600">Ceny</a></li>
                <li><a href="/profi/registrace" className="text-gray-600 hover:text-blue-600">Registrace</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">Právní informace</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/pravidla" className="text-gray-600 hover:text-blue-600">Pravidla</a></li>
                <li><a href="/ochrana-osobnich-udaju" className="text-gray-600 hover:text-blue-600">Ochrana údajů</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 text-center text-sm text-gray-600">
            © 2025 tvujspecialista.cz. Všechna práva vyhrazena.
          </div>
        </div>
      </footer>
    </div>
  )
}
