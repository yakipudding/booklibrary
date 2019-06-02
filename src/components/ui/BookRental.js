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
      userid: props.userid,
      username: props.username,
      isbncode: props.isbncode || 978,
      jancode: props.jancode || 192,
    };
    // firestoreからusersを取得し、stateのusersに保存
    firestore.collection('users')
      .orderBy('username')
      .get()
      .then(snapShot => {
        let users = [];
        snapShot.forEach(doc => {
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
          userid: book.lenderuserid,
          username: book.lendername,
          isbncode: book.isbncode,
          jancode: book.jancode,
        });
      });
    }
  }
  
  //描画
  render() {
    if (this.state.users && (this.state.bookid == null || this.state.bookid && this.state.isbncode != 978)){
      return (
         <RentalInputField
            users={this.state.users}
            userid={this.state.userid}
            username={this.state.username}
            isbncode={this.state.isbncode}
            jancode={this.state.jancode}
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