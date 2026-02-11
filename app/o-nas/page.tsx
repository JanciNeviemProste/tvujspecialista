import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'O nás | TvujSpecialista.cz',
  description: 'Sme prémiová edu-komunitná platforma spojujúca realitných agentov a finančných poradcov s kvalitným vzdelávaním a obchodnými príležitosťami.',
  openGraph: {
    title: 'O nás | TvujSpecialista.cz',
    description: 'Sme prémiová edu-komunitná platforma spojujúca realitných agentov a finančných poradcov.',
    images: ['/og-image.jpg'],
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-background">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center px-4">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            tvujspecialista.cz
          </Link>
        </div>
      </header>

      <div className="container mx-auto max-w-4xl px-4 py-12">
        <h1 className="mb-8 text-4xl font-bold text-gray-900">O nás</h1>

        <div className="prose prose-gray max-w-none">
          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">Naše mise</h2>
            <p className="mb-4 text-gray-700 leading-relaxed">
              tvujspecialista.cz je moderní platforma, která spojuje zákazníky s ověřenými
              specialisty v oblasti financí a nemovitostí. Naším cílem je zjednodušit proces
              hledání důvěryhodných odborníků a pomoci poskytovatelům služeb růst.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">Proč jsme vznikli</h2>
            <p className="mb-4 text-gray-700 leading-relaxed">
              Všimli jsme si, že hledání kvalitního specialistu - ať už pro hypotéku, pojištění
              nebo investice - je často zdlouhavý a stresující proces. Zákazníci neví, komu
              důvěřovat, a specialisté zase hledají efektivní způsob, jak získat nové klienty.
            </p>
            <p className="mb-4 text-gray-700 leading-relaxed">
              Proto jsme vytvořili platformu, která tento proces zjednodušuje pro obě strany.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">Co nabízíme</h2>
            <div className="space-y-4">
              <div className="rounded-lg border bg-gray-50 p-4">
                <h3 className="mb-2 font-semibold text-gray-900">Pro zákazníky</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Ověřené profily specialistů s reálnými recenzemi</li>
                  <li>Snadné porovnání a kontaktování</li>
                  <li>Bezplatné využívání platformy</li>
                </ul>
              </div>
              <div className="rounded-lg border bg-gray-50 p-4">
                <h3 className="mb-2 font-semibold text-gray-900">Pro specialisty</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Kvalitní leady od zainteresovaných zákazníků</li>
                  <li>Ověřený profil zvyšující důvěryhodnost</li>
                  <li>Nástroje pro správu poptávek a recenzí</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">Naše hodnoty</h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="mr-2 text-blue-600">✓</span>
                <div>
                  <strong className="text-gray-900">Transparentnost:</strong>
                  <span className="text-gray-700"> Všechny recenze jsou ověřené a pravdivé</span>
                </div>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-blue-600">✓</span>
                <div>
                  <strong className="text-gray-900">Kvalita:</strong>
                  <span className="text-gray-700"> Pečlivě ověřujeme každého specialistu</span>
                </div>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-blue-600">✓</span>
                <div>
                  <strong className="text-gray-900">Jednoduchost:</strong>
                  <span className="text-gray-700"> Platformu zvládne používat každý</span>
                </div>
              </li>
            </ul>
          </section>

          <section className="rounded-lg bg-blue-50 p-8">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">Připojte se k nám</h2>
            <p className="mb-4 text-gray-700">
              Ať už hledáte specialistu nebo chcete nabídnout své služby, jsme tu pro vás.
            </p>
            <div className="flex gap-4">
              <Link
                href="/hledat"
                className="rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Najít specialistu
              </Link>
              <Link
                href="/profi/registrace"
                className="rounded-md border border-blue-600 px-6 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
              >
                Stát se specialistou
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
