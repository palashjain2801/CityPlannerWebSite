const express = require('express');
const app = express();
const port = 3000;


var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/cityPlanner');
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine','pug');
app.set('views', __dirname + '/views');

const yelp = require('yelp-fusion');
let yelpApiKey = "aMbFl-deJHchPQOyqqlWlW2rjMoTFAHLumHzFphGyFMkMCMj199UWm7SkmtjX0jnuf_x6qomiVKDkhfGaAZ3EIr71093SuPQEa-pQq_F33snaWqOed5y2m0jnRzvW3Yx";
const client = yelp.client(yelpApiKey);

var searchSchema = new mongoose.Schema({
    city: {type: String, required: true},
    numDays: {type: Number, required: true},
    numPlaces: {type: Number, required: true}
  });

  //model built from schema
  var Search = mongoose.model('Search', searchSchema);


var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  

    //returns a table with the searches
    app.get('/', (req, res) => {
        Search.find({}, function(err, searches) {
          if (err) {
            console.log(err)
            res.render('error', {})
          } else {
            res.render('index', { searches: searches })
          }
        });
      });
    
      //create new search (clicking NEW from the main page)
      app.get('/searches/new', (req, res) => {
        res.render('search-form', { title: "New Search", search: {} })
      });
    

      //go to the update page 
      app.get('/searches/:id/update', (req, res) => {
        let id = ObjectID.createFromHexString(req.params.id)
    
        Search.findById(id, function(err, search) {
          if (err) {
            console.log(err)
            res.render('error', {})
          } else {
            if (search === null) {
              res.render('error', { message: "Not found" })
            } else {
              res.render('search-form', { title: "Update Search", search: search })
            }
          }
        });
      });
    
      //add a new search, from the searches-new page
      app.post('/searches/new', function(req, res, next) {
        let newSearch = new Search(req.body);
        newSearch.save(function(err, savedSearch){
          if (err) {
            console.log(err)
            res.render('search-form', { search: newSearch, error: err })
          } else {
            res.redirect('/searches/' + savedSearch.id);
          }
        });
      });
    
      //get a search (after clicking its title in the main page)
      app.get('/searches/:id', (req, res) => {
        let id = ObjectID.createFromHexString(req.params.id);
        let listPlaces = [];
    
        Search.findById(id, function(err, search) {
          if (err) {
            console.log(err)
            res.render('error', {})
          } else {
            if (search === null) {
              res.render('error', { message: "Not found" });
            } else {
              listPlaces=getYelpPlaces(search.city,search.numPlaces,search.numDays, function(err,listPlaces){
                if(err){
                  console.log(err);
                } else {
                  search.listPlaces=listPlaces
                  res.render('search-detail', { search: search });
                }
              });
              
            }
          }
        });

      });

      function getYelpPlaces(citySearch,numberPlaces,numberDays,cb){
        let listPlaces = [];
        
        client.search({
          term: 'Things to do',
          location: citySearch,
          sort_by: 'best_match',
          limit: numberPlaces
        }).then(response => {

          let nPlacesDay=Math.floor(numberPlaces/numberDays);
          let rest = numberPlaces%numberDays;
          let realDay=1;
          let counterPlacesDay=-1;

          for(let i=0;i<numberPlaces;i++)
          {
            counterPlacesDay++;
            listPlaces.push(response.jsonBody.businesses[i]);
            let day=Math.floor(i/nPlacesDay) + 1;
            if(day>numberDays-rest) //one more place to see each day, so nPlacesDay is one more
            {
              nPlacesDay=Math.floor(numberPlaces/numberDays)+1;
            }
            if(counterPlacesDay==nPlacesDay)
            {
              realDay++;
              counterPlacesDay=0;
            }
            listPlaces[i].day=realDay;
          }
          cb(null, listPlaces);
        }).catch(e => {
          console.log(e);
          cb(e);
        });
        return listPlaces;
      }

      //get a search (after clicking its title in the main page)
      app.get('/searches/:id/map', (req, res) => {
        let id = ObjectID.createFromHexString(req.params.id);
        let listPlaces = [];
    
        Search.findById(id, function(err, search) {
          if (err) {
            console.log(err)
            res.render('error', {})
          } else {
            if (search === null) {
              res.render('error', { message: "Not found" });
            } else {
              listPlaces=getYelpPlaces(search.city,search.numPlaces, search.numDays, function(err,listPlaces){
                if(err){
                  console.log(err);
                } else {
                  search.listPlaces=listPlaces
                  
                  res.render('search-map', { search: search });
                  
                }
              });
              
            }
          }
        });

      });
    
      //from the update page (which is like new search page) we click update
      app.post('/searches/:id/update', function(req, res, next) {
        let id = ObjectID.createFromHexString(req.params.id)
    
        Search.updateOne({"_id": id}, { $set: req.body }, function(err, details) {
          if (err) {
            console.log(err)
            res.render('error', {})
          } else {
            res.redirect('/searches/' + id);
          }
        });
      });
    
      //delete an object from the detailed search page and redirects to the main page
      app.post('/searches/:id/delete', function (req, res) {
        let id = ObjectID.createFromHexString(req.params.id)
        Search.deleteOne({_id: id}, function(err, product) {
          res.redirect("/");
        });
      });

      //to be able to access it from the client side without the browser, we will put the methods
      //UI portion for the user, API portion
    
      app.post('/api/searches', (req, res) => {
        console.log(req.body)
        let newSearch = new Search(req.body)
    
        newSearch.save(function (err, savedSearch) {
          if (err) {
            console.log(err)
            res.status(500).send("There was an internal error")
          } else {
            res.send(savedSearch)
          }
        });
      });
    
      app.get('/api/searches', (req, res) => {
        Search.find({}, function(err, searches) {
          if (err) {
            console.log(err)
            res.status(500).send("Internal server error")
          } else {
            res.send(searches)
          }
        });
      });

    
      app.get('/api/searches/:id', (req, res) => {
        let id = ObjectID.createFromHexString(req.params.id)
    
        Search.findById(id, function(err, search) {
          if (err) {
            console.log(err)
            res.status(500).send("Internal server error")
          } else {
            if (search === null) {
              res.status(404).send("Not found")
            } else {
              res.send(search)
            }
          }
        });
      });
    
      app.put('/api/searches/:id', (req, res) => {
        let id = ObjectID.createFromHexString(req.params.id)
    
        Search.updateOne({"_id": id}, { $set: req.body }, function(err, details) {
          if (err) {
            console.log(err)
            res.status(500).send("Internal server error")
          } else {
            res.status(204).send()
          }
        });
      });
    
      app.delete('/api/searches/:id', (req, res) => {
        let id = ObjectID.createFromHexString(req.params.id)
    
        Search.deleteOne({"_id": id}, function(err) {
          if (err) {
            console.log(err)
            res.status(500).send("Internal server error")
          } else {
            res.status(204).send()
          }
        });
      });
    
});

app.listen(port, () => console.log(`City Planner app listening on port ${port}!`));
module.exports.app = app;
module.exports.searchSchema = searchSchema;