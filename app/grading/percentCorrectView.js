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
        var qObj = {};
        if (question.get('questionType') !== 'MC' || question.timesAnswered === 0){
          qObj.percent = '?';
          question.set('percentCorrect', '?');
        } else {
          qObj.percent = (question.timesCorrect / question.timesAnswered * 100) + '%';
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
        return b.percent - a.percent;
      });
      this.renderSortedQuestions();
    }
  },

  template: _.template('<%= number %>. <%= percent %> || '),

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
