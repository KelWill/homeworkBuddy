homeworkBuddy.templates = homeworkBuddy.templates || {};

homeworkBuddy.templates.FillBlankCreation = '<div class = "FillBlank question pull-left">\
<textarea class = "FillBlank question preText text" placeholder = "Text before the blank"><% if (preText) { print (preText) } %> </textarea>\
<input type = "text" class = "FillBlank question answer" value = "<%= answer %>" placeholder = "the blank"/>\
<textarea class = "FillBlank question postText text" placeholder = "Text after the blank"><% if (postText) { print (postText) } %></textarea>\
<button value = "Done" class = "btn btn-success btn-lg submit pull-right">Done</button></div>'