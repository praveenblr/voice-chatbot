# voice-chatbot


# To run this application

Goto project folder, run the following commands

Python -m SimpleHTTPServer


# Configurations

use config.json to update configs

1.endpoint - your restapi endpoint url
2.Modify the payload as per your need
3.Searchinput is used to find key to restapi for passing user text/voice text


# Note

The same searchinput will be used as response key, so make sure your api

get/returns the input/output in the same key

With current setup, we are reading from "message" key


