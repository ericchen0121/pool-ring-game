const {
  List,
  ListItem,
  ListDivider,
  Avatar
} = mui;

Leaderboard = React.createClass({
  propTypes: {
    selectedPlayerId: React.PropTypes.string,
    players: React.PropTypes.array.isRequired,
    onPlayerSelected: React.PropTypes.func
  },
  selectPlayer(playerId) {
    this.props.onPlayerSelected(playerId);
  },
  render() {
    return <List>{
      this.props.players.map((player) => {
        let style = {};
        if (this.props.selectedPlayerId === player._id) {
          style["backgroundColor"] = "#eee";
        }
        var styleScore = {
          top: '0px',
          color: 'rgb(0, 188, 212)'
        };

        return [
          <ListItem key={ player._id }
            primaryText= { player.name }
            onClick={ this.selectPlayer.bind(this, player._id) }
            leftAvatar={ <Avatar src={ "/" + player.name + ".png" }/> }
            rightAvatar = { <h1 style={ styleScore }>{player.score}</h1> }
            style={style}/>,
          <ListDivider/>
        ]
      })
    }</List>
  }
});
