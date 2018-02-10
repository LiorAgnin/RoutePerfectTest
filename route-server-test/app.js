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
    //let sql = 'DROP TABLE users';
    let sql = 'SELECT * FROM Hobbits';
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
            Birthday VARCHAR(20),
            HobbitsID VARCHAR(255), 
            FriendsID VARCHAR(255), 
            PRIMARY KEY(Id))`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send('Users table created...');
    });
});

// Create hobbits table
app.get('/createhobbitstable', (req, res) => {
    let sql = `CREATE TABLE Hobbits (
        Id int AUTO_INCREMENT,
        Hobbit VARCHAR(255),
        PRIMARY KEY(Id)
      )`;
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
                ( First_Name, Last_Name, Password, Birthday, HobbitsID, FriendsID) VALUES 
                ('${req.body.First_Name}','${req.body.Last_Name}', '${req.body.Password}', '${req.body.Birthday}', '${req.body.HobbitsID}', '${req.body.FriendsID}')`;
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
        let SignInCounter = 0;
        store.subscribe(() =>
            this.SignInCounter = store.getState()
        );
        console.log(req.body);
        let sql = `SELECT Id,HobbitsId
            FROM users 
            WHERE Password = '${req.body.Password}' 
            AND First_Name = '${req.body.First_Name}'`;
        console.log(sql)
        let query = db.query(sql, (err, result) => {
            if (err) {
                // throw err
                store.dispatch({
                    type: 'INCREMENT'
                });
                if (SignInCounter == 5) {
                    let currentDate = new Date.now();
                    console.log(req.connection.remoteAddress,
                        req.connection.remotePort,
                        req.connection.localAddress,
                        req.connection.localPort);
                    console.log(currentDate, this.SignInCounter)
                    let signInDetailFailure =
                        'But still I\'m having memories of high' +
                        'speeds when the cops crashed\n' +
                        'As I laugh, pushin the gas while my Glocks blast\n' +
                        'We was young and we was dumb but we had heart';
                    fs.writeFile('log.txt', signInDetailFailure, (err) => {
                        if (err) throw err;
                    });
                }
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
    // console.log(req.param('Id'),req.params)
    let sql = `SELECT * FROM users WHERE Id = '${req.query['Id']}'`;
    let query = db.query(sql, (err, results) => {
        if (err) throw err;
        console.log(results);
        res.send(results);
    });
});

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
// get hobbits
app.get('/gethobbit', (req, res) => {
    let tempVal = req.query.Id;
    let arr = tempVal.split(",").map((val) => {
        // String.prototype
        return Number(val) + 1;
    });
    console.log(arr);
    let sql; // = `SELECT Id, Hobbit FROM Hobbits WHERE Id = '${arrOfHobbitIds[0]}'`;
    console.log(arr[3]);
    for (let i = 0; i < arr.length; i++) {
        sql = `SELECT Id, Hobbit FROM Hobbits WHERE Id = '${arr[i]}'`;

    }
    let query = db.query(sql, (err, result) => {
        if (err) console.log(err);
        console.log(result);
        res.send(result);
    });
});
// Update post
// app.get('/updatepost/:id', (req, res) => {
//     let newTitle = 'Updated Title';
//     let sql = `UPDATE posts SET title = '${newTitle}' WHERE id = ${req.params.id}`;
//     let query = db.query(sql, (err, result) => {
//         if(err) throw err;
//         console.log(result);
//         res.send('Post updated...');
//     });
// });

// Delete post
// app.get('/deletepost/:id', (req, res) => {
//     let newTitle = 'Updated Title';
//     let sql = `DELETE FROM posts WHERE id = ${req.params.id}`;
//     let query = db.query(sql, (err, result) => {
//         if(err) throw err;
//         console.log(result);
//         res.send('Post deleted...');
//     });
// });


app.listen('3000', () => {
    console.log()
})