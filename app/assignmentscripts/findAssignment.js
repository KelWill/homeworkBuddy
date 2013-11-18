homeworkBuddy.student = {}

homeworkBuddy.student.start = function( ){
  if (!this.teachersList){
    this.teachersList = {};
  }
  var $container = $('#container');
  $container.children().detach();
  $container.append('<div class = "row"></div>');
  $container = $container.find('.row');
  $container.append('<div id = "teachers" class = "col-md-4"><h2>All Teachers</h2></div>');
  $container.append('<div id = "myTeachers" class = "col-md-4"><h2>My Teachers</h2></div>');
  $container.append('<div id = "assignments" class = "col-md-4"><h2>Assignments</h2></div>');
  if (!this.allTeachers){
    this.allTeachers = new homeworkBuddy.Collections.AllTeacherList();
  } else {
    $('#container').find('#teachers').append(this.allTeachers.view.el);
  }
  if (!this.myTeachers){
    this.myTeachers = new homeworkBuddy.Collections.TeacherList({});
  } else {
    $('#container').find('#myTeachers').append(this.myTeachers.view.el);
  }
}

homeworkBuddy.Collections.AllTeacherList = Backbone.Collection.extend({
  initialize: function(){
    var allTeacherList = this;
    this.view = new homeworkBuddy.Views.AllTeacherListView({collection: this});
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
        $('#container').find('#teachers').children().detach();
        $('#container').find('#teachers').append('Something went wrong. Sorry! Try again in a minute');
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
    this.render();
  },

  render: function(){
    $('#container').find('#teachers').append(this.el);
  }
});


homeworkBuddy.Collections.TeacherList = Backbone.Collection.extend({
  initialize: function(){
    this.view = new homeworkBuddy.Views.TeacherListView({collection: this});
    this.fetchTeachers();
  },

  fetchTeachers: function(){
    var myTeacherList = this;
    $.ajax({
      method: "GET",
      url: '/allclasses',
      success: function(data){
        data = JSON.parse(data);
        for (var i = 0; i < data.length; i++){
          var teacher = new homeworkBuddy.Models.Teacher(data[i]);
          myTeacherList.add(teacher);
          homeworkBuddy.student.teachersList[data[i].name] = true;
        }
        $('#myTeachers').find('.message').text('');
        $('#container').find('#myTeachers').find('.fetchTeachers').addClass('hide');
      },
      error: function(){
        $('#myTeachers').find('.message').text('There was an error fetching your classes. Are you logged in?')
        $('#container').find('#myTeachers').find('.fetchTeachers').removeClass('hide');
      }
    })
  }
});

homeworkBuddy.Views.TeacherListView = Backbone.View.extend({
  tagName: 'ul',
  className: 'list-group',

  initialize: function(){
    this.$el.append('<div class = "message" fetchTeachers></div>')
    this.$el.append('<a href = "#" class = "list-group-item hide fetchTeachers">Refresh</a>');
    this.collection.on('add', function(teacher){
      var view = new homeworkBuddy.Views.TeacherView({model: teacher});
      this.$el.append(view.el)
    }, this)
    this.render();
  },

  events: {
    'click a.fetchTeachers': 'fetch', 
  },

  fetch: function(){
    this.collection.fetchTeachers();
  },

  render: function(){
    $('#container').find('#myTeachers').append(this.el);
  }
})

homeworkBuddy.Models.Teacher = Backbone.Model.extend({
  initialize: function(){
    this.assignments = [];
  },

  getAssignmentsForTeacher: function(){
    var teacher = this;
    $.ajax({
      method: "GET", 
      url: '/getassignments/' + teacher.get('name'), 
      success: function(data){
        data = JSON.parse(data);
        teacher.assignments = data;
        teacher.assignmentsView = new homeworkBuddy.Views.AssignmentListView({model: teacher});
        teacher.trigger('fetchedAssignments');
        console.log(teacher.assignments);
      }, 
      error: function(){
        teacher.assignments.push({assignmentName: "There was an error fetching the data"});
      }
    });
  },

  joinClass: function(){
    var teacher = this;
    var teacherName = this.get('name');
    if (!homeworkBuddy.student.teachersList[teacherName]){
      $.ajax({
        method:"POST",
        url: '/students/joinclass/' + teacherName, 
        success: function(){
          homeworkBuddy.student.myTeachers.add(teacher);
          homworkBuddy.student.teachersList[teacherName] = true;
        },
        error: function(){
          $('#message').text('There was an error joining the class. Try again in a second').removeClass('hide');
        }
      })
    }
  }
});

homeworkBuddy.Views.TeacherView = Backbone.View.extend({
  tagName: "li", 
  className: "list-group-item",
  initialize: function(){
    this.render();
    this.model.on('fetchedAssignments', function(){
      //where to attach the view
      $assignments = $('#container').find('#assignments');
      $assignments.find('.assignments').detach();
      $assignments.append(this.model.assignmentsView.el);
    }, this)
  },

  events: {
    'click a.teacher': 'getAssignmentsForTeacher', 
  },

  getAssignmentsForTeacher: function(){
    console.log('getting assignments for teacher');
    if (this.model.assignmentsView){
      this.model.trigger('fetchedAssignments');
    } else {
      this.model.getAssignmentsForTeacher();
    }
  },
  template: _.template("<a href = '#' class = 'teacher'><%=name%></a>"),
  render: function(){
    this.$el.append(this.template(this.model.attributes));
    return this;
  }

});

homeworkBuddy.Views.AllTeacherView = homeworkBuddy.Views.TeacherView.extend({
  events: {
    'click a.teacher': 'getAssignmentsForTeacher', 
    'click span.label': 'joinClass'
  },

  joinClass: function(){
    this.model.joinClass();
  },

  template: _.template('<a href = "#" class = "teacher"><%=name%></a><span class ="joinClass label label-default pull-right">Join Class</span>'),
  render: function(){
    var view = this;
    console.log(view.model.attributes);
    var temp = view.template(view.model.attributes);
    console.log(temp);
    view.$el.append(temp);
    console.log(view.el);
    return this;
  }
});

homeworkBuddy.Views.AssignmentListView = Backbone.View.extend({
  className: "list-group assignments",
  tagName: "ul",

  initialize: function(){
    this.render();
  },

  render: function(){
    var options = {};
    var view;
    options.teacher = this.model.get('name');
    for (var i = 0; i < this.model.assignments.length; i++){
      options.assignmentName = this.model.assignments[i].assignmentName
      view = new homeworkBuddy.Views.SingleAssignmentView(options);
      this.$el.append(view.el);
    }
    if (!this.model.assignments.length){
      this.noAssignment();
    }
  },
  noAssignment: function(){
    this.$el.append('<li class = "list-group-item">This teacher hasn\'t made any assignments yet.</li>');
  }
});

homeworkBuddy.Views.SingleAssignmentView = Backbone.View.extend({
  tagName: "li", 
  className: "list-group-item",
  initialize: function(options){
    this.teacher = options.teacher;
    this.assignmentName = options.assignmentName;
    this.render();
  },

  events: {
    'click a.assignment': "gotoAssignment"
  },

  render: function(){
    this.$el.append('<a href = "#" class = "assignment">' + this.assignmentName + '</a>');
    return this;
  },
  
  gotoAssignment: function(){
    homeworkBuddy.app.navigate('/student/' + this.teacher + '/' + this.assignmentName, {trigger: true});
  }
})
