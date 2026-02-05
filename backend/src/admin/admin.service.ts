import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../database/entities/user.entity';
import { Specialist } from '../database/entities/specialist.entity';
import { Lead, LeadStatus } from '../database/entities/lead.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Specialist)
    private readonly specialistRepository: Repository<Specialist>,
    @InjectRepository(Lead)
    private readonly leadRepository: Repository<Lead>,
  ) {}

  /**
   * Get all users in the system
   */
  async getAllUsers(): Promise<User[]> {
    return this.userRepository.find({
      select: ['id', 'email', 'name', 'phone', 'role', 'verified', 'createdAt', 'updatedAt'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Get all specialists with their user information
   */
  async getAllSpecialists(): Promise<Specialist[]> {
    return this.specialistRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Verify a specialist (set verified flag to true)
   */
  async verifySpecialist(specialistId: string): Promise<Specialist> {
    const specialist = await this.specialistRepository.findOne({
      where: { id: specialistId },
    });

    if (!specialist) {
      throw new Error('Specialist not found');
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
  async getAllLeads(): Promise<Lead[]> {
    return this.leadRepository.find({
      relations: ['specialist'],
      order: { createdAt: 'DESC' },
    });
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
    ] = await Promise.all([
      this.userRepository.count(),
      this.specialistRepository.count(),
      this.specialistRepository.count({ where: { verified: true } }),
      this.leadRepository.count(),
      this.leadRepository.count({ where: { status: LeadStatus.NEW } }),
      this.leadRepository.count({ where: { status: LeadStatus.CONTACTED } }),
      this.leadRepository.count({ where: { status: LeadStatus.CLOSED_WON } }),
    ]);

    return {
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
    };
  }
}
