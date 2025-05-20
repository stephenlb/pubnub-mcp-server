PubNub Objects App Context Metadata
==================

App Context is a feature that lets you store and manage data (also called metadata) for users, channels, and relationships between them (membership) directly within the PubNub platform.

This way, you can provide personalized and context-rich interactions in real-time applications without needing external databases, enhancing user experience while ensuring data security and compliance.

Configuration[​](#configuration "Direct link to Configuration")
---------------------------------------------------------------

To use App Context, you must have it enabled and configured on a chosen app's keyset in the [Admin Portal](https://admin.pubnub.com/).

##### Public Admin Portal demo

Want to browse through the Admin Portal without creating an account? Explore it through the [Public Demo](https://demo-admin.pubnub.com/) that shows examples of most PubNub features for transport and logistics use case.

By default, Admin Portal prompts you to enable App Context on every new keyset (unless you select **Choose later** for **Region** during keyset creation).

All testing keysets have `US East` selected as the default region for storing your app's user, channel, and management data.

![App Context in Admin Portal](/assets/images/app-context-0a1fcf08006cdc64c75ae3c5feb420f3.png)

Option

Description

**Bucket Region**

Geographical region where your App Context data is stored and managed. Choosing a region closer to your user base can reduce latency and improve performance. Once you select a region and save the settings, you cannot change it.

**User Metadata Events**

Enables or disables the generation and dispatch of events related to changes in user metadata. When enabled, any create, update, or delete operation on user metadata will trigger an event, which can be consumed by subscribers in real time to react to changes immediately.  
  
Head to [Real-time updates](/docs/general/metadata/basics#real-time-updates) section to find out about user event types and how to receive them.

**Channel Metadata Events**

Controls whether events are generated when channel metadata is created, updated, or deleted. Similar to user metadata events, these allow applications to subscribe to these events and respond dynamically to channel characteristics or properties changes, facilitating real-time updates across clients.  
  
Head to [Real-time updates](/docs/general/metadata/basics#real-time-updates) section to find out about channel event types and how to receive them.

**Membership Events**

Determines if events related to memberships (associations between users and channels) will be generated and sent. This option is crucial for applications that need to manage and respond to changes in which users are part of which channels, supporting dynamic access control and personalized user experiences. Just like with other event types, you must subscribe to them for your app to receive and handle them.  
  
Head to [Real-time updates](/docs/general/metadata/basics#real-time-updates) section to find out about membership event types and how to receive them.

**Disallow Get All Channel Metadata**

This option blocks your app from accessing metadata of all channels in apps with enabled [Access Manager](/docs/general/security/access-control).  
  
If you enable Access Manager and uncheck this option, you can `get` all channel metadata without the need to define that in the permissions schema included in the authentication token.

**Disallow Get All User Metadata**

This option blocks your app from accessing metadata of all users in apps with enabled [Access Manager](/docs/general/security/access-control).  
  
If you enable Access Manager and uncheck this option, you can `get` all user metadata without the need to define that in the permissions schema included in the authentication token.

**Enforce referential integrity for memberships**

When enabled, you can set new membership only when both the specified user ID and channel ID exist as standalone user and channel metadata entities. Deleting a parent user or channel metadata entity automatically deletes any child membership associations for that deleted entity.  
  
When disabled, memberships can be created even for the non-existent user and channel entities, while deleting a user or channel entity does not automatically delete any associated membership objects.

Functional components[​](#functional-components "Direct link to Functional components")
---------------------------------------------------------------------------------------

App Context is an umbrella term for these three metadata types:

*   [Channel metadata](/docs/general/metadata/channel-metadata) — Maintain channel-related data, including names, descriptions, or custom attributes that support the dynamics of a particular channel within your application.
    
*   [User metadata](/docs/general/metadata/users-metadata) — Store and manage user-specific information such as name, email, or custom attributes using the serverless storage provided by the App Context.
    
*   [Membership metadata](/docs/general/metadata/membership-metadata) — Handle the relationships between users and channels, facilitating the addition, update, or removal of users from channels and vice versa.
    

Data management[​](#data-management "Direct link to Data management")
---------------------------------------------------------------------

You can manage App Context data in PubNub through SDK methods, REST API endpoints and calls, or the BizOps Workspace GUI. Your choice of method depends on your operational needs and technical preferences.

### SDKs[​](#sdks "Direct link to SDKs")

SDKs are best for real-time, in-app interactions. PubNub provides SDKs for various programming languages and platforms, making it easy to manage App Context data programmatically within your applications.

In the left navigation of each set of [SDK docs](/docs/sdks), you can find the **App Context** section listing all methods for managing App Context data. For reference, check [JavaScript](/docs/sdks/javascript/api-reference/objects).

### REST API[​](#rest-api "Direct link to REST API")

REST API is ideal for server-to-server interactions, or integration with systems not supported by the SDKs.

PubNub's [REST API](/docs/sdks/rest-api) provides another way to manage App Context data. This is useful for server-side operations where an SDK may not be integrated or for administrative tasks that can be performed from various platforms that can make HTTP requests.

*   [Users API](/docs/sdks/rest-api/app-context-user-introduction)
*   [Channels API](/docs/sdks/rest-api/app-context-channel-introduction)
*   [Memberships API](/docs/sdks/rest-api/app-context-membership-introduction)

### BizOps Workspace[​](#bizops-workspace "Direct link to BizOps Workspace")

[BizOps Workspace](/docs/bizops-workspace/basics) is perfect for operational teams without technical expertise who prefer to manage user, channel, and membership data through a GUI.

BizOps Workspace is available in the Admin Portal UI and contains these App Context-related views:

*   [User management](/docs/bizops-workspace/user-management) — for creating, updating, and deleting user and membership data
*   [Channel management](/docs/bizops-workspace/channel-management) — for creating, updating, and deleting channel and membership data

Real-time updates[​](#real-time-updates "Direct link to Real-time updates")
---------------------------------------------------------------------------

PubNub generates events when changes (such as updates, deletions, or additions) occur to metadata for users, channels, and their memberships (user-channel relationships). Clients can subscribe to receive these events in real time, react dynamically to these changes, and update their front-end application accordingly.

### App Context events[​](#app-context-events "Direct link to App Context events")

PubNub defined the following App Context events:

Event

Type

When it's fired

**User Metadata Set**

User

Metadata is set for a user

**User Metadata Deleted**

User

Metadata is deleted for a user

**Channel Metadata Set**

Channel

Metadata is set for a channel

**Channel Metadata Deleted**

Channel

Metadata is deleted for a channel

**User Added to Channel**

Membership

A membership record is created or updated between a user and a channel

**User Removed from Channel**

Membership

A membership record is removed between a user and a channel

All App Context events use the following format:

    {  "channel": "sample-channel",  // event payload  "message": {    // API from which data is originating     "source": "objects",     // event structure version     "version": "2.0",     // type of occurring event, e.g. "set" or "delete"     "event": "sample-event",     // category of data, e.g. "membership" or "channel"     "type": "sample-type",     // specific event-related data     "data": {      // e.g. "type": {member.Type},

show all 24 lines

The fields are defined as follows:

*   **event** indicates what happened, and can be `set` or `delete`
*   **type** indicates where the event happened, and can be `uuid` (user), `channel`, or `membership`
*   **data** contains event-specific information

##### User metadata event notifications

When the [**User Metadata Events**](#configuration) option is enabled on a keyset, any modification to a user entity (`set` and `delete`) results in sending event notifications to any membership associations, so both that user and any channel they are a member of.  
  
For example, if a user with User ID `test-user-1` is a member of channels `test-channel-1` and `test-channel-2`, and that user entity is modified, a `set` event for type `uuid` is published to the three channels: `test-user-1` (user-associated channel), `test-channel-1`, and `test-channel-2`. Similarly, a `delete` event is published to those three channels if that User ID is deleted.

### Subscribe to App Context events[​](#subscribe-to-app-context-events "Direct link to Subscribe to App Context events")

Subscribing to App Context events in PubNub involves using a PubNub SDK to listen for real-time changes in metadata related to users, channels, or memberships.

Detailed steps on how to set up event subscriptions are listed in the documentation of a given [SDK](/docs/sdks), but the general steps are as follows:

1.  **Initialize PubNub** — Set up your PubNub instance using your publish and subscribe keys.
    
2.  **Add a listener** — Implement an event listener (also called event handler) that will handle incoming messages and events related to App Context (used to called Objects) features, such as user metadata, channel metadata, and memberships. For more information on adding an event listener, head to the [Receive](/docs/general/messages/receive#add-an-event-handler) section.
    
3.  **Subscribe to channels** — Determine the channels or channel patterns that will receive App Context events and subscribe to them.
    
    You can choose whether to subscribe to the channel (if you are interested in receiving all membership info from that channel) or a user (if you are interested in listening to changes/events concerning the user’s data or their memberships). Subscribing to a user involves setting up a subscription to a particular channel for user change events, which typically is the user’s user ID.
    

Subscribing to App Context events primarily relies on using SDKs and event listeners. However, you can also use [PubNub Functions](/docs/serverless/functions/overview) to consume, modify, and analyze messages or events in real-time by writing JavaScript code that executes directly on the PubNub network.

API limits[​](#api-limits "Direct link to API limits")
------------------------------------------------------

PubNub imposes soft and hard limits for user and channel metadata in an App Context API, including size constraints for records and field character limits and recommended maximums for user memberships and channel members. For details, head to [API Limits](/docs/general/setup/limits#app-context).

Last updated on **Apr 17, 2025**

On this page

Channel Metadata
================

##### Manage channel data with BizOps Workspace

You can create, edit, or delete channels and their data using [BizOps Workspace](/docs/bizops-workspace/channel-management) on Admin Portal that provides a preview of all channels available on your apps' keysets.

The App Context service allows you to persist metadata about [channels](#channel-metadata), [channel memberships](/docs/general/metadata/membership-metadata), [channel members](/docs/general/metadata/membership-metadata#channel-member), and [users](/docs/general/setup/users-and-devices). The `name` and `description` are the predefined properties for channel metadata. Additionally, there is a `custom` property that you can use to store any custom attribute about a channel as per your business needs.

##### Illuminate & sensitive data

You can capture and track your App Context data in [Illuminate](/docs/illuminate/basics) for real-time decisioning and analytics. Illuminate captures all data you define with JSON paths and [map](/docs/illuminate/business-objects/basics#data-mapping) when creating measures and dimensions for the Business Objects. For this reason, make sure you don’t include any PII data (e-mail address, profile URL, or IP address) in the `custom` fields of your App Context mappings.

Channel Metadata[​](#channel-metadata "Direct link to Channel Metadata")
------------------------------------------------------------------------

The App Context service emits events when the metadata associated to a particular channel ID is set or deleted. Your application can receive these events in real time and dynamically react to data changes by updating the information visible on the front end of your app, for instance.

In the following sections, we're going to focus on what you can actually do with channels and their metadata.

### Set Channel Metadata[​](#set-channel-metadata "Direct link to Set Channel Metadata")

You can set any of the predefined or custom channel metadata by providing the desired information as key/value pairs.

##### API limits

To learn about the maximum length of parameters used to set channel metadata, refer to [REST API docs](/docs/sdks/rest-api/set-channel-metadata).

The code below adds the `name`, `description`, and custom `owner` information to the channel `my_channel`.

*   JavaScript
*   Objective-C
*   Java
*   C#

    pubnub.objects.setChannelMetadata({    channel: "my_channel",    data: {      name: "main channel",      description: "This channel is for company wide chatter.",      custom: { "owner": "johndoe_1" }    }});

    self.client.objects().setChannelMetadata(@"my_channel")    .name(@"main channel")    .information(@"This channel is for company wide chatter.")    .custom(@{ @"owner": @"johndoe_1" })    .includeFields(PNChannelCustomField)    .performWithCompletion(^(PNSetChannelMetadataStatus *status) {      if (!status.isError) {          /**           * Channel metadata successfully has been set.           * Channel metadata information available here: status.data.metadata           */      } else {          /**           * Handle channel metadata update error. Check 'category' property to find out possible           * issue because of which request did fail.

show all 20 lines

    Map<String, Object> custom = new HashMap<>();custom.put("owner", "johndoe_1");pubnub.setChannelMetadata()    .channel("my_channel")    .name("main channel")    .description("This channel is for company wide chatter.")    .custom(custom)    .includeCustom(true)    .async(result -> { /* check result */ });

    PNResult<PNSetChannelMetadataResult> setChannelMetadataResponse = await pubnub.SetChannelMetadata()    .Channel("my_channel")    .Name("main channel")    .Description("This channel is for company wide chatter.")    .Custom(new Dictionary<string, object>() { { "owner", "johndoe_1" } })    .IncludeCustom(true)    .ExecuteAsync();PNSetChannelMetadataResult setChannelMetadataResult = setChannelMetadataResponse.Result;PNStatus status = setChannelMetadataResponse.Status;

On success, the PubNub SDK returns same metadata object along with status 200, it will also the fire `objects` -> `channel` -> `set` event so it can be consumed for other clients (users). Refer to [Init & Add Listener section](/docs/general/messages/receive) to learn more.

### Get Channel Metadata[​](#get-channel-metadata "Direct link to Get Channel Metadata")

You can retrieve the metadata of a specific channel by simply providing the channel ID. You can optionally specify whether custom metadata should be included in the response. The code below returns all metadata of the channel with the ID `my_channel`.

*   JavaScript
*   Objective-C
*   Java
*   C#

    pubnub.objects.getChannelMetadata({        channel: "my_channel"});

    self.client.objects().channelMetadata(@"my_channel")    .includeFields(PNChannelCustomField)    .performWithCompletion(^(PNFetchChannelsMetadataResult *result, PNErrorStatus *status) {        if (!status.isError) {            /**             * Channel metadata successfully fetched.             * Channel metadata information available here: result.data.metadata             */        } else {            /**             * Handle channel metadata fetch error. Check 'category' property to find out possible             * issue because of which request did fail.             *             * Request can be resent using: [status retry]             */

show all 17 lines

    pubnub.getChannelMetadata()    .channel("my_channel")    .includeCustom(true)    .async(result -> { /* check result */ });

    PNResult<PNGetChannelMetadataResult> getChannelMetadataResponse = await pubnub.GetChannelMetadata()    .Channel("my_channel")    .IncludeCustom(true)    .ExecuteAsync();PNGetChannelMetadataResult getChannelMetadataResult = getChannelMetadataResponse.Result;PNStatus status = getChannelMetadataResponse.Status;

On success, the PubNub SDK returns the metadata of the specified channel along with status 200.

### Get Metadata for All Channels[​](#get-metadata-for-all-channels "Direct link to Get Metadata for All Channels")

You can also retrieve metadata for all the channels associated with the API key. You can optionally specify whether custom metadata should be included in the response. The code below returns all predefined and custom metadata of all channels:

*   JavaScript
*   Objective-C
*   Java
*   C#

    pubnub.objects.getAllChannelMetadata();

    self.client.objects().allChannelsMetadata()    .start(@"<next from previous request>")    .includeFields(PNChannelCustomField)    .performWithCompletion(^(PNFetchAllChannelsMetadataResult *result, PNErrorStatus *status) {        if (!status.isError) {            /**             * Channels metadata successfully fetched.             * Result object has following information:             *   result.data.metadata - List of fetched channels metadata.             *   result.data.next - Random string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.             *   result.data.prev - Random string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data.             *   result.data.totalCount - Total number of associated channel metadata.        } else {            /**             * Handle channels metadata fetch error. Check 'category' property to find out possible

show all 21 lines

    pubnub.getAllChannelsMetadata()    .includeCustom(true)    .async(result -> { /* check result */ });

    PNResult<PNGetAllChannelMetadataResult> getAllChannelMetadataResponse = await pubnub.GetAllChannelMetadata()    .IncludeCustom(true)    .ExecuteAsync();PNGetAllChannelMetadataResult getAllChannelMetadataResult = getAllChannelMetadataResponse.Result;PNStatus status2 = getAllChannelMetadataResponse.Status;

On success, the PubNub SDK returns a paginated list of metadata for all channels.

### Remove Channel Metadata[​](#remove-channel-metadata "Direct link to Remove Channel Metadata")

You can remove all metadata for a single channel. The code below removes all metadata of the channel with the ID `my_channel`.

##### Cascading deletes

Enabling [referential integrity](/docs/general/metadata/basics#configuration) on your app’s keyset in the Admin Portal ensures that deleting a channel entity automatically deletes any memberships related to this channel. If it's not enabled, deleting a channel does not automatically delete any associated membership objects.

*   JavaScript
*   Objective-C
*   Java
*   C-Sharp

    pubnub.objects.removeChannelMetadata({    channel: "my_channel"});

    self.client.objects().removeChannelMetadata(@"my_channel")    .performWithCompletion(^(PNAcknowledgmentStatus *status) {        if (!status.isError) {            // Channel metadata successfully removed.        } else {            /**             * Handle channel metadata remove error. Check 'category' property to find out possible             * issue because of which request did fail.             *             * Request can be resent using: [status retry]             */        }    });

    pubnub.removeChannelMetadata()    .channel("my_channel")    .async(result -> { /* check result */ });

    PNResult<PNRemoveChannelMetadataResult> removeChannelMetadataResponse = await pubnub.RemoveChannelMetadata()    .Channel("my_channel")    .ExecuteAsync();PNRemoveChannelMetadataResult removeChannelMetadataResult = removeChannelMetadataResponse.Result;PNStatus status = removeChannelMetadataResponse.Status;

On completion, the PubNub SDK will fire the `objects` -> `channel` -> `delete` event so it can be consumed for other clients (users). Refer to [Receive Messages](/docs/general/messages/receive) to learn more.

Last updated on **Jan 27, 2025**

On this page

User Metadata
=============

##### Manage user data with BizOps Workspace

You can create, edit, or delete users and their data using [BizOps Workspace](/docs/bizops-workspace/user-management) on Admin Portal that provides a preview of all users available on your apps' keysets.

The App Context feature provides easy-to-use, serverless storage for user metadata, channel metadata, channel memberships, and channel members without the need to stand up an external infrastructure.

Clients can optionally store metadata for users to use them in front-end applications and enhance your application. You can store any of the predefined properties for a user such as `name`, `email`, `profileURL`, `externalId`. Additionally, you can use a `custom` property to store any custom attribute for a user. Some examples of custom data are nickname, color etc.

##### User ID / UUID

User ID is also referred to as **`UUID`/`uuid`** in some APIs and server responses but **holds the value** of the **`userId`** parameter you set during initialization.

PubNub also generates events when the metadata associated to a particular user is set or deleted. Your application can receive these events in real time and dynamically react to data changes within the app. You can enable these events from the [Admin Portal](https://admin.pubnub.com/).

Events for each user are published to a channel named for each user. For example, to receive events for the user with User ID `chat-user-9A7X8`, you would subscribe to the channel named `chat-user-9A7X8`.

##### Illuminate & sensitive data

You can capture and track your App Context data in [Illuminate](/docs/illuminate/basics) for real-time decisioning and analytics. Illuminate captures all data you define with JSON paths and [map](/docs/illuminate/business-objects/basics#data-mapping) when creating measures and dimensions for the Business Objects. For this reason, make sure you don’t include any PII data (e-mail address, profile URL, or IP address) in the `custom` fields of your App Context mappings.

Set User Metadata[​](#set-user-metadata "Direct link to Set User Metadata")
---------------------------------------------------------------------------

You can set any of the predefined or custom user metadata by providing the desired information as key/value pairs.

##### API limits

To learn about the maximum length of parameters used to set user metadata, refer to [REST API docs](/docs/sdks/rest-api/set-user-metadata).

The code below adds the `name`, `email`, and custom `nickname` information to the current user.

*   JavaScript
*   Objective-C
*   Java
*   C#

    pubnub.objects.setUUIDMetadata({    data: {        name: "John Doe",        email: "johndoe@pubnub.com",        custom: {            "nickname": "Mr. Mysterious"        }    }});

    self.client.objects().setUUIDMetadata()    .uuid(@"uuid")    .name(@"John Doe")    .custom(@{ @"nickname": @("Mr. Mysterious") })    .email(@"johndoe@pubnub.com")    .includeFields(PNUUIDCustomField)    .performWithCompletion(^(PNSetUUIDMetadataStatus *status) {        if (!status.isError) {            /**             * User ID metadata successfully has been set.             * User ID metadata information available here: status.data.metadata             */        } else {            /**             * Handle User ID metadata set error. Check 'category' property to find out possible issue

show all 21 lines

    Map<String, Object> custom = new HashMap<>();custom.put("nickname", "Mr. Mysterious");pubnub.setUUIDMetadata()    .name("John Doe")    .email("johndoe@pubnub.com")    .custom(custom)    .includeCustom(true)    .async(result -> { /* check result */ });

    PNResult<PNSetUuidMetadataResult> setUuidMetadataResponse = await pubnub.SetUuidMetadata()        .Uuid(config.Uuid)        .Name("John Doe")        .Email("johndoe@pubnub.com")        .Custom(new Dictionary<string, object>() { { "nickname", "Mr. Mysterious" } })        .ExecuteAsync();PNSetUuidMetadataResult setUuidMetadataResult = setUuidMetadataResponse.Result;PNStatus status = setUuidMetadataResponse.Status;

On success, the PubNub SDK will return the metadata of the user along with the status 200. It will also fire a `User Metadata Set` event that can be consumed by other clients. Refer to the [Receive Messages](/docs/general/messages/receive) section to learn more.

Get User Metadata[​](#get-user-metadata "Direct link to Get User Metadata")
---------------------------------------------------------------------------

You can retrieve the metadata of the current user. The code below returns all metadata for the current user.

*   JavaScript
*   Objective-C
*   Java
*   C#

    pubnub.objects.getUUIDMetadata();

    self.client.objects().uuidMetadata()    .uuid(@"uuid")    .includeFields(PNUUIDCustomField)    .performWithCompletion(^(PNFetchUUIDMetadataResult *result, PNErrorStatus *status) {      if (!status.isError) {          /**           * User ID metadata successfully fetched.           * Fetched User ID metadata information available here: result.data.metadata           */      } else {          /**           * Handle User ID metadata fetch error. Check 'category' property to find out possible issue           * because of which request did fail.           *           * Request can be resent using: [status retry]

show all 18 lines

    pubnub.getUUIDMetadata().async(result -> { /* check result */ });

    // Get Metadata for the current userPNResult<PNGetUuidMetadataResult> getUuidMetadataResponse = await pubnub.GetUuidMetadata()    .ExecuteAsync();PNGetUuidMetadataResult getUuidMetadataResult = getUuidMetadataResponse.Result;PNStatus status = getUuidMetadataResponse.Status;// Get Metadata for a specific userPNResult<PNGetUuidMetadataResult> getUuidMetadataResponse = await pubnub.GetUuidMetadata()    .Uuid("my-uuid")    .ExecuteAsync();PNGetUuidMetadataResult getUuidMetadataResult = getUuidMetadataResponse.Result;PNStatus status = getUuidMetadataResponse.Status;

On success, the PubNub SDK will return the all metadata of the user along with the status 200.

Get Metadata for All Users[​](#get-metadata-for-all-users "Direct link to Get Metadata for All Users")
------------------------------------------------------------------------------------------------------

You can also retrieve metadata for all users at once. If you're interested in their custom metadata as well, you can optionally specify whether custom metadata should be included in the response. The code below returns all predefined and custom metadata of all users:

*   JavaScript
*   Objective-C
*   Java
*   C#

    pubnub.objects.getAllUUIDMetadata();

    self.client.objects().allUUIDMetadata()    .start(@"<next from previous request>")    .includeFields(PNUUIDCustomField)    .performWithCompletion(^(PNFetchAllUUIDMetadataResult *result, PNErrorStatus *status) {        if (!status.isError) {            /**             * UUID metadata successfully fetched.             * Result object has following information:             *   result.data.metadata - List of fetched UUID metadata.             *   result.data.next - Random string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.             *   result.data.prev - Random string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data.             *   result.data.totalCount - Total number of created UUID metadata.             */        } else {            /**

show all 22 lines

    pubnub.getAllUUIDMetadata()    .includeTotalCount(true)    .includeCustom(true)    .async(result -> { /* check result */ });

    PNResult<PNGetAllUuidMetadataResult> getAllUuidMetadataResponse = await pubnub.GetAllUuidMetadata()    .IncludeCustom(true)    .IncludeCount(true)    .ExecuteAsync();PNGetAllUuidMetadataResult getAllUuidMetadataResult = getAllUuidMetadataResponse.Result;PNStatus status = getAllUuidMetadataResponse.Status;

On success, the PubNub SDK will return the all metadata of all users associated with the API key along with the status 200.

Remove User Metadata[​](#remove-user-metadata "Direct link to Remove User Metadata")
------------------------------------------------------------------------------------

You can remove all metadata for a single user. The code below removes all metadata of the current user.

##### Cascading deletes

Enabling [referential integrity](/docs/general/metadata/basics#configuration) on your app’s keyset in the Admin Portal ensures that deleting a user entity automatically deletes any memberships related to this user. If it's not enabled, deleting a user does not automatically delete any associated membership objects.

*   JavaScript
*   Objective-C
*   Java
*   C#

    pubnub.objects.removeUUIDMetadata();

    self.client.objects().removeUUIDMetadata()    .uuid(@"uuid")    .performWithCompletion(^(PNAcknowledgmentStatus *status) {        if (!status.isError) {             // User successfully deleted.        } else {            /**             * Handle user delete error. Check 'category' property to find out possible issue             * because of which request did fail.             *             * Request can be resent using: [status retry]             */        }    });

    pubnub.removeUUIDMetadata()    .async(result -> { /* check result */ });

    PNResult<PNRemoveUuidMetadataResult> removeUuidMetadataResponse = await pubnub.RemoveUuidMetadata()    .ExecuteAsync();PNRemoveUuidMetadataResult removeUuidMetadataResult = removeUuidMetadataResponse.Result;PNStatus status = removeUuidMetadataResponse.Status;

On completion, the PubNub SDK will fire `object` -> `uuid` -> `delete` event that can be consumed by other clients. Refer to the [Receive Messages](/docs/general/messages/receive) document to learn more.

Last updated on **Jun 12, 2024**

On this page

Membership Metadata
===================

##### Manage membership with BizOps Workspace

You can manage user-channel membership using [BizOps Workspace](/docs/bizops-workspace/user-management#manage-membership) on Admin Portal that lets you add, update, or remove users from channels on your apps' keysets.

Apart from [users](/docs/general/metadata/users-metadata) and [channels](/docs/general/channels/overview), PubNub also allows you to store the relations between them called _memberships_. Each user that you add to a channel becomes a _member_ of that specific channel.

##### Memberships and subscriptions

Adding channel memberships to a user isn't the same as subscribing to a channel by that user. The act of adding channel memberships doesn't result in receiving messages sent to that channel. To receive messages, [subscribe](/docs/general/channels/subscribe).

Persisting membership information isn't necessary to send or receive messages, but comes in handy when you want to keep track of the subscribers of a particular channel. Using a membership association, your application can display channel memberships lists for each user or give the user the possibility to join or leave channels at their discretion, for example.

When a user opens a in-app messaging app and joins a few channels they're interested in, they're expressing the desire to change their current memberships - it's always the user who wants to manage their memberships. Because of this, membership methods take the current client's User ID by default unless another user's User ID is explicitly specified.

##### User ID / UUID

User ID is also referred to as **`UUID`/`uuid`** in some APIs and server responses but **holds the value** of the **`userId`** parameter you set during initialization.

PubNub emits events to notify clients when users are added to or removed from a channel. You can enable this feature using the [Admin Portal](https://admin.pubnub.com). In the **App Context** section, select or clear the appropriate checkboxes to enable or disable sending particular events.

##### Illuminate & sensitive data

You can capture and track your App Context data in [Illuminate](/docs/illuminate/basics) for real-time decisioning and analytics. Illuminate captures all data you define with JSON paths and [map](/docs/illuminate/business-objects/basics#data-mapping) when creating measures and dimensions for the Business Objects. For this reason, make sure you don’t include any PII data (e-mail address, profile URL, or IP address) in the `custom` fields of your App Context mappings.

The App Context service allows you to perform the following operations on memberships:

Channel Memberships[​](#channel-memberships "Direct link to Channel Memberships")
---------------------------------------------------------------------------------

Operation

Description

[Set channel memberships](#set-channel-memberships)

Adds the current user to one or more channels or updates the custom metadata for the existing memberships. This operation creates a membership for the user to the specified channels.

[Remove channel memberships](#remove-channel-memberships)

Removes the current user from one or more channels. This operation removes a membership for the user from the specified channels.

[Get channel memberships](#get-channel-memberships)

Returns a list of channel memberships for the current user.

### Set Channel Memberships[​](#set-channel-memberships "Direct link to Set Channel Memberships")

You can add a single user to one or more channels (effectively creating a membership relation between the user and the channels) or update the custom metadata of the user's one or more existing memberships. To update custom metadata of existing memberships, provide the desired information as key/value pairs.

##### API limits

To learn about the maximum length of parameters used to set channel membership metadata, refer to [REST API docs](/docs/sdks/rest-api/set-membership-metadata).

The code below adds the current user to the channels `my_channel` and `my_channel_2` and adds the `starred` metadata to the newly created `my_channel_2` membership.

*   JavaScript
*   Objective-C
*   Java
*   C#

    pubnub.objects.setMemberships({    channels: [    "channel-1",    {id: "channel-2", custom: {starred: true}    }]});

    NSArray<NSDictionary *> *channels = @[  @{ @"channel": @"my_channel" },  @{ @"channel": @"my_channel_2", @"custom": @{ @"starred": @YES } }];self.client.objects().setMemberships()    .uuid(@"uuid")    .channels(channels)    .includeCount(YES)    .limit(40)    .includeFields(NMembershipCustomField | PNMembershipChannelField)    .performWithCompletion(^(PNManageMembershipsStatus *status) {        if (!status.isError) {            /**             * UUID's memberships successfully set.

show all 30 lines

    Map<String, Object> custom = new HashMap<>();custom.put("starred", true);pubnub.setMemberships()    .channelMemberships(Arrays.asList(PNChannelMembership.channel("my_channel"), PNChannelMembership.channelWithCustom("my_channel_2", custom)))    .async(result -> { /* check result */ });

    List<PNMembership> setMembershipChannelMetadataIdList = new List<PNMembership>();if (!string.IsNullOrEmpty(seMembershipChannelMetaId)){    setMembershipChannelMetadataIdList.Add(new PNMembership() { Channel = "my_channel" });    setMembershipChannelMetadataIdList.Add(new PNMembership() { Channel = "my_channel_2", Custom = new Dictionary<string, object>() { { "starred", true } } });}PNResult<PNMembershipsResult> setMembershipsResponse = await pubnub.SetMemberships()    .Uuid("my-user-id")    .Channels(setMembershipChannelMetadataIdList)    .Include(new PNMembershipField[] { PNMembershipField.CUSTOM, PNMembershipField.CHANNEL, PNMembershipField.CHANNEL_CUSTOM })    .IncludeCount(true)    .ExecuteAsync();PNMembershipsResult setMembershipsResult = setMembershipsResponse.Result;PNStatus status = setMembershipsResponse.Status;

On success, the PubNub SDK will return the channel data for all the specified channels along with the status 200. It will also fire the `objects` -> `membership` -> `set` event so it can be consumed for other clients (users).

##### Referential integrity

Enabling [referential integrity](/docs/general/metadata/basics#configuration) on your app’s keyset in the Admin Portal ensures that memberships can only be created for existing users and channels, and automatically deletes memberships when their associated user or channel is deleted.

If it’s not enabled, memberships can be created even for the non-existent user and channel entities, while deleting a user or channel entity does not automatically delete any associated membership objects.

### Remove Channel Memberships[​](#remove-channel-memberships "Direct link to Remove Channel Memberships")

You can remove a single user from one or more channels, effectively deleting a membership relation between the user and the channels. The code below removes the current user from the channel `my_channel_2`.

*   JavaScript
*   Objective-C
*   Java
*   C#

    pubnub.objects.removeMemberships({  channels: ["my_channel_2"]});

    self.client.objects().removeMemberships()    .uuid(@"uuid")    .channels(@"my_channel_2")    .includeFields(PNMembershipCustomField | PNMembershipChannelField)    .performWithCompletion(^(PNManageMembershipsStatus *status) {        if (!status.isError) {            /**             * UUID's memberships successfully removed.             * Result object has following information:             *   status.data.memberships - List of UUID's existing memberships.             *   status.data.next - Random string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.             *   status.data.prev - Random string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data.             *   status.data.totalCount - Total number of UUID's memberships.             */        } else {

show all 23 lines

    pubnub.removeMemberships()    .channelMemberships(Collections.singletonList(PNChannelMembership.channel("my_channel_2")))    .async(result -> { /* check result */ });

    List<string> removeMembershipList = new List<string>();if (!string.IsNullOrEmpty(removeMembershipChannelMetaId)){    removeMembershipList.Add("my_channel_2");}PNResult<PNMembershipsResult> removeMembershipsResponse = await pubnub.RemoveMemberships()    .Uuid("user_Id")    .Channels(removeMembershipList)    .Include(new PNMembershipField[] { PNMembershipField.CUSTOM, PNMembershipField.CHANNEL, PNMembershipField.CHANNEL_CUSTOM })    .IncludeCount(true)    .ExecuteAsync();PNMembershipsResult removeMembershipsResult = removeMembershipsResponse.Result;PNStatus status2 = removeMembershipsResponse.Status;

On completion, the PubNub SDK will fire the `objects` -> `membership` -> `delete` event so it can be consumed for other clients (users). Refer to the [Receive Messages](/docs/general/messages/receive) to learn more.

### Get Channel Memberships[​](#get-channel-memberships "Direct link to Get Channel Memberships")

You can retrieve a list of channel memberships for the current user. The code below returns all memberships for the current user.

*   JavaScript
*   Objective-C
*   Java
*   C#

    pubnub.objects.getMemberships();

    self.client.objects().memberships()    .uuid(@"uuid")    .includeFields(PNMembershipCustomField | PNMembershipChannelField)    .performWithCompletion(^(PNFetchMembershipsResult *result, PNErrorStatus *status) {        if (!status.isError) {            /**             * UUID's memberships successfully fetched.             * Result object has following information:             *   result.data.memberships - List of UUID's memberships.             *   result.data.next - Random string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.             *   result.data.prev - Random string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data.             *   result.data.totalCount - Total number of UUID's memberships.             */        } else {            /**

show all 22 lines

    pubnub.getMemberships()    .async(result -> { /* check result */ });

    PNResult<PNGetMembershipsResult> getMembershipsResponse = await pubnub.GetMemberships()    .Uuid("my-user-id")    .Include(new PNMembershipField[] { PNMembershipField.CUSTOM, PNMembershipField.CHANNEL, PNMembershipField.CHANNEL_CUSTOM })    .IncludeCount(true)    .Page(new PNPageObject() { Next = "", Prev = "" })    .ExecuteAsync();PNGetMembershipsResult getMembershipsResult = getMembershipsResponse.Result;PNStatus status = getMembershipsResponse.Status;

On success, the PubNub SDK will return the all channels for which the user is a member along with the status 200.

Channel Member[​](#channel-member "Direct link to Channel Member")
------------------------------------------------------------------

Apart from [users](/docs/general/metadata/users-metadata) and [channels](/docs/general/channels/overview), PubNub also allows you to store the relations between them called _memberships_. Each user that you add to a channel becomes a _member_ of that specific channel.

The following section describes how to add channel memberships from an external user's perspective, that is, when another user wants to add/remove members to a channel. This is the case when a user already is a member (or a moderator) of a specific channel and wishes to add/remove users to that channel. Setting _members_ in a channel is also a more efficient way of handling bulk operations than setting _memberships_.

PubNub emits events to notify clients when users are added to or removed from a channel. You can enable this feature using the [Admin Portal](https://admin.pubnub.com). In the **App Context** section, select or clear the appropriate checkboxes to enable or disable sending particular events.

The App Context service allows you to perform the following operations on channel members:

##### User ID / UUID

User ID is also referred to as **`UUID`/`uuid`** in some APIs and server responses but **holds the value** of the **`userId`** parameter you set during initialization.

Operation

Description

[Set members in channel](#set-members-in-channel)

Adds one or more users to a single channel. This operation creates memberships for these users to the specified channel.

[Remove members from channel](#remove-members-from-channel)

Removes one or more users from a single channel. This operation removes memberships for these users from the specified channel.

[Get members in channel](#get-members-in-channel)

Returns a list of users on a single channel. The list includes user's custom metadata if available and includes only User IDs for users who do not have custom metadata.

### Set Members in Channel[​](#set-members-in-channel "Direct link to Set Members in Channel")

You can add one or more users to a single channel (effectively creating a membership relation between the users and the channel) or update the custom metadata of one or more users that are existing members of a single channel. To update custom metadata of existing memberships, provide the desired information as key/value pairs.

##### API limits

To learn about the maximum length of parameters used to set channel members metadata, refer to [REST API docs](/docs/sdks/rest-api/set-channel-members-metadata).

The code below adds the membership to `my_channel` for the users `johndoe_1` and `janedoe_1`. Additionally, custom metadata `trialPeriod` is also added to the newly created membership for `janedoe_1`.

*   JavaScript
*   Objective-C
*   Java
*   C#

    pubnub.objects.setChannelMembers({  channel: "my_channel",  uuids: [    'johndoe_1',    { id: 'janedoe_1', custom: { trialPeriod: false } },  ],});

    NSArray<NSDictionary *> *uuids = @[  @{ @"uuid": @"johndoe_1" }  @{ @"uuid": @"janedoe_1", @"custom": @{ @"trialPeriod": @YES } }];self.client.objects().setChannelMembers(@"my_channel")    .uuids(uuids)    .includeFields(PNChannelMemberCustomField | PNChannelMemberUserField)    .performWithCompletion(^(PNManageChannelMembersStatus *status) {        if (!status.isError) {            /**             * Channel's members successfully set.             * Result object has following information:             *   result.data.members - List of existing channel's members.             *   result.data.next - Random string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.

show all 27 lines

    Map<String, Object> custom = new HashMap<>();custom.put("trialPeriod", true);pubnub.setChannelMembers()    .channel("my_channel")    .uuids(Arrays.asList(PNUUID.uuid("johndoe_1"), PNUUID.uuidWithCustom("janedoe_1", custom)))    .async(result -> { /* check result */ });

    List<PNChannelMember> setMemberChannelList = new List<PNChannelMember>();if (!string.IsNullOrEmpty(setMemberChUuid)){    setMemberChannelList.Add(new PNChannelMember() { Uuid = "johndoe_1" } );    setMemberChannelList.Add(new PNChannelMember() { Uuid = "janedoe_1", Custom = new Dictionary<string, object>() { { "trialPeriod", false } } });}PNResult<PNChannelMembersResult> setChannelMembersResponse = await pubnub.SetChannelMembers()    .Channel(setmemberChMetadataId)    .Uuids(setMemberChannelList)    .Include(new PNChannelMemberField[] { PNChannelMemberField.CUSTOM, PNChannelMemberField.UUID, PNChannelMemberField.UUID_CUSTOM })    .IncludeCount(true)    .ExecuteAsync();PNChannelMembersResult setChannelMembersResult = setChannelMembersResponse.Result;PNStatus status2 = setChannelMembersResponse.Status;

On success, the PubNub SDK will return the channel data of the specified channel along with the status 200. It will also fire the `objects` -> `membership` -> `set` event so it can be consumed for other clients (users). Refer to the [Receive Messages](/docs/general/messages/receive) to learn more.

##### Referential integrity

Enabling [referential integrity](/docs/general/metadata/basics#configuration) on your app’s keyset in the Admin Portal ensures that memberships can only be created for existing users and channels, and automatically deletes memberships when their associated user or channel is deleted.

If it’s not enabled, memberships can be created even for the non-existent user and channel entities, while deleting a user or channel entity does not automatically delete any associated membership objects.

### Remove Members from Channel[​](#remove-members-from-channel "Direct link to Remove Members from Channel")

You can remove one or more users from a single channel by providing the channel ID and a list of users. The code below deletes the membership to `my_channel_2` for the users `johndoe_1` and `janedoe_1`.

*   JavaScript
*   Objective-C
*   Java
*   C#

    pubnub.objects.removeChannelMembers({        channel: "my_channel_2",        uuids: ["johndoe_1", "janedoe_1"]    });

    self.client.objects().removeChannelMembers(@"my_channel_2")    .uuids(@[@"johndoe_1", @"janedoe_1"])    .includeFields(PNChannelMemberCustomField | PNChannelMemberUserField)    .performWithCompletion(^(PNManageChannelMembersStatus *status) {        if (!status.isError) {            /**             * Channel's members successfully removed.             * Result object has following information:             *   result.data.members - List of channel's existing members.             *   result.data.next - Random string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.             *   result.data.prev - Random string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data.             *   result.data.totalCount - Total number of channel's members.             */        } else {            /**

show all 22 lines

    pubnub.removeChannelMembers()    .channel("my_channel_2")    .uuids(Arrays.asList(PNUUID.uuid("johndoe_1"), PNUUID.uuid("janedoe_1")))    .async(result -> { /* check result */ });

    List<string> removeChannelMemberList = new List<string>();removeChannelMemberList.Add("johndoe_1");removeChannelMemberList.Add("janedoe_1");PNResult<PNChannelMembersResult> removeChannelMembersResponse = await pubnub.RemoveChannelMembers()    .Channel("my_channel_2")    .Uuids(removeChannelMemberList)    .Include(new PNChannelMemberField[] { PNChannelMemberField.CUSTOM, PNChannelMemberField.UUID, PNChannelMemberField.UUID_CUSTOM })    .IncludeCount(true)    .ExecuteAsync();PNChannelMembersResult removeChannelMembersResult = removeChannelMembersResponse.Result;PNStatus status = removeChannelMembersResponse.Status;

On completion, the PubNub SDK will fire `objects` -> `membership` -> `delete` event.

### Get Members in Channel[​](#get-members-in-channel "Direct link to Get Members in Channel")

You can retrieve a list of members of a single channel simply by providing its ID. The code below returns the members of the channel `my_channel`.

*   JavaScript
*   Objective-C
*   Java
*   C#

    pubnub.objects.getChannelMembers({    channel: "my_channel"});

    self.client.objects().channelMembers(@"my_channel")    .includeFields(PNChannelMemberCustomField | PNChannelMemberUUIDField)    .performWithCompletion(^(PNFetchChannelMembersResult *result, PNErrorStatus *status) {        if (!status.isError) {            /**             * Channel's members successfully fetched.             * Result object has following information:             *   result.data.members - List of channel's members.             *   result.data.next - Random string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.             *   result.data.prev - Random string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data.             *   result.data.totalCount - Total number of channel's members.             */        } else {            /**             * Handle channel's members fetch error. Check 'category' property to find out possible

show all 21 lines

    pubnub.getChannelMembers()    .channel("my_channel")    .async(result -> { /* check result */ });

    PNResult<PNChannelMembersResult> getChannelMembersResponse = await pubnub.GetChannelMembers()    .Channel("my_channel")    .Include(new PNChannelMemberField[] { PNChannelMemberField.CUSTOM, PNChannelMemberField.UUID, PNChannelMemberField.UUID_CUSTOM })    .IncludeCount(true)    .ExecuteAsync();PNChannelMembersResult getChannelMembersResult = getChannelMembersResponse.Result;PNStatus status2 = getChannelMembersResponse.Status;

On success, the PubNub SDK returns the UUIDs of all the users, and the associated channel metadata for that channel, along with the status 200.

Last updated on **Jun 12, 2024**

On this page

App Context Filtering Language
==============================

PubNub SDKs, REST API, and BizOps Workspace allow you to specify conditions for querying and interacting with user, channel, and membership data (collectively called App Context) using a combination of operators and functions.

You can use the `filter` parameter to query data fields for users, channels, and memberships and get or change that data based on certain conditions.

Read on to learn which App Context data you can filter through and which operators and expressions you can use for this purpose.

This document shows examples of handling data in your applications using different SDK methods. Still, you can refer to the [REST API](https://www.pubnub.com/docs/sdks/rest-api) documentation to learn how to directly query PubNub's server data or read [BizOps Workspace](/docs/bizops-workspace/basics) docs to find out how to filter user and channel data through UI.

Data fields[​](#data-fields "Direct link to Data fields")
---------------------------------------------------------

Here is a list of data fields available for querying and managing users, channels, and channel memberships using PubNub's App Context Filtering Language.

### User data fields[​](#user-data-fields "Direct link to User data fields")

##### Data fields format

Format of these parameters can vary between REST API, SDKs, and BizOps Workspace.

*   `id` — Unique user identifier (UUID)
*   `name` — User's display name
*   `externalId` — An identifier that links the user to an external system
*   `profileUrl` — URL to the user's profile picture
*   `email` — User's email address
*   `status` — Condition the user is in, like `active` (some SDKs)
*   `type` — Category used to classify the user, like `SupportAgent` (some SDKs)
*   `updated` — Timestamp of the last update to the user's metadata
*   `custom` — Any user-specific property (filtering through it is not recommended in SDKs and BizOps Workspace)

### Channel data fields[​](#channel-data-fields "Direct link to Channel data fields")

*   `id` — Unique channel identifier
*   `name` — Display name of the channel
*   `description` — Description of the channel
*   `status` — Condition the channel is in, like `archived` (some SDKs)
*   `type` — Category used to classify the channel, like `OffTopic` (some SDKs)
*   `updated` — Timestamp of the last update to the channel's metadata
*   `custom` — Any channel-specific property (filtering through it is not recommended in SDKs and BizOps Workspace)

### Channel memberships and members data fields[​](#channel-memberships-and-members-data-fields "Direct link to Channel memberships and members data fields")

*   `channel.id` - Identifier of the channel associated with the membership
*   `channel.name` — Name of the channel
*   `channel.description` — Channel description
*   `channel.status` — Condition the channel is in, like `archived` (some SDKs)
*   `channel.type` — Category used to classify the channel, like `OffTopic` (some SDKs)
*   `channel.updated` — Timestamp of the last update to the channel's metadata
*   `channel.custom` - Any channel-specific property (filtering through it is not recommended in SDKs and BizOps Workspace)
*   `uuid.id` — The UUID of the channel member
*   `uuid.name` — Name of the channel member
*   `uuid.externalId` — An identifier that links the channel member to an external system
*   `uuid.profileUrl` — URL to the channel member's profile picture
*   `uuid.email` — Channel member's email address
*   `uuid.status` — Condition the channel member is in, like `active` (some SDKs)
*   `uuid.type` — Category used to classify the channel member, like `SupportAgent` (some SDKs)
*   `uuid.updated` — Timestamp when the channel member was last updated
*   `uuid.custom` - Any channel member-specific property (filtering through it is not recommended in SDKs and BizOps Workspace)
*   `status` — Condition the membership is in
*   `type` — Category used to classify the membership, like `subscription` (only REST API)
*   `custom` — Any membership-specific property (filtering through it is not recommended)

Filtering operators[​](#filtering-operators "Direct link to Filtering operators")
---------------------------------------------------------------------------------

When retrieving metadata for users or channels, pass a `filter` parameter, which contains an expression that determines which records to return based on the properties of those records. The filtering language supports basic operators like comparison (`==`, `!=`, `>`, `<`, `>=`, `<=`), logical operators (`&&`, `||`), and the ability to check for presence or patterns using `LIKE`.

*   `==` (equal to)
*   `!=` (not equal to)
*   `<` (less than)
*   `>` (greater than)
*   `<=` (less than or equal to)
*   `>=` (greater than or equal to)
*   `&&` (and)
*   `||` (or)
*   `LIKE` (SQL-like pattern matching, supports `*` as wildcard for string fields)

##### Filtering large data volumes

For applications with a large number of users, channels, or memberships, use exact ID equality filters (`id == "channel-123"`, `uuid.id == "user-456"`) instead of pattern matching with `LIKE`. In [BizOps Workspace](/docs/bizops-workspace/basics), avoid the quick search box and use the Filters button with `equals` operators when working with many entities. This approach makes your searches much faster because it uses database indexes rather than scanning all records.

Query parameters and methods[​](#query-parameters-and-methods "Direct link to Query parameters and methods")
------------------------------------------------------------------------------------------------------------

You can filter App Context data in one of the following ways:

*   Using the REST API calls to get the data:
    
    *   [Get metadata for all users](/docs/sdks/rest-api/get-metadata-for-all-users)
    *   [Get metadata for all channels](/docs/sdks/rest-api/get-metadata-for-all-channels)
    *   [Get membership metadata](/docs/sdks/rest-api/set-membership-metadata)
*   Using SDK methods that accept the `filter` parameter to limit App Context data when getting, setting, or removing it, like `getAllUUIDMetadata()`, `getAllChannelMetadata()`, `getMemberships()`, or `setChannelMembers()` in the [JavaScript SDK](/docs/sdks/javascript/api-reference/objects).
    
    For details, head to the `App Context` document in a selected [SDK](/docs/sdks) documentation set.
    
    ##### Filtering through custom properties
    
    To avoid performance issues, do not filter App Context data through the `custom` fields using SDK methods.
    
*   UI filters in BizOps Workspace:
    
    *   [Filter users and their related channel memberships](/docs/bizops-workspace/user-management#filters)
    *   [Filter channels and their related user members](/docs/bizops-workspace/channel-management#filters)
    
    ##### Filtering through custom properties
    
    To avoid performance issues, do not filter App Context data through the `custom` fields using BizOps Workspace.
    

##### Performance consideration

For applications with a large number of channels or users, always use exact match filtering with `id == "channelname"` or `id == "user-123"` rather than pattern matching with `LIKE` or partial string matches. Exact ID equality queries use database indexes and perform significantly better, especially in high-volume applications.

Filter expression components[​](#filter-expression-components "Direct link to Filter expression components")
------------------------------------------------------------------------------------------------------------

The filter expression syntax in PubNub's App Context API can be structured into categories that include expressions for logical operations, data referencing tools, literals representing fixed values, and tokens that assist in constructing queries, enabling complex condition formulation and data manipulation in queries.

### Expressions and conditions[​](#expressions-and-conditions "Direct link to Expressions and conditions")

This category contains the elements that form the logical structure of queries, allowing the definition of conditions and decision-making expressions based on data.

Element

Description

Syntax/Example

Expression

Main building block, evaluates to true or false based on conditions

`email LIKE "*@example.com"`

And expression

Combines conditions that must all be true (logical AND)

`name == "Alice" && email LIKE "*@example.com"`

Binary condition

Basic unit for simple or negated conditions

`!(name == "Alice")`

Relational condition

Compares properties to values

`profileUrl != "http://example.com/default.jpg"`

### Data references and operators[​](#data-references-and-operators "Direct link to Data references and operators")

This category includes the tools for referencing data properties and manipulating them through various operators.

Element

Description

Syntax/Example

Identifier

Must start with a letter (A-Z, a-z), `$`, or `_`, and allow subsequent characters to include letters, digits (0-9), `$`, or `_`.

`my_user_id`, `$userID`, `_user_912710938aa848eda2c3e0c2b583`

Property name

Can be an alternative form of an identifier represented by a string enclosed in square brackets. Using square brackets makes most sense for non-regular (`custom`) fields containing special characters or spaces that are not supported directly with identifiers, but filtering through `custom` fields is not recommended for SDKs and BizOps Workspace.

`["name"] == "John"` (same as identifier `name`, but in brackets) or `custom["employment-status"] == "valid"` (as `custom.employment-status == "test"` would throw an error due to invalid `-` character)

Property path

Accesses nested properties using dot notation

`channel.name == "general"`

Relational operator

Operators to compare properties and values

`==`, `!=`, `<`, `>`, `<=`, `>=`, `LIKE`

### Literals and data types[​](#literals-and-data-types "Direct link to Literals and data types")

Elements in this category represent specific data values or constants used within filter expressions.

Element

Description

Syntax/Example

Value

Fixed data values like strings, numbers, booleans, or null

`status == "active"`

String

Text values, enclosed in quotes (supports escaped characters)

`"Hello \"World\""`

### Characters and tokens[​](#characters-and-tokens "Direct link to Characters and tokens")

Key single characters and symbols used to construct literals, strings, and structure within the syntax.

Element

Description

Syntax/Example

Letter

Any alphabetic character from any language

`a`, `Z`, `é`, `λ`

Number

Numeric values, supports integers, decimals, and scientific notation

`3.14159`, `-42`, `6.022e23`

Digit

Numbers from 0 to 9

`0`, `9`

Hex digit

Hexadecimal digit used in unicode encoding

`0`, `9`, `A`, `F`

Double quote

Used to denote the start and end of strings

`"This is a string"`

Unicode character

Any character valid in the Unicode range

Any visible character, emoji, etc.

Special character

Characters that perform special functions in strings. For example, if you want to search for parameters that contain an asterisk, you must escape this special character, like `filter: 'name LIKE '*\\**'`.

`\n` (new line), `\t` (tab), `\\` (backslash)

### Examples[​](#examples "Direct link to Examples")

#### Expression[​](#expression "Direct link to Expression")

Get all users whose names start with `John`.

*   JavaScript
*   Swift
*   Kotlin
*   Python

    pubnub.objects.getAllUUIDMetadata({    filter: 'name LIKE "John*"'})

    pubnub.allUUIDMetadata(    filter: "name LIKE 'John*'",    completion: { result in        switch result {        case .success(let response):            let uuids = response.uuids            print("Fetched UUID Metadata: \(uuids)")        case .failure(let error):            print("Failed to fetch UUID Metadata: \(error.localizedDescription)")        }    })

    pubnub.getAllUUIDMetadata(    filter = "name LIKE 'John*'").async { result: Result<PNUUIDMetadataArrayResult> ->    result.onFailure { exception ->        println("Error fetching UUID metadata: ${exception.message}")    }.onSuccess { value: PNUUIDMetadataArrayResult ->        value.data.forEach { metadata ->            println("UUID: ${metadata.id}, Name: ${metadata.name}")        }    } }

    def callback(response, status):    if status.is_error():        print(f"Error fetching UUID metadata: {status.error_message}")    else:        for uuid_data in response.data:            print(f"UUID: {uuid_data['id']}, Name: {uuid_data['name']}")pubnub.get_all_uuid_metadata()       .filter("name LIKE 'John*'")       .pn_async(callback)

#### And expression[​](#and-expression "Direct link to And expression")

Get metadata of channels that include `general` in names and were updated after January 1st, 2023.

*   JavaScript
*   Swift
*   Kotlin
*   Python

    pubnub.objects.getAllChannelMetadata({    filter: 'name LIKE "*general*" && updated >= "2023-01-01T00:00:00Z"'})

    pubnub.allChannelMetadata(  filter: "name LIKE '*general*' && updated >= '2023-01-01T00:00:00Z'",  completion: { result in    switch result {    case .success(let data):      let channels = data.channels      print("Filtered Channels: \(channels)")    case .failure(let error):      print("Error fetching channel metadata: \(error.localizedDescription)")    }  })

    pubnub.getAllChannelMetadata(    filter = "name LIKE '*general*' && updated >= '2023-01-01T00:00:00Z'").async { result: Result<PNChannelMetadataArrayResult> ->    result.onFailure { exception ->        println("Error fetching channel metadata: ${exception.message}")    }.onSuccess { value: PNChannelMetadataArrayResult ->        value.data.forEach { channel ->            println("Channel ID: ${channel.id}, Name: ${channel.name}")        }    }}

    def callback(response, status):    if status.is_error():        print(f"Error fetching channel metadata: {status.error_message}")    else:        for channel in response.data:            print(f"Channel ID: {channel['id']}, Name: {channel['name']}, Updated: {channel['updated']}")pubnub.get_all_channel_metadata() \    .filter("name LIKE '*general*' && updated >= '2023-01-01T00:00:00Z'") \    .pn_async(callback)

#### Binary condition[​](#binary-condition "Direct link to Binary condition")

Retrieve all user memberships excluding the channel with ID `Channel-001`.

*   JavaScript
*   Swift
*   Kotlin
*   Python

    pubnub.objects.getMemberships({    uuid: 'user123',    filter: '!(channel.id == "Channel-001")'})

    pubnub.fetchMemberships(    uuid: "user123",    filter: "!(channel.id == 'Channel-001')",    completion: { result in        switch result {        case .success(let data):            let memberships = data.memberships            print("Filtered Memberships: \(memberships)")        case .failure(let error):            print("Error fetching memberships: \(error.localizedDescription)")        }    })

    val userId = "user123"pubnub.getMemberships(    uuid = userId,    filter = "!(channel.id == 'Channel-001')").async { result ->    result.onFailure { exception ->        println("Error fetching memberships: ${exception.message}")    }.onSuccess{ value ->        println("Successfully removed channel members")        value.data.forEach { membership ->            println("Channel ID: ${membership.channel?.id}, User ID: $userId")        }    }}

    memberships = pubnub.get_memberships() \    .uuid("user123") \    .filter("!(channel.id == 'Channel-001')") \    .sync()if memberships.status.is_error():    print(f"Error fetching memberships: {memberships.status}")else:    print(memberships.__dict__)    for membership in memberships.result.data:        print(f"Channel ID: {membership['channel']['id']}")

#### Relational condition[​](#relational-condition "Direct link to Relational condition")

Find channel members whose last update was before a specific time.

*   JavaScript
*   Swift
*   Kotlin
*   Python

    pubnub.objects.getChannelMembers({    channel: "specialEvents",    filter: 'uuid.updated < "2023-01-01T00:00:00Z"'})

    pubnub.fetchMembers(    channel: "specialEvents",    filter: "uuid.updated < '2023-01-01T00:00:00Z'",    completion: { result in        switch result {        case .success(let response):            let memberships = response.memberships            print("Fetched Memberships: \(memberships)")        case .failure(let error):            print("Failed to fetch Memberships: \(error.localizedDescription)")        }    })

    val channel = "specialEvents"pubnub.getChannelMembers(    channel = channel,    filter = "uuid.updated < '2023-01-01T00:00:00Z'").async { result ->    result.onFailure { exception: PubNubException ->        println("Error fetching channel members: ${exception.message}")    }.onSuccess { value: PNMemberArrayResult ->        value.data.forEach { member ->            println("Member UUID: ${member.uuid}, Channel: $channel")        }    }}

    def callback(response, status):    if status.is_error():        print(f"Error fetching channel members: {status.error_message}")    else:        for member in response.data:            print(f"Member UUID: {member['uuid']}, Channel: {member['channel']}")pubnub.get_channel_members() \    .channel("specialEvents") \    .filter("uuid.updated < '2023-01-01T00:00:00Z'") \    .pn_async(callback)

#### Identifier[​](#identifier "Direct link to Identifier")

Retrieve all users whose name is `John`.

*   JavaScript
*   Swift
*   Kotlin
*   Python

    pubnub.objects.getAllUUIDMetadata({    filter: 'name == "John"'})

    pubnub.allUUIDMetadata(    filter: "name == 'John'",    completion: { result in        switch result {        case .success(let response):            let uuids = response.uuids            print("Fetched UUID Metadata: \(uuids)")        case .failure(let error):            print("Failed to fetch UUID Metadata: \(error.localizedDescription)")        }    })

    pubnub.getAllUUIDMetadata(    filter = "name == 'John'").async { result ->    result.onFailure { exception ->        println("Error fetching UUID metadata: ${exception.message}")    }.onSuccess { value ->        value.data.forEach { metadata ->            println("UUID: ${metadata.id}, Name: ${metadata.name}")        }    }}

    def callback(response, status):    if status.is_error():        print(f"Error fetching UUID metadata: {status.error_message}")    else:        for uuid_data in response.data:            print(f"UUID: {uuid_data['id']}, Name: {uuid_data['name']}")pubnub.get_all_uuid_metadata()       .filter("name == 'John'")       .pn_async(callback)

#### Property name[​](#property-name "Direct link to Property name")

Retrieve all channels whose descriptions contain `support`.

*   JavaScript
*   Swift
*   Kotlin
*   Python

    pubnub.objects.getAllChannelMetadata({    filter: '["description"] LIKE "*support*"'})

    pubnub.allChannelMetadata(  filter: "['description'] LIKE '*support*'",  completion: { result in    switch result {    case .success(let data):      let channels = data.channels      print("Filtered Channels: \(channels)")    case .failure(let error):      print("Error fetching channel metadata: \(error.localizedDescription)")    }  })

    pubnub.getAllChannelMetadata(    filter = "description LIKE '*support*'").async { result ->    result.onFailure { exception ->        println("Error fetching channel metadata: ${exception.message}")    }.onSuccess { value ->        value.data.forEach { channel ->            println("Channel ID: ${channel.id}, Name: ${channel.name}")        }    }}

    def callback(response, status):    if status.is_error():        print(f"Error fetching channel metadata: {status.error_message}")    else:        for channel in response.data:            print(f"Channel ID: {channel['id']}, Name: {channel['name']}, Updated: {channel['updated']}")pubnub.get_all_channel_metadata() \    .filter("['description'] LIKE '*support*'") \    .pn_async(callback)

#### Property path[​](#property-path "Direct link to Property path")

Retrieve all user memberships where channel ID starts with `user`.

*   JavaScript
*   Swift
*   Kotlin
*   Python

    pubnub.objects.getMemberships({    uuid: 'user123',    filter: 'channel.id LIKE "user*")'})

    pubnub.fetchMemberships(    uuid: "user123",    filter: "(channel.id LIKE 'user*')",    completion: { result in        switch result {        case .success(let data):            let memberships = data.memberships            print("Filtered Memberships: \(memberships)")        case .failure(let error):            print("Error fetching memberships: \(error.localizedDescription)")        }    })

    val userId = "user123"pubnub.getMemberships(    uuid = userId,    filter = "!(channel.id LIKE 'user*')").async { result ->    result.onFailure { exception ->        println("Error fetching memberships: ${exception.message}")    }.onSuccess{ value ->        println("Successfully removed channel members")        value.data.forEach { membership ->            println("Channel ID: ${membership.channel?.id}, User ID: $userId")        }    }}

    def callback(response, status):    if status.is_error():        print(f"Error fetching memberships: {status.error_message}")    else:        for membership in response.data:            print(f"Membership ID: {membership['id']}, Channel ID: {membership['channel']['id']}, User ID: {membership['uuid']}")pubnub.get_memberships() \    .uuid("user123") \    .filter("(channel.id LIKE 'user*')") \    .pn_async(callback)

#### Relational operator[​](#relational-operator "Direct link to Relational operator")

Add to the `advancedChannel` channel all specified users, but return only those users whose IDs are greater than a certain value (`250`).

*   JavaScript
*   Swift
*   Kotlin
*   Python

    pubnub.objects.setChannelMembers({    channel: "advancedChannel",    uuids: [        { id: "201" },        { id: "300" },        { id: "450" },        { id: "789" }    ],    filter: 'uuid.id > "250"'});

    pubnub.setMembers(  channel: "advancedChannel",  uuids: [    PubNubMembershipMetadataBase(uuidMetadataId: "201", channelMetadataId: "advancedChannel"),    PubNubMembershipMetadataBase(uuidMetadataId: "300", channelMetadataId: "advancedChannel"),    PubNubMembershipMetadataBase(uuidMetadataId: "450", channelMetadataId: "advancedChannel"),    PubNubMembershipMetadataBase(uuidMetadataId: "789", channelMetadataId: "advancedChannel")  ],  filter: "uuid.id > '250'",  completion: { result in    switch result {    case .success(let data):      let memberships = data.memberships      print("Updated Memberships: \(memberships)")    case .failure(let error):

show all 19 lines

    val channel = "advancedChannel"pubnub.setChannelMembers(    uuids = listOf(        PNMember.Partial(uuidId = "201"),        PNMember.Partial(uuidId = "300"),        PNMember.Partial(uuidId = "450"),        PNMember.Partial(uuidId = "789")    ),    channel = channel,    filter = "uuid.id > '250'").async { result ->    result.onFailure { exception ->        println("Error setting channel members: ${exception.message}")    }.onSuccess{ value ->        value.data.forEach { member ->

show all 19 lines

    def callback(response, status):    if status.is_error():        print(f"Error setting channel members: {status.error_message}")    else:        for member in response.data:            print(f"Member UUID: {member['uuid']}, Channel: {member['channel']}")pubnub.set_channel_members() \    .channel("advancedChannel") \    .uuids([        PNUUID(uuid="201"),        PNUUID(uuid="300"),        PNUUID(uuid="450"),        PNUUID(uuid="789")    ]) \

show all 17 lines

#### Value[​](#value "Direct link to Value")

Get all `oldChannel` channel members with the `inactive` status.

*   JavaScript
*   Swift
*   Kotlin
*   Python

    pubnub.objects.getChannelMembers({    channel: "oldChannel",    filter: 'uuid.status == "inactive"'})

    pubnub.fetchMembers(    channel: "oldChannel",    filter: "uuid.status == 'inactive'",    completion: { result in        switch result {        case .success(let response):            let memberships = response.memberships            print("Fetched Memberships: \(memberships)")        case .failure(let error):            print("Failed to fetch Memberships: \(error.localizedDescription)")        }    })

    val channel = "oldChannel"pubnub.getChannelMembers(    channel = channel,    filter = "uuid.status == 'inactive'").async { result ->    result.onFailure { exception: PubNubException ->        println("Error fetching channel members: ${exception.message}")    }.onSuccess { value: PNMemberArrayResult ->        value.data.forEach { member ->            println("Member UUID: ${member.uuid}, Channel: $channel")        }    }}

    def callback(response, status):    if status.is_error():        print(f"Error fetching channel members: {status.error_message}")    else:        for member in response.data:            print(f"Member UUID: {member['uuid']}, Channel: {member['channel']}")pubnub.get_channel_members() \    .channel("oldChannel") \    .filter("uuid.status == 'inactive'") \    .pn_async(callback)

#### String[​](#string "Direct link to String")

Get metadata of a channel with a description including escaped characters.

*   JavaScript
*   Swift
*   Kotlin
*   Python

    pubnub.objects.getAllChannelMetadata({    filter: 'description == "Hello \\"Gossipers\\""'})

    pubnub.allChannelMetadata(  filter: "description == 'Hello \\'Gossipers\\''",  completion: { result in    switch result {    case .success(let data):      let channels = data.channels      print("Filtered Channels: \(channels)")    case .failure(let error):      print("Error fetching channel metadata: \(error.localizedDescription)")    }  })

    pubnub.getAllChannelMetadata(    filter = "description == 'Hello \\'Gossipers\\''").async { result ->    result.onFailure { exception ->        println("Error fetching channel metadata: ${exception.message}")    }.onSuccess { value ->        value.data.forEach { channel ->            println("Channel ID: ${channel.id}, Name: ${channel.name}")        }    }}

    def callback(response, status):    if status.is_error():        print(f"Error fetching channel metadata: {status.error_message}")    else:        for channel in response.data:            print(f"Channel ID: {channel['id']}, Name: {channel['name']}, Updated: {channel['updated']}")pubnub.get_all_channel_metadata() \    .filter("description == 'Hello \\'Gossipers\\''") \    .pn_async(callback)

#### Letter[​](#letter "Direct link to Letter")

Get all users whose names start with `J`.

*   JavaScript
*   Swift
*   Kotlin
*   Python

    pubnub.objects.getAllUUIDMetadata({    filter: 'name LIKE "J*"'})

    pubnub.allUUIDMetadata(    filter: "name LIKE 'J*'",    completion: { result in        switch result {        case .success(let response):            let uuids = response.uuids            print("Fetched UUID Metadata: \(uuids)")        case .failure(let error):            print("Failed to fetch UUID Metadata: \(error.localizedDescription)")        }    })

    pubnub.getAllUUIDMetadata(    filter = "name LIKE 'J*'").async { result ->    result.onFailure { exception ->        println("Error fetching UUID metadata: ${exception.message}")    }.onSuccess { value ->        value.data.forEach { metadata ->            println("UUID: ${metadata.id}, Name: ${metadata.name}")        }    }}

    def callback(response, status):    if status.is_error():        print(f"Error fetching UUID metadata: {status.error_message}")    else:        for uuid_data in response.data:            print(f"UUID: {uuid_data['id']}, Name: {uuid_data['name']}")pubnub.get_all_uuid_metadata()       .filter("name LIKE 'J*'")       .pn_async(callback)

#### Number[​](#number "Direct link to Number")

Get metadata of channels that were updated after January 1st, 2023.

*   JavaScript
*   Swift
*   Kotlin
*   Python

    pubnub.objects.getAllChannelMetadata({    filter: 'updated >= "2023-01-01T00:00:00Z"'})

    pubnub.allChannelMetadata(  filter: "updated >= '2023-01-01T00:00:00Z'",  completion: { result in    switch result {    case .success(let data):      let channels = data.channels      print("Filtered Channels: \(channels)")    case .failure(let error):      print("Error fetching channel metadata: \(error.localizedDescription)")    }  })

    pubnub.getAllChannelMetadata(    filter = "updated >= '2023-01-01T00:00:00Z'").async { result ->    result.onFailure { exception ->        println("Error fetching channel metadata: ${exception.message}")    }.onSuccess{ value ->        value.data.forEach { channel ->            println("Channel ID: ${channel.id}, Name: ${channel.name}")        }    }}

    def callback(response, status):    if status.is_error():        print(f"Error fetching channel metadata: {status.error_message}")    else:        for channel in response.data:            print(f"Channel ID: {channel[' id']}, Name: {channel[' name']}, Updated: {channel[' updated']}")pubnub.get_all_channel_metadata() \    .filter("updated >= '2023-01-01T00:00:00Z'") \    .pn_async(callback)

#### Digit[​](#digit "Direct link to Digit")

Get all users with IDs that do not contain `8`.

*   JavaScript
*   Swift
*   Kotlin
*   Python

    pubnub.objects.getAllUUIDMetadata({    filter: '!(id LIKE "*8*")'})

    pubnub.allUUIDMetadata(    filter: "!(id LIKE "*8*")",    completion: { result in        switch result {        case .success(let response):            let uuids = response.uuids            print("Fetched UUID Metadata: \(uuids)")        case .failure(let error):            print("Failed to fetch UUID Metadata: \(error.localizedDescription)")        }    })

    pubnub.getAllUUIDMetadata(    filter = "!(id LIKE "*8*")").async { result ->    result.onFailure { exception ->        println("Error fetching UUID metadata: ${exception.message}")    }.onSuccess { value ->        value.data.forEach { metadata ->            println("UUID: ${metadata.id}, Name: ${metadata.name}")        }    }}

    def callback(response, status):    if status.is_error():        print(f"Error fetching UUID metadata: {status.error_message}")    else:        for uuid_data in response.data:            print(f"UUID: {uuid_data['id']}, Name: {uuid_data['name']}")pubnub.get_all_uuid_metadata()       .filter("!(id LIKE "*8*")")       .pn_async(callback)

#### Hex digit[​](#hex-digit "Direct link to Hex digit")

Retrieve all channels with IDs containing `A3F9`.

*   JavaScript
*   Swift
*   Kotlin
*   Python

    pubnub.objects.getAllChannelMetadata({    filter: 'id LIKE "*A3F9*"'})

    pubnub.allChannelMetadata(  filter: "id LIKE '*A3F9*'",  completion: { result in    switch result {    case .success(let data):      let channels = data.channels      print("Filtered Channels: \(channels)")    case .failure(let error):      print("Error fetching channel metadata: \(error.localizedDescription)")    }  })

    pubnub.getAllChannelMetadata(    filter = "id LIKE '*A3F9*'").async { result ->    result.onFailure { exception ->        println("Error fetching channel metadata: ${exception.message}")    }.onSuccess { value ->        value.data.forEach { channel ->            println("Channel ID: ${channel.id}, Name: ${channel.name}")        }    }}

    def callback(response, status):    if status.is_error():        print(f"Error fetching channel metadata: {status.error_message}")    else:        for channel in response.data:            print(f"Channel ID: {channel['id']}, Name: {channel['name']}, Updated: {channel['updated']}")pubnub.get_all_channel_metadata() \    .filter("id LIKE '*A3F9*'") \    .pn_async(callback)

#### Double quote[​](#double-quote "Direct link to Double quote")

Find all channels whose descriptions contain the word `VIP`.

*   JavaScript
*   Swift
*   Kotlin
*   Python

    pubnub.objects.getAllChannelMetadata({    filter: "description LIKE \"*VIP*\""})

    pubnub.allChannelMetadata(  filter: "description LIKE \"*VIP*\"",  completion: { result in    switch result {    case .success(let data):      let channels = data.channels      print("Filtered Channels: \(channels)")    case .failure(let error):      print("Error fetching channel metadata: \(error.localizedDescription)")    }  })

    pubnub.getAllChannelMetadata(  filter = "description LIKE \"*VIP*\"").async { result ->  result.onFailure { exception ->    println("Error fetching channel metadata: ${exception.message}")  }.onSuccess { value ->    value.data.forEach { channel ->      println("Channel ID: ${channel.id}, Name: ${channel.name}")    }  }}

    def callback(response, status):    if status.is_error():        print(f"Error fetching channel metadata: {status.error_message}")    else:        for channel in response.data:            print(f"Channel ID: {channel['id']}, Name: {channel['name']}, Updated: {channel['updated']}")pubnub.get_all_channel_metadata() \    .filter("description LIKE \"*VIP*\"") \    .pn_async(callback)

#### Unicode character[​](#unicode-character "Direct link to Unicode character")

Retrieve all channel descriptions that contain the `❤️` emoji.

*   JavaScript
*   Swift
*   Kotlin
*   Python

    pubnub.objects.getAllChannelMetadata({    filter: 'description LIKE "*❤️*"'})

    pubnub.allChannelMetadata(  filter: "description LIKE '*❤️*'",  completion: { result in    switch result {    case .success(let data):      let channels = data.channels      print("Filtered Channels: \(channels)")    case .failure(let error):      print("Error fetching channel metadata: \(error.localizedDescription)")    }  })

    pubnub.getAllChannelMetadata(  filter = "description LIKE '*:heart:*'").async { result ->  result.onFailure { exception ->    println("Error fetching channel metadata: ${exception.message}")  }.onSuccess { value ->    value.data.forEach { channel ->      println("Channel ID: ${channel.id}, Name: ${channel.name}")    }  }}

    def callback(response, status):    if status.is_error():        print(f"Error fetching channel metadata: {status.error_message}")    else:        for channel in response.data:            print(f"Channel ID: {channel['id']}, Name: {channel['name']}, Updated: {channel['updated']}")pubnub.get_all_channel_metadata() \    .filter("description LIKE '*❤️*'") \    .pn_async(callback)

#### Special character[​](#special-character "Direct link to Special character")

Get metadata of a channel with a specific description containing a new line.

*   JavaScript
*   Swift
*   Kotlin
*   Python

    pubnub.objects.getAllChannelMetadata({    filter: 'description == "Check out our new deals!\nAvailable for a limited time."'})

    pubnub.allChannelMetadata(  filter: "description == 'Check out our new deals!\nAvailable for a limited time.'",  completion: { result in    switch result {    case .success(let data):      let channels = data.channels      print("Filtered Channels: \(channels)")    case .failure(let error):      print("Error fetching channel metadata: \(error.localizedDescription)")    }  })

    pubnub.getAllChannelMetadata(    filter = "description == 'Check out our new deals!\nAvailable for a limited time.'").async { result ->    result.onFailure { exception ->        println("Error fetching channel metadata: ${exception.message}")    }.onSuccess { value ->        value.data.forEach { channel ->            println("Channel ID: ${channel.id}, Name: ${channel.name}")        }    }}

    def callback(response, status):    if status.is_error():        print(f"Error fetching channel metadata: {status.error_message}")    else:        for channel in response.data:            print(f"Channel ID: {channel['id']}, Name: {channel['name']}, Updated: {channel['updated']}")pubnub.get_all_channel_metadata() \    .filter("description == 'Check out our new deals!\nAvailable for a limited time.'") \    .pn_async(callback)

Last updated on **Mar 27, 2025**
