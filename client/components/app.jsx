const {
  RaisedButton
} = mui;

const ThemeManager = new mui.Styles.ThemeManager();

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
  },
  addPointsToPlayer(playerId, points) {
    Players.update(playerId, {$inc: {score: points}});
  },
  render() {
    let bottomBar;
    if (this.state.selectedPlayerId) {
      bottomBar = (
        <div className="details">
          <div className="name">{this.data.selectedPlayer.name}</div>
          <RaisedButton
            onClick={this.addPointsToPlayer.bind(
              this, this.state.selectedPlayerId, 2)}
            style={{float: "right"}}
            label="Add 2"
            secondary={true}/>
          <RaisedButton
            onClick={this.addPointsToPlayer.bind(
              this, this.state.selectedPlayerId, 4)}
            style={{float: "right", margin: "0 5px 0 0"}}
            label="Add 4"
            primary={true}/>
        </div>
      )
    } else {
      bottomBar = <div className="message">Click a player to select</div>;
    }

    return (
      <div className="outer">
        <div className="logo"></div>
        <h1 className="title">Ring Game</h1>
        <div className="subtitle">Select a player to add points</div>
        <Leaderboard players={this.data.players}
          selectedPlayerId={this.state.selectedPlayerId}
          onPlayerSelected={this.selectPlayer} />
        { bottomBar }
      </div>
    )
  }
});
