import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sgMail from '@sendgrid/mail';
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

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('SENDGRID_API_KEY');
    if (apiKey && apiKey !== 'SG.xxxxxxxxxxxxx') {
      sgMail.setApiKey(apiKey);
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

    try {
      await sgMail.send({
        to: specialistEmail,
        from: {
          email: this.configService.get<string>('SENDGRID_FROM_EMAIL')!,
          name: this.configService.get<string>('SENDGRID_FROM_NAME'),
        },
        subject: `Nová poptávka od ${leadData.customerName}`,
        html:
          html ||
          `
          <h1>Nová poptávka</h1>
          <p>Dobrý den ${specialistName},</p>
          <p>Máte novou poptávku od ${leadData.customerName}.</p>
          <p><strong>Email:</strong> ${leadData.customerEmail}</p>
          <p><strong>Telefon:</strong> ${leadData.customerPhone}</p>
          <p><strong>Zpráva:</strong> ${leadData.message}</p>
        `,
      });
    } catch (error) {
      this.logger.error('Error sending email:', error);
    }
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

    try {
      await sgMail.send({
        to: customerEmail,
        from: {
          email: this.configService.get<string>('SENDGRID_FROM_EMAIL')!,
          name: this.configService.get<string>('SENDGRID_FROM_NAME'),
        },
        subject: `Potvrzení poptávky - ${specialistName}`,
        html:
          html ||
          `
          <h1>Potvrzení poptávky</h1>
          <p>Dobrý den ${customerName},</p>
          <p>Děkujeme za vaši poptávku. ${specialistName} vás bude brzy kontaktovat.</p>
        `,
      });
    } catch (error) {
      this.logger.error('Error sending email:', error);
    }
  }

  async sendWelcomeEmail(email: string, name: string) {
    const template = this.loadTemplate('welcome');
    const html = this.replaceVariables(template, {
      name,
      dashboardUrl: `${this.configService.get<string>('FRONTEND_URL')}/profi/dashboard`,
    });

    try {
      await sgMail.send({
        to: email,
        from: {
          email: this.configService.get<string>('SENDGRID_FROM_EMAIL')!,
          name: this.configService.get<string>('SENDGRID_FROM_NAME'),
        },
        subject: 'Vítejte na tvujspecialista.cz',
        html:
          html ||
          `
          <h1>Vítejte!</h1>
          <p>Dobrý den ${name},</p>
          <p>Děkujeme za registraci na tvujspecialista.cz.</p>
        `,
      });
    } catch (error) {
      this.logger.error('Error sending email:', error);
    }
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

    try {
      await sgMail.send({
        to: email,
        from: {
          email: this.configService.get<string>('SENDGRID_FROM_EMAIL')!,
          name: this.configService.get<string>('SENDGRID_FROM_NAME'),
        },
        subject: `Potvrzení zápisu: ${courseTitle}`,
        html:
          html ||
          `
          <h1>Gratulujeme k zápisu do kurzu!</h1>
          <p>Dobrý den ${userName},</p>
          <p>Byl/a jste úspěšně zapsán/a do kurzu: <strong>${courseTitle}</strong></p>
          <p><a href="${courseUrl}">Začít se učit</a></p>
        `,
      });
    } catch (error) {
      this.logger.error('Error sending enrollment confirmation email:', error);
    }
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

    try {
      await sgMail.send({
        to: email,
        from: {
          email: this.configService.get<string>('SENDGRID_FROM_EMAIL')!,
          name: this.configService.get<string>('SENDGRID_FROM_NAME'),
        },
        subject: `Potvrzení registrace: ${eventTitle}`,
        html:
          html ||
          `
          <h1>Potvrzení registrace na akci</h1>
          <p>Dobrý den ${userName},</p>
          <p>Byl/a jste úspěšně registrován/a na akci: <strong>${eventTitle}</strong></p>
          <p><a href="${eventUrl}">Zobrazit detail akce</a></p>
          <p><a href="${myEventsUrl}">Moje akce</a></p>
        `,
      });
    } catch (error) {
      this.logger.error('Error sending RSVP confirmation email:', error);
    }
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

    try {
      await sgMail.send({
        to: email,
        from: {
          email: this.configService.get<string>('SENDGRID_FROM_EMAIL')!,
          name: this.configService.get<string>('SENDGRID_FROM_NAME'),
        },
        subject: `Zrušení akce: ${eventTitle}`,
        html:
          html ||
          `
          <h1>Akce byla zrušena</h1>
          <p>Dobrý den ${userName},</p>
          <p>Omlouváme se, ale akce <strong>${eventTitle}</strong> byla zrušena.</p>
          <p>Pokud jste zaplatili vstupné, bude vám vráceno.</p>
          <p><a href="${eventsUrl}">Zobrazit další akce</a></p>
        `,
      });
    } catch (error) {
      this.logger.error('Error sending event cancellation email:', error);
    }
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

    try {
      await sgMail.send({
        to: email,
        from: {
          email: this.configService.get<string>('SENDGRID_FROM_EMAIL')!,
          name: this.configService.get<string>('SENDGRID_FROM_NAME'),
        },
        subject: `Nová provize: ${commissionAmount.toLocaleString('cs-CZ')} Kč`,
        html:
          html ||
          `
          <h1>Gratulujeme k uzavření obchodu!</h1>
          <p>Dobrý den ${specialistName},</p>
          <p>Váš obchod v hodnotě <strong>${dealValue.toLocaleString('cs-CZ')} Kč</strong> byl úspěšně uzavřen.</p>
          <p>Vaše provize činí: <strong>${commissionAmount.toLocaleString('cs-CZ')} Kč</strong></p>
          <p>Provizi můžete uhradit na platformě do 30 dnů.</p>
          <p><a href="${commissionsUrl}">Zobrazit provize</a></p>
        `,
      });
    } catch (error) {
      this.logger.error('Error sending commission notification email:', error);
    }
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

    try {
      await sgMail.send({
        to: email,
        from: {
          email: this.configService.get<string>('SENDGRID_FROM_EMAIL')!,
          name: this.configService.get<string>('SENDGRID_FROM_NAME'),
        },
        subject: `Potvrzení platby provize - ${commissionAmount.toLocaleString('cs-CZ')} Kč`,
        html:
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
      });
    } catch (error) {
      this.logger.error('Error sending commission receipt email:', error);
    }
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

    try {
      await sgMail.send({
        to: email,
        from: {
          email: this.configService.get<string>('SENDGRID_FROM_EMAIL')!,
          name: this.configService.get<string>('SENDGRID_FROM_NAME'),
        },
        subject: 'Zmena statusu dealu',
        html:
          html ||
          `
          <h1>Zmena statusu dealu</h1>
          <p>Dobrý deň ${specialistName},</p>
          <p>Status vášho dealu pre ${deal.customerName} bol zmenený z ${this.getStatusLabel(oldStatus)} na ${this.getStatusLabel(newStatus)}.</p>
        `,
      });
    } catch (error) {
      this.logger.error('Error sending deal status change email:', error);
    }
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

    try {
      await sgMail.send({
        to: email,
        from: {
          email: this.configService.get<string>('SENDGRID_FROM_EMAIL')!,
          name: this.configService.get<string>('SENDGRID_FROM_NAME'),
        },
        subject: 'Hodnota dealu nastavená',
        html:
          html ||
          `
          <h1>Hodnota dealu nastavená</h1>
          <p>Dobrý deň ${specialistName},</p>
          <p>Hodnota vášho dealu pre ${deal.customerName} bola nastavená na ${formattedValue} €.</p>
          <p>Predpokladané uzavretie: ${formattedDate}</p>
        `,
      });
    } catch (error) {
      this.logger.error('Error sending deal value set email:', error);
    }
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

    try {
      await sgMail.send({
        to: email,
        from: {
          email: this.configService.get<string>('SENDGRID_FROM_EMAIL')!,
          name: this.configService.get<string>('SENDGRID_FROM_NAME'),
        },
        subject: 'Pripomienka uzavretia dealu',
        html:
          html ||
          `
          <h1>Pripomienka uzavretia</h1>
          <p>Dobrý deň ${specialistName},</p>
          <p>Váš deal pre ${deal.customerName} sa blíži k predpokladanému dátumu uzavretia: ${formattedDate}</p>
          <p>Hodnota dealu: ${formattedValue} €</p>
        `,
      });
    } catch (error) {
      this.logger.error('Error sending deal deadline reminder email:', error);
    }
  }

  async sendPasswordReset(
    email: string,
    name: string,
    token: string,
  ): Promise<void> {
    const resetUrl = `${this.configService.get<string>('FRONTEND_URL')}/profi/reset-password?token=${token}`;

    try {
      await sgMail.send({
        to: email,
        from: {
          email: this.configService.get<string>('SENDGRID_FROM_EMAIL')!,
          name: this.configService.get<string>('SENDGRID_FROM_NAME'),
        },
        subject: 'Obnovení hesla - tvujspecialista.cz',
        html: `
          <h1>Obnovení hesla</h1>
          <p>Dobrý den ${name},</p>
          <p>Obdrželi jsme žádost o obnovení vašeho hesla.</p>
          <p><a href="${resetUrl}" style="padding: 12px 24px; background: #2563eb; color: white; text-decoration: none; border-radius: 6px;">Obnovit heslo</a></p>
          <p>Odkaz je platný 1 hodinu.</p>
          <p>Pokud jste o obnovení hesla nežádali, tento email můžete ignorovat.</p>
        `,
      });
    } catch (error) {
      this.logger.error('Error sending password reset email:', error);
    }
  }

  async sendEmailVerification(
    email: string,
    name: string,
    token: string,
  ): Promise<void> {
    const verifyUrl = `${this.configService.get<string>('FRONTEND_URL')}/profi/verify-email?token=${token}`;

    try {
      await sgMail.send({
        to: email,
        from: {
          email: this.configService.get<string>('SENDGRID_FROM_EMAIL')!,
          name: this.configService.get<string>('SENDGRID_FROM_NAME'),
        },
        subject: 'Ověření emailu - tvujspecialista.cz',
        html: `
          <h1>Ověření emailu</h1>
          <p>Dobrý den ${name},</p>
          <p>Děkujeme za registraci. Prosím ověřte svůj email kliknutím na tlačítko níže.</p>
          <p><a href="${verifyUrl}" style="padding: 12px 24px; background: #2563eb; color: white; text-decoration: none; border-radius: 6px;">Ověřit email</a></p>
        `,
      });
    } catch (error) {
      this.logger.error('Error sending email verification:', error);
    }
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
