const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
//html 렌더링 설정
const morgan = require('morgan');
const cookieparser = require('cookie-parser');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
var hasher = require('pbkdf2-password')();
const fs = require('fs');
const flash = require('connect-flash');
const cors = require('cors');
//부가 기능들




app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
//html파일을 ejs라는 파일을 통해 클라이언트의 브라우저에 뿌려주는 역할



app.use(express.urlencoded({
    extended: false
}));
// querystring 모듈 사용



app.use(express.static(path.join(__dirname, 'public')));
//public 폴더로 


app.use(cookieparser());
//cookie 사용할때 쓰는것

app.use(session({
    secret: '1A@W#E$E',
    resave: false,
    saveUninitialized: true,
    store: new FileStore()
}));
//session-file-store 사용할때 쓰는것 

app.use(cors());

app.use(morgan('dev'));
//morgan 사용할때 쓰는것

app.use(flash());
//flash 사용
app.use(function (req, res, next) {
    res.locals.test2 = req.session.user;
    next();
});




//app서버에 testrouter 미들웨어 등록
var testrouter = require('./router/testrouter');

//var apirouter = 

// app.use('/test', testrouter);





var sampleUserList = {};
//sampleUserList 선언


//sampleUserList.push(user)
// fs.writeFileSync('data/userlist.json', JSON.stringify(sampleUserList));
if (fs.existsSync('data/userlist.json')) {
    let rawdata = fs.readFileSync('data/userlist.json');
    sampleUserList = JSON.parse(rawdata);
    console.log(sampleUserList);
}
//만약 


// 기본 페이지
app.get('/', (req, res) => {
    res.render('first_page.html')
})
// ~~/ 로 끝나는 기본 페이지
// (/로 끝나면 first_page.html로 이동한다는 의미)
// 여기에서 두 경로로 이동가능 (회원가입페이지, 로그인페이지)



app.post('/gosignup', (req, res) => {
    res.render('signup_page.html');
})
//회원가입 버튼(gosignup)을 누르면 회원가입 페이지로 이동합니다.



app.post('/gosignin', (req, res) => {
    res.render('signin_page.html');
})
//로그인 버튼(gosignin)을 누르면 로그인 페이지로 이동합니다.



// 회원가입 페이지
app.get('/signup_page', (req, res) => {
    res.render('signup_page.html');
})
// ~~/signup_page인 회원가입 페이지


app.get('/api/carlist', (req, res) => {
    res.json(sampleCarList);
})




app.post('/signup', (req, res) => {
    console.log('signup 요청');
    console.log(req.body);
    let userid = req.body.userid;
    let password = req.body.password;
    let name = req.body.name;
    let email = req.body.email;
    console.log('userid = ', userid);
    console.log('password = ', password);
    console.log('name = ', name);
    console.log('email = ', email);
    res.render('first_page.html');
    //회원가입을 완료한 후 버튼을 누르면 다시 first 페이지로 이동합니다.


    hasher({
        password: req.body.password
    }, (err, pass, salt, hash) => {
        if (err) {
            console.log('ERR: ', err);
            res.redirect('/signup_form');
        }
        let user = {
            userid: userid,
            password: hash,
            salt: salt,
            name: name,
            email: email
        }

        //sampleUserList.push(user);
        sampleUserList[userid] = user;
        fs.writeFileSync('data/userlist.json', JSON.stringify(sampleUserList, null, 2));

        console.log('user added : ', user);
        res.redirect('/signin_form');

        //입력된 정보들을 userlist.json 파일에 추가합니다.
        //(비밀번호는 hash함수처리해서 안전하게 처리합니다.)
    });

})




// 로그인 페이지
app.get('/signin_page', (req, res) => {
    res.render('signin_page.html');
})
// ~~/signin_page인 로그인 페이지



app.post('/gomain', (req, res) => {
    console.log('signin');
    console.log(req.body);
    res.render('main_page.html');
})
//로그인 완료 버튼(gomain)을 누르면 메인 페이지로 이동합니다.





// // 메인 페이지
// app.get('/main_page', (req, res) => {
//     res.render('main_page.html');
// })
// // ~~/main_page인 로그인 페이지 ->원래 폼




// 메인 페이지
app.get('/main_page', (req, res) => {
    console.log(req.session.user);
    if (req.session.user) {
        res.render('main_page.html', {
            test1: req.session.user
        });    
    }
    else {
        res.redirect('signin_page');
    }
})
// ~~/main_page인 로그인 페이지
//이용자 리스트에 있으면 받고 아니면 튕기는


var mysqlPool = require('./router/mysqlpool')();

app.use('/mysql', mysqlPool);














app.post('/signin', (req, res) => {

    console.log(req.body);
    let userid = req.body.id;
    let password = req.body.password;
    console.log('userid = ', userid);
    console.log('password = ', password);
    console.log('userlist = ', sampleUserList);

    
    let user = sampleUserList[userid];

    if (user) {
        hasher({
            password: password,
            salt: user.salt
        }, function (err, pass, salt, hash) {
            if (err) {
                console.log('ERR : ', err);
                //req.flash('fmsg', '오류가 발생했습니다.');
                res.redirect('signin_page')
            }
            console.log(hash)
            console.log(user.password)


            if (hash === user.password) {
                console.log('INFO : ', userid, ' 로그인 성공')

                req.session.user = user;
                console.log('========');
                console.log(req.session.user);
                req.session.save(function () {
                    res.redirect('/main_page');
                })
                return;
            } else {
                // req.flash('fmsg', '패스워드가 맞지 않습니다.');
                console.log('패스워드 오류');
                res.redirect('signin_page')
            }
        });


    } else {
        res.redirect('signin_page')
    }
});


















app.listen(port, () => {
    console.log('server listening...' + port);
});
//끝냅니다.

