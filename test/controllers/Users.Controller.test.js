const userService = require("../../services/Users.Service");
const userController = require("../../controllers/Users.Controller");
const {
  logSignUpInfo,
  logSignUpError,
  logLoginError,
  logLoginInfo,
  logVerifyInfo,
  logVerifyError,
  logRequestError,
  logRequestInfo,
} = require("../../middleware/logger/logger");
const { CONTROLLER, MESSAGE } = require("../../constants/Users.Constants");
const { HTTP_STATUS } = require("../../constants/HttpStatus");

jest.mock("../../middleware/logger/logger", () => ({
  logSignUpInfo: jest.fn(),
  logSignUpError: jest.fn(),
  logLoginError: jest.fn(),
  logLoginInfo: jest.fn(),
  logVerifyInfo: jest.fn(),
  logVerifyError: jest.fn(),
  logRequestError: jest.fn(),
  logRequestInfo: jest.fn(),
}));

describe("User Controller", () => {
  describe("createUser", () => {
    describe("for succesfull operation", () => {
      test("it  calls user service create user method", async () => {
        const request = {
          body: {
            userDetails: {
              name: "John Doe",
              username: "johndoe",
              email: "johndoe@example.com",
              password: "password123",
            },
          },
        };
        const response = {
          status: jest.fn(() => response),
          json: jest.fn(),
        };

        const mockUser = {
          _id: "mockUserId",
          name: "John Doe",
          username: "johndoe",
          email: "johndoe@example.com",
        };
        userService.createUser = jest.fn().mockResolvedValue(mockUser);

        await userController.createUser(request, response);

        expect(userService.createUser).toHaveBeenCalledWith(
          request.body.userDetails
        );
      });

      test("it returns response with status code 201", async () => {
        const request = {
          body: {
            userDetails: {
              name: "John Doe",
              username: "johndoe",
              email: "johndoe@example.com",
              password: "password123",
            },
          },
        };
        const response = {
          status: jest.fn(() => response),
          json: jest.fn(),
        };
        const mockUser = {
          _id: "mockUserId",
          name: "John Doe",
          username: "johndoe",
          email: "johndoe@example.com",
        };
        userService.createUser = jest.fn().mockResolvedValue(mockUser);

        await userController.createUser(request, response);

        expect(response.status).toHaveBeenCalledWith(HTTP_STATUS.CREATED);
      });

      test("it returns user object with _id attribute in response", async () => {
        const request = {
          body: {
            userDetails: {
              name: "John Doe",
              username: "johndoe",
              email: "johndoe@example.com",
              password: "password123",
            },
          },
        };
        const response = {
          status: jest.fn(() => response),
          json: jest.fn(),
        };
        const mockUser = {
          _id: "mockUserId",
          name: "John Doe",
          username: "johndoe",
          email: "johndoe@example.com",
        };
        userService.createUser = jest.fn().mockResolvedValue(mockUser);

        await userController.createUser(request, response);

        expect(response.json).toHaveBeenCalledWith({
          status: true,
          message: MESSAGE.USER_CREATED,
          user: expect.objectContaining({
            _id: expect.any(String),
            name: "John Doe",
            username: "johndoe",
            email: "johndoe@example.com",
          }),
        });
      });

      test("it logs with appropriate message", async () => {
        const request = {
          body: {
            userDetails: {
              name: "John Doe",
              username: "johndoe",
              email: "johndoe@example.com",
              password: "password123",
            },
          },
        };
        const response = {
          status: jest.fn(() => response),
          json: jest.fn(),
        };

        const mockUser = {
          _id: "mockUserId",
          name: "John Doe",
          username: "johndoe",
          email: "johndoe@example.com",
        };
        userService.createUser = jest.fn().mockResolvedValue(mockUser);

        await userController.createUser(request, response);

        expect(logSignUpInfo).toHaveBeenCalledWith(
          request,
          `${mockUser.name} Created an Unverified Account`,
          CONTROLLER.CREATE_USER
        );
      });
    });

    describe("for unsuccessfull operation", () => {
      test("it should create a log record with appropriate message", async () => {
        const request = {
          body: {
            userDetails: {
              name: "John Doe",
              username: "johndoe",
              email: "johndoe@example.com",
              password: "password123",
            },
          },
        };
        const response = {
          status: jest.fn(() => response),
          json: jest.fn(),
        };

        const mockError = new Error("Database error");
        userService.createUser = jest.fn().mockRejectedValue(mockError);

        await userController.createUser(request, response);

        expect(logSignUpError).toHaveBeenCalledWith(
          request,
          MESSAGE.USER_CREATION_ERROR,
          CONTROLLER.CREATE_USER
        );
      });

      test("it should return a response with status 500", async () => {
        const request = {
          body: {
            userDetails: {
              name: "John Doe",
              username: "johndoe",
              email: "johndoe@example.com",
              password: "password123",
            },
          },
        };
        const response = {
          status: jest.fn(() => response),
          json: jest.fn(),
        };

        const mockError = new Error("Database error");
        userService.createUser = jest.fn().mockRejectedValue(mockError);

        await userController.createUser(request, response);

        expect(response.status).toHaveBeenCalledWith(
          HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
      });
    });
  });

  describe("login", () => {
    describe("for valid credentials", () => {
      test("it calls user service loginUser method", async () => {
        const request = {
          body: {
            email: "johndoe@example.com",
            password: "password123",
          },
          user: {
            _id: "mockUserId",
            name: "John Doe",
            username: "johndoe",
            email: "johndoe@example.com",
            password: "password123",
          },
        };
        const response = {
          status: jest.fn(() => response),
          json: jest.fn(),
        };
        userService.loginUser = jest.fn();

        await userController.login(request, response);

        expect(userService.loginUser).toHaveBeenCalledWith(
          request.body.email,
          request.body.password
        );
      });

      test("it returns response with status code 200", async () => {
        const request = {
          body: {
            email: "johndoe@example.com",
            password: "password123",
          },
          user: {
            _id: "mockUserId",
            name: "John Doe",
            username: "johndoe",
            email: "johndoe@example.com",
            password: "password123",
          },
        };
        const response = {
          status: jest.fn(() => response),
          json: jest.fn(),
        };
        userService.loginUser = jest.fn();

        await userController.login(request, response);

        expect(response.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
      });

      test("it returns response with message user logged in", async () => {
        const request = {
          body: {
            email: "johndoe@example.com",
            password: "password123",
          },
          user: {
            _id: "mockUserId",
            name: "John Doe",
            username: "johndoe",
            email: "johndoe@example.com",
            password: "password123",
          },
        };
        const response = {
          status: jest.fn(() => response),
          json: jest.fn(),
        };
        userService.loginUser = jest.fn();

        await userController.login(request, response);

        expect(response.json).toHaveBeenCalledWith({
          status: true,
          message: MESSAGE.USER_LOGGED_IN,
          user: request.user,
        });
      });

      test("it logs with appropriate message", async () => {
        const request = {
          body: {
            email: "johndoe@example.com",
            password: "password123",
          },
          user: {
            _id: "mockUserId",
            name: "John Doe",
            username: "johndoe",
            email: "johndoe@example.com",
            password: "password123",
          },
        };
        const response = {
          status: jest.fn(() => response),
          json: jest.fn(),
        };
        userService.loginUser = jest.fn();

        await userController.login(request, response);

        expect(logLoginInfo).toHaveBeenCalledWith(
          request,
          "John Doe Logged in",
          CONTROLLER.LOGIN
        );
      });
    });

    describe("for invalid credentials", () => {
      test("it should create a log record with appropriate message", async () => {
        const request = {
          body: {
            email: "johndoe@example.com",
            password: "password123",
          },
          user: {
            _id: "mockUserId",
            name: "John Doe",
            username: "johndoe",
            email: "johndoe@example.com",
            password: "password123",
          },
        };
        const response = {
          status: jest.fn(() => response),
          json: jest.fn(),
        };
        const mockError = new Error("Database error");
        userService.loginUser = jest.fn().mockRejectedValue(mockError);

        await userController.login(request, response);

        expect(logLoginError).toHaveBeenCalledWith(
          request,
          MESSAGE.USER_LOGIN_ERROR,
          CONTROLLER.LOGIN
        );
      });

      test("it should return a response with status 500", async () => {
        const request = {
          body: {
            email: "johndoe@example.com",
            password: "password123",
          },
          user: {
            _id: "mockUserId",
            name: "John Doe",
            username: "johndoe",
            email: "johndoe@example.com",
            password: "password123",
          },
        };
        const response = {
          status: jest.fn(() => response),
          json: jest.fn(),
        };
        const mockError = new Error("Database error");
        userService.loginUser = jest.fn().mockRejectedValue(mockError);

        await userController.login(request, response);

        expect(response.status).toHaveBeenCalledWith(
          HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
      });
    });
  });
  
  describe("verifyUser", () => {
    describe("for valid verification token", () => {
      test("it calls user service verifyUser method", async () => {
        const request = {
          body: {
            token: 1234
          },
          user: {
            _id: "mockUserId",
            name: "John Doe",
            username: "johndoe",
            email: "johndoe@example.com",
            password: "password123",
          },
        };
        const response = {
          status: jest.fn(() => response),
          json: jest.fn(),
        };
        userService.verify = jest.fn();

        await userController.verifyUser(request, response);

        expect(userService.verify).toHaveBeenCalledWith(
          request.user,
          request.body.token
        );
      });

      test("it returns response with status code 200", async () => {
        const request = {
          body: {
            token:1234
          },
          user: {
            _id: "mockUserId",
            name: "John Doe",
            username: "johndoe",
            email: "johndoe@example.com",
            password: "password123",
          },
        };
        const response = {
          status: jest.fn(() => response),
          json: jest.fn(),
        };
        userService.verify = jest.fn();

        await userController.verifyUser(request, response);

        expect(response.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
      });

      test("it returns response with message account verified", async () => {
        const request = {
          body: {
            token: 1234
          },
          user: {
            _id: "mockUserId",
            name: "John Doe",
            username: "johndoe",
            email: "johndoe@example.com",
            password: "password123",
          },
        };
        const response = {
          status: jest.fn(() => response),
          json: jest.fn(),
        };
        userService.verify = jest.fn();

        await userController.verifyUser(request, response);

        expect(response.json).toHaveBeenCalledWith({
          status: true,
          message: MESSAGE.USER_VERIFIED
        });
      });

      test("it logs with appropriate message", async () => {
        const request = {
          body: {
            email: "johndoe@example.com",
            password: "password123",
          },
          user: {
            _id: "mockUserId",
            name: "John Doe",
            username: "johndoe",
            email: "johndoe@example.com",
            password: "password123",
          },
        };
        const response = {
          status: jest.fn(() => response),
          json: jest.fn(),
        };
        userService.verify = jest.fn();

        await userController.verifyUser(request, response);

        expect(logVerifyInfo).toHaveBeenCalledWith(request, `${request.user.name} Verified their Email`, CONTROLLER.VERIFY_EMAIL);
      });
    });

    describe("for invalid verification token", () => {
      test("it should create a log record with appropriate message", async () => {
        const request = {
          body: {
            token: 1234
          },
          user: {
            _id: "mockUserId",
            name: "John Doe",
            username: "johndoe",
            email: "johndoe@example.com",
            password: "password123",
          },
        };
        const response = {
          status: jest.fn(() => response),
          json: jest.fn(),
        };
        const mockError = new Error("Database error");
        userService.verify = jest.fn().mockRejectedValue(mockError);

        await userController.verifyUser(request, response);

        expect(logVerifyError).toHaveBeenCalledWith(request, MESSAGE.USER_VERIFICATION_ERROR, CONTROLLER.VERIFY_EMAIL );
      });

      test("it should return a response with status 500", async () => {
        const request = {
          body: {
            token: 1234
          },
          user: {
            _id: "mockUserId",
            name: "John Doe",
            username: "johndoe",
            email: "johndoe@example.com",
            password: "password123",
          },
        };
        const response = {
          status: jest.fn(() => response),
          json: jest.fn(),
        };
        const mockError = new Error("Database error");
        userService.verify = jest.fn().mockRejectedValue(mockError);

        await userController.verifyUser(request, response);

        expect(response.status).toHaveBeenCalledWith(
          HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
      });
    });
  });
  
  describe("changePasswordRequest", () => {
    describe("for valid verification token", () => {
      test("it calls user service requestForPasswordChange method", async () => {
        const request = {
          body: {
            username: 'johndoe'
          },
          user: {
            _id: "mockUserId",
            name: "John Doe",
            username: "johndoe",
            email: "johndoe@example.com",
            password: "password123",
          },
        };
        const response = {
          status: jest.fn(() => response),
          json: jest.fn(),
        };
        userService.requestForPasswordChange = jest.fn();

        await userController.changePasswordRequest(request, response);

        expect(userService.requestForPasswordChange).toHaveBeenCalledWith( request.user );
      });

      test("it returns response with status code 200", async () => {
        const request = {
          body: {
            username: 'johndoe'
          },
          user: {
            _id: "mockUserId",
            name: "John Doe",
            username: "johndoe",
            email: "johndoe@example.com",
            password: "password123",
          },
        };
        const response = {
          status: jest.fn(() => response),
          json: jest.fn(),
        };
        userService.requestForPasswordChange = jest.fn();

        await userController.changePasswordRequest(request, response);

        expect(response.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
      });

      test("it returns response with message mail sent", async () => {
        const request = {
          body: {
            username: "johndoe"
          },
          user: {
            _id: "mockUserId",
            name: "John Doe",
            username: "johndoe",
            email: "johndoe@example.com",
            password: "password123",
          },
        };
        const response = {
          status: jest.fn(() => response),
          json: jest.fn(),
        };
        userService.requestForPasswordChange = jest.fn();

        await userController.changePasswordRequest(request, response);

        expect(response.json).toHaveBeenCalledWith({
          status: true,
          message: MESSAGE.EMAIL_SENT
        });
      });

      test("it logs with appropriate message", async () => {
        const request = {
          body: {
            username:'johndoe'
          },
          user: {
            _id: "mockUserId",
            name: "John Doe",
            username: "johndoe",
            email: "johndoe@example.com",
            password: "password123",
          },
        };
        const response = {
          status: jest.fn(() => response),
          json: jest.fn(),
        };
        userService.requestForPasswordChange = jest.fn();

        await userController.changePasswordRequest(request, response);

        expect(logRequestInfo).toHaveBeenCalledWith(request, `${request.user.name} requested for Password Change`,"UsersController/changePasswordRequest");
      });
    });

    describe("for invalid verification token", () => {
      test("it should create a log record with appropriate message", async () => {
        const request = {
          body: {
            username: "johndoe"
          },
          user: {
            _id: "mockUserId",
            name: "John Doe",
            username: "johndoe",
            email: "johndoe@example.com",
            password: "password123",
          },
        };
        const response = {
          status: jest.fn(() => response),
          json: jest.fn(),
        };
        const mockError = new Error("Database error");
        userService.requestForPasswordChange = jest.fn().mockRejectedValue(mockError);

        await userController.changePasswordRequest(request, response);

        expect(logRequestError).toHaveBeenCalledWith(request, MESSAGE.CHANGE_PASSWORD_VERIFICATION_TOKEN_CREATION_ERROR, CONTROLLER.CHANGE_PASSWORD_REQUEST );
      });

      test("it should return a response with status 500", async () => {
        const request = {
          body: {
            username: "johndoe"
          },
          user: {
            _id: "mockUserId",
            name: "John Doe",
            username: "johndoe",
            email: "johndoe@example.com",
            password: "password123",
          },
        };
        const response = {
          status: jest.fn(() => response),
          json: jest.fn(),
        };
        const mockError = new Error("Database error");
        userService.requestForPasswordChange = jest.fn().mockRejectedValue(mockError);

        await userController.changePasswordRequest(request, response);

        expect(response.status).toHaveBeenCalledWith(
          HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
      });
    });
  });
});
