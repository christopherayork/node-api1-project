// implement your API here
const db = require('./data/db');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser());

app.route('/api/users')
  .get((req, res) => {
    db.find()
      .then(response => {
        console.log(response);
        res.status(200).json(response);
      })
      .catch(error => {
        console.log(error);
        res.status(500).json({ error: "The users information could not be retrieved." });
      });
  })
  .post((req, res) => {
    console.dir(req.body);
    let user = req.body;
    if(!user.name || !user.bio) {
      res.status(400).json({ errorMessage: "Please provide name and bio for the user."});
    }
    else {
      db.insert(user)
        .then(response => {
          console.log(response);
          res.status(201).json(response);
        })
        .catch(e => {
          console.log(e);
          res.status(500).json({ error: "There was an error while saving the user to the database" })
        });
    }
  });

app.route('/api/users/:id')
  .get((req, res) => {
    console.log(req.params.id);
    let id = req.params.id;
    db.findById(id)
      .then(response => {
        console.log(response);
        if(response) res.status(200).json(response);
        else res.status(404).json({ message: "The user with the specified ID does not exist." });
      })
      .catch(e => {
        console.log(e);
        res.status(500).json({ error: "The user information could not be retrieved." });
      })
  })
  .delete((req, res) => {
    console.log(req.params.id);
    let id = req.params.id;
    db.remove(id)
      .then(response => {
        console.log(response);
        if(response) res.status(200).json({ message: "The user was successfully deleted." });
        else res.status(404).json({ message: "The user with the specified ID does not exist." });
      })
      .catch(e => {
        console.log(e);
        res.status(500).json({ error: "The user could not be removed" });
      });
  })
  .put((req, res) => {
    console.log(req.body);
    let user = req.body;
    if(!user.name || !user.bio) res.status(400).json({ errorMessage: "Please provide name and bio for the user." });
    else db.update(req.params.id, user)
      .then(response => {
        console.log(response);
        if(response) res.status(200).json({ message: "The user was successfully updated." });
        else res.status(404).json({ message: "The user with the specified ID does not exist." });
      })
      .catch(e => {
        console.log(e);
        res.status(500).json({ error: "The user information could not be modified." });
      })
  });

app.listen(5000, () => console.log('Server running on port 5000.'));

