
$(document).ready(function(){
  var currentParagraph = 0;
  var currentQuestion = 0;
  var textNotQuestions = true;

  //   Initializing Collections and Collection Views   //
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

  //   Setting up the Router   //
  var app = new (Backbone.Router.extend({
    baseURL: document.URL,
    routes: {
      'p/:id' : 'showParagraph',
      'p/:id/q' : 'showQuestions'
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
      console.log('show paragraph is running with ', paragraph_id);
      if (this.assignment){
        paragraph = this.assignment.find(function(p){
          return p.get('paragraph_id') + '' === paragraph_id + '';
        });
        console.log('paragraph is', paragraph);
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
       console.log('renderQuestions has been triggered');
       this.renderQuestions();
     }, this);

     this.listenTo(this.model, 'complete', function(){
       console.log('complete has been triggered')
       this.render();
     }, this);
     
     this.listenTo(this.model, 'showMe', function(){
       console.log('show me is running');
       $('#container').html('');
       $('#container').append(view.el);

       view.$el.find(".go").on('click', function(){
         view.doQuestions();
       });
       view.$el.find(".return").on('click', function(){
         view.returnParagraph();
       });
       console.log(view.$el.find('.submit'));
       view.$el.find(".submit").on('click', function(){
         view.submit();
       });
     });
    },

    submit: function(){
      router.currentIndex++;
      router.navigate('/p/' + router.urls[router.currentIndex], {trigger: true});
    },

    doQuestions: function(){
      console.log('doquestion has been clicked');
      app.navigate(this.url + '/q');
      this.$el.children().toggleClass('hide');
    },

    returnParagraph: function(){
      console.log('return paragraph has been clicked')
      app.navigate(this.url);
      this.$el.children().toggleClass('hide');
    }, 

    render: function(){
      this.$el.html('<div class = "questions" >' + this.model.get('text') + '</div>');
      this.$el.append('<div class = "questionSet questions hide"></div>');
      // if (this.model.get('questionSet').length) { 
      this.$el.append('<button class = "questions go">Ready for some questions?</button>');
      // } else {
      //   this.$el.append('<button class = "submit">Submit Entire Assignment!</button>');
      // }
      this.$el.append('<button class = "questions return hide">Return to text</button><button class = "submit hide">Submit Answers</button>');
      return this;
    },

    questionTemplate: _.template('<%= number %><h4><%= question %></h4>\
      <div class = "A answer option">A: <%= answerOptions[0] %></div>\
      <div class = "B answer option">B: <%= answerOptions[1] %></div>\
      <div class = "C answer option">C: <%= answerOptions[2] %></div>\
      <div class = "D answer option">D: <%= answerOptions[3] %></div>'),

    renderQuestions: function(){
      var questionSet = this.model.get('questionSet');
      for ( var i = 0; i < questionSet.length; i++ ) {
        question = JSON.parse(questionSet[i].QuestionText);
        this.$el.find('div.questionSet').append(this.questionTemplate(question));
      }
    }
  });


  Backbone.history.start({pushState: true, root: app.rootURL});

});