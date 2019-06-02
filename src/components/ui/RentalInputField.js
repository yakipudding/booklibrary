import React from 'react';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';

// 図書レンタル　入力部分
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

function RentalInputField(props) {
  const classes = useStyles();
  const [values, setValues] = React.useState({
    users: props.users,
    userid: props.userid,
    username: props.username,
    isbncode: props.isbncode,
    jancode: props.jancode,
  });
  console.log(values)

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handleChangeSelect = name => event => {
    console.log(event.target)
    setValues({ ...values,
              userid: event.target.value,
              username: values.users[event.target.value],
             });
  };

  return (
    <Container maxWidth="sm">
      <form className={classes.container} noValidate autoComplete="off">
        <Grid item xs={6}>
          <TextField
            id="select-username"
            select
            label="貸出人名"
            className={classes.textField}
            value={values.userid}
            onChange={handleChangeSelect('userid')}
            SelectProps={{
              MenuProps: {
                className: classes.menu,
              },
            }}
            margin="normal"
          >
            {values.users.map(option => (
              <MenuItem key={option.username} value={option.id}>
                {option.username}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={6}>
          <TextField
            id="isbncode"
            label="ISBNコード"
            className={classes.textField}
            value={values.isbncode}
            onChange={handleChange('isbncode')}
            margin="normal"
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            id="jancode"
            label="JANコード"
            className={classes.textField}
            value={values.jancode}
            onChange={handleChange('jancode')}
            margin="normal"
          />
        </Grid>
        <Grid item xs={6}>
          <Button variant="contained" color="primary" className={classes.button}>
            <Icon>arrow_forward</Icon>
            借りる
          </Button>
        </Grid>
      </form>
    </Container>
  );
}

export default RentalInputField;