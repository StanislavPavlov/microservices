import { TypeormMock } from '@lomray/microservice-helpers/mocks';
import {
  countResult,
  endpointOptions,
  listResult,
} from '@lomray/microservice-helpers/test-helpers';
import { expect } from 'chai';
import rewiremock from 'rewiremock';
import { getRepository } from 'typeorm';
import Role from '@entities/role';
import OriginalRoleCrud from '@methods/role/crud';

const { default: Crud } = rewiremock.proxy<{
  default: typeof OriginalRoleCrud;
}>(() => require('@methods/role/crud'), {
  typeorm: TypeormMock.mock,
});

describe('methods/role/crud', () => {
  beforeEach(() => {
    TypeormMock.sandbox.reset();
  });

  it('should correctly return count', async () => {
    const res = await Crud.count?.({}, endpointOptions);

    expect(res).to.deep.equal(countResult());
  });

  it('should correctly return list', async () => {
    const res = await Crud.list?.({}, endpointOptions);

    expect(res).to.deep.equal(listResult());
  });

  it('should correctly entity view', async () => {
    const entity = { id: 1 };

    TypeormMock.queryBuilder.getMany.returns([entity]);

    const res = await Crud.view?.({ query: { where: { alias: 'users' } } }, endpointOptions);

    expect(res).to.deep.equal(entity);
  });

  it('should correctly entity create', async () => {
    const fields = {
      name: 'Test',
      alias: 'test',
    };

    TypeormMock.entityManager.save.resolves([fields]);

    const res = await Crud.create?.({ fields }, endpointOptions);

    expect(res).to.deep.equal(fields);
  });

  it('should correctly entity update', async () => {
    const entity = getRepository(Role).create({
      name: 'Test',
      alias: 'test',
    });
    const fields = { name: 'Test2' };

    TypeormMock.queryBuilder.getMany.returns([entity]);
    TypeormMock.entityManager.save.resolves(fields);

    const res = await Crud.update?.(
      { fields, query: { where: { alias: 'users' } } },
      endpointOptions,
    );

    expect(res).to.deep.equal(fields);
  });

  it('should correctly entity remove', async () => {
    const entity = { alias: 'users' };

    TypeormMock.queryBuilder.getMany.returns([entity]);

    const res = await Crud.remove?.({ query: { where: { alias: 'users' } } }, endpointOptions);

    expect(res).to.deep.equal({ deleted: [entity] });
  });

  it("should haven't restore method", () => {
    expect(Crud.restore).to.be.undefined;
  });
});
