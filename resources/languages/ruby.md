TITLE: Subscribe and Publish Messages with PubNub Ruby
DESCRIPTION: Illustrates how to subscribe to a specific channel, optionally including presence information, and how to publish a message to that channel. The publish operation includes a block to handle the response status.
SOURCE: https://github.com/pubnub/ruby/blob/master/README.md#_snippet_3

LANGUAGE: Ruby
CODE:
```
pubnub.subscribe(
    channels: ['my_channel'],
    with_presence: true
)

pubnub.publish(
    channel: 'my_channel',
    message: { text: 'Hello world' }
) do |envelope|
    puts envelope.status
end
```

----------------------------------------

TITLE: Full Pubnub Client Example with Listeners and Subscribe (Ruby)
DESCRIPTION: A comprehensive example demonstrating the initialization of a Pubnub client, the creation and addition of multiple listener callback objects with names, and subscribing to a channel and its presence channel. Includes example output showing received events.
SOURCE: https://github.com/pubnub/ruby/blob/master/docs.md#_snippet_14

LANGUAGE: ruby
CODE:
```
# Init pubnub client
pubnub_client = Pubnub.new(subscribe_key: 'demo', publish_key: 'demo')

# First callbacks object
callbacks0 = Pubnub::SubscribeCallback.new(
  message:  ->(envelope) { puts "C0 MESSAGE: #{envelope.result[:data][:message]}" },
  presence: ->(envelope) { puts "C0 PRESENCE: #{envelope.result[:data][:message]}" },
  status:   ->(envelope) { puts "C0 STATUS: #{envelope.result[:data][:message]}" }
)

# Second callbacks object
callbacks1 = Pubnub::SubscribeCallback.new(
  message:  ->(envelope) { puts "C1 MESSAGE: #{envelope.result[:data][:message]}" },
  presence: ->(envelope) { puts "C1 PRESENCE: #{envelope.result[:data][:message]}" },
  status:   ->(envelope) { puts "C1 STATUS: #{envelope.result[:data][:message]}" }
)

# Adding listener allows you to specify name, it's not required to specify a name
pubnub_client.add_listener(name: 'c0', callback: callbacks0)

# Let's subscribe somewhere
pubnub_client.subscribe(channel: :demo, presence: :demo)

# SOME OUTPUT:
# C0 PRESENCE: {\"action\"=>\"join\", \"timestamp\"=>1461683357, \"uuid\"=>\"fc0c0460-44b4-4338-b7e9-1b534b85072e\", \"occupancy\"=>2}
# C0 MESSAGE: {\"text\"=>\"hey\"}
```

----------------------------------------

TITLE: Install PubNub Ruby Gem
DESCRIPTION: Provides the command-line instruction to install the PubNub Ruby SDK using the RubyGems package manager, which is the standard way to add Ruby libraries to a project.
SOURCE: https://github.com/pubnub/ruby/blob/master/README.md#_snippet_0

LANGUAGE: Bash
CODE:
```
gem install pubnub
```

----------------------------------------

TITLE: Installing PubNub Ruby Gem (Command Line)
DESCRIPTION: Provides the command line instruction to install the PubNub Ruby gem using the standard `gem` command. This is the typical way to install the gem globally or within a specific Ruby environment.
SOURCE: https://github.com/pubnub/ruby/blob/master/docs.md#_snippet_7

LANGUAGE: Ruby
CODE:
```
gem install pubnub
```

----------------------------------------

TITLE: Adding PubNub Ruby Gem to Gemfile
DESCRIPTION: Shows how to add the PubNub Ruby gem as a dependency in a Gemfile. This is commonly used with Bundler to manage project dependencies, specifying the gem name and an optional version constraint.
SOURCE: https://github.com/pubnub/ruby/blob/master/docs.md#_snippet_8

LANGUAGE: Ruby
CODE:
```
gem 'pubnub', '~> 4.0'
```

----------------------------------------

TITLE: Initializing Pubnub Client (Ruby)
DESCRIPTION: Demonstrates how to create a new Pubnub client instance using the `Pubnub.new` method. It shows the minimum required parameters, `subscribe_key` and `publish_key`, passed as a hash.
SOURCE: https://github.com/pubnub/ruby/blob/master/docs.md#_snippet_10

LANGUAGE: ruby
CODE:
```
pubnub = Pubnub.new(
  subscribe_key: :demo,
  publish_key:   :demo
)
```

----------------------------------------

TITLE: Initialize PubNub Ruby SDK
DESCRIPTION: Demonstrates the minimal configuration needed to create a PubNub client instance in Ruby. It requires providing your subscribe key, publish key, and a unique identifier (UUID) to authenticate and identify the client.
SOURCE: https://github.com/pubnub/ruby/blob/master/README.md#_snippet_1

LANGUAGE: Ruby
CODE:
```
require 'pubnub'

pubnub = Pubnub.new(
    subscribe_key: :mySubscribeKey,
    publish_key: :myPublishKey,
    uuid: :myUniqueUUID
)
```

----------------------------------------

TITLE: Subscribing to a Channel in Ruby
DESCRIPTION: Basic example of subscribing to a single channel ('my_channel') using the PubNub Ruby SDK. This initiates the subscription process, and messages/presence events for this channel will be delivered to registered listeners. Requires a PubNub client instance (`pubnub`).
SOURCE: https://github.com/pubnub/ruby/blob/master/docs.md#_snippet_20

LANGUAGE: Ruby
CODE:
```
# Subscribe to channel 'my_channel'.
pubnub.subscribe(
  channel: :my_channel
)
```

----------------------------------------

TITLE: Adding Listener Callbacks (Ruby)
DESCRIPTION: Illustrates the process of creating a `Pubnub::SubscribeCallback` object with lambda functions for handling different event types (message, presence, status) and then adding this callback object to the Pubnub client using `add_listener`, optionally providing a name.
SOURCE: https://github.com/pubnub/ruby/blob/master/docs.md#_snippet_12

LANGUAGE: ruby
CODE:
```
callbacks = Pubnub::SubscribeCallback.new(
  message:  ->(envelope) { puts #{envelope.result[:data][:message]}" },
  presence: ->(envelope) { puts #{envelope.result[:data][:message]}" },
  status:   ->(envelope) { puts #{envelope.status}" }
)

pubnub.add_listener(name: 'my_listener', callback: callbacks)
```

----------------------------------------

TITLE: Add PubNub Event Listeners in Ruby
DESCRIPTION: Shows how to create a Pubnub::SubscribeCallback instance with lambda functions to handle incoming messages and presence events. This callback is then added to the PubNub client to process realtime data.
SOURCE: https://github.com/pubnub/ruby/blob/master/README.md#_snippet_2

LANGUAGE: Ruby
CODE:
```
callback = Pubnub::SubscribeCallback.new(
    message: ->(envelope) {
        puts "MESSAGE: #{puts envelope.result[:data][:message]['msg']}"
    },
    presence: ->(envelope) {
        puts "PRESENCE: #{envelope.result[:data]}"
    }
)
pubnub.add_listener(callback: callback)
```

----------------------------------------

TITLE: Publishing Message to Channel in Ruby
DESCRIPTION: Basic example of publishing a message to a specific channel ('my_channel') using the PubNub Ruby SDK. It includes a block to handle the publish response envelope and print the status. Requires a PubNub client instance (`pubnub`).
SOURCE: https://github.com/pubnub/ruby/blob/master/docs.md#_snippet_18

LANGUAGE: Ruby
CODE:
```
pubnub.publish(
  channel: 'my_channel',
  message: { text: 'Hi!' }
) do |envelope|
  puts envelope.status
end
```

----------------------------------------

TITLE: Requiring PubNub Ruby Gem
DESCRIPTION: Demonstrates the Ruby code required to load the PubNub gem into a script or application. This line makes the PubNub classes and methods available for use in the current file.
SOURCE: https://github.com/pubnub/ruby/blob/master/docs.md#_snippet_9

LANGUAGE: Ruby
CODE:
```
require 'pubnub'
```

----------------------------------------

TITLE: Subscribing to Multiple Channels and Groups in Ruby
DESCRIPTION: Shows how to subscribe to multiple channels (with presence) and multiple channel groups in a single call to the `subscribe` method.
SOURCE: https://github.com/pubnub/ruby/blob/master/docs.md#_snippet_25

LANGUAGE: ruby
CODE:
```
pubnub.subscribe(
  channel: ['debug', 'info', 'warn'],
  channel_group: ['ruby_group', 'jruby_group', 'rbx_group'],
  presence: ['debug', 'info', 'warn']
)
```

----------------------------------------

TITLE: Subscribing to Channel and Presence in Ruby
DESCRIPTION: Shows how to subscribe to a specific channel and its corresponding presence channel simultaneously using the `subscribe` method.
SOURCE: https://github.com/pubnub/ruby/blob/master/docs.md#_snippet_22

LANGUAGE: ruby
CODE:
```
pubnub.subscribe(
  channel: 'ruby',
  presence: 'ruby'
)
```

----------------------------------------

TITLE: Pubnub Ruby SetState Envelope Object Inspection
DESCRIPTION: This snippet shows the detailed structure of the Pubnub::Envelope object returned after a SetState operation. It includes event details, options, result (which is nil in this example), status information (including code, operation, client request URI, server response, data, category, and error flag), and timetoken. The `status[:error]` field is highlighted as a key indicator of success or failure.
SOURCE: https://github.com/pubnub/ruby/blob/master/Pubnub Ruby SDK upgrade guide.md#_snippet_13

LANGUAGE: Ruby
CODE:
```
#<Pubnub::Envelope:0x005571e215cc88
 @event=:set_state,
 @event_options={:channel=>:demo, :state=>{:one=>1}, :http_sync=>true, :callback=>nil},
 @id="600bd479-8749-4278-8276-43cc7deca12a",
 @result=nil,
 @status=
  {:code=>200,
   :operation=>:set_state,
   :client_request=>
    #<URI::HTTP http://pubsub.pubnub.com/v2/presence/sub-key/sub-a-mock-key/channel/demo/uuid/96ba2f54-955c-4fd3-acb7-a8407dae2269/data?pnsdk=PubNub-Ruby%2F4.0.13&state=%7B%22one%22%3A1%7D&timestamp=1479310989&uuid=96ba2f54-955c-4fd3-acb7-a8407dae2269&signature=6LSIKJMxhTrSFbPWPfVEbQHuv%2BlK1Dt4zQwXb%2B5Lav8%3D>,
   :server_response=>
    #<HTTP::Message:0x005571e218a520
     @http_body=#<HTTP::Message::Body:0x005571e218a368 @body="{\"status\": 200, \"message\": \"OK\", \"payload\": {\"one\": 1}, \"service\": \"Presence\"}", @chunk_size=nil, @positions=nil, @size=0>,
     @http_header=
      #<HTTP::Message::Headers:0x005571e218a4f8
       @body_charset=nil,
       @body_date=nil,
       @body_encoding=#<Encoding:UTF-8>,
       @body_size=0,
       @body_type=nil,
       @chunked=false,
       @dumped=false,
       @header_item=
        [["Date", "Wed, 16 Nov 2016 15:43:10 GMT"],
         ["Content-Type", "text/javascript; charset=\"UTF-8\""],
         ["Content-Length", "78"],
         ["Connection", "keep-alive"],
         ["Access-Control-Allow-Origin", "*"],
         ["Access-Control-Allow-Methods", "OPTIONS, GET, POST"],
         ["cache-control", "no-cache"],
         ["Accept-Ranges", "bytes"],
         ["Age", "0"],
         ["Server", "Pubnub Presence"]],
       @http_version="1.1",
       @is_request=false,
       @reason_phrase="OK",
       @request_absolute_uri=nil,
       @request_method="GET",
       @request_query=nil,
       @request_uri=
        #<Addressable::URI:0x2ab8f10c5a10 URI:http://pubsub.pubnub.com/v2/presence/sub-key/sub-a-mock-key/channel/demo/uuid/96ba2f54-955c-4fd3-acb7-a8407dae2269/data?pnsdk=PubNub-Ruby%2F4.0.13&state=%7B%22one%22%3A1%7D&timestamp=1479310989&uuid=96ba2f54-955c-4fd3-acb7-a8407dae2269&signature=6LSIKJMxhTrSFbPWPfVEbQHuv%2BlK1Dt4zQwXb%2B5Lav8%3D>,
       @status_code=200>,
     @peer_cert=nil,
     @previous=nil>,
   :data=>nil,
   :category=>:ack,
   :error=>false,
   :auto_retried=>false,
   :current_timetoken=>nil,
   :last_timetoken=>nil,
   :subscribed_channels=>nil,
   :subscribed_channel_groups=>nil,
   :config=>{:tls=>false, :uuid=>"96ba2f54-955c-4fd3-acb7-a8407dae2269", :auth_key=>nil, :origin=>"pubsub.pubnub.com"}},
 @timetoken=nil>
```

----------------------------------------

TITLE: Subscribing to Presence Channel in Ruby
DESCRIPTION: Illustrates subscribing only to the presence channel for a given channel name using the `subscribe` method.
SOURCE: https://github.com/pubnub/ruby/blob/master/docs.md#_snippet_23

LANGUAGE: ruby
CODE:
```
pubnub.subscribe(
  presence: 'ruby'
)
```

----------------------------------------

TITLE: Adding Listener with Name and Callback in Ruby
DESCRIPTION: Demonstrates adding a new listener to the PubNub client instance, identified by a name ('c1') and associated with a specific callback object (`callbacks1`). This allows the client to handle messages and presence events for subscribed channels.
SOURCE: https://github.com/pubnub/ruby/blob/master/docs.md#_snippet_15

LANGUAGE: Ruby
CODE:
```
pubnub_client.add_listener(name: 'c1', callback: callbacks1)
```

----------------------------------------

TITLE: Examining PubNub HereNow Response Structure (Ruby)
DESCRIPTION: This snippet represents the structure of the Pubnub::Envelope object received after performing a HereNow operation. It illustrates the nested hash structure, showing where the presence data, including the list of UUIDs and the occupancy count, is stored within the `@result[:data]` key.
SOURCE: https://github.com/pubnub/ruby/blob/master/Pubnub Ruby SDK upgrade guide.md#_snippet_8

LANGUAGE: Ruby
CODE:
```
#<Pubnub::Envelope:0x005571e3119f40
 @event=:here_now,
 @event_options={:channel=>:demo, :http_sync=>true, :callback=>nil},
 @id="de7e1ff6-216d-4d3e-9b42-f1c83bd2fb39",
 @result=
  {:code=>200,
   :operation=>:here_now,
   :client_request=>
    #<URI::HTTP http://pubsub.pubnub.com/v2/presence/sub-key/sub-a-mock-key/channel/demo?pnsdk=PubNub-Ruby%2F4.0.13&timestamp=1479310131&uuid=96ba2f54-955c-4fd3-acb7-a8407dae2269&signature=9%2F2CaKUvCvq5jhEEzz9LScQO0O8vo7SgYBkYeQv1jMs%3D>,
   :server_response=>
    #<HTTP::Message:0x005571e315cb38
     @http_body=
      #<HTTP::Message::Body:0x005571e315ca98 @body="{\"status\": 200, \"message\": \"OK\", \"service\": \"Presence\", \"uuids\": [\"96ba2f54-955c-4fd3-acb7-a8407dae2269\"], \"occupancy\": 1}", @chunk_size=nil, @positions=nil, @size=0>,
     @http_header=
      #<HTTP::Message::Headers:0x005571e315cb10
       @body_charset=nil,
       @body_date=nil,
       @body_encoding=#<Encoding:UTF-8>,
       @body_size=0,
       @body_type=nil,
       @chunked=false,
       @dumped=false,
       @header_item=
        [["Date", "Wed, 16 Nov 2016 15:28:52 GMT"],
         ["Content-Type", "text/javascript; charset=\"UTF-8\""],
         ["Content-Length", "122"],
         ["Connection", "keep-alive"],
         ["Access-Control-Allow-Origin", "*"],
         ["Access-Control-Allow-Methods", "OPTIONS, GET, POST"],
         ["cache-control", "no-cache"],
         ["Accept-Ranges", "bytes"],
         ["Age", "0"],
         ["Server", "Pubnub Presence"]],
       @http_version="1.1",
       @is_request=false,
       @reason_phrase="OK",
       @request_absolute_uri=nil,
       @request_method="GET",
       @request_query=nil,
       @request_uri=
        #<Addressable::URI:0x2ab8f18ae8bc URI:http://pubsub.pubnub.com/v2/presence/sub-key/sub-a-mock-key/channel/demo?pnsdk=PubNub-Ruby%2F4.0.13&timestamp=1479310131&uuid=96ba2f54-955c-4fd3-acb7-a8407dae2269&signature=9%2F2CaKUvCvq5jhEEzz9LScQO0O8vo7SgYBkYeQv1jMs%3D>,
       @status_code=200>,
     @peer_cert=nil,
     @previous=nil>,
   :data=>{:uuids=>["96ba2f54-955c-4fd3-acb7-a8407dae2269"], :occupancy=>1, :total_occupancy=>nil, :total_channels=>nil, :channels=>nil}},
 @status=
  {:code=>200,
   :client_request=>
    #<URI::HTTP http://pubsub.pubnub.com/v2/presence/sub-key/sub-a-mock-key/channel/demo?pnsdk=PubNub-Ruby%2F4.0.13&timestamp=1479310131&uuid=96ba2f54-955c-4fd3-acb7-a8407dae2269&signature=9%2F2CaKUvCvq5jhEEzz9LScQO0O8vo7SgYBkYeQv1jMs%3D>,
   :server_response=>
    #<HTTP::Message:0x005571e315cb38
     @http_body=
      #<HTTP::Message::Body:0x005571e315ca98 @body="{\"status\": 200, \"message\": \"OK\", \"service\": \"Presence\", \"uuids\": [\"96ba2f54-955c-4fd3-acb7-a8407dae2269\"], \"occupancy\": 1}", @chunk_size=nil, @positions=nil, @size=0>,
     @http_header=
      #<HTTP::Message::Headers:0x005571e315cb10
       @body_charset=nil,
       @body_date=nil,
       @body_encoding=#<Encoding:UTF-8>,
       @body_size=0,
       @body_type=nil,
       @chunked=false,
       @dumped=false,
       @header_item=
        [["Date", "Wed, 16 Nov 2016 15:28:52 GMT"],
         ["Content-Type", "text/javascript; charset=\"UTF-8\""],
         ["Content-Length", "122"],
         ["Connection", "keep-alive"],
         ["Access-Control-Allow-Origin", "*"],
         ["Access-Control-Allow-Methods", "OPTIONS, GET, POST"],
         ["cache-control", "no-cache"],
         ["Accept-Ranges", "bytes"],
         ["Age", "0"],
         ["Server", "Pubnub Presence"]],
       @http_version="1.1",
       @is_request=false,
       @reason_phrase="OK",
       @request_absolute_uri=nil,
       @request_method="GET",
       @request_query=nil,
       @request_uri=
        #<Addressable::URI:0x2ab8f18ae8bc URI:http://pubsub.pubnub.com/v2/presence/sub-key/sub-a-mock-key/channel/demo?pnsdk=PubNub-Ruby%2F4.0.13&timestamp=1479310131&uuid=96ba2f54-955c-4fd3-acb7-a8407dae2269&signature=9%2F2CaKUvCvq5jhEEzz9LScQO0O8vo7SgYBkYeQv1jMs%3D>,
       @status_code=200>,
     @peer_cert=nil,
     @previous=nil>,
   :data=>nil,
   :category=>:ack,
   :error=>false,
   :auto_retried=>false,
   :current_timetoken=>nil,
   :last_timetoken=>nil,
   :subscribed_channels=>nil,
   :subscribed_channel_groups=>nil,
   :config=>{:tls=>false, :uuid=>"96ba2f54-955c-4fd3-acb7-a8407dae2269", :auth_key=>nil, :origin=>"pubsub.pubnub.com"}},
 @timetoken=nil>
```

----------------------------------------

TITLE: Pubnub Grant Operation Result Envelope - Ruby
DESCRIPTION: This snippet shows the structure of a Pubnub::Envelope object returned after a successful grant operation. It includes details about the event, options, result (including HTTP response details), and the final status object, which contains the critical `error` flag.
SOURCE: https://github.com/pubnub/ruby/blob/master/Pubnub Ruby SDK upgrade guide.md#_snippet_7

LANGUAGE: ruby
CODE:
```
#<Pubnub::Envelope:0x007fc3242582c8
 @event=:grant,
 @event_options={:channel=>:whatever, :ttl=>3600, :http_sync=>true, :callback=>nil},
 @id="a631994f-5c37-4a49-ba82-52b7aa2db685",
 @result=
  {:code=>200,
   :operation=>:grant,
   :client_request=
    #<URI::HTTP http://pubsub.pubnub.com/v1/auth/grant/sub-key/sub-a-mock-key?channel=whatever&m=1&pnsdk=PubNub-Ruby%2F4.0.13&r=1&signature=o-r78nncnqenn_LlJDoVzwP3jOhJKP2riKgcEZpbbCA%3D&timestamp=1479310015&ttl=3600&uuid=96ba2f54-955c-4fd3-acb7-a8407dae2269&w=1>,
   :server_response=
    #<HTTP::Message:0x007fc32423a6b0
     @http_body=
      #<HTTP::Message::Body:0x007fc32423a610
       @body=
        "{\"message\":\"Success\",\"payload\":{\"level\":\"channel\",\"subscribe_key\":\"sub-a-mock-key\",\"ttl\":3600,\"channels\":{\"whatever\":{\"r\":1,\"w\":1,\"m\":1}}},\"service\":\"Access Manager\",\"status\":200}",
       @chunk_size=nil,
       @positions=nil,
       @size=0>,
     @http_header=
      #<HTTP::Message::Headers:0x007fc32423a688
       @body_charset=nil,
       @body_date=nil,
       @body_encoding=#<Encoding:UTF-8>,
       @body_size=0,
       @body_type=nil,
       @chunked=false,
       @dumped=false,
       @header_item=
        [["Date", "Wed, 16 Nov 2016 15:26:55 GMT"],
         ["Content-Type", "text/javascript; charset=UTF-8"],
         ["Content-Length", "207"],
         ["Connection", "keep-alive"],
         ["Access-Control-Allow-Origin", "*"],
         ["Access-Control-Allow-Methods", "GET"],
         ["Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept"],
         ["Cache-Control", "no-cache, no-store, must-revalidate"]],
       @http_version="1.1",
       @is_request=false,
       @reason_phrase="OK",
       @request_absolute_uri=nil,
       @request_method="GET",
       @request_query=nil,
       @request_uri=
        #<Addressable::URI:0x3fe19211d678 URI:http://pubsub.pubnub.com/v1/auth/grant/sub-key/sub-a-mock-key?channel=whatever&m=1&pnsdk=PubNub-Ruby%2F4.0.13&r=1&signature=o-r78nncnqenn_LlJDoVzwP3jOhJKP2riKgcEZpbbCA%3D&timestamp=1479310015&ttl=3600&uuid=96ba2f54-955c-4fd3-acb7-a8407dae2269&w=1>,
       @status_code=200>,
     @peer_cert=nil,
     @previous=nil>,
   :data=>{"level"=>"channel", "subscribe_key"=>"sub-a-mock-key", "ttl"=>3600, "channels"=>{"whatever"=>{"r"=>1, "w"=>1, "m"=>1}}}},
 @status=
  {:code=>200,
   :client_request=
    #<URI::HTTP http://pubsub.pubnub.com/v1/auth/grant/sub-key/sub-a-mock-key?channel=whatever&m=1&pnsdk=PubNub-Ruby%2F4.0.13&r=1&signature=o-r78nncnqenn_LlJDoVzwP3jOhJKP2riKgcEZpbbCA%3D&timestamp=1479310015&ttl=3600&uuid=96ba2f54-955c-4fd3-acb7-a8407dae2269&w=1>,
   :server_response=
    #<HTTP::Message:0x007fc32423a6b0
     @http_body=
      #<HTTP::Message::Body:0x007fc32423a610
       @body=
        "{\"message\":\"Success\",\"payload\":{\"level\":\"channel\",\"subscribe_key\":\"sub-a-mock-key\",\"ttl\":3600,\"channels\":{\"whatever\":{\"r\":1,\"w\":1,\"m\":1}}},\"service\":\"Access Manager\",\"status\":200}",
       @chunk_size=nil,
       @positions=nil,
       @size=0>,
     @http_header=
      #<HTTP::Message::Headers:0x007fc32423a688
       @body_charset=nil,
       @body_date=nil,
       @body_encoding=#<Encoding:UTF-8>,
       @body_size=0,
       @body_type=nil,
       @chunked=false,
       @dumped=false,
       @header_item=
        [["Date", "Wed, 16 Nov 2016 15:26:55 GMT"],
         ["Content-Type", "text/javascript; charset=UTF-8"],
         ["Content-Length", "207"],
         ["Connection", "keep-alive"],
         ["Access-Control-Allow-Origin", "*"],
         ["Access-Control-Allow-Methods", "GET"],
         ["Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept"],
         ["Cache-Control", "no-cache, no-store, must-revalidate"]],
       @http_version="1.1",
       @is_request=false,
       @reason_phrase="OK",
       @request_absolute_uri=nil,
       @request_method="GET",
       @request_query=nil,
       @request_uri=
        #<Addressable::URI:0x3fe19211d678 URI:http://pubsub.pubnub.com/v1/auth/grant/sub-key/sub-a-mock-key?channel=whatever&m=1&pnsdk=PubNub-Ruby%2F4.0.13&r=1&signature=o-r78nncnqenn_LlJDoVzwP3jOhJKP2riKgcEZpbbCA%3D&timestamp=1479310015&ttl=3600&uuid=96ba2f54-955c-4fd3-acb7-a8407dae2269&w=1>,
       @status_code=200>,
     @peer_cert=nil,
     @previous=nil>,
   :category=>:ack,
   :error=>false,
   :auto_retried=>false,
   :current_timetoken=>nil,
   :last_timetoken=>nil,
   :subscribed_channels=>nil,
   :subscribed_channel_groups=>nil,
   :data=>nil,
   :config=>{:tls=>false, :uuid=>"96ba2f54-955c-4fd3-acb7-a8407dae2269", :auth_key=>nil, :origin=>"pubsub.pubnub.com"}},
 @timetoken=nil>
```

----------------------------------------

TITLE: PubNub Audit Result Envelope Structure in Ruby
DESCRIPTION: This code snippet shows the structure of the Pubnub::Envelope object returned after a successful audit operation using the PubNub Ruby SDK. It illustrates the nested data structure containing the operation result, server response details, and the final data payload, which is accessible via `result[:data]`.
SOURCE: https://github.com/pubnub/ruby/blob/master/Pubnub Ruby SDK upgrade guide.md#_snippet_4

LANGUAGE: Ruby
CODE:
```
#<Pubnub::Envelope:0x007fc3240706b8
 @event=:audit,
 @event_options={:channel=>:whatever, :http_sync=>true, :callback=>nil},
 @id="e344be13-95b6-48bc-bf2e-47db0b19368c",
 @result=
  {:code=>200,
   :operation=>:audit,
   :client_request=
    #<URI::HTTP http://pubsub.pubnub.com/v1/auth/audit/sub-key/sub-a-mock-key?channel=whatever&pnsdk=PubNub-Ruby%2F4.0.13&signature=724F4F024fhSolYgMc5dQrAGOY7tFZeo_2_XKxAvg0g%3D&timestamp=1479309113&uuid=96ba2f54-955c-4fd3-acb7-a8407dae2269>,
   :server_response=
    #<HTTP::Message:0x007fc3240575f0
     @http_body=
      #<HTTP::Message::Body:0x007fc324057550
       @body="{\"message\":\"Success\",\"payload\":{\"level\":\"channel\",\"subscribe_key\":\"sub-a-mock-key\",\"channels\":{}},\"service\":\"Access Manager\",\"status\":200}",
       @chunk_size=nil,
       @positions=nil,
       @size=0>,
     @http_header=
      #<HTTP::Message::Headers:0x007fc3240575c8
       @body_charset=nil,
       @body_date=nil,
       @body_encoding=#<Encoding:UTF-8>,
       @body_size=0,
       @body_type=nil,
       @chunked=false,
       @dumped=false,
       @header_item=
        [["Date", "Wed, 16 Nov 2016 15:11:54 GMT"],
         ["Content-Type", "text/javascript; charset=UTF-8"],
         ["Content-Length", "166"],
         ["Connection", "keep-alive"],
         ["Access-Control-Allow-Origin", "*"],
         ["Access-Control-Allow-Methods", "GET"],
         ["Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept"],
         ["Cache-Control", "no-cache, no-store, must-revalidate"]],
       @http_version="1.1",
       @is_request=false,
       @reason_phrase="OK",
       @request_absolute_uri=nil,
       @request_method="GET",
       @request_query=nil,
       @request_uri=
        #<Addressable::URI:0x3fe19202be2c URI:http://pubsub.pubnub.com/v1/auth/audit/sub-key/sub-a-mock-key?channel=whatever&pnsdk=PubNub-Ruby%2F4.0.13&signature=724F4F024fhSolYgMc5dQrAGOY7tFZeo_2_XKxAvg0g%3D&timestamp=1479309113&uuid=96ba2f54-955c-4fd3-acb7-a8407dae2269>,
       @status_code=200>,
     @peer_cert=nil,
     @previous=nil>,
   :data=>{"level"=>"channel", "subscribe_key"=>"sub-a-mock-key", "channels"=>{}}},
 @status=
  {:code=>200,
   :client_request=
    #<URI::HTTP http://pubsub.pubnub.com/v1/auth/audit/sub-key/sub-a-mock-key?channel=whatever&pnsdk=PubNub-Ruby%2F4.0.13&signature=724F4F024fhSolYgMc5dQrAGOY7tFZeo_2_XKxAvg0g%3D&timestamp=1479309113&uuid=96ba2f54-955c-4fd3-acb7-a8407dae2269>,
   :server_response=
    #<HTTP::Message:0x007fc3240575f0
     @http_body=
      #<HTTP::Message::Body:0x007fc324057550
       @body="{\"message\":\"Success\",\"payload\":{\"level\":\"channel\",\"subscribe_key\":\"sub-a-mock-key\",\"channels\":{}},\"service\":\"Access Manager\",\"status\":200}",
       @chunk_size=nil,
       @positions=nil,
       @size=0>,
     @http_header=
      #<HTTP::Message::Headers:0x007fc3240575c8
       @body_charset=nil,
       @body_date=nil,
       @body_encoding=#<Encoding:UTF-8>,
       @body_size=0,
       @body_type=nil,
       @chunked=false,
       @dumped=false,
       @header_item=
        [["Date", "Wed, 16 Nov 2016 15:11:54 GMT"],
         ["Content-Type", "text/javascript; charset=UTF-8"],
         ["Content-Length", "166"],
         ["Connection", "keep-alive"],
         ["Access-Control-Allow-Origin", "*"],
         ["Access-Control-Allow-Methods", "GET"],
         ["Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept"],
         ["Cache-Control", "no-cache, no-store, must-revalidate"]],
       @http_version="1.1",
       @is_request=false,
       @reason_phrase="OK",
       @request_absolute_uri=nil,
       @request_method="GET",
       @request_query=nil,
       @request_uri=
        #<Addressable::URI:0x3fe19202be2c URI:http://pubsub.pubnub.com/v1/auth/audit/sub-key/sub-a-mock-key?channel=whatever&pnsdk=PubNub-Ruby%2F4.0.13&signature=724F4F024fhSolYgMc5dQrAGOY7tFZeo_2_XKxAvg0g%3D&timestamp=1479309113&uuid=96ba2f54-955c-4fd3-acb7-a8407dae2269>,
       @status_code=200>,
     @peer_cert=nil,
     @previous=nil>,
   :category=>:ack,
   :error=>false,
   :auto_retried=>false,
   :current_timetoken=>nil,
   :last_timetoken=>nil,
   :subscribed_channels=>nil,
   :subscribed_channel_groups=>nil,
   :data=>nil,
   :config=>{:tls=>false, :uuid=>"96ba2f54-955c-4fd3-acb7-a8407dae2269", :auth_key=>nil, :origin=>"pubsub.pubnub.com"}},
 @timetoken=nil>
```