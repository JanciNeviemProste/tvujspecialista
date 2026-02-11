import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ochrana osobních údajů | TvůjSpecialista.cz',
  description: 'Informace o zpracování a ochraně osobních údajů (GDPR) na platformě TvůjSpecialista.cz. Vaše práva, účel zpracování a kontaktní údaje.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center px-4">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            tvujspecialista.cz
          </Link>
        </div>
      </header>

      <div className="container mx-auto max-w-4xl px-4 py-12">
        <h1 className="mb-8 text-4xl font-bold text-gray-900">Ochrana osobních údajů (GDPR)</h1>

        <div className="prose prose-gray max-w-none">
          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">1. Správce osobních údajů</h2>
            <p className="mb-4 text-gray-700 leading-relaxed">
              Správcem osobních údajů je provozovatel platformy tvujspecialista.cz.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">2. Jaké údaje zpracováváme</h2>
            <p className="mb-4 text-gray-700 leading-relaxed">Zpracováváme následující údaje:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Identifikační údaje (jméno, příjmení)</li>
              <li>Kontaktní údaje (email, telefon)</li>
              <li>Pro poskytovatele: IČO, certifikace, vzdělání</li>
              <li>Údaje o využívání služby (leady, recenze)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">3. Účel zpracování</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Poskytování služeb platformy</li>
              <li>Zprostředkování kontaktu mezi zákazníky a poskytovateli</li>
              <li>Ověřování poskytovatelů</li>
              <li>Zlepšování kvality služeb</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">4. Právní základ zpracování</h2>
            <p className="mb-4 text-gray-700 leading-relaxed">
              Údaje zpracováváme na základě:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Souhlasu uživatele</li>
              <li>Plnění smlouvy</li>
              <li>Oprávněného zájmu</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">5. Doba uložení údajů</h2>
            <p className="mb-4 text-gray-700 leading-relaxed">
              Osobní údaje uchováváme po dobu nezbytně nutnou k naplnění účelu zpracování,
              obvykle po dobu trvání uživatelského účtu a následně max. 5 let pro účetní
              a daňové účely.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">6. Vaše práva</h2>
            <p className="mb-4 text-gray-700 leading-relaxed">Máte právo:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Na přístup k osobním údajům</li>
              <li>Na opravu nepřesných údajů</li>
              <li>Na výmaz údajů ("právo být zapomenut")</li>
              <li>Na přenositelnost údajů</li>
              <li>Vznést námitku proti zpracování</li>
              <li>Odvolat souhlas se zpracováním</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">7. Cookies</h2>
            <p className="mb-4 text-gray-700 leading-relaxed">
              Používáme cookies pro zlepšení funkčnosti webu a analytics. Detaily naleznete
              v našem Cookie Policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">8. Kontakt</h2>
            <p className="mb-4 text-gray-700 leading-relaxed">
              Pro uplatnění svých práv nebo dotazy ohledně zpracování osobních údajů nás
              kontaktujte na <a href="mailto:gdpr@tvujspecialista.cz" className="text-blue-600 hover:underline">gdpr@tvujspecialista.cz</a>
            </p>
          </section>

          <p className="mt-8 text-sm text-gray-500">
            Poslední aktualizace: {new Date().toLocaleDateString('cs-CZ')}
          </p>
        </div>
      </div>
    </div>
  )
}
