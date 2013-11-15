homeworkBuddy.templates = homeworkBuddy.templates || {};

homeworkBuddy.templates.FillBlankCreation = '<div class = "FillBlank question">\
<textarea class = "FillBlank question preText text" value = "<%= preText %>" placeholder = "Text before the blank"></textarea>\
<input type = "text" class = "FillBlank question answer" value = "<%= answer %>" placeholder = "the blank"/>\
<textarea class = "FillBlank question postText text" value = "<%= postText %>" placeholder = "Text after the blank"></textarea>\
</div><button value = "Done" class = "submit">Done</button>'