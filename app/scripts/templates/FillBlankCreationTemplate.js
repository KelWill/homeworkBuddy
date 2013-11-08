homeworkBuddy.templates = homeworkBuddy.templates || {};

homeworkBuddy.templates.FillBlankCreation = '<div class = "FillBlank question">\
<input type = "text" class = "FillBlank question preText text" value = "<%= preText %>" placeholder = "Text before the blank"/>\
<input type = "text" class = "FillBlank question answer" value = "<%= answer %>" placeholder = "Write the correct answer in the blank. Students will not see this"/>\
<input type = "text" class = "FillBlank question postText text" value = "<%= postText %>" placeholder = "Text after the blank"/>\
</div><button value = "Done" class = "submit">Done</button>'