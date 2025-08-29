// model/service_health_status.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { BaseEntity } from '../base-entity.entity';
import { getSchemaName } from '../../utils/schema-prefix.util';

@Entity('service_health_status', { schema: getSchemaName('model') })
export class ServiceHealthStatus extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id!: number;

  @Column({ type: 'varchar', length: 255, name: 'deployment_id' })
  deploymentId!: string;

  @Column({ type: 'varchar', length: 255, name: 'deployment_name' })
  deploymentName!: string;

  @Column({ type: 'varchar', length: 255, name: 'flow_name' })
  flowName!: string;

  @Column({ type: 'varchar', length: 50, name: 'status' })
  status!: string;

  @CreateDateColumn({ type: 'datetime', name: 'start_time' })
  startTime!: Date;

  @CreateDateColumn({ type: 'datetime', name: 'end_time', nullable: true })
  endTime?: Date;

  @CreateDateColumn({ type: 'datetime', name: 'last_checked' })
  lastChecked!: Date;

  @Column({ type: 'float', name: 'run_duration', nullable: true })
  runDuration?: number;

  @Column({ type: 'varchar', length: 6, name: 'is_healthy' })
  isHealthy!: string;

  @Column({ type: 'text', name: 'health_message' })
  healthMessage!: string;
}
