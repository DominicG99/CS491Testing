var request = require("request");
var expect = require("chai").expect;

it("Main page content", function (done) {
  request("http://localhost:3000", function (error, response, body) {
    expect(body).to.equal("Home Page");
    expect(response.statusCode).to.equal(200);
    done();
  });
});

it("Login page content", function (done) {
  request("http://localhost:3000/login", function (error, response, body) {
    expect(body).to.equal("Login Page");
    expect(response.statusCode).to.equal(200);
    done();
  });
});

it("Register page content", function (done) {
  request("http://localhost:3000/register", function (error, response, body) {
    expect(body).to.equal("Register Page");
    expect(response.statusCode).to.equal(200);
    done();
  });
});
