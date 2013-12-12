homeworkBuddy.Views.QuestionView = Backbone.View.extend({});

homeworkBuddy.Views.MCQuestionView = homeworkBuddy.Views.QuestionView.extend({
  events: {
    'click a.answer.option' : 'select', 
  },

  select: function(event){
    var option = this.$el.find('a.answer.option');
    option.removeClass('selected').removeClass('active');
    $currentTarget = $(event.currentTarget);
    $currentTarget.addClass('selected').addClass('active');
    var selected = $currentTarget.attr('class')[0];
    this.model.set('selected', selected);
  },

  initialize: function(){
    this.model.on('save', function(){
      var option = this.$el.find('.selected');
      if (option.length){
        var answer = option.attr('class')[0];
        this.model.set('answer', answer);
      }
    }, this);
    this.listenTo(this.model, 'highlight', function(correct, answer){
      this.$el.find('.answer.option').removeClass('active');
      if (correct){
        this.$el.find('.' + answer).addClass('correct');
      } else {
        this.$el.find('.' + answer).addClass('incorrect');
      }
    })
  },
  //<% if (selected === "A") { print("selected") }%>
  questionTemplate: _.template('<h2><%= number %>. <%= question %></h2\
   <div class = "list-group">\
     <a class = "A answer option list-group-item">A: <%= answerOptions[0] %></li>\
     <a class = "B answer option list-group-item">B: <%= answerOptions[1] %></li>\
     <a class = "C answer option list-group-item">C: <%= answerOptions[2] %></li>\
     <a class = "D answer option list-group-item">D: <%= answerOptions[3] %></li>\
   </div>'),

  render: function(){
    this.$el.append(this.questionTemplate(this.model.attributes));
    return this;
  }
});

homeworkBuddy.Views.ShortAnswerQuestionView = homeworkBuddy.Views.QuestionView.extend({
  initialize: function(){
    this.model.on('save', function(){
      var answer = this.$el.find('.answer').val();
      this.model.set('answer', answer);
    }, this)
  },
  questionTemplate: _.template('<h2><%= number %>. <%= question %></h2>\
    <textarea class = "answer" value = "<%=answer%>" />'), 

  render: function(){
    this.$el.append(this.questionTemplate(this.model.attributes));
    return this;
  }
 });

homeworkBuddy.Views.FillBlankQuestionView = homeworkBuddy.Views.QuestionView.extend({
  initialize: function(){
    this.model.on('save', function(){
      var answer = this.$el.find('.answer').val();
      this.model.set('answer', answer);
    }, this)
  },

  questionTemplate: _.template('<h2><%= number %>. <%= preText %><input type = "text" class = "answer" value = "<%=answer%>"><%= postText %></h2>'),

  render: function(){
    this.$el.append(this.questionTemplate(this.model.attributes));
    return this;
  }
});

homeworkBuddy.Views.ParagraphView = Backbone.View.extend({
  initialize: function(){
   var view = this;
   this.url = '/p/' + this.model.get('paragraph_id'),

   this.listenTo(this.model, 'renderQuestions', function(){
     this.renderQuestions();
   }, this);

   this.listenTo(this.model, 'complete', function(){
     this.render();
   }, this);


   this.listenTo(this.model, 'showMe', function(){
     $('#container').children().detach();
     $('#container').append(view.el);

     view.$el.find(".go").on('click', function(){
       view.doQuestions();
     });
     view.$el.find(".return").on('click', function(){
       view.returnParagraph();
     });
     view.$el.find(".submit").on('click', function(){
       view.submit();
     });
     view.$el.find(".assignment").on('click', function(){
       view.submitAssignment();
     });
   });
  },

  submit: function(){
    //saving values
    var paragraph = app.assignment.find(function(item){
      return item.get('paragraph_id') + '' === app.urls[router.currentIndex] + '';
    });
    if (paragraph && paragraph.questionSet){
      paragraph.questionSet.forEach(function(question){
        question.trigger('save');
      });
    }

    app.currentIndex++;
    if (app.currentIndex < app.urls.length){
      app.navigate(app.rootURL + '/p/' + app.urls[app.currentIndex], {trigger: true});
    } else {
      this.submitAssignment();
    }
  },

  doQuestions: function(){
    app.navigate(app.rootURL + this.url + '/q');
    this.$el.children().toggleClass('hide');
  },

  returnParagraph: function(){
    app.navigate(app.rootURL + this.url);
    this.$el.children().toggleClass('hide');
  },

  submitAssignment: function(){
    if (router.loggedin){
      var data = [];
      router.assignment.forEach(function(paragraph){
        if (paragraph.attributes.questionSet){
          paragraph.questionSet.forEach(function(question){
            var toSave = {};
            toSave.question_id = question.get('questionId');
            toSave.answer = question.get('answer');
            data.push(toSave);
          });
        }
      })
      data = JSON.stringify(data);

      console.log('data', data);
      $.ajax({
        method: "POST", 
        data: data,
        url: '/submitAssignment' + router.rootURL, 
        contentType: 'application/JSON',
        success: function(){
          $('#container').children().detach();
          $('#container').append("You're done!");
        }
      });
    } else {
      $('#container').prepend("You aren't logged in. Please login and submit again.");
    }
  },

  render: function(){
    this.$el.append('<div class = "questions" >' + this.model.get('text') + '</div>');
    this.$el.append('<div class = "questionSet questions hide"></div>');
    this.$el.append('<button class = "questions go btn btn-success btn-lg pull-right marTop">Ready for some questions?</button>');
    this.$el.append('<button class = "btn btn-warning questions btn-lg return hide pull-left marTop">Return to text</button>');
    this.$el.append('<button class = "btn btn-success btn-lg submit hide pull-right marTop">Submit Answers</button>');
    
    return this;
  },

  renderQuestions: function(){
    this.model.questionSet = new homeworkBuddy.Collections.QuestionSet();
    this.model.questionSetView = new homeworkBuddy.Views.QuestionSetView({collection: this.model.questionSet});
    for (var i = 0; i < this.model.get('questionSet').length; i++){
      var q = this.model.get('questionSet')[i]
      var id = q.id;
      q = JSON.parse(q.QuestionText);
      q = new homeworkBuddy.Models.Question(q);
      q.set({questionId: id});
      this.model.questionSet.add(q);
    }
    this.$el.find('div.questionSet').append(this.model.questionSetView.el);
    
  }
});
