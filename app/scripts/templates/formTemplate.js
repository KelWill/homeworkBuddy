homeworkBuddy.templates.formTemplate = '<form class = "teacher login hide container text-center" action="/login/teacher" method="post">\
    <div>\
        <label>Username:</label><br>\
        <input type="text" name="username" placeholder = "Username"/>\
    </div>\
    <div>\
    <label>Password:</label><br>\
        <input type="password" name="password" placeholder = "Password"/>\
    </div>\
    <div>\
        <input type="submit" value="Log In"/>\
    </div>\
</form>\
<form class = "student login hide container text-center" action="/login/student" method="post">\
    <div>\
    <label>Username:</label><br>\
        <input type="text" name="username" placeholder = "Username"/>\
    </div>\
    <div>\
    <label>Password:</label><br>\
        <input type="password" name="password" placeholder = "Password"/>\
    </div>\
    <div>\
        <input type="submit" value="Log In"/>\
    </div>\
</form>\
<form class = "teacher signup hide container text-center" action="/signup/teacher" method="post">\
    <div>\
    <label>Username:</label><br>\
        <input type="text" name="username" placeholder = "How students find you"/>\
    </div>\
    <div>\
    <label>Email:</label><br>\
        <input type="text" name="email" placeholder = "optional"/>\
    </div>\
    <div>\
    <label>Password:</label><br>\
        <input type="password" name="password" placeholder = "Password"/>\
    </div>\
    <div>\
        <input type="submit" value="Sign Up"/>\
    </div>\
</form>\
<form class = "student signup hide container text-center" action="/signup/student" method="post">\
    <div>\
    <label>Username:</label><br>\
        <input type="text" name="username" placeholder = "Visible to teacher"/>\
    </div>\
    <div>\
        <label>Email:</label><br>\
        <input type="text" name="email" placeholder = "optional"/>\
    </div>\
    <div>\
        <label>Password:</label><br>\
        <input type="password" name="password" placeholder = "Password"/>\
    </div>\
    <div>\
        <input type="submit" value="Sign Up" role = "button"/>\
    </div>\
</form>'