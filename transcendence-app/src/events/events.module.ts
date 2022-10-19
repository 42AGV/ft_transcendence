import { Global, Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { EventsService } from './events.service';

@Global()
@Module({ providers: [EventsGateway, EventsService], exports: [EventsService] })
export class EventsModule {}
