/*********************************************************************************
*  WEB700 – Assignment 04
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Ieko Molina Student ID 112614227 Date: 07/06/2023
*
*  Online (Cycliic) Link: https://spring-green-hare-wrap.cyclic.app/
*
********************************************************************************/ 
 

var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var app = express();
var cData = require("./modules/collegeData");
var router = express.Router();

// Create app.use for the views
app.use(express.static('./views'));

//Create app.use for the public
app.use(express.static('./public'));
app.use('/css', express.static(__dirname + 'public/css'))

//Json Middleware
app.use(express.json());

//Adding body-parser
app.use(express.urlencoded({extended:true}))

app.get("/students", (req, res) => {``
    if (Object.keys(req.query).length > 0) {
        var param1Value = req.query.course; // Get the Parameters
        console.log(param1Value)
        cData.getStudentsByCourse(param1Value)
        .then((filteredStudents) => {
            res.send(filteredStudents);
        })
        .catch((error) => {
            console.log({message:"No Results from Course"});
        });
    } 
    else {
        cData.getAllStudents()
        .then((students) => {
            res.send(students);
        })
        .catch((error) => {
            console.log({message:"No Results"});
        });
    }
});

app.get("/tas", (req, res) => {
    cData.getTAs()
    .then((filteredStudents) => {
        res.send(filteredStudents);
    })
    .catch((error) => {
        console.log({message:"no results"});
    });
});

app.get("/courses", (req, res) => {
    cData.getCourses()
    .then((courses) => {
        res.send(courses);
    })
    .catch((error) => {
        console.log({message:"no results"});
    });
});

app.get('/student/:id', (req, res) => {
  const studentId = req.params.id;
  cData.getStudentByNum(studentId)
  .then((foundStudent) => {
      res.send(foundStudent);
  })
  .catch((error) => {
      console.log({message:"no results"});
  });
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/home.html');
});

app.get('/about', (req, res) => {
    res.sendFile(__dirname + '/views/about.html');
});

app.get('/htmlDemo', (req, res) => {
    res.sendFile(__dirname + '/views/htmlDemo.html');
});

app.get('/students/add', (req, res) => {
    res.sendFile(__dirname + '/views/addStudent.html');
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
