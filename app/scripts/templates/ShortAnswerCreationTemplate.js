homeworkBuddy.templates = homeworkBuddy.templates || {};
homeworkBuddy.templates.ShortAnswerCreation = '<div class = "ShortAnswer question">\
  Question: <input type = "text" class = "SA question text" value = "<%= question %>" /><br>\
  Min Length: <input type = "text" class = "min" value = "<%= min %>" placeholder = "Default is 0"/><br>\
  Max Length: <input type = "text" class = "max" value = "<%= max %>" placeholder = "Default is 100"/>\
  <button class = "submit">Done</button>\
</div>'

