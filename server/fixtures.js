if (Players.find().count() === 0) {
  var names = [
    'Alex Pagulayan',
    'Efren Reyes',
    'Mika Immonen',
    'Mike Dechaine',
    'Jeanette Lee'
  ];

  for (var i = 0; i < names.length; i++) {
    Players.insert({name: names[i], score: Math.floor(Math.random() * 10) * 5});
  }
}
