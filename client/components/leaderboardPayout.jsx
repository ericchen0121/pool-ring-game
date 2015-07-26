const {
  List,
  ListItem,
  ListDivider,
  Avatar
} = mui;

LeaderboardPayout = React.createClass({
  propTypes: {
    selectedPlayerId: React.PropTypes.string,
    selectedPlayerPoints: React.PropTypes.number,
    players: React.PropTypes.array.isRequired,
    onPlayerSelected: React.PropTypes.func
  },
  selectPlayer(playerId) {
    this.props.onPlayerSelected(playerId);
  },
  render() {
    return <List>{

      this.props.players.map((player) => {
        // styling
        let style = {};
        if (this.props.selectedPlayerId === player._id) {
          style["backgroundColor"] = "#eee";
        }
        var styleScore = {
          top: '0px',
          color: 'rgb(0, 188, 212)'
        };

        var payout = this.props.selectedPlayerPoints - player.score;

        // return
        return [
          <ListItem key={ player._id }
            primaryText= { player.name }
            onClick={ this.selectPlayer.bind(this, player._id) }
            rightAvatar = { <h1 style={ styleScore }>{payout}</h1> }
            style={style}/>,
          <ListDivider/>
        ]
      })
    }
    </List>
  }
});
