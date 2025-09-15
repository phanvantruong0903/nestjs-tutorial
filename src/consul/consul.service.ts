import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import Consul from 'consul';

@Injectable()
export class ConsulService implements OnModuleInit, OnModuleDestroy {
  private consul: any;
  private readonly serviceId = 'user-service-1';

  onModuleInit() {
    this.consul = new Consul({
      host: '127.0.0.1',
      port: 8500,
      promisify: true,
    } as any);

    this.registerService();
  }

  private async registerService() {
    try {
      await this.consul.agent.service.register({
        id: this.serviceId,
        name: 'user-service',
        address: 'host.docker.internal',
        port: 50051,
        check: {
          http: 'http://localhost:3000/health',
          interval: '10s',
        },
      });

      console.log('✅ User service registered to Consul');
    } catch (err) {
      console.error('❌ Failed to register service with Consul:', err);
    }
  }

  onModuleDestroy() {
    this.consul.agent.service.deregister(this.serviceId, (err) => {
      if (err) {
        console.error('❌ Deregister failed:', err);
      } else {
        console.log('🛑 User service deregistered from Consul');
      }
    });
  }
}
