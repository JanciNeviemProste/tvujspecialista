import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import * as fs from 'fs';
import * as path from 'path';

interface LeadData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  message: string;
}

interface DealData {
  customerName: string;
  dealValue: number;
  estimatedCloseDate: string | Date;
}

type Locale = 'cs' | 'sk' | 'en' | 'pl';

const emailTranslations: Record<
  string,
  Record<Locale, Record<string, string>>
> = {
  passwordReset: {
    cs: {
      subject: 'Obnovení hesla - tvujspecialista.cz',
      title: 'Obnovení hesla',
      greeting: 'Dobrý den',
      body: 'Obdrželi jsme žádost o obnovení vašeho hesla.',
      button: 'Obnovit heslo',
      expiry: 'Odkaz je platný 1 hodinu.',
      ignore:
        'Pokud jste o obnovení hesla nežádali, tento email můžete ignorovat.',
    },
    sk: {
      subject: 'Obnovenie hesla - tvujspecialista.cz',
      title: 'Obnovenie hesla',
      greeting: 'Dobrý deň',
      body: 'Dostali sme žiadosť o obnovenie vášho hesla.',
      button: 'Obnoviť heslo',
      expiry: 'Odkaz je platný 1 hodinu.',
      ignore:
        'Ak ste o obnovenie hesla nežiadali, tento email môžete ignorovať.',
    },
    en: {
      subject: 'Password Reset - tvujspecialista.cz',
      title: 'Password Reset',
      greeting: 'Hello',
      body: 'We received a request to reset your password.',
      button: 'Reset Password',
      expiry: 'This link is valid for 1 hour.',
      ignore:
        'If you did not request a password reset, you can ignore this email.',
    },
    pl: {
      subject: 'Resetowanie hasła - tvujspecialista.cz',
      title: 'Resetowanie hasła',
      greeting: 'Dzień dobry',
      body: 'Otrzymaliśmy prośbę o zresetowanie Twojego hasła.',
      button: 'Zresetuj hasło',
      expiry: 'Link jest ważny przez 1 godzinę.',
      ignore:
        'Jeśli nie prosiłeś o zresetowanie hasła, możesz zignorować ten email.',
    },
  },
  emailVerification: {
    cs: {
      subject: 'Ověření emailu - tvujspecialista.cz',
      title: 'Ověření emailu',
      greeting: 'Dobrý den',
      body: 'Děkujeme za registraci. Prosím ověřte svůj email kliknutím na tlačítko níže.',
      button: 'Ověřit email',
    },
    sk: {
      subject: 'Overenie emailu - tvujspecialista.cz',
      title: 'Overenie emailu',
      greeting: 'Dobrý deň',
      body: 'Ďakujeme za registráciu. Prosím overte si email kliknutím na tlačidlo nižšie.',
      button: 'Overiť email',
    },
    en: {
      subject: 'Email Verification - tvujspecialista.cz',
      title: 'Email Verification',
      greeting: 'Hello',
      body: 'Thank you for registering. Please verify your email by clicking the button below.',
      button: 'Verify Email',
    },
    pl: {
      subject: 'Weryfikacja email - tvujspecialista.cz',
      title: 'Weryfikacja email',
      greeting: 'Dzień dobry',
      body: 'Dziękujemy za rejestrację. Proszę zweryfikuj swój email klikając przycisk poniżej.',
      button: 'Zweryfikuj email',
    },
  },
  welcome: {
    cs: {
      subject: 'Vítejte na tvujspecialista.cz',
      title: 'Vítejte!',
      greeting: 'Dobrý den',
      body: 'Děkujeme za registraci na tvujspecialista.cz.',
    },
    sk: {
      subject: 'Vitajte na tvujspecialista.cz',
      title: 'Vitajte!',
      greeting: 'Dobrý deň',
      body: 'Ďakujeme za registráciu na tvujspecialista.cz.',
    },
    en: {
      subject: 'Welcome to tvujspecialista.cz',
      title: 'Welcome!',
      greeting: 'Hello',
      body: 'Thank you for registering on tvujspecialista.cz.',
    },
    pl: {
      subject: 'Witamy na tvujspecialista.cz',
      title: 'Witamy!',
      greeting: 'Dzień dobry',
      body: 'Dziękujemy za rejestrację na tvujspecialista.cz.',
    },
  },
};

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private resend: Resend | null = null;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');
    if (apiKey && apiKey !== 're_xxxxxxxxxxxxx') {
      this.resend = new Resend(apiKey);
    }
  }

  private getFrom(): string {
    const email = this.configService.get<string>('RESEND_FROM_EMAIL') || 'noreply@tvujspecialista.cz';
    const name = this.configService.get<string>('RESEND_FROM_NAME') || 'tvujspecialista.cz';
    return `${name} <${email}>`;
  }

  private async sendEmail(to: string, subject: string, html: string): Promise<void> {
    if (!this.resend) {
      this.logger.warn('Resend not configured, skipping email send');
      return;
    }

    try {
      await this.resend.emails.send({
        from: this.getFrom(),
        to: [to],
        subject,
        html,
      });
    } catch (error) {
      this.logger.error('Error sending email:', error);
    }
  }

  private loadTemplate(templateName: string): string {
    const templatePath = path.join(
      __dirname,
      'templates',
      `${templateName}.html`,
    );
    if (fs.existsSync(templatePath)) {
      return fs.readFileSync(templatePath, 'utf-8');
    }
    return '';
  }

  private replaceVariables(
    template: string,
    variables: Record<string, string>,
  ): string {
    let result = template;
    for (const [key, value] of Object.entries(variables)) {
      result = result.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }
    return result;
  }

  async sendNewLeadNotification(
    specialistEmail: string,
    specialistName: string,
    leadData: LeadData,
  ) {
    const template = this.loadTemplate('new-lead');
    const html = this.replaceVariables(template, {
      specialistName,
      customerName: leadData.customerName,
      customerEmail: leadData.customerEmail,
      customerPhone: leadData.customerPhone,
      message: leadData.message,
      dashboardUrl: `${this.configService.get<string>('FRONTEND_URL')}/profi/dashboard`,
    });

    await this.sendEmail(
      specialistEmail,
      `Nová poptávka od ${leadData.customerName}`,
      html ||
        `
        <h1>Nová poptávka</h1>
        <p>Dobrý den ${specialistName},</p>
        <p>Máte novou poptávku od ${leadData.customerName}.</p>
        <p><strong>Email:</strong> ${leadData.customerEmail}</p>
        <p><strong>Telefon:</strong> ${leadData.customerPhone}</p>
        <p><strong>Zpráva:</strong> ${leadData.message}</p>
      `,
    );
  }

  async sendLeadConfirmation(
    customerEmail: string,
    customerName: string,
    specialistName: string,
  ) {
    const template = this.loadTemplate('lead-confirmation');
    const html = this.replaceVariables(template, {
      customerName,
      specialistName,
    });

    await this.sendEmail(
      customerEmail,
      `Potvrzení poptávky - ${specialistName}`,
      html ||
        `
        <h1>Potvrzení poptávky</h1>
        <p>Dobrý den ${customerName},</p>
        <p>Děkujeme za vaši poptávku. ${specialistName} vás bude brzy kontaktovat.</p>
      `,
    );
  }

  async sendWelcomeEmail(email: string, name: string, locale?: string) {
    const loc = this.getLocale(locale);
    const t = emailTranslations.welcome[loc];
    const template = this.loadTemplate('welcome');
    const html = this.replaceVariables(template, {
      name,
      dashboardUrl: `${this.configService.get<string>('FRONTEND_URL')}/profi/dashboard`,
    });

    await this.sendEmail(
      email,
      t.subject,
      html ||
        `
        <h1>${t.title}</h1>
        <p>${t.greeting} ${name},</p>
        <p>${t.body}</p>
      `,
    );
  }

  async sendEnrollmentConfirmation(
    email: string,
    userName: string,
    courseTitle: string,
    courseSlug: string,
  ): Promise<void> {
    const courseUrl = `${this.configService.get<string>('FRONTEND_URL')}/academy/learn/${courseSlug}`;
    const dashboardUrl = `${this.configService.get<string>('FRONTEND_URL')}/academy/my-learning`;

    const template = this.loadTemplate('enrollment-confirmation');
    const html = this.replaceVariables(template, {
      userName,
      courseTitle,
      courseUrl,
      dashboardUrl,
    });

    await this.sendEmail(
      email,
      `Potvrzení zápisu: ${courseTitle}`,
      html ||
        `
        <h1>Gratulujeme k zápisu do kurzu!</h1>
        <p>Dobrý den ${userName},</p>
        <p>Byl/a jste úspěšně zapsán/a do kurzu: <strong>${courseTitle}</strong></p>
        <p><a href="${courseUrl}">Začít se učit</a></p>
      `,
    );
  }

  async sendRSVPConfirmation(
    email: string,
    userName: string,
    eventTitle: string,
    eventSlug: string,
  ): Promise<void> {
    const eventUrl = `${this.configService.get<string>('FRONTEND_URL')}/community/events/${eventSlug}`;
    const myEventsUrl = `${this.configService.get<string>('FRONTEND_URL')}/community/my-events`;

    const template = this.loadTemplate('rsvp-confirmation');
    const html = this.replaceVariables(template, {
      userName,
      eventTitle,
      eventUrl,
      myEventsUrl,
    });

    await this.sendEmail(
      email,
      `Potvrzení registrace: ${eventTitle}`,
      html ||
        `
        <h1>Potvrzení registrace na akci</h1>
        <p>Dobrý den ${userName},</p>
        <p>Byl/a jste úspěšně registrován/a na akci: <strong>${eventTitle}</strong></p>
        <p><a href="${eventUrl}">Zobrazit detail akce</a></p>
        <p><a href="${myEventsUrl}">Moje akce</a></p>
      `,
    );
  }

  async sendEventCancellation(
    email: string,
    userName: string,
    eventTitle: string,
  ): Promise<void> {
    const eventsUrl = `${this.configService.get<string>('FRONTEND_URL')}/community/events`;

    const template = this.loadTemplate('event-cancellation');
    const html = this.replaceVariables(template, {
      userName,
      eventTitle,
      eventsUrl,
    });

    await this.sendEmail(
      email,
      `Zrušení akce: ${eventTitle}`,
      html ||
        `
        <h1>Akce byla zrušena</h1>
        <p>Dobrý den ${userName},</p>
        <p>Omlouváme se, ale akce <strong>${eventTitle}</strong> byla zrušena.</p>
        <p>Pokud jste zaplatili vstupné, bude vám vráceno.</p>
        <p><a href="${eventsUrl}">Zobrazit další akce</a></p>
      `,
    );
  }

  async sendCommissionNotification(
    email: string,
    specialistName: string,
    dealValue: number,
    commissionAmount: number,
  ): Promise<void> {
    const dashboardUrl = `${this.configService.get<string>('FRONTEND_URL')}/profi/dashboard`;
    const commissionsUrl = `${this.configService.get<string>('FRONTEND_URL')}/profi/commissions`;

    const template = this.loadTemplate('commission-notification');
    const html = this.replaceVariables(template, {
      specialistName,
      dealValue: dealValue.toLocaleString('cs-CZ'),
      commissionAmount: commissionAmount.toLocaleString('cs-CZ'),
      dashboardUrl,
      commissionsUrl,
    });

    await this.sendEmail(
      email,
      `Nová provize: ${commissionAmount.toLocaleString('cs-CZ')} Kč`,
      html ||
        `
        <h1>Gratulujeme k uzavření obchodu!</h1>
        <p>Dobrý den ${specialistName},</p>
        <p>Váš obchod v hodnotě <strong>${dealValue.toLocaleString('cs-CZ')} Kč</strong> byl úspěšně uzavřen.</p>
        <p>Vaše provize činí: <strong>${commissionAmount.toLocaleString('cs-CZ')} Kč</strong></p>
        <p>Provizi můžete uhradit na platformě do 30 dnů.</p>
        <p><a href="${commissionsUrl}">Zobrazit provize</a></p>
      `,
    );
  }

  async sendCommissionReceipt(
    email: string,
    specialistName: string,
    commissionAmount: number,
    commissionId: string,
  ): Promise<void> {
    const dashboardUrl = `${this.configService.get<string>('FRONTEND_URL')}/profi/dashboard`;

    const template = this.loadTemplate('commission-receipt');
    const html = this.replaceVariables(template, {
      specialistName,
      commissionAmount: commissionAmount.toLocaleString('cs-CZ'),
      commissionId,
      dashboardUrl,
      date: new Date().toLocaleDateString('cs-CZ'),
    });

    await this.sendEmail(
      email,
      `Potvrzení platby provize - ${commissionAmount.toLocaleString('cs-CZ')} Kč`,
      html ||
        `
        <h1>Potvrzení platby provize</h1>
        <p>Dobrý den ${specialistName},</p>
        <p>Vaše platba provize ve výši <strong>${commissionAmount.toLocaleString('cs-CZ')} Kč</strong> byla úspěšně zpracována.</p>
        <p><strong>ID platby:</strong> ${commissionId}</p>
        <p><strong>Datum:</strong> ${new Date().toLocaleDateString('cs-CZ')}</p>
        <p>Děkujeme za vaši důvěru!</p>
        <p><a href="${dashboardUrl}">Přejít na dashboard</a></p>
      `,
    );
  }

  async sendDealStatusChange(
    email: string,
    specialistName: string,
    deal: DealData,
    oldStatus: string,
    newStatus: string,
  ): Promise<void> {
    const template = this.loadTemplate('deal-status-change');

    const html = this.replaceVariables(template, {
      specialistName,
      customerName: deal.customerName,
      oldStatus: this.getStatusLabel(oldStatus),
      newStatus: this.getStatusLabel(newStatus),
      dealsUrl: `${this.configService.get<string>('FRONTEND_URL')}/profi/dashboard/deals`,
    });

    await this.sendEmail(
      email,
      'Zmena statusu dealu',
      html ||
        `
        <h1>Zmena statusu dealu</h1>
        <p>Dobrý deň ${specialistName},</p>
        <p>Status vášho dealu pre ${deal.customerName} bol zmenený z ${this.getStatusLabel(oldStatus)} na ${this.getStatusLabel(newStatus)}.</p>
      `,
    );
  }

  async sendDealValueSet(
    email: string,
    specialistName: string,
    deal: DealData,
  ): Promise<void> {
    const template = this.loadTemplate('deal-value-set');

    const formattedValue = new Intl.NumberFormat('sk-SK', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(deal.dealValue);

    const formattedDate = new Date(deal.estimatedCloseDate).toLocaleDateString(
      'sk-SK',
    );

    const html = this.replaceVariables(template, {
      specialistName,
      customerName: deal.customerName,
      dealValue: formattedValue,
      estimatedCloseDate: formattedDate,
      dealsUrl: `${this.configService.get<string>('FRONTEND_URL')}/profi/dashboard/deals`,
    });

    await this.sendEmail(
      email,
      'Hodnota dealu nastavená',
      html ||
        `
        <h1>Hodnota dealu nastavená</h1>
        <p>Dobrý deň ${specialistName},</p>
        <p>Hodnota vášho dealu pre ${deal.customerName} bola nastavená na ${formattedValue} €.</p>
        <p>Predpokladané uzavretie: ${formattedDate}</p>
      `,
    );
  }

  async sendDealDeadlineReminder(
    email: string,
    specialistName: string,
    deal: DealData,
  ): Promise<void> {
    const template = this.loadTemplate('deal-deadline-reminder');

    const formattedValue = new Intl.NumberFormat('sk-SK', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(deal.dealValue);

    const formattedDate = new Date(deal.estimatedCloseDate).toLocaleDateString(
      'sk-SK',
    );

    const html = this.replaceVariables(template, {
      specialistName,
      customerName: deal.customerName,
      dealValue: formattedValue,
      estimatedCloseDate: formattedDate,
      dealsUrl: `${this.configService.get<string>('FRONTEND_URL')}/profi/dashboard/deals`,
    });

    await this.sendEmail(
      email,
      'Pripomienka uzavretia dealu',
      html ||
        `
        <h1>Pripomienka uzavretia</h1>
        <p>Dobrý deň ${specialistName},</p>
        <p>Váš deal pre ${deal.customerName} sa blíži k predpokladanému dátumu uzavretia: ${formattedDate}</p>
        <p>Hodnota dealu: ${formattedValue} €</p>
      `,
    );
  }

  private getLocale(locale?: string): Locale {
    const supported: Locale[] = ['cs', 'sk', 'en', 'pl'];
    return supported.includes(locale as Locale) ? (locale as Locale) : 'cs';
  }

  private getLocalePrefix(locale: Locale): string {
    return locale === 'cs' ? '' : `/${locale}`;
  }

  async sendPasswordReset(
    email: string,
    name: string,
    token: string,
    locale?: string,
  ): Promise<void> {
    const loc = this.getLocale(locale);
    const t = emailTranslations.passwordReset[loc];
    const prefix = this.getLocalePrefix(loc);
    const resetUrl = `${this.configService.get<string>('FRONTEND_URL')}${prefix}/profi/reset-hesla?token=${token}`;

    await this.sendEmail(
      email,
      t.subject,
      `
        <h1>${t.title}</h1>
        <p>${t.greeting} ${name},</p>
        <p>${t.body}</p>
        <p><a href="${resetUrl}" style="padding: 12px 24px; background: #2563eb; color: white; text-decoration: none; border-radius: 6px;">${t.button}</a></p>
        <p>${t.expiry}</p>
        <p>${t.ignore}</p>
      `,
    );
  }

  async sendEmailVerification(
    email: string,
    name: string,
    token: string,
    locale?: string,
  ): Promise<void> {
    const loc = this.getLocale(locale);
    const t = emailTranslations.emailVerification[loc];
    const prefix = this.getLocalePrefix(loc);
    const verifyUrl = `${this.configService.get<string>('FRONTEND_URL')}${prefix}/profi/overenie-emailu?token=${token}`;

    await this.sendEmail(
      email,
      t.subject,
      `
        <h1>${t.title}</h1>
        <p>${t.greeting} ${name},</p>
        <p>${t.body}</p>
        <p><a href="${verifyUrl}" style="padding: 12px 24px; background: #2563eb; color: white; text-decoration: none; border-radius: 6px;">${t.button}</a></p>
      `,
    );
  }

  private getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      new: 'Nový',
      contacted: 'Kontaktovaný',
      qualified: 'Kvalifikovaný',
      in_progress: 'V procese',
      closed_won: 'Uzavretý (Vyhrané)',
      closed_lost: 'Uzavretý (Prehrané)',
    };
    return labels[status] || status;
  }
}
