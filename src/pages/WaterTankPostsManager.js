import React, { Component, Fragment } from 'react';
import { withOktaAuth } from '@okta/okta-react';
import { withRouter, Route, Redirect, Link } from 'react-router-dom';
import {
  withStyles,
  Typography,
  Fab,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@material-ui/core';
import { Delete as DeleteIcon, Add as AddIcon } from '@material-ui/icons';
import moment from 'moment';
import { find, orderBy } from 'lodash';
import { compose } from 'recompose';

import WaterTankPostEditor from '../components/WaterTankPostEditor';
import ErrorSnackbar from '../components/ErrorSnackbar';

const styles = theme => ({
    waterTankPosts: {
      marginTop: theme.spacing(2),
    },
    fab: {
      position: 'absolute',
      bottom: theme.spacing(3),
      right: theme.spacing(3),
      [theme.breakpoints.down('xs')]: {
        bottom: theme.spacing(2),
        right: theme.spacing(2),
      },
    },
  });


const API = process.env.REACT_APP_API || 'http://localhost:3001';

class WaterTankPostsManager extends Component {
  state = {
    loading: true,
    waterTankPosts: [],
    error: null,
  };

  componentDidMount() {
    this.getWaterTankPosts();
  }

  async fetch(method, endpoint, body) {
    try {
      const response = await fetch(`${API}${endpoint}`, {
        method,
        body: body && JSON.stringify(body),
        headers: {
          'content-type': 'application/json',
          accept: 'application/json',
          authorization: `Bearer ${await this.props.authService.getAccessToken()}`,
        },
      });
      return await response.json();
    } catch (error) {
      console.error(error);

      this.setState({ error });
    }
  }

  async getWaterTankPosts() {
    this.setState({ loading: false, watertankposts: (await this.fetch('get', '/watertankposts')) || [] });
  }

  saveWaterTankPost = async (waterTankPost) => {
    if (waterTankPost.id) {
      await this.fetch('put', `/watertankposts/${waterTankPost.id}`, waterTankPost);
    } else {
      await this.fetch('post', '/watertankposts', waterTankPost);
    }

    this.props.history.goBack();
    this.getWaterTankPosts();
  }

  async deleteWaterTankPost(waterTankPost) {
    if (window.confirm(`Are you sure you want to delete "${waterTankPost.filledDate}"`)) {
      await this.fetch('delete', `/watertankposts/${waterTankPost.id}`);
      this.getWaterTankPosts();
    }
  }

  renderWaterTankPostEditor = ({ match: { params: { id } } }) => {
    if (this.state.loading) return null;
    const waterTankPost = find(this.state.waterTankPosts, { id: Number(id) });

    if (!waterTankPost && id !== 'new') return <Redirect to="/watertankposts" />;

    return <WaterTankPostEditor waterTankPost={waterTankPost} onSave={this.saveWaterTankPost} />;
  };

  render() {
    const { classes } = this.props;

    return (
      <Fragment>
        <Typography variant="h4">Water Tank Tracker Manager</Typography>
        {this.state.waterTankPosts.length > 0 ? (
          <Paper elevation={1} className={classes.waterTankPosts}>
            <List>
              {orderBy(this.state.waterTankPosts, filledDate, desc).map(waterTankPost => (
                <ListItem key={waterTankPost.id} button component={Link} to={`/watertankposts/${waterTankPost.id}`}>
                  <ListItemText
                    primary={waterTankPost.filledDate}
                    secondary={waterTankPost.comment}
                  />
                  <ListItemSecondaryAction>
                    <IconButton onClick={() => this.deleteWaterTankPost(waterTankPost)} color="inherit">
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Paper>
        ) : (
          !this.state.loading && <Typography variant="subtitle1">No posts to display</Typography>
        )}
        <Fab
          color="secondary"
          aria-label="add"
          className={classes.fab}
          component={Link}
          to="/watertankposts/new"
        >
          <AddIcon />
        </Fab>
        <Route exact path="/watertankposts/:id" render={this.renderWaterTankPostEditor} />
        {this.state.error && (
          <ErrorSnackbar
            onClose={() => this.setState({ error: null })}
            message={this.state.error.message}
          />
        )}
      </Fragment>
    );
  }
}

export default compose(
  withOktaAuth,
  withRouter,
  withStyles(styles),
)(WaterTankPostsManager);
