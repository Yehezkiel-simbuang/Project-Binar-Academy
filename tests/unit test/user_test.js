const { createMockContext } = require("../context");
const {
  getUser,
  getUserDetails,
  postUser,
} = require("../../middleware/UserMiddleware");

const bcryptjs = require("bcryptjs");

describe("testing all user function", () => {
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

  describe("get all users function", () => {
    test("should return all users", async () => {
      const req = mockRequest();
      const res = mockResponse();
      const next = mockNext();
      await getUser(req, res, next);
      expect(res.status).toBeCalledWith(200);
      expect(res.json).toBeCalledWith(
        expect.objectContaining({
          status: "success",
          data: expect.any(Array),
        })
      );
    });
  });
  describe("get user detail function", () => {
    test("should return users where id is 1", async () => {
      const req = mockRequest({}, {}, { userid: 1 });
      const res = mockResponse();
      const next = mockNext();
      await getUserDetails(req, res, next);
      // console.log(res.json.mock.lastCall[0].data.id); get ID
      expect(res.status).toBeCalledWith(200);
      expect(res.json).toBeCalledWith(
        expect.objectContaining({
          status: "success",
          data: expect.any(Object),
        })
      );
    });
    test("should return 'data is empty' message when accessing with wrong user id parameter", async () => {
      const req = mockRequest({}, {}, { userid: 100 });
      const res = mockResponse();
      const next = mockNext();
      await getUserDetails(req, res, next);
      expect(res.status).toBeCalledWith(200);
      expect(res.json).toBeCalledWith(
        expect.objectContaining({
          status: "success",
          message: "data is empty",
        })
      );
    });
  });
  describe("create user function", () => {
    const user = {
      email: "sua@gmail.com",
      name: "sua",
      password: "sua123",
      identity_type: "user",
      identity_number: 1,
      address: "jl.test.no 1",
    };
    test("successfull store the user in database", async () => {
      const email = "anonymous" + Math.random().toString().slice(-8);
      const req = mockRequest({
        email: email,
        name: user.name,
        password: user.password,
        identity_type: user.identity_type,
        identity_number: user.identity_number,
        address: user.address,
      });
      const res = mockResponse();
      const next = mockNext();
      await postUser(req, res, next);
      expect(res.status).toBeCalledWith(200);
      expect(res.json.mock.lastCall[0].data.email).toBe(email);
    });
    test("cannot create user if email has been created before", async () => {
      const req = mockRequest({
        email: user.email,
        name: user.name,
        password: user.password,
        identity_type: user.identity_type,
        identity_number: user.identity_number,
        address: user.address,
      });
      const res = mockResponse();
      const next = mockNext();
      await postUser(req, res, next);
      expect(next).toHaveBeenCalled();
      // expect(res.json.mock.lastCall[0].data).toBe("Email sudah ada sebelumnya");
    });
    test("store the correct encrypted password", async () => {
      const req_user = mockRequest({}, {}, { userid: 3 });
      const res_user = mockResponse();
      await getUserDetails(req_user, res_user);
      const passwordHash = res_user.json.mock.lastCall[0].data.password;
      const isValid = bcryptjs.compareSync("sua123", passwordHash);
      expect(res_user.status).toBeCalledWith(200);
      expect(isValid).toBe(true);
    });
  });
});
