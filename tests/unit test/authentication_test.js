const { createMockContext } = require("../context");
const {
  loginMiddleware,
  authenticateMidlleware,
} = require("../../middleware/authMiddleware");
const jwt = require("jsonwebtoken");
describe("testing authentication function", () => {
  const mockRequest = (body = {}, cookies = {}) => ({
    body,
    cookies,
  });

  const mockResponse = () => {
    const res = {};
    res.json = jest.fn().mockReturnValue(res);
    res.status = jest.fn().mockReturnValue(res);
    res.cookie = jest.fn().mockReturnValue(res);
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

  describe("login and authentication function", () => {
    test("return jwt token and success message if credential valid", async () => {
      const req = mockRequest({
        email: "sua@gmail.com",
        password: "sua123",
      });
      const res = mockResponse();
      const next = mockNext();
      await loginMiddleware(req, res, next);
      expect(res.status).toBeCalledWith(200);
      expect(res.json).toBeCalledWith(
        expect.objectContaining({
          status: "success",
          message: "User authenticate successfully",
        })
      );
      expect(res.cookie.mock.lastCall[0]).toContain("access_token");
    });
  });
  test("return 'email or password wrong' if password wrong", async () => {
    const req = mockRequest({
      email: "sua@gmail.com",
      password: "sua123345354353",
    });
    const res = mockResponse();
    const next = mockNext();
    await loginMiddleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });
  test("return 'email or password wrong' if email wrong", async () => {
    const req = mockRequest({
      email: "sua1231eweqedwed@gmail.com",
      password: "sua123",
    });
    const res = mockResponse();
    const next = mockNext();
    await loginMiddleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });
  test("return user authenticate if cookies valid", async () => {
    const payload = {
      id: 3,
      email: "sua@gmail.com",
      name: "sua",
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET);
    const req = mockRequest({}, { access_token: token });
    const res = mockResponse();
    const next = mockNext();
    await authenticateMidlleware(req, res, next);
    expect(res.status).toBeCalledWith(200);
    expect(res.json).toBeCalledWith(
      expect.objectContaining({
        status: "success",
        data: expect.any(Object),
      })
    );
  });
  test("return error token not found when cookies not defined", async () => {
    const req = mockRequest({}, {});
    const res = mockResponse();
    const next = mockNext();
    await authenticateMidlleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });
  test("return error token invalid when cookies is wrong", async () => {
    const req = mockRequest(
      {},
      { access_token: "weirj2or3ij2wmof2wo3irj23io" }
    );
    const res = mockResponse();
    const next = mockNext();
    await authenticateMidlleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});
