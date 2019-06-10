const Express = require("express");
const BodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
const cors = require('cors');

const prepareUrls = require('local-ip-url/prepareUrls');

const CONNECTION_URL = "mongodb+srv://yewjun:tonytong123@cluster0-cdir5.mongodb.net/test?retryWrites=true";
const DATABASE_NAME = "my_fyp_db";

var API_KEY = 'bdebc07c0ade68d24f93226601d2d96c-2416cf28-9724f44f';
var PUBLIC_API_KEY = 'pubkey-41c82a71d857e75030b0332b87b6869d';
var DOMAIN = 'sandboxed947f545b944559a3fc5fee8b9d825e.mailgun.org';
var mailgun = require('mailgun-js')({apiKey: API_KEY, domain: DOMAIN});
var public_mailgun = require('mailgun-js')({apiKey: PUBLIC_API_KEY, domain: DOMAIN});

var app = Express();
var database, collection;

app.use(cors());
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }))

app.listen(3001, () => {
    MongoClient.connect(CONNECTION_URL, { useNewUrlParser: true }, (error, client) => {
        if(error) {
            throw error;
        }
        database = client.db(DATABASE_NAME);
        collection = database.collection("user_details");
        collection.createIndex({"createdAt": 1 }, { expireAfterSeconds: 259200 });
        console.log("Connected to `" + DATABASE_NAME + "`!");
    });
});

app.post("/add", (request, response) => {
  console.log("triggered add user info api");
    database.collection(request.body.table).insert({...request.body.query, createdAt: new Date()}, (error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result.result);
    });
});

app.post("/addScanned", (request, response) => {
  console.log("triggered add to scanned table api");
    database.collection(request.body.table).insert(request.body.query, (error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result.result);
    });
});

app.post("/delete", (request, response) => {
  console.log("triggered delete api");
    database.collection(request.body.table).deleteOne(request.body.query, true, function(error, result) {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result.result);
    });
});

app.post("/getIP",  (request, response) => {
    response.send(
      prepareUrls({
        protocol: 'http',
        host: '0.0.0.0',
        port: 3000
      })
    );
});

app.post("/find", (request, response) => {
    console.log("find request: ", request);
    database.collection(request.body.table).find(request.body.query).toArray(function(error, result) {
      if(error) {
             return response.status(500).send(error);
         }
         console.log(result);

         response.send(result);
    })
});

app.post("/updateImg", (request, response) => {
    console.log("update request: ", request);
    console.log("update request: ", request.body);
    console.log("update request: ", request.body.newvalues);
    database.collection(request.body.table).update({_id: ObjectId(request.body.id)}, request.body.newvalues, function(error, result) {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result.result);
    });
});

app.post("/update", (request, response) => {
    console.log("update request: ", request);
    console.log("update request: ", request.body);
    console.log("update request: ", request.body.newvalues);
    database.collection(request.body.table).update({id: request.body.id}, request.body.newvalues, function(error, result) {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result.result);
    });
});

app.post("/sent", (request, response) => {
  console.log("HEHEHEHHE");
  mailgun.messages().send(request.body.data, (error, body) => {
    console.log("Email Sent Error", error);
    console.log("Email Sent Body", body);
    if(error) {
        next(error);
    }else{
        return response.send(body);
    }
  });
});

app.post("/validateEmail", (request, response) => {
  console.log(request.body.email);
  public_mailgun.validate(request.body.email, function (error, body) {
        return response.send(body);
  });
});
