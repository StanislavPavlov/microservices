import { IsUndefinable } from '@lomray/microservice-helpers';
import { MiddlewareType } from '@lomray/microservice-nodejs-lib';
import type {
  MiddlewareEntity,
  IRemoteMiddlewareReqParams,
} from '@lomray/microservice-remote-middleware';
import { Allow, IsEnum, IsObject, Length } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity()
@Unique(['sender', 'senderMethod', 'target', 'targetMethod', 'type'])
class Middleware implements MiddlewareEntity {
  @PrimaryGeneratedColumn()
  @Allow()
  id: number;

  @Column({ type: 'varchar', length: 30 })
  @Length(1, 30)
  target: string;

  @Column({ type: 'varchar', length: 30 })
  @Length(1, 30)
  targetMethod: string;

  @Column({ type: 'varchar', length: 30 })
  @Length(1, 30)
  sender: string;

  @Column({ type: 'varchar', length: 30 })
  @Length(1, 30)
  senderMethod: string;

  @Column({
    type: 'enum',
    enum: MiddlewareType,
    default: MiddlewareType.request,
  })
  @IsEnum(MiddlewareType)
  type: MiddlewareType;

  @Column({ type: 'json', default: {} })
  @IsObject()
  @IsUndefinable()
  params: IRemoteMiddlewareReqParams;
}

export default Middleware;
