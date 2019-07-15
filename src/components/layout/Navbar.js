import React from 'react'
import firebase from '../../config/fbConfig'
import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';

// ナビゲーションバー
function Navbar(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const useStyles = makeStyles(theme => ({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  }));
  const ITEM_HEIGHT = 48;

  function handleClick(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  //firebase サインアウト
  function handleSignOut() {
    firebase.auth().signOut();
    // サインアウトするとrequireAuth内のfirebase.auth().onAuthStateChangedが発火
  }

  //firebase 認証状態に応じたリンク
  const authlink = props.login 
                      ? <Button color="inherit" onClick={handleSignOut}>SignOut</Button> 
                      : <Button color="inherit" component={Link} to="/SignIn">SignIn</Button>;  
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton 
            edge="start" 
            className={classes.menuButton} 
            color="inherit" 
            aria-label="Menu"
            aria-owns={open ? 'long-menu' : undefined}
            aria-haspopup="true"
            onClick={handleClick}
            disabled={props.login ? false : true}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            id="long-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            PaperProps={{
              style: {
                maxHeight: ITEM_HEIGHT * 4.5,
                width: 200,
              },
            }}>
            <MenuItem component={Link} to="/" onClick={handleClose}>図書一覧</MenuItem>
            <MenuItem component={Link} to="/BookRental" onClick={handleClose}>図書レンタル</MenuItem>
          </Menu>
          <Typography variant="h6" className={classes.title}>
            図書アプリ
          </Typography>
          {authlink}
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default Navbar
