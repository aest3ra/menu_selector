const express = require('express');
const config = require('../config/config')
const conn = require('../config/db')
const conn2 = require('../config/db2')
const router = express.Router();
//const LoginService = require('../service/LoginService');
const RegisterService = require('../service/RegisterService');
const jwt = require("jsonwebtoken");
var cookieParser = require('cookie-parser')
var multer = require('multer'); 
//const path = require("path");
const fs = require('fs');
const spawn = require('child_process').spawn;

var storage  = multer.diskStorage({ 
    destination(req, file, cb) {
        cb(null, 'upload/');
    },
    filename(req, file, cb) {
        cb(null, file.originalname);
    },
});
var upload = multer({ dest: 'upload/' }); 
var uploadWithOriginalFilename = multer({ storage: storage }); 

router.use(cookieParser())
router.get('/', (req, res, next) => {
    var sql1 = "SELECT * FROM user;";
    var sql2 = "SELECT * FROM sns ORDER BY idx DESC;";

    conn.query(sql1+sql2, (err, rows) => {
		if (err) console.log("query is not excuted. select fail!\n" + err);
		else{

            let authHeader = req.headers["cookie"];
            let token = authHeader && authHeader.split("=")[1];
        
            jwt.verify(token, config.SECRET_KEY, 
                function(err, decoded){
                    if(decoded) return res.render("index.ejs", {username: decoded, info: rows[0], list: rows[1], auth: 1});
                    else return res.render("index.ejs", { list: rows[1], auth: -1 });
                }
                    
            )
        }
        
	});
	
});

router.use(express.json());
router.post('/login', (req, res, next) => {
    const loginID = req.body.userID 
    const loginPW = req.body.userPW

    var sql = `SELECT * FROM user WHERE uid = "${loginID}"`;

    conn.query(sql, (err, row) => {
            var userID = row[0].uid;
            var userPW = row[0].upw;

        if (loginID === userID && loginPW === userPW) {
            token = jwt.sign({
                type: 'JWT',
                name: userID,
              }, config.SECRET_KEY, {
                expiresIn: '30m', 
              });
            
              res.cookie('jwt',token)
              return res.status(200).send("<script>alert('login!');window.location.replace('/')</script>");
        }else{
            res.send("<script>alert('비밀번호가 틀렸습니다');window.location.replace('/')</script>");
        }
    });
});

router.get('/logout', (req, res, next) => {
    return res.clearCookie('jwt').send("<script>alert('로그아웃 되었습니다');window.location.replace('/')</script>");
});

router.get('/register', (req, res, next) => {
    return res.status(200).render("register")
});

router.post('/register', (req, res, next) => {
    const registerInfo = req.body; 
    const RegisterResult = RegisterService.doRegister(registerInfo);
    if(RegisterResult) return res.status(200).send("<script>alert('회원가입 완료');window.location.replace('/')</script>");
    else return res.send("error");
});

router.post('/share', uploadWithOriginalFilename.single('inputFile'), (req, res, next) => {
    if(!req.file){
        var sql = "insert into sns (uid, content) values (?, ?);";
        params = [req.body.uid, req.body.message];
    }
    if(!req.file && !req.body.message){return res.redirect("/");}

    else{
        var sql = "insert into sns (uid, content, file) values (?, ?, ?);";
        params = [req.body.uid, req.body.message, req.file.filename];
        
        var filename = "./upload/"+req.file.filename

        const classresult = spawn('python', ['./imagetraining.py', filename, req.body.uid]);

        classresult.stdout.on('data', function(data) {
            console.log(data.toString());
            conn.query(sql, params, function (err, rows) {
                if (err) console.log("query is not excuted. insert fail!\n" + err);
            });
        });
        classresult.stderr.on('data', function(data) {console.log(data.toString());});
    } 
	res.redirect("/");
});

router.get('/img/:filename', (req, res, next) => {
    const filename = req.params.filename

    fs.readFile("./upload/"+filename, (err ,data) => {
        res.writeHead(200, {'Content-type': 'text/html'});
        res.end(data);
    });
});

router.get('/like/:filename', (req, res, next) => {
    const filename = req.params.filename
    const userid = req.param('username')
    var sql = `select class from sns where file='${filename}'`

    conn.query(sql, function (err, rows) {
		if (err) console.log("query is not excuted. insert fail!\n" + err);
        cla = rows[0]['class']
        sql2 = `UPDATE ${userid} SET ${cla} = ${cla} + 1 where con = 1`

        conn2.query(sql2, function (err, rows) {
            if (err) console.log("query is not excuted. insert fail!\n" + err);
            
        });
    });
});

router.get('/recommend', (req, res, next) => {
    var sql1 = "SELECT * FROM user;";
    var sql2 = "SELECT * FROM sns ORDER BY idx DESC;";

    conn.query(sql1+sql2, (err, rows) => {
		if (err) console.log("query is not excuted. select fail!\n" + err);
		else{

            let authHeader = req.headers["cookie"];
            let token = authHeader && authHeader.split("=")[1];
        
            jwt.verify(token, config.SECRET_KEY, 
                function(err, decoded){
                    if(decoded) return res.render("recommend.ejs", {username: decoded, info: rows[0], list: rows[1], auth: 1});
                    else return res.render("recommend.ejs", { list: rows[1], auth: -1 });
                }
                    
            )
        }
        
	});
});
router.post('/recommend', (req, res, next) => {
    inputID=req.body.friends
    var friends = inputID.split(",")
    friends.push(req.body.uid)
    
    const classresult = spawn('python', ['./rule.py', friends]);

    classresult.stdout.on('data', function(data) {
        var selectedmenu = data.toString().replace("\r\n", "").split(",")
        var sql1 = `select * from menu where class = '${selectedmenu[0]}';`
        var sql2 = `select * from menu where class = '${selectedmenu[1]}';`
        var sql3 = `select * from menu where class = '${selectedmenu[2]}';`
        var sql = sql1+sql2+sql3

        conn.query(sql, function (err, rows) {
            if (err) console.log("query is not excuted. insert fail!\n" + err);
            return res.render("result.ejs", { list1: rows[0], list2: rows[1], list3: rows[2] });
            
        });
    });
    classresult.stderr.on('data', function(data) {console.log(data.toString());});

});

module.exports = router;