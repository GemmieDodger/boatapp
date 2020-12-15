import React from 'react';
import { Link } from 'react-router-dom';
import {
   AppBar,
   Button,
   Toolbar,
   Typography,
   withStyles,
 } from '@material-ui/core';


import LoginButton from './LoginButton';

const styles = {
  flex: {
    flex: 1,
  },
};

const AppHeader = ({ classes }) => (
   <AppBar position="static">
     <Toolbar>
       <Typography variant="h6" color="inherit">
         Boat Tracker App
       </Typography>
       <Button color="inherit" component={Link} to="/">Home</Button>
       <Button color="inherit" component={Link} to="/posts">Posts</Button>
       <Button color="inherit" component={Link} to="/watertankposts">Water Tank</Button>
      <div className={classes.flex} />
      <LoginButton />
     </Toolbar>
   </AppBar>
 );

 export default withStyles(styles)(AppHeader);