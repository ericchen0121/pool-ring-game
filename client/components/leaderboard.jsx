const {
  List,
  ListItem,
  ListDivider,
  IconButton,
  Avatar
} = mui;

Leaderboard = React.createClass({
  propTypes: {
    listView: React.PropTypes.string,
    selectedPlayerId: React.PropTypes.string,
    selectedPlayerPoints: React.PropTypes.number,
    players: React.PropTypes.array.isRequired,
    onPlayerSelected: React.PropTypes.func,
    onDeletePlayer: React.PropTypes.func
  },
  selectPlayer(playerId) {
    this.props.onPlayerSelected(playerId);
  },
  deletePlayer(playerId) {
    this.props.onDeletePlayer(playerId);
  },
  render() {
    return (
      <List>{
      /* list of players */
        this.props.players.map((player) => {
          let style = {};
          let playerAction = <div />
          let rightIconButton;
          let listItem;

          if (this.props.selectedPlayerId === player._id) {
            style["backgroundColor"] = "#eee";
          }
          var styleScore = {
            top: '0px',
            color: 'rgb(0, 188, 212)'
          };

          var payout = this.props.selectedPlayerPoints - player.score;

          switch(this.props.listView){
            case 'scores':
              playerAction = <h1 style={ styleScore }>{player.score}</h1>;
              listItem = [
                <ListItem key={ player._id }
                  primaryText= { player.name }
                  onClick={ this.selectPlayer.bind(this, player._id) }
                  rightAvatar = { playerAction }
                  style={style}/>,
                <ListDivider/>
              ];
              break;
            case 'settle':
              playerAction = <h1 style={ styleScore }>{payout}</h1>;
              listItem = [
                <ListItem key={ player._id }
                  primaryText= { player.name }
                  onClick={ this.selectPlayer.bind(this, player._id) }
                  rightAvatar = { playerAction }
                  style={style}/>,
                <ListDivider/>
              ];
              break;
            case 'removePlayer':
              rightIconButton = <IconButton iconClassName="material-icons" onTouchTap={ this.deletePlayer.bind(this, player._id)} >remove_circle_outline</IconButton>

              listItem = [
                <ListItem key={ player._id }
                  primaryText= { player.name }
                  rightIconButton = { rightIconButton }
                  style={style}/>,
                <ListDivider/>
              ];break;
            default:
              playerAction = <h1 style={ styleScore }>{player.score}</h1>;
              listItem = [
                <ListItem key={ player._id }
                  primaryText= { player.name }
                  onClick={ this.selectPlayer.bind(this, player._id) }
                  rightAvatar = { playerAction }
                  style={style}/>,
                <ListDivider/>
              ];
              break;
          }

          return listItem;
        })
      }</List>
    )
  }
});
