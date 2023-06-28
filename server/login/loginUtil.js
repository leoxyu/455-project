const { LOGINS } = require('./loginValues');
const { MongoClient } = require('mongodb');


const LOGIN_STATUS = {
    LogInSuccess: "logInSuccess",
    LogInFailed: "logInFailed",
    TryRegister: "tryRegister",
    RegisterSuccess: "registerSuccess",
    RegisterFailed: "registerFailed",
    UnknownStatus: "unknownStatus"
}

const uri = "mongodb+srv://unifi:smOSKX8hMAYZhUFD@cluster.cojsppq.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

const databaseName = 'unifi';
const collectionName = 'users';

async function authenticateLogin(username, password) {
    await client.connect();

    try {
        // Specify the collection name and search for the user
        const database = client.db(databaseName);
        const collection = database.collection(collectionName);

        const foundUser = await collection.findOne({ user: username });

        if (foundUser) {
            if (foundUser.pass === password) {
                return LOGIN_STATUS.LogInSuccess;
            } else {
                return LOGIN_STATUS.LogInFailed;
            }
        } else {
            return LOGIN_STATUS.TryRegister;
        }
    } finally {
        await client.close();
    }
}

module.exports = {
    authenticateLogin,
    LOGIN_STATUS
};


// function authenticateLogin(user, pass) {
//     const foundUser = LOGINS.find((obj) => obj.user === user);
//     if (foundUser) {
//         if (foundUser.pass === pass) {
//             return LOGIN_STATUS.LogInSuccess;
//         } else {
//             return LOGIN_STATUS.LogInFailed;
//         }
//     } else {
//         return LOGIN_STATUS.TryRegister;
//     }
// };

// module.exports = {
//     authenticateLogin,
//     LOGIN_STATUS
// };