---
title: Módulo predefinido
language_tabs:
  - shell: Shell
  - http: HTTP
  - javascript: JavaScript
  - ruby: Ruby
  - python: Python
  - php: PHP
  - java: Java
  - go: Go
toc_footers: []
includes: []
search: true
code_clipboard: true
highlight_theme: darkula
headingLevel: 2
generator: "@tarslib/widdershins v4.0.30"

---

# Módulo predefinido

Base URLs:

# Authentication

- HTTP Authentication, scheme: bearer

# users

## POST Create own user

POST /users

This endpont allows the registration of a new user.

> Body Parameters

```yaml
username: dude
email: dude@email.com
password: badpassw0rd

```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|body|body|object| yes |none|
|» username|body|string| yes |Username to be associated to a user|
|» email|body|string| yes |Email to be associated to a user|
|» password|body|string| yes |User's password to be tranformed into an hash after this request|

> Response Examples

> 400 Response

```json
{
  "message": "The required parameters were not submited"
}
```

> 409 Response

```json
{
  "message": "There is already registered user dude"
}
```

> 500 Response

```json
{
  "message": "Internal server error. Try again later."
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|none|None|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|none|Inline|
|409|[Conflict](https://tools.ietf.org/html/rfc7231#section-6.5.8)|none|Inline|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **400**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» message|string|true|none||none|

HTTP Status Code **409**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» message|string|true|none||none|

HTTP Status Code **500**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» message|string|true|none||none|

## DELETE Delete own user

DELETE /users

> Body Parameters

```yaml
{}

```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|body|body|object| yes |none|

> Response Examples

> 400 Response

```json
{
  "message": "A JWT token was not submited"
}
```

> 401 Response

```json
{
  "message": "jwt malformed"
}
```

> 500 Response

```json
{
  "message": "Internal server error. Try again later."
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|none|None|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|none|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|none|Inline|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **400**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» message|string|true|none||none|

HTTP Status Code **401**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» message|string|true|none||none|

HTTP Status Code **500**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» message|string|true|none||none|

# login

## POST Authenticate own user

POST /login

This endpoint allows a registered user to authenticate to IP-YTP. In a successfull login, the user is going to recieve a JWT Token containing their username and role.

> Body Parameters

```yaml
username: dude
password: badpassw0rd

```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|body|body|object| yes |none|
|» username|body|string| yes |Username associated to a user|
|» password|body|string| yes |Password associated to a user (with the usage of an hash stored)|

> Response Examples

> 200 Response

```json
{
  "token": "*JWT Token*"
}
```

> 400 Response

```json
{
  "message": "The required parameters were not submited"
}
```

> 401 Response

```json
{
  "message": "Incorrect password"
}
```

> 404 Response

```json
{
  "message": "User not found"
}
```

> 500 Response

```json
{
  "message": "Internal server error."
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|none|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|none|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|none|Inline|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» token|string|true|none||none|

HTTP Status Code **400**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» message|string|true|none||none|

HTTP Status Code **401**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» message|string|true|none||none|

HTTP Status Code **404**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» message|string|true|none||none|

HTTP Status Code **500**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» message|string|true|none||none|

# channels

## POST Add new channel

POST /channels

This endpont allows the creation of a new channel.

> Body Parameters

```yaml
name: Another Channel
rtmpPathName: nthr-chnl
iconURI: ""

```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|body|body|object| yes |none|
|» name|body|string| yes |Name of the new channel|
|» rtmpPathName|body|string| no |Name of the path to be associated with the new channel|
|» iconURI|body|string| no |The image URI to be associated to the new channel|

> Response Examples

> 201 Response

```json
{
  "message": "New channel 'Gametrailers' was created!"
}
```

> 400 Response

```json
{
  "message": "A JWT token was not submited"
}
```

> 401 Response

```json
{
  "message": "jwt malformed"
}
```

> 403 Response

```json
{
  "message": "Only users with admin role can create a channel."
}
```

> 500 Response

```json
{
  "message": "Internal server error."
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|none|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|none|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|none|Inline|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|none|Inline|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **201**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» message|string|true|none||none|

HTTP Status Code **400**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» message|string|true|none||none|

HTTP Status Code **403**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» message|string|true|none||none|

HTTP Status Code **500**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» message|string|true|none||none|

## GET Get and Search Channels

GET /channels

This endpont allows the collection and search of a registred channels.

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|search|query|string| no |Optional text input that filters by channel name|
|page|query|integer| no |Page number|
|pageSize|query|integer| no |Page size limit|

> Response Examples

> 200 Response

```json
{
  "items": [
    {
      "_id": "[Channel ID]",
      "name": "GameTrailers",
      "rtmpPathName": "gametrailers",
      "iconURI": "[image URI]",
      "__v": 0
    }
  ],
  "page": 2,
  "totalItems": "*N* items",
  "totalPages": "*P* pages",
  "_links": {
    "self": "/channels?page=2",
    "next": "/channels?page=3",
    "prev": "/channels?page=1"
  }
}
```

> 400 Response

```json
{
  "message": "The queries 'page' and 'pageSize' should be a number"
}
```

> 404 Response

```json
{
  "message": "Page requested not found"
}
```

> 500 Response

```json
{
  "message": "Internal server error."
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|none|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|none|Inline|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» items|[object]|true|none||none|
|»» _id|string|false|none||none|
|»» name|string|false|none||none|
|»» rtmpPathName|string|false|none||none|
|»» iconURI|string|false|none||none|
|»» __v|integer|false|none||none|
|» page|integer|true|none||none|
|» totalItems|string|true|none||none|
|» totalPages|string|true|none||none|
|» _links|object|true|none||none|
|»» self|string|true|none||none|
|»» next|string|false|none||none|
|»» prev|string|false|none||none|

HTTP Status Code **400**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» message|string|true|none||none|

HTTP Status Code **404**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» message|string|true|none||none|

HTTP Status Code **500**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» message|string|true|none||none|

## GET Get Channel

GET /channels/{channel}

This endpont allows to obtain information from a specific channel, its programs with the optional filtering by a requested weekday

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|channel|path|string| yes |Path parameter associated with the channel's path name|
|weekday|query|string| no |An optional filter that allows to obtain programs that occurs in that specific day of the week. It should be used with the 3 letter abreviation.|

> Response Examples

> 200 Response

```json
{
  "_id": "[Channel ID]",
  "name": "Another Channel",
  "rtmpPathName": "another-channel",
  "iconURI": "[Icon URI]",
  "programs": [
    {
      "_id": "[Program ID]",
      "name": "1 hour of Gametrailers!",
      "startTime": "10:00:00",
      "endTime": "11:00:00",
      "weekdays": [
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat",
        "Sun"
      ],
      "type": "byYTChannel",
      "ytChannelId": "gametrailers"
    }
  ]
}
```

> 400 Response

```json
{
  "message": "The requested weekday is not valid."
}
```

> 404 Response

```json
{
  "message": "Channel not found"
}
```

> 500 Response

```json
{
  "message": "Internal server error. Try again later."
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|none|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|none|Inline|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» _id|string|true|none||none|
|» name|string|true|none||none|
|» rtmpPathName|string|true|none||none|
|» iconURI|string|true|none||none|
|» programs|[object]|true|none||none|
|»» _id|string|false|none||none|
|»» name|string|false|none||none|
|»» startTime|string|false|none||none|
|»» endTime|string|false|none||none|
|»» weekdays|[string]|false|none||none|
|»» type|string|false|none||none|
|»» ytChannelId|string|false|none||none|

HTTP Status Code **400**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» message|string|true|none||none|

HTTP Status Code **500**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» message|string|true|none||none|

## PATCH Edit channel

PATCH /channels/{channel}

This endpont allows to update the information of a specific channel

> Body Parameters

```yaml
name: Another Channel
rtmpPathName: nthr-chnl
iconURI: ""

```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|channel|path|string| yes |Path parameter associated with the channel's path name|
|body|body|object| yes |none|
|» name|body|string| no |Updated name of the channel|
|» rtmpPathName|body|string| no |Name of the path to be updated|
|» iconURI|body|string| no |The image URI to be updated|

> Response Examples

> 200 Response

```json
{
  "message": "Channel updated!"
}
```

> 400 Response

```json
{
  "message": "A JWT token was not submited"
}
```

> 401 Response

```json
{
  "message": "jwt malformed"
}
```

> 403 Response

```json
{
  "message": "Only users with admin role can edit a channel."
}
```

> 404 Response

```json
{
  "message": "Channel not found"
}
```

> 500 Response

```json
{
  "message": "Internal server error. Try again later."
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|none|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|none|Inline|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|none|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|none|Inline|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» message|string|true|none||none|

HTTP Status Code **400**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» message|string|true|none||none|

HTTP Status Code **404**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» message|string|true|none||none|

HTTP Status Code **500**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» message|string|true|none||none|

## DELETE Delete channel

DELETE /channels/{channel}

This endpont allows to remove a specific channel

> Body Parameters

```yaml
{}

```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|channel|path|string| yes |Path parameter associated with the channel's path name|
|body|body|object| yes |none|

> Response Examples

> 400 Response

```json
{
  "message": "A JWT token was not submited"
}
```

> 401 Response

```json
{
  "message": "jwt malformed"
}
```

> 403 Response

```json
{
  "message": "Only users with admin role can delete a channel."
}
```

> 404 Response

```json
{
  "message": "Channel not found"
}
```

> 500 Response

```json
{
  "message": "Internal server error."
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|none|None|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|none|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|none|Inline|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|none|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|none|Inline|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **400**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» message|string|true|none||none|

HTTP Status Code **401**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» message|string|true|none||none|

HTTP Status Code **403**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» message|string|true|none||none|

HTTP Status Code **404**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» message|string|true|none||none|

HTTP Status Code **500**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» message|string|true|none||none|

## POST Add program

POST /channels/{channel}

This endpont allows the creation of a new program.

> Body Parameters

```yaml
name: 1 hour of Gametrailers!
description: Lorem ipsium sit amet
startTime: 10:00:00
endTime: 11:00:00
weekdays:
  - Mon
  - Tue
  - Wed
  - Thu
  - Fri
  - Sat
  - Sun
type: byYTChannel
ytChannelId: gametrailers
ytPlaylistId: ""
ytVideoSearchMode: alwaysNewer
ytVideoInvertedOrder: "false"
maxVideos: 10

```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|channel|path|string| yes |Path parameter associated with the channel's path name|
|body|body|object| yes |none|
|» name|body|string| yes |Name of the new program|
|» description|body|string| no |Description of the new program|
|» startTime|body|string| yes |The initial time when the program starts|
|» endTime|body|string| no |The maximum time when the program ends|
|» weekdays|body|[string]| yes |The days of the week when the new program is going to be showed|
|» type|body|string| yes |Determines if the new program is based on a YouTube channel (byYTChannel) or a YouTube playlist (byYTPlaylist)|
|» ytChannelId|body|string| yes |YouTube channel ID to be used if the type of the new program is 'byYTChannel'|
|» ytPlaylistId|body|string| yes |YouTube playlist ID to be used if the type of the new program is 'byYTPlaylist'|
|» ytVideoSearchMode|body|string| yes |Determines if the new program is based on newer videos (alwaysNewer) or if it deals with the videos as a series (episode)|
|» ytVideoInvertedOrder|body|boolean| yes |Determines if order of the emited videos in new program is inverted (last to newer)|
|» maxVideos|body|integer| yes |Determines the maximum number of videos the program emits independently of the program's end time|

> Response Examples

> 200 Response

```json
{
  "message": "New program created for 'Another Channel'."
}
```

> 400 Response

```json
{
  "message": "A JWT token was not submited"
}
```

> 401 Response

```json
{
  "message": "jwt malformed"
}
```

> 403 Response

```json
{
  "message": "Only users with admin role can add a program."
}
```

> 404 Response

```json
{
  "message": "Channel not found"
}
```

> 409 Response

```json
{
  "message": "There are conflicts in the timetable."
}
```

> 500 Response

```json
{
  "message": "Internal server error."
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|none|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|none|Inline|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|none|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|none|Inline|
|409|[Conflict](https://tools.ietf.org/html/rfc7231#section-6.5.8)|none|Inline|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» message|string|true|none||none|

HTTP Status Code **400**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» message|string|true|none||none|

HTTP Status Code **401**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» message|string|true|none||none|

HTTP Status Code **403**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» message|string|true|none||none|

## GET Get Program

GET /channels/{channel}/{programId}

This endpont allows to obtain information from a specific program

> Body Parameters

```yaml
{}

```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|channel|path|string| yes |Path parameter associated with the channel's path name|
|programId|path|string| yes |The ID of a program to be found|
|body|body|object| yes |none|

> Response Examples

> 200 Response

```json
{
  "_id": "69dd3073e1cf22a21f0aadfc",
  "name": "1 hour of Gametrailers!",
  "description": "Lorem ipsium sit amet",
  "startTime": "10:00:00",
  "endTime": "11:00:00",
  "weekdays": [
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun"
  ],
  "maxVideos": 10,
  "type": "byYTChannel",
  "ytChannelId": "gametrailers",
  "ytVideoSearchMode": "alwaysNewer",
  "ytVideoInvertedOrder": false
}
```

> 404 Response

```json
{
  "message": "Program not found"
}
```

> 500 Response

```json
{
  "message": "Internal server error."
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|none|Inline|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» _id|string|true|none||none|
|» name|string|true|none||none|
|» description|string|true|none||none|
|» startTime|string|true|none||none|
|» endTime|string|true|none||none|
|» weekdays|[string]|true|none||none|
|» maxVideos|integer|true|none||none|
|» type|string|true|none||none|
|» ytChannelId|string|true|none||none|
|» ytVideoSearchMode|string|true|none||none|
|» ytVideoInvertedOrder|boolean|true|none||none|

HTTP Status Code **404**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» message|string|true|none||none|

## PATCH Edit program

PATCH /channels/{channel}/{programId}

This endpont allows to update the information of a specific program

> Body Parameters

```yaml
name: 1 hour of Gametrailers!
description: Lorem ipsium sit amet
startTime: 10:00:00
endTime: 11:00:00
weekdays:
  - Mon
  - Tue
  - Wed
  - Thu
  - Fri
  - Sat
  - Sun
type: byYTChannel
ytChannelId: gametrailers
ytPlaylistId: ""
ytVideoSearchMode: alwaysNewer
ytVideoInvertedOrder: "false"
maxVideos: 10

```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|channel|path|string| yes |Path parameter associated with the channel's path name|
|programId|path|string| yes |The ID of a program to be updated|
|body|body|object| yes |none|
|» name|body|string| no |Name of the program|
|» description|body|string| no |Description of the program|
|» startTime|body|string| no |The initial time when the program starts|
|» endTime|body|string| no |The maximum time when the program ends|
|» weekdays|body|[string]| no |The days of the week when the program is going to be showed|
|» type|body|string| no |Determines if the program is based on a YouTube channel (byYTChannel) or a YouTube playlist (byYTPlaylist)|
|» ytChannelId|body|string| no |YouTube channel ID to be used if the type of the program is 'byYTChannel'|
|» ytPlaylistId|body|string| no |YouTube playlist ID to be used if the type of the program is 'byYTPlaylist'|
|» ytVideoSearchMode|body|string| no |Determines if the program is based on newer videos (alwaysNewer) or if it deals with the videos as a series (episode)|
|» ytVideoInvertedOrder|body|boolean| no |Determines if order of the emited videos in program is inverted (last to newer)|
|» maxVideos|body|integer| no |Determines the maximum number of videos the program emits independently of the program's end time|

> Response Examples

> 200 Response

```json
{
  "message": "Program updated!"
}
```

> 400 Response

```json
{
  "message": "A JWT token was not submited"
}
```

> 401 Response

```json
{
  "message": "jwt malformed"
}
```

> 403 Response

```json
{
  "message": "Only users with admin role can edit a program."
}
```

> 404 Response

```json
{
  "message": "Program not found"
}
```

> 409 Response

```json
{
  "message": "There are conflicts in the timetable."
}
```

> 500 Response

```json
{
  "message": "Internal Server Error"
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|none|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|none|Inline|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|none|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|none|Inline|
|409|[Conflict](https://tools.ietf.org/html/rfc7231#section-6.5.8)|none|Inline|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» message|string|true|none||none|

HTTP Status Code **400**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» message|string|true|none||none|

HTTP Status Code **401**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» message|string|true|none||none|

HTTP Status Code **403**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» message|string|true|none||none|

HTTP Status Code **404**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» message|string|true|none||none|

HTTP Status Code **409**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» message|string|true|none||none|

HTTP Status Code **500**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» message|string|true|none||none|

## DELETE Delete program

DELETE /channels/{channel}/{programId}

> Body Parameters

```yaml
{}

```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|channel|path|string| yes |Path parameter associated with the channel's path name|
|programId|path|string| yes |The ID of a program to be removed|
|body|body|object| yes |none|

> Response Examples

> 400 Response

```json
{
  "message": "A JWT token was not submited"
}
```

> 401 Response

```json
{
  "message": "jwt malformed"
}
```

> 403 Response

```json
{
  "message": "Only users with admin role can delete a program."
}
```

> 404 Response

```json
{
  "message": "Program not found"
}
```

> 500 Response

```json
{
  "message": "Internal Server Error"
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|none|None|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|none|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|none|Inline|
|403|[Forbidden](https://tools.ietf.org/html/rfc7231#section-6.5.3)|none|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|none|Inline|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **400**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» message|string|true|none||none|

HTTP Status Code **401**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» message|string|true|none||none|

HTTP Status Code **403**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» message|string|true|none||none|

HTTP Status Code **500**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» message|string|true|none||none|

# Data Schema

