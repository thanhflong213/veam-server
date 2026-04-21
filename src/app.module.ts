import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { AdminsModule } from './modules/admins/admins.module';
import { PagesModule } from './modules/pages/pages.module';
import { AnnouncementsModule } from './modules/announcements/announcements.module';
import { SettingsModule } from './modules/settings/settings.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { InstitutionModule } from './modules/institution/institution.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    DatabaseModule,
    AuthModule,
    AdminsModule,
    PagesModule,
    AnnouncementsModule,
    SettingsModule,
    UploadsModule,
    InstitutionModule,
  ],
})
export class AppModule {}
