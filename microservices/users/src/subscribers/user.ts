import type { InsertEvent, UpdateEvent } from 'typeorm';
import { EntitySubscriberInterface, EventSubscriber, UpdateResult } from 'typeorm';
import IdentityProvider from '@entities/identity-provider';
import Profile from '@entities/profile';
import UserEntity from '@entities/user';

@EventSubscriber()
class User implements EntitySubscriberInterface<UserEntity> {
  /**
   * This subscriber only for User entity
   */
  listenTo(): typeof UserEntity {
    return UserEntity;
  }

  /**
   * Also create profile when we create new user
   */
  afterInsert(event: InsertEvent<UserEntity>): Promise<Profile> {
    const profileRepository = event.manager.getRepository(Profile);

    return profileRepository.save(profileRepository.create({ userId: event.entity.id }));
  }

  /**
   * Also soft delete or restore user profile
   * @inheritDoc
   */
  afterUpdate(event: UpdateEvent<UserEntity>): Promise<UpdateResult[]> | void {
    const profileRepository = event.manager.getRepository(Profile);
    const idProviderRepository = event.manager.getRepository(IdentityProvider);

    if (User.isRecovered(event)) {
      return Promise.all([
        profileRepository.restore({ userId: event.databaseEntity.id }),
        idProviderRepository.restore({ userId: event.databaseEntity.id }),
      ]);
    } else if (User.isSoftRemoved(event)) {
      return Promise.all([
        profileRepository.softDelete({ userId: event.databaseEntity.id }),
        idProviderRepository.softDelete({ userId: event.databaseEntity.id }),
      ]);
    }
  }

  /**
   * Detect if user is soft removed
   * @private
   */
  private static isSoftRemoved({ entity, databaseEntity }: UpdateEvent<UserEntity>): boolean {
    return typeof entity?.deletedAt?.toString() === 'string' && databaseEntity.deletedAt === null;
  }

  /**
   * Detect if user is restored
   * @private
   */
  private static isRecovered({ entity, databaseEntity }: UpdateEvent<UserEntity>): boolean {
    return entity?.deletedAt === null && typeof databaseEntity.deletedAt?.toString() === 'string';
  }
}

export default User;