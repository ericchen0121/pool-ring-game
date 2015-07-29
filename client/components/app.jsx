const {
  AppBar,
  ActionAlarmAdd,
  SvgIcon,
  IconButton,
  RaisedButton,
  FlatButton,
  CircularProgress,
  Menu,
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
    console.log('menu touched', e, item.props.value)
    this.setState({
      menuValue: item.props.value
    })
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
    this.togglePayoutView();
    this.setPlayerPoints(playerId);
  },

  deletePlayer(playerId) {
    Players.remove(playerId);
  },

  togglePayoutView() {
    console.log('toggling payout view')
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

  toggleOptionsMenu() {
    console.log('toggling options menu')
    if(this.state.optionsMenu == true) {
      this.setState({
        optionsMenu: false
      })
    } else {
      this.setState({
        optionsMenu: true
     });
    }
    console.log('state.optionsMenu is', this.state.optionsMenu)
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

    if (this.state.optionsMenu) {
      console.log('render method: this.state.optionsMenu:', this.state.optionsMenu);
      optionsMenu =  (
          <Menu onItemTouchTap={ this.menuTouch }>
            <MenuItem primaryText="New Game" value='new'/>
            <MenuItem primaryText="Add Player" value='add'/>
            <MenuItem primaryText="Remove Player" value='remove'/>
            <MenuItem primaryText="Settle Score" value='settle' />
          </Menu>
      )
    } else {
      optionsMenu = <div></div>
    }

    if (this.state.menuValue ){

    }

    appBarRightElement = (
      <IconButton
        iconClassName="material-icons"
        onTouchTap= { this.toggleOptionsMenu }
      >more_vert</IconButton>
    )

    return (
      <div>
        <div className="logo"><CircularProgress onClick= {this.resetPlayerScores} mode="indeterminate" size={.5} /></div>
        <AppBar
          title='Ring Game'
          iconElementRight={ appBarRightElement }
        />
        { optionsMenu }
        { listView }
        <NewPlayer />
        { bottomBar }
      </div>
    )
  }
});
