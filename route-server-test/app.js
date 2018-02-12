const express = require('express');
const mysql = require('mysql');
const fs = require('fs');
const _ = require('lodash');
const redux = require('redux');
const bodyParser = require('body-parser');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'social-media'
});
const app = express();

function counter(state = 0, action) {
    switch (action.type) {
        case 'INCREMENT':
            return state + 1
        default:
            return state
    }
}
let store = redux.createStore(counter)
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('MySql Connected...');
});


app.get('/', (req, res) => {
    let sql = 'SELECT * FROM Hobbies';
    db.query(sql, (err, result) => {
        if (err) throw err;
        // console.log(result);
        res.send('created...');
    });
});


// Create users table
app.get('/CreateUsersTable', (req, res) => {
    let sql = `CREATE TABLE Users
            (Id int AUTO_INCREMENT,
            First_Name VARCHAR(20),
            Last_Name VARCHAR(20),
            Password VARCHAR(40),
            Birthday date, 
            PRIMARY KEY(Id))`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send('Users table created...');
    });
});
// Create Friends table
app.get('/CreateFriendsTable', (req, res) => {
    let sql = `CREATE TABLE Friends
            (Id int AUTO_INCREMENT,
            FriendId int NOT NULL,          
            UserId int NOT NULL,            
            PRIMARY KEY(Id),
            FOREIGN KEY (UserId) REFERENCES Users(UserId))`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send('Friends table created...');
    });
});


// Create Ip table
app.get('/CreateIpTable', (req, res) => {
    let sql = `CREATE TABLE Ip
                (Id int AUTO_INCREMENT,
                IpAdress VARCHAR(50),          
                UserId int NOT NULL,            
                Tries int,
                PRIMARY KEY(Id),
                FOREIGN KEY (UserId) REFERENCES Users(Id))`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send('Friends table created...');
    });
});


// Create hobbits table
app.get('/createHobbiestable', (req, res) => {
    let sql = `CREATE TABLE Hobbits (
        Id int AUTO_INCREMENT,
        Hobby VARCHAR(255),
        PRIMARY KEY(Id))`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send('Hobbit table created...');
    });
});


// Insert adduser 1 
app.post('/adduser', (req, res) => {
    console.log(req.body);
    let sql = `INSERT INTO Users 
                ( First_Name, Last_Name, Password, Birthday, HobbitsID) VALUES 
                ('${req.body.First_Name}','${req.body.Last_Name}', '${req.body.Password}', '${req.body.Birthday}', '${req.body.HobbitsID}')`;
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send(result);
    });
});

function isValid(First_Name, Password) {
    let valid = false;
    if ((First_Name || Password) == '' || null || undefined) {
        // return 'Please fill all fields';
    } else {
        // return 'Ok'
        valid = true;
    }
    return valid;
}
// Insert login 
app.post('/login', (req, res) => {
    if (isValid(req.body.First_Name, req.body.Password)) {
        let post = {
            Password: `${req.body.Password}`,
            First_Name: `${req.body.First_Name}`
        };
        console.log(req.body);
        let sql = `SELECT Id,HobbitsId
            FROM users 
            WHERE Password = '${req.body.Password}' 
            AND First_Name = '${req.body.First_Name}'`;
        console.log(sql);
        let query = db.query(sql, (err, result) => {
            if (err) {

            } else {
                console.log(err, result)
                res.send(result);
            }
        });
    } else {
        res.send('Please fill both fileds');
    }
});

// get user
app.get('/getuser', (req, res) => {
    let sql = `SELECT * FROM users WHERE Id = '${req.query['Id']}'`;
    let query = db.query(sql, (err, results) => {
        if (err) throw err;
        console.log(results);
        res.send(results);
    });
});

//bithdays 
app.get('/checkfriendsnumber', (req, res) => {
    console.log(req.query['Id']);
    let sql = `SELECT FriendId FROM Friends WHERE UserId = '${req.query['Id']}'`;
    let query = db.query(sql, (err, results) => {
        if (err) {
            console.log(err);
        } else {
            console.log(results);
            res.send(results);
        }
    });
});


// Birthdays in upcoming 2 weeks
// SELECT * 
// FROM  users 
// WHERE  DATE_ADD(Birthday, 
//                 INTERVAL YEAR(CURDATE())-YEAR(birthday)
//                          + IF(DAYOFYEAR(CURDATE()) > DAYOFYEAR(birthday),1,0)
//                 YEAR)  
//             BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY)


// select friends name
// select username from users u
// inner join friends f on f.friendid = u.iduser
// where f.iduser = 1

// RETURN FRIENDS OF FRIENDS 
// SELECT DISTINCT 
//     u.Id, 
//     u.First_Name, 
//     u.Birthday 
//     FROM friends a 
//     INNER JOIN friends b ON a.FriendId = b.UserId 
//     INNER JOIN users u ON u.Id = b.FriendId 
//     WHERE U.Id = '3' 
//     AND b.FriendId <> a.UserId

app.get('/birthdayintwoweeks', (req, res) => {
    let sql = `SELECT * FROM users 
                WHERE  DATE_ADD(Birthday, 
                INTERVAL YEAR(CURDATE())-YEAR(birthday)
                + IF(DAYOFYEAR(CURDATE()) > DAYOFYEAR(Birthday),1,0)
                    YEAR)  
                BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 14 DAY)
                ORDER BY Birthday`;
    let query = db.query(sql, (err, result) => {
        if(err) throw err;
        console.log(result);
        res.send('Post updated...');
    });
});
app.post('/addfriend', (req, res) => {
    console.log(req.body);
    let sql = `INSERT INTO Friends (UserId, FriendId)  
               VALUES(${req.body.IdToAddTo} , ${req.body.FriendTo})`;
    let query = db.query(sql, (err, results) => {
        if (err) {
            console.log(err);
        } else {
            res.send(results);
        }
    });
});
// let currentDate = new Date.now();
// console.log(req.connection.remoteAddress,
//     req.connection.remotePort,
//     req.connection.localAddress,
//     req.connection.localPort);
// console.log(currentDate, this.SignInCounter)
// let signInDetailFailure =
//     'But still I\'m having memories of high' +
//     'speeds when the cops crashed\n' +
//     'As I laugh, pushin the gas while my Glocks blast\n' +
//     'We was young and we was dumb but we had heart';
// fs.writeFile('log.txt', signInDetailFailure, (err) => {
//     if (err) throw err;
// });
// getUserHobbit(IdsAr) {
//   for (let i = 0; i < IdsAr.length; i++) {
//     this._HobbitsService.GetHobbits(IdsAr[i])
//       .subscribe(res =>
//         console.log(res)
//       );

//     this.HobbitsArray.push({
//       Id:,
//       Hobbit: 
//     })
//   }
// }

app.get('/gethobby', (req, res) => {
    let Id = req.query.Id;
    console.log(arr);
    let sql = `SELECT Id, Hobbit FROM Hobbits WHERE Id = '${Id}'`;
    console.log(arr[3]);
    let query = db.query(sql, (err, result) => {
        if (err) console.log(err);
        console.log(result);
        res.send(result);
    });
});
app.get('/getfriends/:Id', (req, res) => {
    let sql = `SELECT First_Name, Last_Name, Birthday FROM users u INNER JOIN friends f on f.FriendId = u.Id WHERE F.UserId = ${req.params.Id}`;
    let query = db.query(sql, (err, result) => {
        if (err) console.log(err);
        res.send(result);
    });
});



app.listen('3000', () => {
    console.log()
})