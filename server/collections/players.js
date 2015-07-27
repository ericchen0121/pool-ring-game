Meteor.methods({
	resetPlayerScores: function() {
		Players.update({}, {$set: {score: 0}}, {multi: true});
	}
})