const {
  AppBar,
  ActionAlarmAdd,
  SvgIcon,
  IconButton,
  RaisedButton,
  FlatButton,
  CircularProgress,
  IconMenu,
  MenuItem,
  FontIcon
} = mui;

const ThemeManager = new mui.Styles.ThemeManager();
let Colors = mui.Styles.Colors;

App = React.createClass({
  mixins: [ReactMeteorData],
  getInitialState: function () {
    return {
      selectedPlayerId: null
    };
  },
  childContextTypes: {
    muiTheme: React.PropTypes.object
  },

  getChildContext: function() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  },

  getMeteorData() {
    return {
      players: Players.find({}, { sort: { score: -1, name: 1 } }).fetch(),
      selectedPlayer: Players.findOne(this.state.selectedPlayerId)
    }
  },

  menuTouch(e, item) {
    this.setState({
      menuValue: item.props.value
    })
    this.menuController();
  },

  menuController() {
    switch(this.state.menuValue){
      case 'new': this.resetPlayerScores(); break;
      case 'add': this.toggleAddPlayerView(); break;
      case 'delete': console.log('deleting'); break;
      case 'settle': this.togglePayoutView(); break;
    }
  },

  selectPlayer(playerId) {
    this.setState({
      selectedPlayerId: playerId
    });
    this.setPlayerPoints(playerId);
  },

  setPlayerPoints(playerId) {
    var points = 0;
    players = this.data.players;
    for(i=0; i< players.length; i++) {
      if(players[i]._id == playerId){
        points = players[i].score
      }
    };
    this.setState({
      selectedPlayerPoints: points
    });
  },

  setPayoutView(playerId) {
    this.setPlayerPoints(playerId);
  },

  deletePlayer(playerId) {
    Players.remove(playerId);
  },

  togglePayoutView() {
    console.log('toggle Payout!')
    if(this.state.payoutView == true) {
      this.setState({
        payoutView: false
      })
    } else {
      this.setState({
        payoutView: true
     });
    }
  },

  toggleAddPlayerView() {
    if(this.state.addPlayerView == true) {
      this.setState({
        addPlayerView: false
      })
    } else {
      this.setState({
        addPlayerView: true
     });
    }
  },

  addPointsToPlayer(playerId, points) {
    Players.update(playerId, {$inc: {score: points}});
  },
  resetPlayerScores() {
    Meteor.call('resetPlayerScores');
  },

  render() {
    let bottomBar;
    let listView;
    let subtitle;
    let optionsMenu;
    let addPlayer;

    /* Bottom Action Bar */
    if (this.state.selectedPlayerId) {
      bottomBar = (
        <div className="details">
          <FlatButton
            onClick={this.setPayoutView.bind(this, this.state.selectedPlayerId)}
            rippleColor={Colors.greenA700}
            label="Settle"
          />
          <FlatButton
            onClick={this.deletePlayer.bind(this, this.state.selectedPlayerId)}
            rippleColor={Colors.redA700}
            label="Remove"
          />
          <RaisedButton
            onClick={this.addPointsToPlayer.bind(
              this, this.state.selectedPlayerId, 2)}
            style={{float: "right"}}
            label="+2"
            secondary={true}/>
          <RaisedButton
            onClick={this.addPointsToPlayer.bind(
              this, this.state.selectedPlayerId, 4)}
            style={{float: "right", margin: "0 5px 0 0"}}
            label="+4"
            primary={true}/>
          <RaisedButton
            onClick={this.addPointsToPlayer.bind(
              this, this.state.selectedPlayerId, -2)}
            style={{float: "right", margin: "0 5px 0 0"}}
            label="-2"
            secondary={true}/>
        </div>
      )
    } else {
      bottomBar = <div className="message">Click a player to select</div>;
    }

    /* Settlement / Payout View */
    if (this.state.payoutView) {
      listView = <LeaderboardPayout players={this.data.players}
        selectedPlayerId={this.state.selectedPlayerId}
        selectedPlayerPoints={this.state.selectedPlayerPoints}
        onPlayerSelected={this.selectPlayer} />
      subtitle = 'Payouts'
    } else {
      listView = <Leaderboard players={this.data.players}
        selectedPlayerId={this.state.selectedPlayerId}
        onPlayerSelected={this.selectPlayer} />
      subtitle = 'Scores'
    }

    if (this.state.addPlayerView) {
      console.log('addPlayerView')
      addPlayer = <NewPlayer />
      subtitle = 'Add Player'
    } else {
      addPlayer = <div></div>
    }

    /* Options Menu */
    optionMenuButton = <IconButton iconClassName="material-icons" onTouchTap= { this.menuTouch }>more_vert</IconButton>

    optionsMenu =  (
      <IconMenu onItemTouchTap={ this.menuTouch } iconButtonElement= { optionMenuButton }>
        <MenuItem primaryText="New Game" value='new'/>
        <MenuItem primaryText="Add Player" value='add'/>
        <MenuItem primaryText="Remove Player" value='remove'/>
        <MenuItem primaryText="Settle Score" value='settle' />
      </IconMenu>
    )

    /* Return Rendering */
    return (
      <div>
        <AppBar
          title={ 'Ring Game: ' + subtitle }
          iconElementRight={ optionsMenu }
        />
        { listView }
        { addPlayer }
        { bottomBar }
      </div>
    )
  }
});
