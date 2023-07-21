/*********************************************************************************
*  WEB700 – Assignment 05
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Ieko Molina Student ID 112614227 Date: 07/20/2023
*
*  Online (Cycliic) Link: 
*
********************************************************************************/ 
 

var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var app = express();
var cData = require("./modules/collegeData");
var router = express.Router();
const exphbs = require("express-handlebars");

// Setup handlebars and helpers
app.engine(".hbs", exphbs.engine(
    { 
        extname: ".hbs",
        helpers: {
            navLink: function(url, options){
                return '<li' + 
                    ((url == app.locals.activeRoute) ? ' class="nav-item active" ' : ' class="nav-item" ') + 
                    '><a class="nav-link" href="' + url + '">' + options.fn(this) + '</a></li>';
            },
            equal: function (lvalue, rvalue, options) {
                if (arguments.length < 3)
                    throw new Error("Handlebars Helper equal needs 2 parameters");
                if (lvalue != rvalue) {
                    return options.inverse(this);
                } else {
                    return options.fn(this);
                }
            }
        }
        
    }));
app.set("view engine", ".hbs");

// Create app.use for the views
app.use(express.static('./views'));

//Create app.use for the public
app.use(express.static('./public'));
app.use('/css', express.static(__dirname + 'public/css'))

//Json Middleware
app.use(express.json());

//Adding body-parser
app.use(express.urlencoded({extended:true}))

//Middleware function to fix "Active" item in menu bar
app.use(function(req,res,next){
    let route = req.path.substring(1);
    app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));    
    next();
});

app.get("/students", (req, res) => {``
    if (Object.keys(req.query).length > 0) {
        var param1Value = req.query.course; // Get the Parameters
        console.log(param1Value)
        cData.getStudentsByCourse(param1Value)
        .then((filteredStudents) => {
            //res.send(filteredStudents);
            res.render("students", {students: filteredStudents});
        })
        .catch((error) => {
            res.render("students", {message: "no results"});
        });
    } 
    else {
        cData.getAllStudents()
        .then((students) => {
            res.render("students", {students: students});
        })
        .catch((error) => {
            res.render("students", {message: "no results"});
        });
    }
});

app.get("/courses", (req, res) => {
    cData.getCourses()
    .then((courses) => {
        //res.send(courses);
        res.render("courses", {courses: courses});
    })
    .catch((error) => {
        res.render("courses", {message: "no results"});
    });
});

app.get('/student/:id', (req, res) => {
  const studentId = req.params.id;
  cData.getStudentByNum(studentId)
  .then((foundStudent) => {
      //res.send(foundStudent);
      res.render("student", { student: foundStudent }); 
  })
  .catch((error) => {
      console.log({message:"no results"});
  });
});

// Get Course by ID
app.get('/course/:id', (req, res) => {
    const courseId = req.params.id;
    cData.getCourseById(courseId)
    .then((foundCourse) => {
        //res.send(foundCourse);
        res.render("course", { course: foundCourse }); 
    })
    .catch((error) => {
        console.log({message:"no results"});
    });
  });
app.get('/', (req, res) => {
    //res.sendFile(__dirname + '/views/home.html');
    res.render('home');
});

app.get('/about', (req, res) => {
    //res.sendFile(__dirname + '/views/about.html');
    res.render('about');
});

app.get('/htmlDemo', (req, res) => {
    //res.sendFile(__dirname + '/views/htmlDemo.html');
    res.render('htmlDemo');
});

app.get('/students/add', (req, res) => {
    //res.sendFile(__dirname + '/views/addStudent.html');
    res.render('addStudent');
});

//Post Route
app.post("/students/add", (req, res) => {
    const studentInfo = req.body
    cData.addStudent(studentInfo)
    .then(() => {
        cData.getAllStudents()
        .then((students) => {
            res.send(students);
        })
        .catch((error) => {
            console.log({message:"No Results"});
        });
    })
    .catch((error) => {
        console.log({message:"no results"});
    });
});

// Post route for student update
app.post("/student/update", (req, res) => {
    const studentData = req.body;
    cData.updateStudent(studentData)
    .then(() => {
        res.redirect("/students");
    })
    .catch((error) => {
        console.log({message:"no results"});
    });
});

app.use((req,res) => {
    res.status(404);
    res.send(`<h1>Error 404: Page Not Found </h1>`);
})

cData.initialize()
.then(() => {
    // setup http server to listen on HTTP_PORT
    app.listen(HTTP_PORT, ()=> {console.log("server listening on port: " + HTTP_PORT);
    });
})

.catch((err) => { 
    console.log('Initialization Failed');
});
