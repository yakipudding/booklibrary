import React, { Component } from "react";
import firebase from '../../config/fbConfig'
import Navbar from '../layout/Navbar'
import SignIn from '../auth/SignIn'
import BookList from '../ui/BookList'

export default function(ComposedComponent) {
  class Authentication extends Component {
    // コンストラクタ
    constructor(props) {
      super(props);
      this.state = {login: false, loading: true}
    }
    componentDidMount(){
      const changeState = this.onChangeState
      // firebase ログインユーザ取得
      firebase.auth().onAuthStateChanged(
        (user) => {
          // この中はthisが変わるのでthis.setState等は直接呼べないので注意
          if (user) {
            // sign in
            changeState({login: true, loading: false})
          }
          else {
            changeState({login: false, loading: false})
          }
      });
    }
    onChangeState = (state) => {
      this.setState(state);
    }

    render() {
      if (this.state.loading) {
        return null
      }
      else if (this.state.login && this.props.match.path === '/SignIn') {
        return <div><Navbar login={true} /><BookList /></div>;
      }
      else if (this.state.login) {
        return <div><Navbar login={true} /><ComposedComponent {...this.props} /></div>;
      }
      else{
        return <div><Navbar login={false} /><SignIn /></div>;
      }
    }
  }

  return Authentication;
}