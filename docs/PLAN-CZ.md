# tvujspecialista.cz — Akcelerační plán (CZ)
## Jak rozjet platformu krok za krokem

---

## TÝDEN 1-2: Příprava na start

### Technická příprava
- [ ] Nastavit vlastní doménu tvujspecialista.cz (Vercel + DNS)
- [ ] Stripe přepnout na production mode (live API klíče)
- [ ] Nastavit Google Analytics 4 + Meta Pixel
- [ ] Přidat cookie consent banner (GDPR povinnost)
- [ ] Otestovat všechny email šablony (registrace, reset hesla, nový lead)
- [ ] Vytvořit 10 reálných testovacích profilů specialistů s kvalitními fotkami

### Právní záležitosti
- [ ] Obchodní podmínky (už existují — zkontrolovat s právníkem)
- [ ] GDPR politika (už existuje — zkontrolovat)
- [ ] Fakturační údaje pro Stripe (IČO, DIČ, bankovní účet)

### Branding
- [ ] Logo v různých formátech (SVG, PNG, favicon)
- [ ] Open Graph obrázek (1200×630px) pro sdílení na sociálních sítích
- [ ] Social media profily: Facebook stránka, Instagram profil, LinkedIn company page

---

## TÝDEN 3-4: Soft Launch (Praha + Brno)

### Získání prvních 20 specialistů
**Postup:**
1. Napsat seznam 50 finančních poradců a realitních makléřů v Praze a Brně
2. Kontaktovat přes LinkedIn s personalizovanou zprávou:
   > "Dobrý den [jméno], spouštíme novou platformu pro ověřené finanční specialisty. Nabízíme vám 30 dní zdarma + přednostní profil. Máte 5 minut na krátký hovor?"
3. Osobní demo přes Zoom/Meet (max 15 min):
   - Ukázat jak funguje profil
   - Ukázat Kanban s leady
   - Ukázat CRM integraci
4. Pomoct jim vyplnit profil (fotka, bio, služby, certifikace)
5. Po 30 dnech free trial → konverze na platící verzi

**Cíl:** 20 registrovaných, 10 s kompletním profilem

### První obsah
- [ ] 3 blog články (SEO):
  - "Jak si vybrat finančního poradce v roce 2026"
  - "10 otázek, které byste měli položit svému makléři"
  - "Proč je důležité mít ověřeného finančního poradce"
- [ ] 1 video: "Jak funguje tvujspecialista.cz" (2 min, na YouTube + web)

---

## MĚSÍC 2: První leady a validace

### Generování leadů pro specialisty
**Organic (zdarma):**
- SEO články — optimalizovat na "finanční poradce Praha", "realitní makléř Brno"
- Google My Business profil pro platformu
- Sdílení na relevantních Facebook skupinách (hypotéky, nemovitosti)

**Paid (rozpočet 300€):**
- Google Ads: 150€ na keywords "finanční poradce", "hypotéka srovnání"
- Facebook Ads: 150€ na retargeting návštěvníků webu
- Cíl: 100 leadů/měsíc

### Feedback loop
- [ ] Kontaktovat každého specialistu 1× týdně: "Jak se vám daří? Co byste zlepšili?"
- [ ] Sledovat metriky: kolik leadů dostali, kolik odpověděli, kolik uzavřeli
- [ ] Sbírat první recenze od klientů

**Cíl měsíce 2:** 30 specialistů, 100 leadů, první 3 recenze

---

## MĚSÍC 3: Referral program a růst

### Spuštění referral programu
**Mechanismus:**
- Každý specialista dostane unikátní referral link
- Za každého pozvaného kolegu, který se zaregistruje → 1 měsíc zdarma
- Za každého pozvaného klienta → "priority" badge na profilu

**Implementace:**
- Referral kód v URL (?ref=ABC123)
- Tracking v databázi (kdo koho pozval)
- Automatický email s pozvánkou

### Zvýšení paid rozpočtu
- Google Ads: 300€/měsíc
- Facebook/Instagram: 300€/měsíc
- LinkedIn (B2B na specialisty): 200€/měsíc
- **Celkem: 800€/měsíc → cíl 25 nových specialistů**

### Partnerství (začít vyjednávat)
- [ ] OVB Allfinanz — navrhnout CRM integraci jako benefit pro jejich poradce
- [ ] Partner Group — stejná nabídka
- [ ] 4fin — kontaktovat přes LinkedIn vedení

**Cíl měsíce 3:** 60 specialistů, 300 leadů, 5 platících

---

## MĚSÍC 4-5: Product-Market Fit

### Optimalizace na základě dat
- Analyzovat: které leady se konvertují, z jakých kanálů, v jakých městech
- A/B testovat: hero text, CTA tlačítka, pricing stránku
- Přidat Hotjar heatmaps — sledovat kde lidé klikají a kde odcházejí

### Nové funkce (podle feedbacku)
- [ ] In-app notifikace (nový lead → okamžitý alert)
- [ ] Onboarding wizard (nový specialista → 5 kroků na kompletní profil)
- [ ] Messaging systém (klient ↔ specialista chat)

### Expanze do dalších měst
- Ostrava, Plzeň, Liberec, Olomouc
- Lokální SEO pro každé město
- 5 specialistů v každém novém městě

**Cíl měsíce 5:** 120 specialistů, 30 platících, 1,500€ MRR

---

## MĚSÍC 6-8: Growth fáze

### Škálování marketingu
- **Content machine:** 2 články/týden, 1 video/měsíc
- **Paid ads:** 1,500€/měsíc (Google + Facebook + LinkedIn)
- **Email marketing:** Newsletter pro specialisty i klienty (Resend/Mailchimp)
- **PR:** Článek v HN.cz, E15.cz, Forbes.cz

### Nové kategorie specialistů
- Pojistní agenti
- Účetní
- Daňoví poradci
- (každá kategorie = nový segment trhu)

### Enterprise nabídka
- Balíčky pro firmy (10+ specialistů = sleva 20%)
- Firemní admin panel
- Custom branding profilu

**Cíl měsíce 8:** 200 specialistů, 100 platících, 5,000€ MRR

---

## MĚSÍC 9-12: Škálování

### Automatizace
- AI lead scoring (automatická prioritizace leadů)
- Automatické follow-up emaily
- Chatbot na webu pro základní otázky

### Mobilní aplikace
- React Native aplikace pro specialisty
- Push notifikace na nové leady
- Rychlý response přímo z telefonu

### Expanze na Slovensko a do Polska
- Slovenské a polské překlady (už existují!)
- Partnerství se slovenskými a polskými finančními firmami
- Paid ads ve slovenštině a polštině

**Cíl měsíc 12:** 500 specialistů, 250 platících, **12,500€ MRR**

---

## FINANČNÍ PŘEHLED

### Náklady (měsíčně)
| Položka | Měsíc 1-3 | Měsíc 4-8 | Měsíc 9-12 |
|---------|-----------|-----------|------------|
| Hosting (Vercel + Railway) | 50€ | 100€ | 200€ |
| Domény + služby | 20€ | 20€ | 20€ |
| Paid ads | 300€ | 1,000€ | 2,000€ |
| Stripe poplatky (2.9%) | 15€ | 145€ | 360€ |
| Email (Resend) | 0€ | 20€ | 50€ |
| Cloudinary | 0€ | 0€ | 30€ |
| **Celkem** | **385€** | **1,285€** | **2,660€** |

### Výnosy (měsíčně)
| Metrika | Měsíc 3 | Měsíc 6 | Měsíc 12 |
|---------|---------|---------|----------|
| Platících specialistů | 10 | 80 | 250 |
| MRR | 500€ | 4,000€ | 12,500€ |
| **Zisk (MRR - náklady)** | **115€** | **2,715€** | **9,840€** |

### Break-even: Měsíc 2-3 (při 8-10 platících specialistech)

---

## DENNÍ REŽIM ZAKLADATELE

### Každý den (30 min)
- Zkontrolovat nové registrace a leady
- Odpovědět na support otázky
- Podívat se na metriky (GA4, Stripe dashboard)

### Každý týden (2 hodiny)
- 1 nový blog článek nebo social media post
- Kontaktovat 5 potenciálních specialistů (LinkedIn)
- Feedback hovor s 1 specialistou
- Aktualizovat Kanban s úkoly

### Každý měsíc (4 hodiny)
- Analýza metrik (konverze, retention, churn)
- Plánování paid ads rozpočtu
- 1 vylepšení produktu (funkce nebo bug fix)
- Newsletter pro specialisty

---

## KLÍČOVÉ METRIKY K SLEDOVÁNÍ

1. **MRR** (Monthly Recurring Revenue) — kolik vyděláváte měsíčně
2. **Churn rate** — kolik % specialistů zruší předplatné
3. **CAC** (Customer Acquisition Cost) — kolik stojí získání 1 specialisty
4. **LTV** (Lifetime Value) — kolik přinese 1 specialista za celou dobu
5. **Lead-to-Contact rate** — kolik % leadů specialista kontaktuje
6. **Response time** — jak rychle specialista reaguje na lead
7. **NPS** (Net Promoter Score) — spokojenost specialistů i klientů

---

> **Pamatuj:** Nejdůležitější první 3 měsíce jsou o osobním kontaktu. Žádné ads nenahradí osobní telefonát s poradcem, kterému ukážeš jak platforma funguje. Prvních 20 specialistů získáš ručně — pak se to začne šířit samo.
