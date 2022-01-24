import { Length, IsEnum, IsNumber } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  UpdateDateColumn,
  ManyToOne,
  PrimaryColumn,
  Unique,
} from 'typeorm';
import Filter from '@entities/filter';
import Method from '@entities/method';
import Role from '@entities/role';

export enum FilterOperator {
  only = 'only',
  and = 'and',
}

@Entity()
@Unique(['methodId', 'filterId', 'roleAlias'])
class MethodFilter {
  @Column()
  @PrimaryColumn()
  @IsNumber()
  methodId: number;

  @Column()
  @PrimaryColumn()
  @IsNumber()
  filterId: number;

  @Column({
    type: 'enum',
    enum: FilterOperator,
  })
  @IsEnum(FilterOperator)
  operator: string;

  @Column({ type: 'varchar', length: 30 })
  @Length(3, 30)
  roleAlias: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Filter, (filter) => filter.filterMethods, { onDelete: 'CASCADE' })
  filter: Filter;

  @ManyToOne(() => Method, (method) => method.methodFilters, { onDelete: 'CASCADE' })
  method: Method;

  @ManyToOne(() => Role, { onDelete: 'CASCADE' })
  role: Role;
}

export default MethodFilter;
