import React, { useState, useEffect } from 'react';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import 'firebase/firestore'
import { firestore } from '../../config/fbConfig'

// 図書レンタル　入力部分
const useStyles = makeStyles(theme => ({
  container: {
    alignItems: 'center',
  },
  textField: {
    width: 150,
  },
  labelField: {
    width: 300,
  },
  menu: {
    width: 300,
  },
  button: {
    width: 150,
  },
  formControl: {
    // margin: theme.spacing(3),
  },
  group: {
    margin: theme.spacing(1, 0),
  },
  root: {
    padding: theme.spacing(3, 0),
  },
}));

function RentalInputField(props) {
  // 初期処理
  const classes = useStyles();
  const [values, setValues] = useState({
    users: props.users,
    rentalmode: props.lenderuserid ? 'return' : 'rental',
    userid: props.lenderuserid || '',
    username: props.lenderusername || '',
    isbncode: props.isbncode || '978',
    jancode: props.jancode || '192',
  });
  const [validateValues, setValidateValues] = useState({
    bookid: props.bookid,
    bookname: props.bookname || '',
    message: props.lenderuserid ? '貸出人名を選択してください' 
           : props.bookid ? 'ISBNコードとJANコードを入力してください' 
           : null,
    enableOKButton: false,
  });

  //借りる・返す、ISBNコード、JANコード
  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  //貸出人名設定
  const handleChangeSelect = name => event => {
    setValues({
              ...values,
              userid: event.target.value,
              username: values.users.filter((user) => user.id === event.target.value)[0]['username'],
             });
  };

  //コンポーネントに変化があった時、バリデーションが走る
  useEffect(()=> 
    {
      if(values.userid === ''){
        setValidateValues({
                    ...validateValues,
                    message: '貸出人名を選択してください',
                    enableOKButton: false, });
        return
      }
      //コードが13桁未満の場合は書籍情報をクリア
      if (values.isbncode.toString().length !== 13 || values.jancode.toString().length !== 13){
        setValidateValues({
                    bookid: null,
                    bookname: '',
                    message: 'ISBN,JANコードを入力してください',
                    enableOKButton: false, });
        return
      }
      //ISBNコードとJANコードから本を検索
      let bookname = ''
      firestore.collection('books')
                .where('isbncode', '==', parseInt(values.isbncode,10))
                .get()
                .then(booksDoc => 
                {
                  console.log(booksDoc)
                  if(booksDoc.empty){
                    //本がない
                    setValidateValues({
                                bookid: null,
                                bookname: bookname,
                                message: '本が見つかりません。ISBNコードとJANコードを確認してください',
                                enableOKButton: false, 
                    });
                    return
                  }
                  //foreachだと途中でreturnできないのでforを使用
                  for(let i = 0; i < booksDoc.docs.length; i++)
                  {
                    let bookid = booksDoc.docs[i].id
                    let book = {...booksDoc.docs[i].data()}
                    console.log(book)
                    if(values.rentalmode === 'rental' && book.lendable)
                    {
                      console.log('貸出可能')
                      //貸出可能
                      setValidateValues({
                                  bookid: bookid,
                                  bookname: book.bookname,
                                  message: '貸出可能です。OKボタンをクリックしてください',
                                  enableOKButton: true, 
                      });
                      return
                    }
                    else if (values.rentalmode === 'return'
                          && values.userid === book.lenderuserid)
                    {
                        //返却可能
                        setValidateValues({
                                    bookid: bookid,
                                    bookname: book.bookname,
                                    message: '貸出を確認しました。OKボタンをクリックしてください',
                                    enableOKButton: true, 
                        });
                        return
                    }
                    bookname = book.bookname
                  }
                  if(values.rentalmode === 'rental')
                  {
                    //本はあるが貸出中
                    setValidateValues({
                                bookid: null,
                                bookname: bookname,
                                message: '貸出可能な在庫がありません',
                                enableOKButton: false, 
                    });
                    return
                  }
                  if(values.rentalmode === 'return')
                  {
                    //借りていない
                    setValidateValues({
                                bookid: null,
                                bookname: bookname,
                                message: '貸出を確認できませんでした。入力内容を再確認してください。',
                                enableOKButton: false, 
                    });
                    return
                  }
                })
    }, [values]
  );

  //登録
  const handleSubmit = e => {
    e.preventDefault();
    console.log('submit!')
    //本取得
    let bookid = validateValues.bookid;
    let lenderuserid = values.userid;
    let lenderusername = values.username;
    console.log(bookid + '・' + lenderuserid + '・' + lenderusername)
    if(values.rentalmode === 'rental'){
      console.log('借りる')
      firestore.collection('books').doc(bookid)
      .update({
        lendable: false,
        lenderdate_ts: new Date(),
        lenderuserid: lenderuserid,
        lenderusername: lenderusername,
      })
      .then(
        //成功
        alert('貸出登録しました'),
        setValues({
          ...values,
          isbncode: '978',
          jancode: '192',
          })
      ) 
    }
    else{
      firestore.collection('books').doc(bookid)
      .update({
        lendable: true,
        lenderdate_ts: null,
        lenderuserid: null,
        lenderusername: null,
      })
      .then(
        //成功
        alert('返却登録しました'),
        setValues({
          ...values,
          isbncode: '978',
          jancode: '192',
         })
      )
    }

  };

  return (
    <Container maxWidth="sm">
      <form className={classes.container} onSubmit={handleSubmit} noValidate autoComplete="off">
        <Grid item xs={9}>
          {/* メッセージ */}
          <Typography className={classes.root} component="p">
            {validateValues.message}
          </Typography>
        </Grid>
        <Grid item xs={9}>
          <FormControl component="fieldset" className={classes.formControl}>
            <RadioGroup
              aria-label="rentalmode"
              name="rentalmode"
              className={classes.group}
              value={values.rentalmode}
              onChange={handleChange('rentalmode')} 
              row
            >
              <FormControlLabel value="rental" control={<Radio />} label="借りる" />
              <FormControlLabel value="return" control={<Radio />} label="返す" />
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item xs={9}>
          <TextField
            id="select-username"
            select
            label="貸出人名"
            className={classes.labelField}
            value={values.userid}
            onChange={handleChangeSelect('userid')}
            error={!values.userid}
            InputProps={{ readOnly: props.lenderuserid ? true : false }}
            SelectProps={{ MenuProps: { className: classes.menu, }, }}
            margin="normal"
          >
            {values.users.map(option => (
              <MenuItem key={option.username} value={option.id} name={option.username}>
                {option.username}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={9}>
          <TextField
            id="isbncode"
            label="ISBNコード"
            type="number"
            className={classes.textField}
            value={values.isbncode}
            error={!validateValues.bookid}
            InputProps={{
              readOnly: props.isbncode ? true : false,
            }}
            onChange={handleChange('isbncode')}
            margin="normal"
          />
          <TextField
            id="jancode"
            label="JANコード"
            type="number"
            className={classes.textField}
            value={values.jancode}
            error={!validateValues.bookid}
            InputProps={{
              readOnly: props.jancode ? true : false
            }}
            onChange={handleChange('jancode')}
            margin="normal"
          />
        </Grid>
        <Grid item xs={9}>
          <Typography className={classes.root} component="p">
            {'書籍名：' + validateValues.bookname}
          </Typography>
        </Grid>
        <Grid item xs={9}>
          <Button type="submit" onSubmit={handleSubmit} disabled={!validateValues.enableOKButton} variant="contained" color="primary" className={classes.button}>
            OK
          </Button>
        </Grid>
      </form>
    </Container>
  );
}

export default RentalInputField;