import React, { Component } from 'react'
import 'firebase/firestore'
import { firestore } from '../../config/fbConfig'
import moment from 'moment'
import MaterialTable from 'material-table'

// 図書一覧
class BookList extends Component {
  // 列定義
  columns = [
        { title: '管理部門', field: 'department', lookup: { 0: '部署A', 1: '部署B' } },
        { title: '状態', field: 'lendable', lookup: { true: '貸出可能', false: '貸出中' } },
        { title: '書籍名', field: 'bookname' },
        { title: '貸出人', field: 'lendername'},
        { title: '貸出日', field: 'lenderdate', filtering: false},
      ]
  // debug:firebaseから取得したデータのダミー
  books_debug = [
      { id: "6Gag8cuB5fH9cC4bp9i4", department: 0, lendable: false, bookname: '達人プログラマー', isbncode: 9784274219337, jancode: 1923055032002, lendername: '田中太郎', lenderdate: '2019/05/31' },
      { id: "n7ymXgDRxjQQTEAtL51o", department: 1, lendable: true, bookname: '少女ファイト(1)', isbncode: 9784274219337, jancode: 1923055032002, lendername: '', lenderdate: null },
    ]

  // コンストラクタ
  constructor(props) {
    super(props);
    this.state = {
      books: []
    };
    // firestoreからデータ取得し、stateのbooksに保存
    firestore.collection('books')
      .orderBy('isbncode')
      .get()
      .then(snapShot => {
        let books = [];
        snapShot.forEach(doc => {
          let book = doc.data()
          books.push({
            id: doc.id,
            ...book,
            lenderdate: book["lenderdate_ts"] ? moment(book["lenderdate_ts"].toDate()).format("YYYY/MM/DD") : ""
          });
        });
        this.setState({
          books: books
        });
      });
  }
  
  handleClick = (event, rowData) => {
    this.props.history.push('/BookRental/' + rowData.id );
  }

  //描画　MaterialTableを使用
  render() {
    return (
      <MaterialTable
        title="図書一覧"
        columns={this.columns}
        data={this.state.books}
        actions={[
          rowData => ({
            icon: 'arrow_forward',
            tooltip: '借りる',
            onClick: (event, rowData) => this.handleClick(event, rowData),
            hidden: !rowData.lendable
          }),
          rowData => ({
            icon: 'subdirectory_arrow_left',
            tooltip: '返す',
            onClick: (event, rowData) => this.handleClick(event, rowData),
            hidden: rowData.lendable
          })
        ]}
        options={{
          search: false,
          actionsColumnIndex: -1, 
          filtering: true,
          paging: false
        }}
      />
    );
  }
}

export default BookList;