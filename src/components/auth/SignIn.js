import React from 'react';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import firebase from '../../config/fbConfig'

const useStyles = makeStyles(theme => ({
  container: {
    alignItems: 'center',
  },
  textField: {
    width: 300,
  },
  menu: {
    width: 300,
  },
  button: {
    width: 300,
  },
}));

function SignIn(props) {
  const classes = useStyles();
  const [values, setValues] = React.useState({
      email: '',
      password: ''
  });

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    let history = props.history;
    //firebase認証
    firebase.auth().signInWithEmailAndPassword(
      values.email,
      values.password
    ).then(() => {
      console.log('success')
      history.push("/BookList");
    }).catch((err) => {
      console.log(err)
    });
  };

  return (
    <Container maxWidth="sm">
      <form className={classes.container} noValidate autoComplete="off">
        <Grid item xs={6}>
          <TextField
            id="email"
            label="メールアドレス"
            className={classes.textField}
            onChange={handleChange('email')}
            margin="normal"
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            id="password"
            label="パスワード"
            className={classes.textField}
            onChange={handleChange('password')}
            type="password"
            autoComplete="current-password"
            margin="normal"
          />
        </Grid>
        <Grid item xs={6}>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={handleSubmit}
          >
            <Icon>check</Icon>
            ログイン
          </Button>
        </Grid>
      </form>
    </Container>
  )
}

export default SignIn;