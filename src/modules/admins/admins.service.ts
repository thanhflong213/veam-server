import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { Admin, AdminDocument } from './schemas/admin.schema';

@Injectable()
export class AdminsService implements OnApplicationBootstrap {
  private readonly logger = new Logger(AdminsService.name);

  constructor(
    @InjectModel(Admin.name) private readonly adminModel: Model<AdminDocument>,
    private readonly config: ConfigService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.seed();
  }

  private async seed(): Promise<void> {
    try {
      const count = await this.adminModel.countDocuments();
      if (count > 0) return;

      const email = this.config.get<string>('admin.email');
      const password = this.config.get<string>('admin.password');

      if (!email || !password) {
        this.logger.warn('ADMIN_EMAIL or ADMIN_PASSWORD not set — skipping seed');
        return;
      }

      const passwordHash = await bcrypt.hash(password, 10);
      await this.adminModel.create({ email, passwordHash });
      this.logger.log(`Admin seeded: ${email}`);
    } catch (err) {
      this.logger.error('Admin seed failed', err);
    }
  }

  async findByEmail(email: string): Promise<AdminDocument | null> {
    return this.adminModel.findOne({ email: email.toLowerCase() }).exec();
  }

  async findById(id: string): Promise<AdminDocument | null> {
    return this.adminModel.findById(id).select('-passwordHash').exec();
  }
}