import halMiddleware from '../../../src/middlewares/addHALHeaders';
import { mockReq, mockRes } from 'sinon-express-mock';

// Test with jest and sinon
// You should use sinon-chai and mocha if you stable project

describe('Unit_addHALHeaders_middleware', () => {
  it('Add HAL+json header', () => {
    const req = mockReq();
    const res = mockRes({
      setHeader: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    });
    const next = jest.fn();
    halMiddleware()(req, res, next);
    expect(res.setHeader).toHaveBeenCalledWith(
      'content-type',
      'application/hal+json; charset=utf-8'
    );
  });
});
