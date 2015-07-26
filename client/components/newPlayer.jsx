const {
  TextField, 
  FloatingActionButton, 
  FontIcon
} = mui;

/* https://facebook.github.io/react/docs/two-way-binding-helpers.html */

NewPlayer = React.createClass({
  propTypes: {
  },
  getInitialState: function() {
    return {newPlayer: ''};
  },
  handleTextChange: function(event) {
    this.setState({newPlayer: event.target.value});
  },
  addNewPlayer: function(){
    Players.insert({name: this.state.newPlayer, score: 0})

    /* clear value */
    this.setState(this.getInitialState())
  },
  render() {
    return (
      <div>
        <TextField hintText='New Player' value={this.state.newPlayer} onChange={this.handleTextChange} />
        <FloatingActionButton
          iconClassName="muidocs-icon-action-grade" 
          mini={true}
          onClick = { this.addNewPlayer }
          secondary= { true }
        />
      </div>
    ) 
  }
});
