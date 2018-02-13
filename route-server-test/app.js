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
    db.query(sql, (err, result) => {
        if (err) throw err;
        // console.log(result);
        res.send('default route');
    });
});


// Create users table
app.get('/CreateUsersTable', (req, res) => {
    let sql = `id INT AUTO_INCREMENT,
                username VARCHAR(255) NOT NULL,
                password VARCHAR(255) NOT NULL,
                name TEXT,
                birth_date DATE,
                PRIMARY KEY (id),
                UNIQUE (username)`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send('Users table created...');
    });
});
// Create Friends table
app.get('/CreatefriendshipsTable', (req, res) => {
    let sql = `CREATE TABLE friendships (
                user_id INT,
                friend_id INT,
                date_added DATETIME DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (user_id, friend_id),
                FOREIGN KEY (user_id)
                REFERENCES users (id)
                ON DELETE CASCADE,
                FOREIGN KEY (friend_id)
                REFERENCES users (id)
                ON DELETE CASCADE)`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send('friendships table created...');
    });
});
// failed_login_attempts
app.get('/CreatefailedloginattemptsTable', (req, res) => {
    let sql = `CREATE TABLE failed_login_attempts (
                ip VARCHAR(255) NOT NULL,
                no_attempts INT NOT NULL,
                last_attempt DATETIME DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (ip))`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send('failed login table created...');
    });
});

// Create hobbies table
app.get('/createHobbiestable', (req, res) => {
    let sql = `CREATE TABLE hobbies (
        id INT AUTO_INCREMENT,
        name TEXT,
        PRIMARY KEY (id))`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send('Hobbit table created...');
    });
});

// Create user hobbies table
app.get('/createuserhobbies', (req, res) => {
    let sql = `CREATE TABLE user_hobbies (
        user_id INT,
        hobby_id INT,
        date_added DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id, hobby_id),
        FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE CASCADE,
        FOREIGN KEY (hobby_id)
        REFERENCES hobbies (id)
        ON DELETE CASCADE)`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send('hobbies table created...');
    });
});

// Insert adduser 1 
app.post('/addusers', (req, res) => {
    console.log(req.body);
    let sql = `INSERT INTO Users 
                ( username, password, name, birth_date) VALUES 
                ( 'LiorAgnin', '1111', 'Lior', '2010-11-20' ),
                ( 'SaulGoodman', '2222', 'Saul', '2011-11-19' ),
                ( 'MotiHaim', '3333', 'Moti', '2013-11-11' )
                ( 'DanielDani', '3333', 'Daniel', '2014-11-07' )
                ( 'TamirIsraeli', '4444', 'Tamir', '2015-11-02' )
                ( 'AmiTami', '5555', 'Ami', '2016-11-01' )`
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send(result);
    });
});
app.post('/addhobbies', (req, res) => {
    console.log(req.body);
    let sql = `INSERT INTO hobbies (name) VALUES
                ('Soccer'),
                ('Bowling'),
                ('Climbing'),
                ('Surfing'),
                ('Dancing'),
                ('Painting'),
                ('Jogging'),
                ('Tennis'),
                ('Photographing')`
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send(result);
    });
});
app.post('/addhobbytouser', (req, res) => {
    console.log(req.body);
    let sql = `INSERT INTO user_hobbies (user_id, hobby_id) VALUES
                (1,1),
                (1,2),
                (1,3),
                (1,4),
                (2,5),
                (2,1),
                (3,5),
                (3,3),
                (4,1),
                (5,1),
                (6,1),
                (6,7),
                (6,2),
                (6,3),
                `
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send(result);
    });
});
app.post('/addfriendtouser', (req, res) => {
    console.log(req.body);
    let sql = `INSERT INTO friendships (user_id, friend_id) VALUES
                (1,2),
                (2,1),
                (3,5),
                (3,4),
                (4,1),
                (5,1),
                (6,1),
                (6,5),
                (6,2)
                `;
    let query = db.query(sql, (err, results) => {
        if (err) {
            console.log(err);
        } else {
            res.send(results);
        }
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

// find by friend id
app.get('/findbyfriendid/:id', (req, res) => {
    let sql = `SELECT hobbies.name FROM hobbies 
                LEFT JOIN user_hobbies ON user_hobbies.hobby_id = hobbies.id 
                WHERE user_hobbies.user_id = '${req.params.Id}'`;
    let query = db.query(sql, (err, results) => {
        if (err) throw err;
        console.log(results);
        res.send(results);
    });
});

// find friend by id
app.get('/findbyuserid/:Id', (req, res) => {
    let sql = `SELECT hobbies.name FROM hobbies 
                LEFT JOIN user_hobbies ON user_hobbies.hobby_id = hobbies.id 
                WHERE user_hobbies.user_id ='${req.params.Id}'`;
    let query = db.query(sql, (err, results) => {
        if (err) throw err;
        console.log(results);
        res.send(results);
    });
});
// // find user
// app.get('/finduser', (req, res) => {
//     let sql = `SELECT * FROM users WHERE username = '${req.params.Id}'`;
//     let query = db.query(sql, (err, results) => {
//         if (err) throw err;
//         console.log(results);
//         res.send(results);
//     });
// });
function FindUser(username) {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM users WHERE username = ?', [username]).then((res) => {
            resolve(res)
        }).catch(() => {
            reject()
        })
    });
}

// add friend to user
app.post('/addfriendtouser', (req, res) => {
    if (req.params.user_id === req.params.friend_id) {
        reject('A user cannot be friend themselves');
        return;
    }
    fifoCheckAndRemove('friendships', req.params.user_id, 5).then(() => {
        db.query('INSERT INTO ' + table_name + ' (user_id, friend_id) VALUES (?, ?)', [req.params.user_id, req.params.friend_id]).then(() => {
            resolve()
        }).catch(() => {
            reject()
        })
    }).catch(() => {
        reject()
    })
});

// fifo check and remove user
function fifoCheckAndRemove(table_name, user_id, max_amount) {
    return new Promise((resolve, reject) => {
        db.query('SELECT user_id FROM ' + table_name + ' WHERE user_id = ?', [user_id]).then((res) => {
            if (res.length >= max_amount) {
                db.query('DELETE FROM ' + table_name + ' WHERE date_added IS NOT NULL AND user_id = ? order by date_added asc LIMIT 1', [user_id]).then(() => {
                    resolve()
                }).catch(() => {
                    reject()
                })
            } else {
                resolve()
            }
        })
    });
}

// find friends of Friends 2 weeks birthday
app.get('/findfriendsofFriends2weeksbirthday/:id', (req, res) => {
    let now = new Date();
    let twoWeeks = 1000 * 60 * 60 * 24 * 14;
    let twoWeeksFromNow = new Date(new Date().getTime() + twoWeeks);
    let sql = `SELECT users.id, users.name, users.birth_date 
            FROM friendships f 
            JOIN users ON ( 
            (f.friend_id = users.id AND f.user_id = ?) 
            OR (f.friend_id = users.id AND f.user_id IN (SELECT friend_id FROM friendships f WHERE f.user_id = ?)))  
            WHERE (DATE_FORMAT(users.birth_date, '%c-%d') >= DATE_FORMAT(?, '%c-%d') AND DATE_FORMAT(users.birth_date, '%c-%d') 
            <= DATE_FORMAT(?, '%c-%d'))
            AND users.id <> ?
            GROUP BY users.id, users.name`;
    let query = db.query(sql, [req.params.id, req.params.id, now, twoWeeksFromNow, id], (err, result) => {
        if (err) throw err;
        console.log(result);
    });
});

// Find Potential Friends
app.get('/findpotentialfriends/:username', (req, res) => {
    this.FindUser(req.params.username).then((user) => {
        if (user[0]) {
            user = user[0],
                fiveDays = 1000 * 60 * 60 * 24 * 5,
                fiveDaysAgo = new Date(new Date(user.birth_date).getTime() - fiveDays),
                fiveDaysfromNow = new Date(new Date(user.birth_date).getTime() + fiveDays);
            db.query(`SELECT users.name 
                        FROM users 
                        JOIN user_hobbies ON (user_hobbies.user_id = users.id) 
                        WHERE (DATE_FORMAT(users.birth_date, '%c-%d') >= DATE_FORMAT(?, '%c-%d') AND DATE_FORMAT(users.birth_date, '%c-%d') <= DATE_FORMAT(?, '%c-%d')) 
                        AND user_hobbies.hobby_id IN (SELECT hobbies.id FROM hobbies LEFT JOIN user_hobbies ON user_hobbies.hobby_id = hobbies.id WHERE user_hobbies.user_id = ?) 
                        AND users.id <> ?
                        GROUP BY users.name`, [fiveDaysAgo, fiveDaysfromNow, user.id, user.id]).then((friends) => {
                let friendsArr = [];
                friends.forEach(friend => {
                    friendsArr.push(friend.name);
                });
                resolve(friendsArr)
            }).catch(() => {
                reject()
            })
        } else {
            resolve([])
        }
    }).catch(() => {
        reject()
    })

})

function FindUpcomingBirthdays(user_id) {
    return new Promise((resolve, reject) => {
        let now = new Date();
        let lastDayOfYear = new Date(new Date().getFullYear(), 11, 31);
        db.query(`SELECT users.name 
                    FROM users 
                    WHERE (DATE_FORMAT(users.birth_date, '%c-%d') >= DATE_FORMAT(?, '%c-%d') 
                    AND DATE_FORMAT(users.birth_date, '%c-%d') <= DATE_FORMAT(?, '%c-%d'))
                    AND users.id <> ?`,
        [now, lastDayOfYear, user_id]).then((friends) => {
            let friendsArr = [];
            friends.forEach(friend => {
                friendsArr.push(friend.name);
            });
            resolve(friendsArr)
        }).catch(() => { reject() })
    });
}

// write to log file example
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