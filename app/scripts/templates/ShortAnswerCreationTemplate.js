homeworkBuddy.templates = homeworkBuddy.templates || {};
homeworkBuddy.templates.ShortAnswerCreation = '<div class = "pull-left ShortAnswer question">\
  <textarea type = "text" class = "SA question text" placeholder = "Prompt" ><% if (question) { print (question) } %></textarea><br>\
  <button class = "submit btn btn-success btn-lg pull-right">Done</button>\
</div>'
