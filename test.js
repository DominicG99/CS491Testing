var request = require("request");
var expect = require("chai").expect;
var sinon = require("sinon");
const passport = require("passport");
var port;

if (process.env.PORT !== null) {
  port = "http://cs4912021.herokuapp.com";
} else {
  port = "http://localhost:3000";
}

//Test Page Views.....
console.log(port);
it("Main page content", function (done) {
  request(port, function (error, response, body) {
    expect(body).to.equal("Home Page");
    expect(response.statusCode).to.equal(200);
    done();
  });
});

it("Login page content", function (done) {
  request(port + "/login", function (error, response, body) {
    expect(body).to.equal("Login Page");
    expect(response.statusCode).to.equal(200);
    done();
  });
});

it("Register page content", function (done) {
  request(port + "/register", function (error, response, body) {
    expect(body).to.equal("The Register Page");
    expect(response.statusCode).to.equal(200);
    done();
  });
});
//Test
it("Test Register Post", function (done) {
  request.post(
    {
      url: port + "/register",
      form: {
        username: "DominicG",
        password: "test123",
      },
    },
    function (err, response, body) {
      expect(response.statusCode).to.equal(302);
      done();
    }
  );
});
it("Test Delete User", function (done) {
  request.post(
    {
      url: port + "/delete",
      form: {
        username: "DominicG",
      },
    },
    function (err, response, body) {
      expect(response.statusCode).to.equal(302);
      done();
    }
  );
});
it("Testing Register Post Fail", function (done) {
  request.post(
    {
      url: port + "/register",
      form: {
        username: "",
        password: "",
      },
    },
    function (err, response, body) {
      expect(body).to.equal("Something broke!");
      expect(response.statusCode).to.equal(500);
      done();
    }
  );
});

it("Testing Login", function (done) {
  request.post(
    {
      url: port + "/login",
      form: {
        username: "admin",
        password: "admin",
      },
    },
    function (err, response, body) {
      expect(response.statusCode).to.equal(302);
    }
  );
  //Testing the failed login
  request.post(
    {
      url: port + "/login",
      form: {
        username: "admin",
        password: "admin2",
      },
    },
    function (err, response, body) {
      expect(response.statusCode).to.equal(401);
      done();
    }
  );
});

it("Testing Logout", function (done) {
  request(port + "/logout", function (error, response, body) {
    expect(response.statusCode).to.equal(200);
    done();
  });
});

it("Testing Secrets Page", function (done) {
  request(port + "/secrets", function (error, response, body) {
    expect(response.statusCode).to.equal(200);
    done();
  });
});

it("Testing Submit Page", function (done) {
  request(port + "/submit", function (error, response, body) {
    expect(body).to.equal("Login Page");
    expect(response.statusCode).to.equal(200);
    done();
  });
});

//Login/Submit Integration
it("Testing Login/Submit Integration", function (done) {
  request.post(
    {
      url: port + "/login",
      form: {
        username: "admin",
        password: "admin",
      },
    },
    function (err, response, body) {
      request(port + "/submit", function (error, response, body) {
        expect(body).to.equal("Authenticated");
        expect(response.statusCode).to.equal(200);
        done();
      }).setHeader("Cookie", response.headers["set-cookie"]);
    }
  );
});

it("Testing Submit Post Integration", function (done) {
  request.post(
    {
      url: port + "/login",
      form: {
        username: "admin",
        password: "admin",
      },
    },
    function (err, response, body) {
      request
        .post(
          {
            url: port + "/submit",
            form: {
              secret: "test secret",
            },
          },
          function (error, response, body) {
            expect(body).to.equal("Found. Redirecting to /secrets");
            expect(response.statusCode).to.equal(302);
            done();
          }
        )
        .setHeader("Cookie", response.headers["set-cookie"]);
    }
  );
});

//Login and Register Integration.
it("Test Register/Login Integration", function (done) {
  request.post(
    {
      url: port + "/register",
      form: {
        username: "DominicG",
        password: "test123",
      },
    },
    function (err, response, body) {
      request.post(
        {
          url: port + "/login",
          form: {
            username: "DominicG",
            password: "test123",
          },
        },
        function (err, response, body) {
          // expect(body).to.equal("Found. Redirecting to /secrets");
          // expect(response.statusCode).to.equal(302);
        }
      );
      request.post(
        {
          url: port + "/delete",
          form: {
            username: "DominicG",
          },
        },
        function (err, response, body) {
          expect(response.statusCode).to.equal(302);
        }
      );
      expect(response.statusCode).to.equal(302);
      done();
    }
  );

  //Delete User
});
