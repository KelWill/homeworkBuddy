homeworkBuddy.Views.PercentCorrectViews = Backbone.View.extend({
  initialize: function(){
    this.collection.forEach(function(model){
      var percentCorrectView = new homeworkBuddy.Views.PercentCorrectView({model: model});
      this.$el.append(percentCorrectView.render().el);
    }, this);
  }, 

  sortedQuestions: [],

  sortByDifficulty: function(){
    if (!this.sortedQuestions.length){
      this.collection.forEach(function(question){
        var qObj = {}
        if (!question.timesAnswered){
          qObj.percent = 0;
        } else {
          qObj.percent = question.timesCorrect / question.timesAnswered;
        }
        qObj.number = question.get('number');
        this.sortedQuestions.push(qObj);
      }, this);
      this.sortedQuestions.sort(function(a, b){
        return a.percent - b.percent;
      });
      console.log(this.sortedQuestions);
      this.renderSortedQuestions();
    }
  },

  template: _.template('<%= number %>. <%= percent * 100 %>% || '),

  renderSortedQuestions: function(){
    var view = this;
    this.$el.append('Questions by difficulty: ');
    _.each(this.sortedQuestions, function(item){
      view.$el.append(view.template(item));
    });
    $('.currentView').append(this.el);
  },

  render: function(){
    this.collection.forEach(function(question){
      question.trigger('addPercentageCorrect');
    });
  },
});
