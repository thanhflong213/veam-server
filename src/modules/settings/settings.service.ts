import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Setting, SettingDocument } from './schemas/setting.schema';
import { UpdateSettingDto } from './dto/update-setting.dto';

@Injectable()
export class SettingsService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SettingsService.name);

  constructor(
    @InjectModel(Setting.name)
    private readonly settingModel: Model<SettingDocument>,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    try {
      const count = await this.settingModel.countDocuments();
      if (count === 0) {
        await this.settingModel.create({});
        this.logger.log('Default settings document created');
      }
    } catch (err) {
      this.logger.error('Settings seed failed', err);
    }
  }

  async getSettings(): Promise<SettingDocument> {
    // upsert guarantees a document always exists even if seed failed
    const doc = await this.settingModel
      .findOneAndUpdate({}, {}, { new: true, upsert: true })
      .exec();
    return doc!;
  }

  async updateSettings(dto: UpdateSettingDto): Promise<SettingDocument> {
    const doc = await this.settingModel
      .findOneAndUpdate({}, { $set: dto }, { new: true, upsert: true })
      .exec();
    return doc!;
  }
}
