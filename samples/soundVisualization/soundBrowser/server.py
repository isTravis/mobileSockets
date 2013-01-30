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

define("port", default=5501, help="run on the given port", type=int)

active = 0

GLOBALS={
    'myIDs': []
}


class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("index.html", messages=GLOBALS['myIDs'])

class ClientSocket(tornado.websocket.WebSocketHandler):
    waiters = set()
    def open(self):
        ClientSocket.waiters.add(self)
        for thisID in GLOBALS['myIDs']:
            self.write_message(thisID)
            # print "Just wrote"
            # print thisID
        print "WebSocket opened"

    def on_close(self):
        print "WebSocket closed"
        ClientSocket.waiters.remove(self)

class addData(tornado.web.RequestHandler):
    def get(self):
        myID = self.get_argument("id","")
        GLOBALS['myIDs'].append(myID)
        # print myID

        for waiter in ClientSocket.waiters:
            waiter.write_message(myID)


class Application(tornado.web.Application):
    def __init__(self):
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
