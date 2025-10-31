import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const categories = [
  { id: '1', name: 'Hypotéky', slug: 'hypoteky', description: 'Najděte nejlepší hypotéku pro váš domov' },
  { id: '2', name: 'Pojištění', slug: 'pojisteni', description: 'Ochrana pro vás i vaše blízké' },
  { id: '3', name: 'Investice', slug: 'investice', description: 'Zhodnoťte své úspory chytře' },
  { id: '4', name: 'Reality', slug: 'reality', description: 'Najděte svůj nový domov' },
  { id: '5', name: 'Účetnictví', slug: 'ucetnictvi', description: 'Profesionální účetní služby' },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="text-2xl font-bold text-primary-600">
            tvujspecialista.cz
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/hledat" className="text-sm font-medium hover:text-primary-600">
              Hledat
            </Link>
            <Link href="/ceny" className="text-sm font-medium hover:text-primary-600">
              Ceny
            </Link>
            <Link href="/profi/prihlaseni" className="text-sm font-medium hover:text-primary-600">
              Pro specialisty
            </Link>
            <Button asChild size="sm">
              <Link href="/profi/registrace">Registrace zdarma</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-gray-900">
            Najděte ověřeného specialistu<br />za 2 minuty
          </h1>
          <p className="mb-8 text-xl text-gray-600">
            Porovnejte specialisty, přečtěte si recenze a kontaktujte ty nejlepší
          </p>

          {/* Search Bar */}
          <div className="mx-auto max-w-3xl rounded-lg bg-white p-6 shadow-lg">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="mb-2 block text-left text-sm font-medium">Co hledáte?</label>
                <select className="h-12 w-full rounded-md border border-gray-300 bg-white px-4">
                  <option>Vyberte obor</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="mb-2 block text-left text-sm font-medium">Kde?</label>
                <select className="h-12 w-full rounded-md border border-gray-300 bg-white px-4">
                  <option>Vyberte lokalitu</option>
                  <option>Praha</option>
                  <option>Brno</option>
                  <option>Ostrava</option>
                </select>
              </div>
              <div className="flex items-end">
                <Button size="lg" className="h-12 px-8" asChild>
                  <Link href="/hledat">Najít specialistu</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center text-3xl font-bold">Nejoblíbenější kategorie</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Link key={category.id} href={`/hledat?category=${category.slug}`}>
                <Card className="transition-all hover:shadow-md">
                  <CardHeader>
                    <CardTitle>{category.name}</CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="border-t bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-primary-600">2 500+</div>
              <div className="text-gray-600">Ověřených specialistů</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-primary-600">15 000+</div>
              <div className="text-gray-600">Spokojených zákazníků</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-primary-600">98%</div>
              <div className="text-gray-600">Úspěšnost zprostředkování</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">Jak to funguje?</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-2xl font-bold text-primary-600">
                1
              </div>
              <h3 className="mb-2 text-xl font-semibold">Najděte specialistu</h3>
              <p className="text-gray-600">
                Použijte filtry a najděte specialistu podle vašich potřeb
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-2xl font-bold text-primary-600">
                2
              </div>
              <h3 className="mb-2 text-xl font-semibold">Porovnejte a vyberte</h3>
              <p className="text-gray-600">
                Přečtěte si recenze a porovnejte nabídky
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-2xl font-bold text-primary-600">
                3
              </div>
              <h3 className="mb-2 text-xl font-semibold">Kontaktujte</h3>
              <p className="text-gray-600">
                Odešlete poptávku a specialista vás kontaktuje
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA for Specialists */}
      <section className="border-t bg-primary-600 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold">Jste specialista?</h2>
          <p className="mb-8 text-xl">
            Získejte kvalitní leady a rozšiřte své podnikání
          </p>
          <Button size="lg" variant="outline" className="bg-white text-primary-600 hover:bg-gray-100" asChild>
            <Link href="/profi/registrace">Začít zdarma na 14 dní</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div>
              <h3 className="mb-4 font-bold">tvujspecialista.cz</h3>
              <p className="text-sm text-gray-600">
                Marketplace pro hledání ověřených specialistů
              </p>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">Pro zákazníky</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/hledat" className="text-gray-600 hover:text-primary-600">Hledat specialistu</Link></li>
                <li><Link href="/o-nas" className="text-gray-600 hover:text-primary-600">O nás</Link></li>
                <li><Link href="/kontakt" className="text-gray-600 hover:text-primary-600">Kontakt</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">Pro specialisty</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/ceny" className="text-gray-600 hover:text-primary-600">Ceny</Link></li>
                <li><Link href="/profi/registrace" className="text-gray-600 hover:text-primary-600">Registrace</Link></li>
                <li><Link href="/profi/prihlaseni" className="text-gray-600 hover:text-primary-600">Přihlášení</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">Právní informace</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/pravidla" className="text-gray-600 hover:text-primary-600">Pravidla</Link></li>
                <li><Link href="/ochrana-osobnich-udaju" className="text-gray-600 hover:text-primary-600">Ochrana osobních údajů</Link></li>
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
