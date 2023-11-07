const { createMockContext } = require("../context");
const {
  getAccount,
  getAccountDetails,
  postAccount,
} = require("../../middleware/BankAccount");

describe("testing all account function", () => {
  const mockRequest = (body = {}, query = {}, params = {}) => ({
    body,
    query,
    params,
  });

  const mockResponse = () => {
    const res = {};
    res.json = jest.fn().mockReturnValue(res);
    res.status = jest.fn().mockReturnValue(res);
    return res;
  };

  const mockNext = () => {
    const next = jest.fn();
    return next;
  };

  let mockCtx;
  let ctx;

  beforeEach(() => {
    mockCtx = createMockContext();
    ctx = mockCtx;
  });

  describe("get all account function", () => {
    test("should return all account", async () => {
      const req = mockRequest();
      const res = mockResponse();
      const next = mockNext();
      await getAccount(req, res, next);
      expect(res.status).toBeCalledWith(200);
      expect(res.json).toBeCalledWith(
        expect.objectContaining({
          status: "success",
          data: expect.any(Array),
        })
      );
    });
  });
  describe("get account details function", () => {
    test("should return account details based on params id ", async () => {
      const req = mockRequest({}, {}, { accountid: 1 });
      const res = mockResponse();
      const next = mockNext();
      await getAccountDetails(req, res, next);
      expect(res.status).toBeCalledWith(200);
      expect(res.json).toBeCalledWith(
        expect.objectContaining({
          status: "success",
          data: expect.any(Object),
        })
      );
    });
    test("should return 'data is empty' message when accessing with unregistered account id parameter", async () => {
      const req = mockRequest({}, {}, { accountid: 100 });
      const res = mockResponse();
      const next = mockNext();
      await getAccountDetails(req, res, next);
      expect(res.status).toBeCalledWith(200);
      expect(res.json).toBeCalledWith(
        expect.objectContaining({
          status: "success",
          message: "data is empty",
        })
      );
    });
  });

  describe("create account function", () => {
    const account = {
      name: "bank test",
      accNumber: 1,
      balance: 0,
    };
    test("successfull store account in database", async () => {
      const accNum = Math.floor(Math.random() * 1000000);
      const req = mockRequest({
        name: account.name,
        accNumber: accNum,
        balance: account.balance,
        userid: 3,
      });
      const res = mockResponse();
      const next = mockNext();
      await postAccount(req, res, next);
      expect(res.status).toBeCalledWith(200);
      expect(res.json.mock.lastCall[0].data.bank_account_number).toBe(accNum);
    });
    test("cannot store account when account number is same", async () => {
      const req = mockRequest({
        name: account.name,
        accNumber: account.accNumber,
        balance: account.balance,
        userid: 2,
      });
      const res = mockResponse();
      const next = mockNext();
      await postAccount(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });
});
