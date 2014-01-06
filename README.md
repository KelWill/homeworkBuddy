Homework Buddy
=========
Homework Buddy is a tool that allows teachers to easily add questions to an article or passage, send it to their students, and view the results, all in the browser. It's currently deployed [here](http://hwbud.azurewebsites.net). 
## Why use Homework Buddy?
### Grading
Homework Buddy automatically grades multiple choice questions, and features a grading view that allows teachers to easily see student results, averages, and which questions students had the most trouble with, allowing them to adjust their teaching accordingly. 
###Review
Review is when learning really happens, and every time a student answer a question, a relationship is created between that student and that question, and Homework Buddy uses a Leitner Flashcard system to schedule spiraling review for that student. 
###Engagement
By having students answer questions immediately after reading, students retain more information and read more carefully.
## Tech Stack
The front-end is structured using Backbone.js, and styled with Bootstrap. On the backend, I used Node and Express, with Passport.js for user authentication, and node-mysql2 to communicate with the MySql database. I also used Yeoman and Grunt, and it's deployed using Azure. 

## Under Constuction
Some features are currently being updated. 
* Database: I'm denormalizing parts of the database to speed up queries. 
* Markdown: I'm switching over to a markdown syntax for teacher input to safely allow for more text formatting options. 
* Testing: The current testing suite is insufficient, so I'm working on rewriting it.
