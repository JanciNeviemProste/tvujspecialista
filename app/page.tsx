'use client';

import { MobileNav } from '@/components/layout/MobileNav';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-background">
      <header className="border-b bg-white dark:bg-card sticky top-0 z-30">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="text-2xl font-bold text-blue-600 dark:text-primary">tvujspecialista.cz</div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            <a href="/hledat" className="text-sm font-medium hover:text-blue-600 dark:hover:text-primary transition-colors">Hledat</a>
            <a href="/ceny" className="text-sm font-medium hover:text-blue-600 dark:hover:text-primary transition-colors">Ceny</a>
            <a href="/profi/registrace" className="rounded bg-blue-600 dark:bg-primary px-4 py-2 text-sm text-white hover:bg-blue-700 dark:hover:bg-primary/90 transition-colors">
              Registrace zdarma
            </a>
          </nav>

          {/* Mobile Navigation */}
          <MobileNav />
        </div>
      </header>

      <main>
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="mb-6 text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 dark:text-foreground">
              Najděte ověřeného specialistu<br className="hidden sm:block" />za 2 minuty
            </h1>
            <p className="mb-8 text-lg sm:text-xl text-gray-600 dark:text-muted-foreground">
              Porovnejte specialisty, přečtěte si recenze a kontaktujte ty nejlepší
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="mb-8 text-center text-2xl sm:text-3xl font-bold dark:text-foreground">Vyberte kategorii specialisty</h2>
            <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2">
              <a href="/hledat?category=financni-poradce" className="rounded-lg border bg-white dark:bg-card p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-4 text-4xl sm:text-5xl">💼</div>
                <h3 className="mb-3 text-xl sm:text-2xl font-semibold dark:text-foreground">Finanční poradce</h3>
                <p className="mb-4 text-sm sm:text-base text-gray-600 dark:text-muted-foreground">
                  Komplexní finanční poradenství - hypotéky, pojištění, investice a úvěry
                </p>
                <div className="text-sm font-medium text-blue-600 dark:text-primary">Zobrazit specialisty →</div>
              </a>
              <a href="/hledat?category=realitni-makler" className="rounded-lg border bg-white dark:bg-card p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-4 text-4xl sm:text-5xl">🏠</div>
                <h3 className="mb-3 text-xl sm:text-2xl font-semibold dark:text-foreground">Realitní makléř</h3>
                <p className="mb-4 text-sm sm:text-base text-gray-600 dark:text-muted-foreground">
                  Prodej, pronájem a správa nemovitostí - byty, domy a komerční prostory
                </p>
                <div className="text-sm font-medium text-blue-600 dark:text-primary">Zobrazit specialisty →</div>
              </a>
            </div>
          </div>
        </section>

        <section className="border-t bg-gray-50 dark:bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="mb-2 text-3xl sm:text-4xl font-bold text-blue-600 dark:text-primary">2 500+</div>
                <div className="text-sm sm:text-base text-gray-600 dark:text-muted-foreground">Ověřených specialistů</div>
              </div>
              <div className="text-center">
                <div className="mb-2 text-3xl sm:text-4xl font-bold text-blue-600 dark:text-primary">15 000+</div>
                <div className="text-sm sm:text-base text-gray-600 dark:text-muted-foreground">Spokojených zákazníků</div>
              </div>
              <div className="text-center">
                <div className="mb-2 text-3xl sm:text-4xl font-bold text-blue-600 dark:text-primary">98%</div>
                <div className="text-sm sm:text-base text-gray-600 dark:text-muted-foreground">Úspěšnost zprostředkování</div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-blue-600 dark:bg-primary py-16 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-4 text-2xl sm:text-3xl font-bold">Jste specialista?</h2>
            <p className="mb-8 text-lg sm:text-xl">Získejte kvalitní leady a rozšiřte své podnikání</p>
            <a href="/profi/registrace" className="inline-block rounded bg-white px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base text-blue-600 dark:text-primary hover:bg-gray-100 dark:hover:bg-gray-200 transition-colors">
              Začít zdarma na 14 dní
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t bg-gray-50 dark:bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
            <div>
              <h3 className="mb-4 font-bold dark:text-foreground">tvujspecialista.cz</h3>
              <p className="text-sm text-gray-600 dark:text-muted-foreground">Marketplace pro hledání ověřených specialistů</p>
            </div>
            <div>
              <h4 className="mb-4 font-semibold dark:text-foreground">Pro zákazníky</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/hledat" className="text-gray-600 dark:text-muted-foreground hover:text-blue-600 dark:hover:text-primary transition-colors">Hledat specialistu</a></li>
                <li><a href="/o-nas" className="text-gray-600 dark:text-muted-foreground hover:text-blue-600 dark:hover:text-primary transition-colors">O nás</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold dark:text-foreground">Pro specialisty</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/ceny" className="text-gray-600 dark:text-muted-foreground hover:text-blue-600 dark:hover:text-primary transition-colors">Ceny</a></li>
                <li><a href="/profi/registrace" className="text-gray-600 dark:text-muted-foreground hover:text-blue-600 dark:hover:text-primary transition-colors">Registrace</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold dark:text-foreground">Právní informace</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/pravidla" className="text-gray-600 dark:text-muted-foreground hover:text-blue-600 dark:hover:text-primary transition-colors">Pravidla</a></li>
                <li><a href="/ochrana-osobnich-udaju" className="text-gray-600 dark:text-muted-foreground hover:text-blue-600 dark:hover:text-primary transition-colors">Ochrana údajů</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t dark:border-border pt-8 text-center text-sm text-gray-600 dark:text-muted-foreground">
            © 2025 tvujspecialista.cz. Všechna práva vyhrazena.
          </div>
        </div>
      </footer>
    </div>
  )
}
