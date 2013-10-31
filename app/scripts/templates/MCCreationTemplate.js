homeworkBuddy.templates = homeworkBuddy.templates || {};

homeworkBuddy.templates.MCCreation = 
'<div class = "MC"> \
  Question: <input type = "text" class = "MC text" id = "question" value = "<%=question%>"/> <br>\
  <span>A:</span> <input type = text" class = "MC option A"  value = "<%=answerOptions[0]%>"/> <br>\
  <span>B:</span> <input type = text" class = "MC option B" value = "<%=answerOptions[1]%>"/> <br>\
  <span>C:</span> <input type = text" class = "MC option C" value = "<%=answerOptions[2]%>"/> <br>\
  <span>D:</span> <input type = text" class = "MC option D" value = "<%=answerOptions[3]%>"/><br>\
  <span><form>Correct Answer: A<input type="radio" name="correct" value="A"/>B<input type="radio" name="correct" value="B"/>C<input type="radio" name="correct" value="C"/>D<input type="radio" name="correct" value="D"/></form></span>\
  <button value = "Done" class = "submit">Done!</button>\
</div>'

