homeworkBuddy.templates = homeworkBuddy.templates || {};

homeworkBuddy.templates.MCCreation = 
'<div class = "MC pull-left"> \
<input type = "text" class = "MC text" value = "<%=question%>" placeholder = "Question"/><br>\
<input type = "text" class = "MC option A" value = "<%=answerOptions[0]%>" placeholder = "A"/><br>\
<input type = "text" class = "MC option B" value = "<%=answerOptions[1]%>" placeholder = "B"/><br>\
<input type = "text" class = "MC option C" value = "<%=answerOptions[2]%>" placeholder = "C"/><br>\
<input type = "text" class = "MC option D" value = "<%=answerOptions[3]%>" placeholder = "D"/><br>\
<div class = "btn-group" data-toggle = "buttons">\
  <label class ="A btn btn-primary <% if (correctAnswer === "A") { print("active")} %>"><input type="radio" name="correct" value ="A" >A</label>\
  <label class ="B btn btn-primary <% if (correctAnswer === "B") { print("active")} %>"><input type="radio" name="correct" value ="B" >B</label>\
  <label class ="C btn btn-primary <% if (correctAnswer === "C") { print("active")} %>"><input type="radio" name="correct" value ="C" >C</label>\
  <label class ="D btn btn-primary <% if (correctAnswer === "D") { print("active")} %>"><input type="radio" name="correct" value ="D" >D</label>\
</div>\
  <button class = "submit btn btn-success btn-lg pull-right">Done</button>\
</div>'