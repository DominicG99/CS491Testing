# Authentication-Secrets

The following project is for CS491 Final Project.

Within this repository, I took an existing project which allowed users to sign up and login and added testing to it. After logging in, users were then able to "submit" secrets which other users could see. (Sort of like an anonymous message board)

For the testing, I implemented 13 tests, including two integration tests. I tested the main page, login page, register page, register post, login post, delete user, logout, secrets page, submit page and two integration tests. The integration tests tested the login and register units together and the login and submit units together.

Moreover, although I did state in my initial documentation that I planned on using Docker/Jenkins to implement the automated testing and deployment, I found that using Heroku for my pipeline was much easier and straightfoward. Heroku allows me to implement a CI/CD pipeline. Upon pushing my code into my github repository, Heroku will run my tests I have configured. If the tests all pass, the new build will be deployed onto the heroku server. Thus completing the CI/CD pipeline.

---

To replicate my infrastructure:

1. Initialize github repository and push code to it.
2. Create Heroku Account.
3. Create Heroku App and connect with Github repository.
4. Create Pipeline and add app.
5. Ensure Automatic Deployments are enabled and CI is enabled.
