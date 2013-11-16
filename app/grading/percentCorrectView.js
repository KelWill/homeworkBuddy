homeworkBuddy.Views.PercentCorrectViews = Backbone.View.extend({
  className: "grading percentCorrectView list-inline pull-left",
  initialize: function(){
    this.collection.forEach(function(model){
      var percentCorrectView = new homeworkBuddy.Views.PercentCorrectView({model: model});
      this.$el.append(percentCorrectView.render().el);
    }, this);
  }, 

  tagName: "ul",
  className: "list-group list-inline pull-left text-center",

  sortedQuestions: [],

  sortByDifficulty: function(){
    if (!this.sortedQuestions.length){
      this.collection.forEach(function(question){
        var qObj = {};
        if (question.get('questionType') !== 'MC' || question.timesAnswered === 0){
          qObj.percent = '?';
          qObj.symbol = "";
          question.set('percentCorrect', '?');
        } else {
          qObj.percent = (question.timesCorrect / question.timesAnswered * 100);
          qObj.symbol = "%";
          question.set('percentCorrect', (question.timesCorrect / question.timesAnswered));
        }
        qObj.number = question.get('number');
        this.sortedQuestions.push(qObj);
      }, this);
      this.sortedQuestions.sort(function(a, b){
        if (a.percent === '?' && b.percent === '?'){
          return 0;
        } else if (a.percent === '?'){
          return 1;
        } else if (b.percent === '?'){
          return -1
        }
        return a.percent - b.percent;
      });
      this.renderSortedQuestions();
    }
  },

  template: _.template('<li class = "list-group-item" style = "width:100px"><%= number %>. <%= percent %><%= symbol %></li>'),

  renderSortedQuestions: function(){
    debugger;
    var view = this;
    // this.$el.append('<li class = "list-group-item" style ="width = 250px" >Questions by difficulty:</li>');
    _.each(this.sortedQuestions, function(item){
      view.$el.append(view.template(item));
    });
    $('#container').prepend(this.el);
  },

  render: function(){
    this.collection.forEach(function(question){
      question.trigger('addPercentageCorrect');
    });
  },
});
