import React, { Component } from 'react'
import 'firebase/firestore'
import { firestore } from '../../config/fbConfig'
import RentalInputField from './RentalInputField';

// 図書レンタル
class BookRental extends Component {
  // debug:firebaseから取得したデータのダミー
  users_debug = [
      { id: "6Gag8cuB5fH9cC4bp9i4", username: '田中太郎' },
      { id: "n7ymXgDRxjQQTEAtL51o", username: '山田花子' },
    ]

  // コンストラクタ
  constructor(props) {
    super(props);
    this.state = {
      users: null,
      bookid: props.match.params.id,
      lenderuserid: null,
      lenderusername: null,
      isbncode: null,
      jancode: null,
      bookname: null,
      loading: true
    };
  }

  componentDidMount(props){
    // firestoreからusersを取得し、stateのusersに保存
    firestore.collection('users')
      .orderBy('username')
      .get()
      .then(usersDoc => {
        let users = [];
        usersDoc.forEach(doc => {
          users.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        this.setState({
          users: users
        });
    });
      
    // idを指定されている場合、firestoreからbooksを取得し、stateに保存
    if(this.state.bookid){
      firestore.collection('books').doc(this.state.bookid)
      .get()
      .then(doc => {
        let book = doc.data()
        this.setState({
          lenderuserid: book.lenderuserid,
          lenderusername: book.lenderusername,
          isbncode: book.isbncode,
          jancode: book.jancode,
          bookname: book.bookname,
          loading: false
        });
      });
    }
    else{
      this.setState({
        loading: false
      })
    }
  }
  
  //描画
  render() {
    if (this.state.users && !this.state.loading){
      return (
         <RentalInputField
            users={this.state.users}
            bookid={this.state.bookid}
            lenderuserid={this.state.lenderuserid}
            lenderusername={this.state.lenderusername}
            isbncode={this.state.isbncode}
            jancode={this.state.jancode}
            bookname={this.state.bookname}
          />
      );
    }
    else{
      //loading
      return null
    }
  }
}

export default BookRental;