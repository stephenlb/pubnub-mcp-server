# PubNub Dart SDK App Context (Objects) Best Practices Guide

## Overview

This guide provides practical implementation patterns for PubNub's App Context (Objects) API in the Dart/Flutter SDK. App Context allows you to store metadata about users, channels, and their relationships (memberships) directly in PubNub's infrastructure.

## Core Concepts

### User Objects (UUID Metadata)
User Objects store metadata about individual users in your application.

### Channel Objects (Channel Metadata) 
Channel Objects store metadata about channels, which can represent chat rooms, topics, or any logical grouping.

### Memberships
Memberships define relationships between users and channels, including custom data about that relationship.

## Essential Implementation Patterns

### 1. Creating User Objects

**✅ WORKING**: Custom metadata now works correctly with proper Map structure!

```dart
// ✅ WORKING: Full user metadata with custom fields
final customFields = <String, dynamic>{
  'app_version': '1.0.0+1',
  'platform': 'flutter',
  'created_at': DateTime.now().toIso8601String(),
  'user_type': 'member',
  'preferences': {
    'notifications': true,
    'theme': 'dark'
  }
};

final userInput = UuidMetadataInput(
  name: 'John Doe',
  email: 'john@example.com',
  custom: customFields, // ✅ Now works!
);

await pubnub.objects.setUUIDMetadata(userInput);
// Output: ✅ Created User Object with custom fields
```

**Key Points:**
- Use `UuidMetadataInput` constructor, not a string UUID
- **Custom metadata works with proper `Map<String, dynamic>` structure**
- Use scalar values only in custom fields (strings, numbers, booleans)
- Nested objects are supported but keep them simple

### 2. Creating Channel Objects

```dart
// ✅ WORKING: Full channel metadata with custom fields including app version
final customFields = <String, dynamic>{
  'app_version': '1.0.0+1',
  'platform': 'flutter',
  'challenge_type': 'photo',
  'created_by': userId,
  'duration_minutes': 5,
  'created_at': DateTime.now().toIso8601String(),
};

final channelInput = ChannelMetadataInput(
  name: 'Photo Challenge',
  description: 'Take a creative photo in 5 minutes',
  custom: customFields, // ✅ Works perfectly!
);

await pubnub.objects.setChannelMetadata(channelId, channelInput);

// 🔑 IMPORTANT: To retrieve custom data, use includeCustomFields: true
final result = await pubnub.objects.getChannelMetadata(
  channelId,
  includeCustomFields: true, // Essential for getting custom data!
);
print('Custom data: ${result.metadata?.custom}');
// Output: {app_version: 1.0.0+1, platform: flutter, challenge_type: photo, ...}
```

**Key Points:**
- First parameter is the channel ID string
- Second parameter is `ChannelMetadataInput` object with full custom fields
- **CRITICAL**: Use `includeCustomFields: true` when querying to get custom data
- Custom metadata works perfectly for storing app version and other data

### 3. Managing Memberships

```dart
// ✅ WORKING: Create membership using MembershipMetadataInput
final membershipInput = MembershipMetadataInput(
  channelId, // Required positional parameter (NOT named!)
  custom: {
    'joined_at': DateTime.now().toIso8601String(),
    'role': 'member',
    'permissions': ['read', 'write'],
    'status': 'active'
  },
);

// Multiple approaches that work:
// Approach 1: Direct setMemberships
await pubnub.objects.setMemberships([membershipInput]);

// Approach 2: Helper method with error handling
Future<bool> createMembership(String channelId, Map<String, dynamic> customData) async {
  try {
    final membershipInput = MembershipMetadataInput(channelId, custom: customData);
    await pubnub.objects.setMemberships([membershipInput]);
    return true;
  } catch (e) {
    print('Membership creation failed: $e');
    return false;
  }
}
```

**Key Points:**
- Use `MembershipMetadataInput` constructor with channelId as **positional** parameter
- Pass array of membership inputs to `setMemberships`
- Custom metadata WORKS in memberships (unlike User Objects)
- Store role and permission data in custom fields

### 4. Querying Objects

```dart
// 🔑 CRITICAL: Use includeCustomFields to get custom metadata
final channelResult = await pubnub.objects.getAllChannelMetadata(
  includeCustomFields: true, // Essential for custom data!
);
final channels = channelResult.metadataList ?? [];

for (final channel in channels) {
  final custom = channel.custom ?? {};
  final channelType = custom['channel_type'] ?? 'unknown';
  final createdBy = custom['created_by'] ?? 'system';
  
  print('Channel: ${channel.name}, Type: $channelType');
}

// Get user's memberships
final membershipResult = await pubnub.objects.getMemberships();
final memberships = membershipResult.metadataList ?? [];

for (final membership in memberships) {
  final channel = membership.channel;
  final custom = membership.custom ?? {};
  
  if (channel != null) {
    print('Member of: ${channel.name}');
    print('Role: ${custom['role'] ?? 'member'}');
  }
}
```

**Key Points:**
- Always handle nullable `metadataList` with null coalescing (`?? []`)
- Access custom data with null-safe operations
- Check for null channel references in membership data

## Common Patterns and Use Cases

### User Registration Pattern
```dart
Future<void> registerUser(String userId, String name, String email) async {
  // ✅ WORKING: Full user metadata with custom fields
  final customFields = <String, dynamic>{
    'app_version': '1.0.0+1',
    'platform': 'flutter',
    'registered_at': DateTime.now().toIso8601String(),
    'status': 'active',
    'last_seen': DateTime.now().toIso8601String(),
    'user_type': 'member',
  };
  
  final userInput = UuidMetadataInput(
    name: name,
    email: email,
    custom: customFields, // ✅ Now works correctly!
  );
  
  await pubnub.objects.setUUIDMetadata(userInput);
  // Output: ✅ Created User Object with custom fields for: USER-XXXX
}
```

### Channel Creation Pattern
```dart
Future<String> createChannel(String name, String description, String creatorId) async {
  final channelId = 'channel-${DateTime.now().millisecondsSinceEpoch}';
  
  final channelInput = ChannelMetadataInput(
    name: name,
    description: description,
    custom: {
      'created_at': DateTime.now().toIso8601String(),
      'created_by': creatorId,
      'type': 'discussion',
      'member_count': 0,
    },
  );
  
  await pubnub.objects.setChannelMetadata(channelId, channelInput);
  return channelId;
}
```

### Join Channel Pattern
```dart
Future<void> joinChannel(String channelId, String role) async {
  final membershipInput = MembershipMetadataInput(
    channelId, // ✅ Positional parameter works correctly
    custom: {
      'joined_at': DateTime.now().toIso8601String(),
      'role': role,
      'status': 'active',
      'notifications': true,
    },
  );
  
  // ✅ This works reliably
  await pubnub.objects.setMemberships([membershipInput]);
}

// Enhanced version with error handling and automatic creator membership
Future<bool> joinChannelWithCreatorCheck(String channelId, String role) async {
  try {
    final membershipInput = MembershipMetadataInput(
      channelId,
      custom: {
        'joined_at': DateTime.now().toIso8601String(),
        'role': role,
        'created_channel': role == 'creator',
      },
    );
    
    await pubnub.objects.setMemberships([membershipInput]);
    print('✅ Created membership for role: $role');
    return true;
  } catch (e) {
    print('❌ Failed to create membership: $e');
    return false;
  }
}
```

### Check User Membership Pattern
```dart
Future<bool> isUserMemberOfChannel(String channelId) async {
  final result = await pubnub.objects.getMemberships();
  final memberships = result.metadataList ?? [];
  
  return memberships.any((membership) => 
    membership.channel?.id == channelId
  );
}
```

## Error Handling Best Practices

### Robust Error Handling
```dart
Future<bool> safeCreateUserObject(String userId, Map<String, dynamic> userData) async {
  try {
    final userInput = UuidMetadataInput(
      name: userData['name'] ?? 'Unknown User',
      email: userData['email'],
      custom: {
        'created_at': DateTime.now().toIso8601String(),
        ...userData,
      },
    );
    
    await pubnub.objects.setUUIDMetadata(userInput);
    return true;
  } catch (e) {
    print('Failed to create user object: $e');
    return false;
  }
}
```

## Real-time Events Integration

### Subscribing to App Context Events
```dart
Subscription subscribeToAppContextEvents(String userId) {
  // Subscribe to user's own channel to receive App Context events
  final subscription = pubnub.subscribe(channels: {userId});
  
  subscription.messages.listen((envelope) {
    if (envelope.messageType == MessageType.objects) {
      final payload = envelope.payload;
      print('App Context event: ${payload}');
      
      // Handle different event types
      switch (payload['event']) {
        case 'set':
          handleObjectSet(payload);
          break;
        case 'delete':
          handleObjectDelete(payload);
          break;
      }
    }
  });
  
  return subscription;
}
```

## Performance and Optimization Tips

### 1. Batch Operations
```dart
// When adding users to multiple channels, batch the operations
Future<void> addUserToMultipleChannels(List<String> channelIds) async {
  final membershipInputs = channelIds.map((channelId) => 
    MembershipMetadataInput(
      channelId,
      custom: {
        'joined_at': DateTime.now().toIso8601String(),
        'role': 'member',
      },
    )
  ).toList();
  
  await pubnub.objects.setMemberships(membershipInputs);
}
```

### 2. Efficient Queries
```dart
// Use filtering when possible to reduce data transfer
final recentChannels = await pubnub.objects.getAllChannelMetadata(
  filter: 'updated >= "2023-01-01T00:00:00Z"',
  limit: 50,
);
```

## Common Pitfalls and Solutions

### 1. Null Safety Issues
```dart
// ❌ Wrong - can cause null pointer exceptions
final channels = result.metadataList;
for (final channel in channels) { ... }

// ✅ Correct - handle nullable results
final channels = result.metadataList ?? [];
for (final channel in channels) {
  final custom = channel.custom ?? {};
  // Safe to access custom fields
}
```

### 2. Constructor Parameter Confusion
```dart
// ❌ Wrong - will cause compilation errors
await pubnub.objects.setUUIDMetadata(userId);
await pubnub.objects.setChannelMetadata(channelInput);

// ✅ Correct - use proper input objects
await pubnub.objects.setUUIDMetadata(userInput);
await pubnub.objects.setChannelMetadata(channelId, channelInput);
```

### 3. Membership Input Issues
```dart
// ❌ Wrong - missing required positional parameter
final membership = MembershipMetadataInput(custom: {...});

// ✅ Correct - channelId as first parameter
final membership = MembershipMetadataInput(channelId, custom: {...});
```

## Data Modeling Best Practices

### Custom Data Structure
```dart
// Organize custom data consistently across objects
final standardCustomData = {
  'created_at': DateTime.now().toIso8601String(),
  'updated_at': DateTime.now().toIso8601String(),
  'version': '1.0',
  'tags': ['important', 'project-alpha'],
  'metadata': {
    // Application-specific data
  }
};
```

### Relationship Management
```dart
// Store bidirectional references when needed
await pubnub.objects.setChannelMetadata(channelId, ChannelMetadataInput(
  name: channelName,
  custom: {
    'created_by': userId,
    'member_count': 0,
    'last_activity': DateTime.now().toIso8601String(),
  },
));

await pubnub.objects.setMemberships([
  MembershipMetadataInput(channelId, custom: {
    'role': 'creator',
    'created_channel': true,
  })
]);
```

## Testing Patterns

### Unit Testing App Context Operations
```dart
// Mock successful operations for testing
Future<void> testUserCreation() async {
  // Arrange
  final userId = 'test-user-123';
  final userInput = UuidMetadataInput(
    name: 'Test User',
    custom: {'test': true},
  );
  
  // Act
  await pubnub.objects.setUUIDMetadata(userInput);
  
  // Assert - verify user exists
  final result = await pubnub.objects.getUUIDMetadata(userId);
  assert(result.metadata?.name == 'Test User');
}
```



This guide provides the foundation for successfully implementing PubNub App Context in Dart/Flutter applications while avoiding common pitfalls and working around current SDK limitations.