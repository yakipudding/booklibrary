import React, { Component } from "react";
import firebase from '../../config/fbConfig'
import NeedLogin from './NeedLogin'

export default function(ComposedComponent) {
  class Authentication extends Component {
    // コンストラクタ
    constructor(props) {
      super(props);
      this.state = {
        user: ''
      };
    }

    componentDidMount(){
      firebase.auth().onAuthStateChanged(user => {
        this.setState({ user })
      });
    }

    render() {
      // TODO: いったん認証を切っています
      // if (this.state.user) {
        return <ComposedComponent {...this.props} />;
      // }
      // else{
      //   return <NeedLogin />
      // }
    }
  }

  return Authentication;
}