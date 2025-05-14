TITLE: Publishing and Subscribing with PubNub Python
DESCRIPTION: Define a callback function to handle the result of a publish operation. Use the client's publish method to send a message to a channel and the subscribe method to listen for messages on one or more channels.
SOURCE: https://github.com/pubnub/python/blob/master/README.md#_snippet_3

LANGUAGE: python
CODE:
```
def my_publish_callback(envelope, status):
  if status.is_error():
    ... #handle error here
  else:
    ... #handle result here

pubnub.publish().channel('my_channel').message('Hello world!').pn_async(my_publish_callback)

pubnub.subscribe().channels('my_channel').execute()
```

----------------------------------------

TITLE: Adding PubNub Subscribe Listener in Python
DESCRIPTION: Create a class inheriting from SubscribeCallback to handle various events like status changes, presence updates, incoming messages, and signals. Register an instance of this class with the PubNub client.
SOURCE: https://github.com/pubnub/python/blob/master/README.md#_snippet_2

LANGUAGE: python
CODE:
```
class SubscribeHandler(SubscribeCallback):
  def status(self, pubnub, event):
    print("Is there an error? ", event.is_error())
    print("Status value for category: %s" % event.category)
    print("Status value for error_data: %s" % event.error_data)
    print("Status value for error: %s" % event.error)
    print("Status value for status_code: %s" % event.status_code)
    print("Status value for operation: %s" % event.operation)
    print("Status value for tls_enabled: %s" % event.tls_enabled)
    print("Status value for uuid: %s" % event.uuid)
    print("Status value for auth_key: %s" % event.auth_key)
    print("Status value for origin: %s" % event.origin)
    print("Status value for client_request: %s" % event.client_request)
    print("Status value for client_response: %s" % event.client_response)
    print("Status value for original_response: %s" % event.original_response)
    print("Status value for affected_channels: %s" % event.affected_channels)
    print("Status value for affected_groups: %s" % event.affected_groups)

  def presence(self, pubnub, presence):
      pass  # Handle incoming presence data

  def message(self, pubnub, message):
      pass  # Handle incoming messages

  def signal(self, pubnub, signal):
      pass # Handle incoming signals

pubnub.add_listener(SubscribeHandler())
```

----------------------------------------

TITLE: Installing PubNub Python SDK
DESCRIPTION: Use pip, the Python package installer, to add the PubNub SDK to your project dependencies.
SOURCE: https://github.com/pubnub/python/blob/master/README.md#_snippet_0

LANGUAGE: bash
CODE:
```
pip install pubnub
```

----------------------------------------

TITLE: Configuring PubNub Python SDK
DESCRIPTION: Initialize the PubNub configuration object with your subscribe and publish keys, and optionally a unique UUID, then create the PubNub client instance.
SOURCE: https://github.com/pubnub/python/blob/master/README.md#_snippet_1

LANGUAGE: python
CODE:
```
pnconfig = PNConfiguration()

pnconfig.subscribe_key = 'mySubscribeKey'
pnconfig.publish_key = 'myPublishKey'
pnconfig.uuid = 'myUniqueUUID'
pubnub = PubNub(pnconfig)
```

----------------------------------------

TITLE: Enabling Daemon Mode - PubNub Python
DESCRIPTION: This snippet shows how to enable daemon mode for asynchronous requests in the PubNub Python SDK. By default, asynchronous requests block the main thread until completion. Setting this configuration option to `True` allows the main program execution to continue without waiting for child threads/requests to finish, similar to Java's daemon threads.
SOURCE: https://github.com/pubnub/python/blob/master/DEVELOPER.md#_snippet_0

LANGUAGE: python
CODE:
```
pubnub.config.daemon = True
```

----------------------------------------

TITLE: Setup and Run PubNub AsyncIO Subscriber (Shell)
DESCRIPTION: Provides shell commands to install necessary Python packages (asyncio, pubnub), set environment variables for PubNub publish and subscribe keys, and execute the main Python script.
SOURCE: https://github.com/pubnub/python/blob/master/examples/pubnub_asyncio_simple/README.md#_snippet_0

LANGUAGE: shell
CODE:
```
pip install asyncio pubnub
export PUBNUB_PUBLISH_KEY=demo
export PUBNUB_SUBSCRIBE_KEY=demo
python main.py
```

----------------------------------------

TITLE: Publish Message via Curl (Shell)
DESCRIPTION: Demonstrates how to publish a test message to a PubNub channel using the curl command-line tool. It requires setting the PubNub publish and subscribe keys as environment variables.
SOURCE: https://github.com/pubnub/python/blob/master/examples/pubnub_asyncio_simple/README.md#_snippet_1

LANGUAGE: shell
CODE:
```
export PUBNUB_PUBLISH_KEY=demo
export PUBNUB_SUBSCRIBE_KEY=demo
curl "https://ps.pndsn.com/publish/${PUBNUB_PUBLISH_KEY}/${PUBNUB_SUBSCRIBE_KEY}/0/my_channel/0/%22Hello%20World%22"
```

----------------------------------------

TITLE: Specify PubNub Dependency in Python
DESCRIPTION: Specifies the required PubNub package and its minimum version constraint for the project. This line is typically found in a requirements.txt file.
SOURCE: https://github.com/pubnub/python/blob/master/examples/pubnub_asyncio/fastapi/requirements.txt#_snippet_1

LANGUAGE: Python
CODE:
```
pubnub>=10.1.0
```

----------------------------------------

TITLE: Specify pubnub Dependency (Python)
DESCRIPTION: Specifies the required version constraint for the pubnub library.
SOURCE: https://github.com/pubnub/python/blob/master/examples/pubnub_asyncio/http/requirements.txt#_snippet_2

LANGUAGE: Python
CODE:
```
pubnub>=10.1.0
```

----------------------------------------

TITLE: Specify FastAPI Dependency in Python
DESCRIPTION: Specifies the required FastAPI package and its minimum version constraint for the project. This line is typically found in a requirements.txt file.
SOURCE: https://github.com/pubnub/python/blob/master/examples/pubnub_asyncio/fastapi/requirements.txt#_snippet_0

LANGUAGE: Python
CODE:
```
fastapi>=0.115.11
```

----------------------------------------

TITLE: Specify aiohttp Dependency (Python)
DESCRIPTION: Specifies the required version constraint for the aiohttp library.
SOURCE: https://github.com/pubnub/python/blob/master/examples/pubnub_asyncio/http/requirements.txt#_snippet_0

LANGUAGE: Python
CODE:
```
aiohttp>=3.11.14
```

----------------------------------------

TITLE: Specify aiohttp-cors Dependency (Python)
DESCRIPTION: Specifies the required version constraint for the aiohttp-cors library.
SOURCE: https://github.com/pubnub/python/blob/master/examples/pubnub_asyncio/http/requirements.txt#_snippet_1

LANGUAGE: Python
CODE:
```
aiohttp-cors>=0.8.0
```

----------------------------------------

TITLE: Specify Aiohttp Dependency in Python
DESCRIPTION: Specifies the required aiohttp package and its version constraint, pinned to avoid a known vulnerability. This line is typically found in a requirements.txt file.
SOURCE: https://github.com/pubnub/python/blob/master/examples/pubnub_asyncio/fastapi/requirements.txt#_snippet_2

LANGUAGE: Python
CODE:
```
aiohttp>=3.11.14 # not directly required, pinned to avoid a vulnerability
```

----------------------------------------

TITLE: Specify requests Dependency (Python)
DESCRIPTION: Specifies the required version constraint for the requests library, noted as not directly required but pinned for security.
SOURCE: https://github.com/pubnub/python/blob/master/examples/pubnub_asyncio/http/requirements.txt#_snippet_3

LANGUAGE: Python
CODE:
```
requests>=2.32.2 # not directly required, pinned to avoid a vulnerability
```

----------------------------------------

TITLE: Specify Requests Dependency in Python
DESCRIPTION: Specifies the required requests package and its version constraint, pinned to avoid a known vulnerability. This line is typically found in a requirements.txt file.
SOURCE: https://github.com/pubnub/python/blob/master/examples/pubnub_asyncio/fastapi/requirements.txt#_snippet_3

LANGUAGE: Python
CODE:
```
requests>=2.32.2 # not directly required, pinned to avoid a vulnerability
```

----------------------------------------

TITLE: Specify urllib3 Dependency (Python)
DESCRIPTION: Specifies the required version constraint for the urllib3 library, noted as not directly required but pinned for security.
SOURCE: https://github.com/pubnub/python/blob/master/examples/pubnub_asyncio/http/requirements.txt#_snippet_4

LANGUAGE: Python
CODE:
```
urllib3>=1.26.19,<2 # not directly required, pinned to avoid a vulnerability
```

----------------------------------------

TITLE: Specify Urllib3 Dependency in Python
DESCRIPTION: Specifies the required urllib3 package and its version constraint, pinned to avoid a known vulnerability. This line is typically found in a requirements.txt file.
SOURCE: https://github.com/pubnub/python/blob/master/examples/pubnub_asyncio/fastapi/requirements.txt#_snippet_4

LANGUAGE: Python
CODE:
```
urllib3>=1.26.19,<2 # not directly required, pinned to avoid a vulnerability
```

----------------------------------------

TITLE: Listing Python Dependencies
DESCRIPTION: This snippet lists the Python packages required for the project, specifying minimum or exact versions. This format is commonly used in a requirements.txt file.
SOURCE: https://github.com/pubnub/python/blob/master/requirements-dev.txt#_snippet_0

LANGUAGE: Python
CODE:
```
pyyaml>=6.0
pytest-cov>=6.0.0
pycryptodomex>=3.21.0
flake8>=7.1.2
pytest>=8.3.5
pytest-asyncio>=0.24.0
httpx>=0.28
h2>=4.1
requests>=2.32.2
aiohttp>=3.10.11
cbor2>=5.6
behave>=1.2.6
vcrpy>=6.0.2
urllib3>=1.26.19,<2
busypie>=0.5.1
```

----------------------------------------

TITLE: Specify Zipp Dependency in Python
DESCRIPTION: Specifies the required zipp package and its version constraint, pinned to avoid a known vulnerability. This line is typically found in a requirements.txt file.
SOURCE: https://github.com/pubnub/python/blob/master/examples/pubnub_asyncio/fastapi/requirements.txt#_snippet_5

LANGUAGE: Python
CODE:
```
zipp>=3.19.1 # not directly required, pinned to avoid a vulnerability
```