import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../base-entity.entity';
import { getSchemaName } from '../../utils/schema-prefix.util';

@Entity('audit_log', { schema: getSchemaName('app') })
export class AuditLog extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
  id!: number;

  @Column({ type: 'varchar', length: 255, name: 'entity_type' })
  entityType!: string; // Name of the entity (e.g., 'ServerConfiguration')

  @Column({ type: 'int', name: 'entity_id' })
  entityId!: number; // The ID of the entity that was modified

  @Column({ type: 'varchar', length: 255, name: 'action_type' })
  actionType!: string; // Action taken: 'CREATE', 'UPDATE', 'DELETE'

  @Column({ type: 'varchar', length: 255, name: 'action_by' })
  actionBy!: string; // User who performed the action

  @CreateDateColumn({ type: 'datetime2', name: 'action_at' })
  actionAt!: Date; // Timestamp when the action was taken

  @Column({ type: 'nvarchar', length: 'max', nullable: true, name: 'previous_data' })
  previousData?: string; // Optional: Store previous state for updates or deletes
}
