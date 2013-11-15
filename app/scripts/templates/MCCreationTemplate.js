homeworkBuddy.templates = homeworkBuddy.templates || {};

homeworkBuddy.templates.MCCreation = 
'<div class = "MC"> \
<input type = "text" class = "MC text" value = "<%=question%>" placeholder = "Question"/><br>\
<input type = text" class = "MC option A" value = "<%=answerOptions[0]%>" placeholder = "A"/><br>\
<input type = text" class = "MC option B" value = "<%=answerOptions[1]%>" placeholder = "B"/><br>\
<input type = text" class = "MC option C" value = "<%=answerOptions[2]%>" placeholder = "C"/><br>\
<input type = text" class = "MC option D" value = "<%=answerOptions[3]%>" placeholder = "D"/><br>\
<span><form>Correct Answer: \
    A<input type="radio" name="correct" value="A" <% if (correctAnswer === "A") { print("checked=true")} %> />\
    B<input type="radio" name="correct" value="B" <% if (correctAnswer === "B") { print("checked=true")} %> />\
    C<input type="radio" name="correct" value="C" <% if (correctAnswer === "C") { print("checked=true")} %> />\
    D<input type="radio" name="correct" value="D" <% if (correctAnswer === "D") { print("checked=true")} %> />\
  </form></span>\
  <button class = "submit">Done</button>\
</div>'

