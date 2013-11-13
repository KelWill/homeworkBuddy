
$(document).ready(function(){
  var currentParagraph = 0;
  var currentQuestion = 0;
  var textNotQuestions = true;

  //   Initializing Collections and Collection Views   //
  var QuestionSet = Backbone.Collection.extend({});

  var QuestionSetView = Backbone.View.extend({
    initialize: function(){
      this.collection.on('add', function(q){
        this.renderQuestion(q);
      }, this);
    },

    renderQuestion: function(q){
      var qView;
      if (q.get('questionType') === "MC"){
        qView = new MCQuestionView({model: q});
      } else if (q.get('questionType') === "ShortAnswer"){
        qView = new ShortAnswerQuestionView({model: q});
      } else if (q.get('questionType') === "FillBlank"){
        qView = new FillBlankQuestionView({model: q});
      }
      qView.render();
      this.$el.append(qView.el);
    }
  });
  var QuestionView = Backbone.View.extend({});

  var MCQuestionView = QuestionView.extend({
    events: {
      'click div.answer.option' : 'select'
    }, 

    select: function(event){
      this.$el.find('div.answer.option').removeClass('selected');
      $(event.currentTarget).addClass('selected');
    },

    initialize: function(){
      this.model.on('save', function(){
        var selected = this.$el.find('.selected');
        if (selected.length){
          var answer = selected.attr('class')[0];
          this.model.set('answer', answer);
        }
      }, this)
    },
    //<% if (selected === "A") { print("selected") }%>
    questionTemplate: _.template('<%= number %><h4><%= question %></h4>\
      <div class = "A answer option">A: <%= answerOptions[0] %></div>\
      <div class = "B answer option">B: <%= answerOptions[1] %></div>\
      <div class = "C answer option">C: <%= answerOptions[2] %></div>\
      <div class = "D answer option">D: <%= answerOptions[3] %></div>'),

    render: function(){
      this.$el.append(this.questionTemplate(this.model.attributes));
      return this;
    }
  });

  var ShortAnswerQuestionView = QuestionView.extend({
    initialize: function(){
      this.model.on('save', function(){
        var answer = this.$el.find('.answer').val();
        this.model.set('answer', answer);
      }, this)
    },
    questionTemplate: _.template('<%= number %><h4><%= question %></h4>\
      <textarea class = "answer" value = "<%=answer%>" />'), 

    render: function(){
      this.$el.append(this.questionTemplate(this.model.attributes));
      return this;
    }
  });

  var FillBlankQuestionView = QuestionView.extend({
    initialize: function(){
      this.model.on('save', function(){
        var answer = this.$el.find('.answer').val();
        this.model.set('answer', answer);
      }, this)
    },

    questionTemplate: _.template('<%= number %><h4><%= preText %><input type = "text" class = "answer" value = "<%=answer%>"><%= postText %></h4>'),

    render: function(){
      this.$el.append(this.questionTemplate(this.model.attributes));
      return this;
    }
  });

  var Assignment = Backbone.Collection.extend();

  var AssignmentView = Backbone.View.extend({

    initialize: function(){
     this.$el = $('#container');

     this.collection.on('add', function(p){
        this.addOne(p);
      }, this);

      this.collection.on('questionsAdded', function(){
        this.forEach(function(paragraph){
          paragraph.trigger('complete');
          paragraph.trigger('renderQuestions');
        });
      })
    }, 

    addOne: function(paragraph){
      var paragraphView = new ParagraphView({model: paragraph});
      paragraphView.render();
    }
  });

  //   Model and View initialization   //
  var Paragraph = Backbone.Model.extend({
    initialize: function(options){
      this.set('paragraph_id', options.paragraph_id); 
      this.set('text', options.text);
      this.set('questionSet', []);
    }
  });

  var ParagraphView = Backbone.View.extend({
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
       $('#container').html('');
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
      var paragraph = router.assignment.find(function(item){
        return item.get('paragraph_id') + '' === router.urls[router.currentIndex] + '';
      });
      paragraph.questionSet.forEach(function(question){
        question.trigger('save');
      });

      router.currentIndex++;
      if (router.currentIndex < router.urls.length){
        router.navigate('/p/' + router.urls[router.currentIndex], {trigger: true});
      } else {
        this.submitAssignment();
        $('#container').html('<h1>YOU ARE DONE YOU LUCKY SON OF A BITCH</h1>')
      }
    },

    doQuestions: function(){
      app.navigate(this.url + '/q');
      this.$el.children().toggleClass('hide');
    },

    returnParagraph: function(){
      app.navigate(this.url);
      this.$el.children().toggleClass('hide');
    },

    submitAssignment: function(){
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
        contentType: 'application/JSON'
      });
    },

    render: function(){
      this.$el.html('<div class = "questions" >' + this.model.get('text') + '</div>');
      this.$el.append('<div class = "questionSet questions hide"></div>');
      this.$el.append('<button class = "questions go">Ready for some questions?</button>');
      this.$el.append('<button class = "questions return hide">Return to text</button>');
      this.$el.append('<button class = "submit hide">Submit Answers</button>');
      
      return this;
    },

    renderQuestions: function(){
      this.model.questionSet = new QuestionSet();
      this.model.questionSetView = new QuestionSetView({collection: this.model.questionSet});
      for (var i = 0; i < this.model.get('questionSet').length; i++){
        var q = this.model.get('questionSet')[i]
        var id = q.id;
        q = JSON.parse(q.QuestionText);
        q = new Question(q);
        q.set({questionId: id});
        this.model.questionSet.add(q);
      }
      this.$el.find('div.questionSet').append(this.model.questionSetView.el);
      
    }

  });
  
  var Question = Backbone.Model.extend({
    initialize: function(){
      this.set('answer', '');
    }, 

  });

  // var MCQuestion = Question.extend({
  //   initialize: function(){
  //     this.set('selected', "");
  //   } 
  // });

  // var ShortAnswerQuestion = Question.extend({
  //   initialize: function(){
  //     this.set('answer', '');
  //   }
  // });

  // var FillBlankQuestion = Question.extend({
  //    initialize: function(){
  //     this.set('answer', '');
  //    }, 

  //    save: function(answer){
  //      this.set('answer', answer);
  //    }
  // });



  //   Setting up the Router   //
  var app = new (Backbone.Router.extend({
    baseURL: document.URL,
    routes: {
      'p/:id' : 'showParagraph',
      'p/:id/q' : 'showQuestions', 
    },

    review: function(){
      console.log("REVIEW HAS BEEN TRIGGERED!");
    },

    initialize: function(){
      router = this;
      var url = this.baseURL;
      var i = url.indexOf('/student/') + '/student/'.length;
      var run = true, slashCount = 0, j = i;

      //the below formats the rootUrl correctly
      //and extracts the correct url to ask for the whole assessment
      while (run){
        j++
        if (j === url.length){
          run = false;
        }
        if ('/' === url[j]){
          slashCount++; 
          if (slashCount === 2){
            run = false;
          }
        }
      }
      this.rootURL = '/student/' + url.slice(i, j);
      url = url.slice(i, j);  

      $.ajax({
       method: 'get', 
       url: '/getassignment/' + url, 
       success: function(data){
         data = JSON.parse(data);
         var paragraphs = JSON.parse(data.paragraphs);
         var questions = JSON.parse(data.questions);
         
         router.createCollectionsAndViews(paragraphs, questions);
       }, 
       failure: function(error){
         console.log(error);
       }
      })
    },

    landing: function(){
      //this.navigate('p/1', {trigger: true});
    },

    createCollectionsAndViews: function(paragraphs, questions){
      this.urls = [];
      this.currentIndex = 0;

      this.assignment = new Assignment({model: Paragraph});
      this.assignmentView = new AssignmentView({collection: this.assignment});
      var currentText = '';
      for ( var i = paragraphs.length - 1; i >= 0; i-- ){
        if (paragraphs[i].paragraph_id){
          var paragraph = new Paragraph(paragraphs[i]);
          this.assignment.add(paragraph);
          this.urls.push(paragraph.get('paragraph_id'));
        }
      }
      paragraph = this.assignment.at(0);
      for ( var i = 0; i < questions.length; i++ ) {
        var question = questions[i];

        //only search the collection for the new paragraph if the current paragraph isn't correct
        if (paragraph.get('paragraph_id') !== questions[i].paragraph_id) {
          paragraph = this.assignment.find(function(item){
            return item.get('paragraph_id') === questions[i].paragraph_id;
          });
        }
        paragraph.get('questionSet').push(question);
      }
      this.assignment.trigger('questionsAdded');

      this.navigate('p/' + this.urls[this.currentIndex], {trigger: true});
    },

    showParagraph: function(paragraph_id){
      if (this.assignment){
        paragraph = this.assignment.find(function(p){
          return p.get('paragraph_id') + '' === paragraph_id + '';
        });
        paragraph.trigger('showMe');
      }
    },

    showQuestions: function(paragraph_id){
      if (this.assignment){
        paragraph = this.assignment.find(function(item){
          return item.get('paragraph_id') === paragraph_id;
        });
        paragraph.trigger('showQuestions');
      }
    }

  }));
  //End router



  Backbone.history.start({pushState: true, root: app.rootURL});

});