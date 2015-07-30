const {
  AppBar,
  IconButton,
  RaisedButton,
  FlatButton,
  IconMenu,
  MenuItem
} = mui;

const ThemeManager = new mui.Styles.ThemeManager();
let Colors = mui.Styles.Colors;

App = React.createClass({
  mixins: [ReactMeteorData],
  getInitialState: function () {
    return {
      listView: 'scores',
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
    if(item){
      // run menu action
      switch(item.props.value){
        case 'new': this.startNewGame(); break;
        case 'add': this.toggleAddPlayerView(); break;
        case 'remove': this.setState({ listView: 'removePlayer' }); break;
        case 'settle': this.setPlayerSettleView(this.defaultSelectedPlayerId()); break;
      }

      // set state
      this.setState({ menuValue: item.props.value })
    }
  },

  selectPlayer(playerId) {
    this.setState({ selectedPlayerId: playerId });
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

  setPlayerSettleView(playerId) {
    this.setPlayerPoints(playerId);
    this.setViewSettle()
  },

  deletePlayer(playerId) {
    Players.remove(playerId);
  },

  setViewSettle() {
    this.setState({ listView: 'settle' })
  },

  toggleAddPlayerView() {
    if(this.state.addPlayerView == true) {
      this.setState({ addPlayerView: false
      })
    } else {
      this.setState({
        addPlayerView: true
     });
    }
  },

  addPointsToPlayer(playerId, points) {
    Players.update(playerId, { $inc: { score: points }});
  },

  resetPlayerScores() {
    Meteor.call('resetPlayerScores');
  },
  startNewGame() {
    this.resetPlayerScores();
    this.setState({ listView: 'scores' })
  },
  defaultSelectedPlayerId() {
    if (!this.state.selectedPlayerId) {
      this.setState({ selectedPlayerId: this.data.players[0]._id })
      return this.data.players[0]._id
    } else {
      return this.state.selectedPlayerId
    }

  },

  render() {
    let bottomBar;
    let listView;
    let subtitle;
    let optionsMenu;
    let addPlayer;

    /* Options Menu */
    optionMenuButton = <IconButton iconClassName="material-icons" onTouchTap= { this.menuTouch }>more_vert</IconButton>

    optionsMenu =  (
      <IconMenu onItemTouchTap = {  this.menuTouch } iconButtonElement= { optionMenuButton }>
        <MenuItem primaryText="New Game" value='new'/>
        <MenuItem primaryText="Add Player" value='add'/>
        <MenuItem primaryText="Remove Player" value='remove'/>
        <MenuItem primaryText="Settle Score" value='settle' />
      </IconMenu>
    )

    /* Leaderboard List */
    listView = <Leaderboard players = { this.data.players }
      selectedPlayerId = { this.state.selectedPlayerId }
      selectedPlayerPoints = { this.state.selectedPlayerPoints }
      listView = { this.state.listView }
      onPlayerSelected = { this.selectPlayer }
      onDeletePlayer = { this.deletePlayer } />

    /* Bottom Action Bar */
    if (this.state.selectedPlayerId) {
      bottomBar = (
        <div className="details">
          <RaisedButton
            onClick = { this.addPointsToPlayer.bind(
              this, this.state.selectedPlayerId, 2)}
            style = {{ float: "right" }}
            label="+2"
            secondary = { true}/>
          <RaisedButton
            onClick = { this.addPointsToPlayer.bind(
              this, this.state.selectedPlayerId, 4)}
            style = {{ float: "right", margin: "0 5px 0 0" }}
            label="+4"
            primary = { true}/>
          <RaisedButton
            onClick = { this.addPointsToPlayer.bind(
              this, this.state.selectedPlayerId, -2)}
            style = {{ float: "right", margin: "0 5px 0 0" }}
            label="-2"
            secondary = { true }/>
        </div>
      )
    } else {
      bottomBar = <div className="message">Click a player to select</div>;
    }

    if (this.state.addPlayerView) {
      addPlayer = <NewPlayer />
      subtitle = 'Add Player'
    } else {
      addPlayer = <div></div>
    }

    /* Rendering */
    return (
      <div>
        <AppBar
          title = {  'Ring Game: ' + subtitle }
          iconElementRight = {  optionsMenu }
        />
        { listView }
        { addPlayer }
        { bottomBar }
      </div>
    )
  }
});
