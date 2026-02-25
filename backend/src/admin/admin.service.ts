import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Not, Repository } from 'typeorm';
import { User, UserRole } from '../database/entities/user.entity';
import { Specialist, SpecialistCategory } from '../database/entities/specialist.entity';
import { Lead, LeadStatus } from '../database/entities/lead.entity';
import { Event, EventStatus } from '../database/entities/event.entity';
import { Subscription, SubscriptionStatus } from '../database/entities/subscription.entity';
import { Enrollment, EnrollmentStatus } from '../database/entities/enrollment.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Specialist)
    private readonly specialistRepository: Repository<Specialist>,
    @InjectRepository(Lead)
    private readonly leadRepository: Repository<Lead>,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
    @InjectRepository(Enrollment)
    private readonly enrollmentRepository: Repository<Enrollment>,
  ) {}

  /**
   * Get all users in the system
   */
  async getAllUsers(page = 1, limit = 20) {
    const [users, total] = await this.userRepository.findAndCount({
      select: [
        'id',
        'email',
        'name',
        'phone',
        'role',
        'verified',
        'createdAt',
        'updatedAt',
      ],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { users, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  /**
   * Get all specialists with their user information
   */
  async getAllSpecialists(page = 1, limit = 20) {
    const [specialists, total] = await this.specialistRepository.findAndCount({
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { specialists, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  /**
   * Verify a specialist (set verified flag to true)
   */
  async verifySpecialist(specialistId: string): Promise<Specialist> {
    const specialist = await this.specialistRepository.findOne({
      where: { id: specialistId },
    });

    if (!specialist) {
      throw new NotFoundException('Specialist not found');
    }

    specialist.verified = true;

    // Also verify the associated user
    const user = await this.userRepository.findOne({
      where: { id: specialist.userId },
    });
    if (user) {
      user.verified = true;
      await this.userRepository.save(user);
    }

    return this.specialistRepository.save(specialist);
  }

  /**
   * Get all leads in the system
   */
  async getAllLeads(page = 1, limit = 20) {
    const [leads, total] = await this.leadRepository.findAndCount({
      relations: ['specialist'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { leads, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  /**
   * Get admin dashboard statistics
   */
  async getStats() {
    const [
      totalUsers,
      totalSpecialists,
      verifiedSpecialists,
      totalLeads,
      newLeads,
      contactedLeads,
      closedLeads,
      totalEvents,
      pastEvents,
      totalCustomers,
      realEstateAgents,
      financialAdvisors,
      academyGraduates,
    ] = await Promise.all([
      this.userRepository.count(),
      this.specialistRepository.count(),
      this.specialistRepository.count({ where: { verified: true } }),
      this.leadRepository.count(),
      this.leadRepository.count({ where: { status: LeadStatus.NEW } }),
      this.leadRepository.count({ where: { status: LeadStatus.CONTACTED } }),
      this.leadRepository.count({ where: { status: LeadStatus.CLOSED_WON } }),
      this.eventRepository.count(),
      this.eventRepository.count({
        where: {
          endDate: LessThan(new Date()),
          status: Not(EventStatus.CANCELLED),
        },
      }),
      this.userRepository.count({ where: { role: UserRole.CUSTOMER } }),
      this.specialistRepository.count({ where: { category: SpecialistCategory.REAL_ESTATE_AGENT } }),
      this.specialistRepository.count({ where: { category: SpecialistCategory.FINANCIAL_ADVISOR } }),
      this.enrollmentRepository.createQueryBuilder('e')
        .select('COUNT(DISTINCT e.userId)', 'count')
        .where('e.status = :status', { status: EnrollmentStatus.COMPLETED })
        .getRawOne()
        .then((r) => parseInt(r?.count || '0', 10)),
    ]);

    // Subscription stats
    const activeSubscriptions = await this.subscriptionRepository.find({
      where: { status: SubscriptionStatus.ACTIVE },
    });

    let monthlySubscriptions = 0;
    let yearlySubscriptions = 0;
    for (const sub of activeSubscriptions) {
      if (sub.currentPeriodStart && sub.currentPeriodEnd) {
        const diffDays = (new Date(sub.currentPeriodEnd).getTime() - new Date(sub.currentPeriodStart).getTime()) / (1000 * 60 * 60 * 24);
        if (diffDays > 60) yearlySubscriptions++;
        else monthlySubscriptions++;
      }
    }

    return {
      usersCount: totalUsers,
      specialistsCount: totalSpecialists,
      customersCount: totalCustomers,
      realEstateAgentsCount: realEstateAgents,
      financialAdvisorsCount: financialAdvisors,
      academyGraduatesCount: academyGraduates,
      leadsCount: totalLeads,
      eventsCount: totalEvents,
      pastEventsCount: pastEvents,
      monthlySubscriptions,
      yearlySubscriptions,
      users: {
        total: totalUsers,
      },
      specialists: {
        total: totalSpecialists,
        verified: verifiedSpecialists,
        unverified: totalSpecialists - verifiedSpecialists,
      },
      leads: {
        total: totalLeads,
        new: newLeads,
        contacted: contactedLeads,
        closed: closedLeads,
      },
      events: {
        total: totalEvents,
        past: pastEvents,
      },
    };
  }
}
