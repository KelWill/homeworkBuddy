console.log('loaded successfully');

(function(){
  var currentParagraph = 0;
  var currentQuestion = 0;
  var textNotQuestions = true;

  var app = new (Backbone.Router.extend({
    routes: {
      '': 'getAssignment'
    },

    renderPage: function(paragraphs, questions){
      var assignment = new Assignment({model: Paragraph});
      var assignmentView = new AssignmentView({collection: assignment});

      for ( var i = 0; i < paragraphs.length; i++ ){
        console.log(paragraphs[i]);
        var paragraph = new Paragraph(paragraphs[i]);
        assignment.add(paragraph);
      }
      paragraph = assignment.at(0);
      for ( var i = 0; i < questions.length; i++ ) {
        var question = questions[i];

        //only search the collection for the new paragraph if the current paragraph isn't correct
        if (paragraph.get('paragraph_id') !== questions[i].paragraph_id) {
          paragraph = assignment.find(function(item){
            return item.get('paragraph_id') === questions[i].paragraph_id;
          });
        }
        console.log(paragraph);
        console.log(questions[i]);
      }
    }, 

    getAssignment: function(){
      router = this;
      var url = document.URL;
      var i = url.indexOf('/student/') + '/student/'.length;
      url = url.slice(i);
      console.log(url);

      $.ajax({
       method: 'get', 
       url: '/getassignment/' + url, 
       success: function(data){
         data = JSON.parse(data);
         var paragraphs = JSON.parse(data.paragraphs);
         var questions = JSON.parse(data.questions);
         console.log('paragraphs', paragraphs);
         console.log('questions', questions);
         router.renderPage(paragraphs, questions);
       }, 
       failure: function(error){
         console.log(error);
       }
      })
    }
  }));
  var Paragraph = Backbone.Model.extend({
    initialize: function(options){
      this.paragraph_id = options.paragraph_id; 
      this.text = options.text;
    }
  });

  var ParagraphView = Backbone.View.extend({
    render: function(){
      this.$el.text(this.model.text);
      this.$el.append('<button class = "questions">Ready for some questions?</button>')
      $('#container').html(this.$el);
      return this;
    }
  })

  var Assignment = Backbone.Collection.extend({ });
  var AssignmentView = Backbone.View.extend({
    initialize: function(){
      this.collection.on('add', function(p){
        this.addOne(p);
      }, this);
    }, 
    addOne: function(paragraph){
      var paragraphView = new ParagraphView({model: paragraph});
      paragraphView.render();
      console.log(paragraphView.el);
      this.$el.append(paragraphView.el);
    }
  });

  Backbone.history.start({pushstate: true});

})()