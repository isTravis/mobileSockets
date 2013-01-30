#!/usr/bin/python
# -*- coding: utf-8 -*-

import tornado.ioloop
import tornado.web
import os
import serial
import threading
import sys
import signal
import urlparse

from tornado import websocket
from tornado.options import define, options

# The port you wish to run your web app on
define("port", default=7701, help="run on the given port", type=int)


class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("index.html", messages="") # Render index.html, and pass the contained messages to the index.html template

class ClientSocket(tornado.websocket.WebSocketHandler):
    waiters = set() # The full set of open sockets

    def open(self):
        ClientSocket.waiters.add(self)
        print "WebSocket opened"
        # Can perform initialization code here

    def on_close(self):
        print "WebSocket closed"
        ClientSocket.waiters.remove(self)

class addData(tornado.web.RequestHandler):
    #Parse the data contained in the /add/ url and write it to the sockets
    def get(self):
        # For example, if the url was localhost:8801/add/?id=12&firstName=Mike&lastName=Ditka
        # myBundle = self.request.arguments  would create a JSON containing key value pairs with keys 'id', 'firstName', and 'lastName'
        # print self.request.arguments        

        for waiter in ClientSocket.waiters: #Iterate over all webSockets that are open, and write the message you just received
            waiter.write_message(self.request.arguments)


class Application(tornado.web.Application):
    def __init__(self):
        # Define URL handlers
        handlers = [
            (r"/", MainHandler),
            (r"/socket", ClientSocket),
            (r'/add/.*', addData),
            (r'/static/(.*)', tornado.web.StaticFileHandler, {'path': "./static"}),
        ]
        settings = dict(
            # cookie_secret="__TODO:_GENERATE_YOUR_OWN_RANDOM_VALUE_HERE__",
            template_path=os.path.join(os.path.dirname(__file__), "templates"),
            static_path=os.path.join(os.path.dirname(__file__), "static"),
            # xsrf_cookies=True,
            # autoescape=None,
        )
        tornado.web.Application.__init__(self, handlers, **settings)

def main():
    tornado.options.parse_command_line()
    app = Application()
    app.listen(options.port)
    tornado.ioloop.IOLoop.instance().start()

if __name__ == "__main__":
    main()
