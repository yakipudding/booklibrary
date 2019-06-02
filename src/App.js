import firebase from './config/fbConfig'
import React, { Component } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import requireAuth from "./components/auth/requireAuth";
import Navbar from './components/layout/Navbar'
import BookList from './components/ui/BookList'
import BookRental from './components/ui/BookRental'

class App extends Component {
  render() {
    firebase.auth().signInAnonymously()
    return (
      <BrowserRouter>
        <div className="App">
          <Navbar />
          <Switch>
            <Route exact path='/' component={requireAuth(BookList)} />
            <Route exact path='/BookRental/' component={requireAuth(BookRental)} />
            <Route exact path='/BookRental/:id' component={requireAuth(BookRental)} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
