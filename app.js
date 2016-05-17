class App {
  constructor() {
    this.app = angular.module("myApp", [])
    this.chatController
    this.componentChat
  }

  get chatController() {
    this.app.controller('MainController', ['$scope', function(s) {
      s.master = {}
      s.socket = io.connect('http://idea.selfup.me:3000/', { reconnect: true })
      s.rb     = s.socket
      s.rb.send('createTable', "angularDemoChat")
      s.newMessage = function(keyEvent, user) {
        if (keyEvent.which === 13) {
          s.rb.send('newData', [
            'angularDemoChat', {name: user.name, message: user.message}
          ])
          s.rb.send('getTable', 'angularDemoChat')
        }
      }
      s.update = function() {
        s.rb.send('updateTable', [
          'angularDemoChat', {name: 'Chat Bot', message: 'Wipe Out!'}
        ])
        s.rb.send('getTable', 'angularDemoChat')
      }
    }])
  }

  get componentChat() {
    this.app.component('chat', {
      template: '<p>Chat messages Will Go {{ $ctrl.title.name }}!</p>',
      controller: function() {
        let socket = io.connect('http://idea.selfup.me:3000', { reconnect: true })
        let rb     = socket
        this.title = {name: 'Here'};
        this.init = function() {
          rb.send('getTable', 'angularDemoChat')
          socket.on("foundTable", function (message) {
            const chatMessages = angular.element(
              document.querySelector( '#chat' )
            )
            let objects = []
            Object.getOwnPropertyNames(message).forEach(function(val, idx) {
              if (idx > 0) {
                objects.push(
                  `<p>${message[idx].name}: ${message[idx].message}</p>`
                )
              }
            })
            chatMessages.html(objects.reverse().join(''))
          })
        }
        this.$onInit = function() {
          this.init()
        }
      }
    })
  }
}

const app = new App
