var app = angular.module("myApp", []).controller('M', ['$scope', function(s) {
  s.socket = io.connect('http://idea.selfup.me:3000/', { reconnect: true })
  s.rb     = s.socket; s.rb.send('createTable', "Demo")
  s.listen = function() {
    s.rb.send('getTable', 'Demo')
    s.socket.on("foundTable", function (m) {
      let c = angular.element(document.querySelector('#chat')); let a = []
      Object.getOwnPropertyNames(m).forEach(function(val, idx) {
        if (idx > 0) a.push(`<p>${m[idx].name}: ${m[idx].message}</p>`)
      }); c.html(a.reverse().join(''))
    })
  }();
  s.newMessage = function(keyEvent, u) {
    if (keyEvent.which === 13) {
      s.rb.send('newData', ['Demo', {name: u.name, message: u.message}])
      s.rb.send('getTable', 'Demo'); u.message = ""
    }
  }
  s.update = function() {
    s.rb.send('updateTable', ['Demo', {name: 'Bot', message: 'Reset!'}])
    s.rb.send('getTable', 'Demo')
  }
}])
