// homeworkBuddy.Models.findAssignment = Backbone.Model.extend({});

// homeworkBuddy.Views.findAssignmentView = Backbone.View.extend({});

homeworkBuddy.Collections.AllTeacherList = Backbone.Collection.extend({
  initialize: function(){
    var allTeacherList = this;
    $.ajax({
      method: 'GET', 
      url: '/allteachers',
      success: function(data){
        var teacher;
        data = JSON.parse(data);
        for (var i = 0; i < data.length; i++){
          teacher = new homeworkBuddy.Models.Teacher(data[i]);
          allTeacherList.add(teacher);
        }
      },
      error: function(error){
        $('#container').children().detach();
        $('#container').html('Something went wrong. Sorry! Try again in a minute');
      }
    });
  }, 

});

homeworkBuddy.Views.AllTeacherListView = Backbone.View.extend({
  tagName: 'ul',
  className: 'list-group', 

  initialize: function(){
    this.listenTo(this.collection, 'add', function(model){
      var view = new homeworkBuddy.Views.AllTeacherView({model: model});
      this.$el.append(view.el);
    }, this);
  }
});

homeworkBuddy.Views.AllTeacherView = Backbone.View.extend({
  tagName: "li", 
  className: "list-group-item"
  initialize: function(){
    this.render();
  },

  events: {
    'click a.teacher': 'getAssignmentsForTeacher'
  },

  getAssignmentsForTeacher: function(){
    console.log('getting assignments for teacher');
    this.model.trigger('getAssignmentsForTeacher');
  },
  template: _.template("<a href = '#' class = 'teacher'><%=name%></a>  <span class = 'label pull-right'>Join Class</span>"),
  render: function(){
    this.$el.append(this.template(this.model.attributes));
    return this;
  }
});

homeworkBuddy.Collections.TeacherList = Backbone.Collection.extend({});

homeworkBuddy.Models.Teacher = Backbone.Model.extend({});

homeworkBuddy.Views.TeacherView = Backbone.View.extend({});

homeworkBuddy.Models.Assignment = Backbone.Model.extend({});

homeworkBuddy.Collections.AssignmentList = Backbone.Collection.extend({});

homeworkBuddy.Views.AssignmentView = Backbone.View.extend({});