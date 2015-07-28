const {
  RaisedButton,
  FlatButton,
  CircularProgress,
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

    return (
      <div className="outer">
        <div className="logo"><CircularProgress onClick= {this.resetPlayerScores} mode="indeterminate" size={.5} /></div>
        <div className="center">
          <h1 className="title">Ring Game</h1>
          <h3 className='subtitle'>{subtitle}</h3>
        </div>
        { listView }
        <NewPlayer />
        { bottomBar }
      </div>
    )
  }
});
