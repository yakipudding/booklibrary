import React, { Component } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import requireAuth from "./components/auth/requireAuth";
import SignIn from "./components/auth/SignIn";
import BookList from './components/ui/BookList'
import BookRental from './components/ui/BookRental'
import BookListForAdmin from './components/ui/BookListForAdmin'
const NotFound = () =>(
  <h1>Not Found</h1>
)

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Switch>
            <Route exact path='/' component={requireAuth(BookList)} />
            <Route exact path='/BookList' component={requireAuth(BookList)} />
            <Route exact path='/BookRental/' component={requireAuth(BookRental)} />
            <Route exact path='/BookRental/:id' component={requireAuth(BookRental)} />
            <Route exact path='/SignIn' component={requireAuth(SignIn)} />
            <Route exact path='/BookListForAdmin' component={requireAuth(BookListForAdmin)} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
