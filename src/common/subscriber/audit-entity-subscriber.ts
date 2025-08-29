import {
  EventSubscriber,
  EntitySubscriberInterface,
  InsertEvent,
  UpdateEvent,
  RemoveEvent,
  EntityManager,
} from 'typeorm';
import { AuditLog } from '../entities/app/audit-log.entity';
import { RequestContext, RequestContextKey } from '../utils/request.context';
import { BaseAuditEntity, IBaseAuditEntity } from '../entities/base-audit-entity.entity';

@EventSubscriber()
export class AuditEntitySubscriber implements EntitySubscriberInterface<IBaseAuditEntity> {
  listenTo() {
    return BaseAuditEntity; // Listen to all entities extending BaseAuditEntity
  }

  // Helper method to save an audit log
  async saveAuditLog<T extends IBaseAuditEntity>(
    manager: EntityManager,
    actionType: string,
    entityType: string,
    entityId: number,
    userId: string,
    previousData?: T,
  ) {
    const auditLog = manager.create(AuditLog, {
      entityType,
      entityId,
      actionType,
      actionBy: userId,
      previousData: previousData ? JSON.stringify(previousData) : undefined,
    });
    await manager.save(AuditLog, auditLog);
  }

  async beforeInsert(event: InsertEvent<IBaseAuditEntity>) {
    const userId = RequestContext.get<string>(RequestContextKey.USER_ID);
    if (!userId) return;

    event.entity.createdAt = new Date();
    event.entity.updatedAt = new Date();
    event.entity.createdBy = userId;
    event.entity.updatedBy = userId;

    // Save to audit log
    await this.saveAuditLog(event.manager, 'CREATE', event.metadata.name, event.entity.id, userId);
  }

  async beforeUpdate(event: UpdateEvent<IBaseAuditEntity>) {
    const userId = RequestContext.get<string>(RequestContextKey.USER_ID);
    if (!userId) return;
    if (!event.entity) return;

    event.entity.updatedAt = new Date();
    event.entity.updatedBy = userId;
    event.entity.actionType = 'UPDATE';

    // Save to audit log, with previous data for comparison
    const previousData = event.databaseEntity; // The previous state before the update
    await this.saveAuditLog(event.manager, 'UPDATE', event.metadata.name, event.entity.id, userId, previousData);
  }

  async beforeRemove(event: RemoveEvent<IBaseAuditEntity>) {
    const userId = RequestContext.get<string>(RequestContextKey.USER_ID);
    if (!userId) return;
    if (!event.entity) return;

    // Save to audit log, with previous data for reference
    const previousData = event.entity;
    await this.saveAuditLog(event.manager, 'DELETE', event.metadata.name, event.entity.id, userId, previousData);
  }
}
