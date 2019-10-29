import app from '../../../app';
import supertest from 'supertest';

describe('Unit_addHALHeaders_middleware', () => {
  it('Add HAL+json header', () => {
    supertest(app)
      .get('/')
      .then(res => {
        expect(res.get('content-type')).toBe(
          'application/hal+json; charset=utf-8'
        );
        expect(res.status).toBe(200);
      });
  });
});
