<div align="center">
    <h1>AminoDorksTS</h1>
    <a href="https://t.me/aminodorks"><img src="https://img.shields.io/badge/Telegram-2CA5E0?style=for-the-badge&logo=telegram&logoColor=white" alt="Telegram"></a>
    <a href="https://www.npmjs.com/package/amino.dorks"><img src="https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white" alt="NPM"></a>
</div>
<div align="center">
    <img src="https://img.shields.io/npm/dm/amino.dorks" alt="Downloads">
    <img src="https://img.shields.io/npm/v/amino.dorks.svg" alt="Version">
    <h2>AminoDorksTS is a TypeScript library that interacts with the AminoApps API.</h2>
</div>

##[README on English](https://github.com/thatcelt/AminoDorksTS/blob/master/README.MD)
##[README на Русском](https://github.com/thatcelt/AminoDorksTS/blob/master/README.RU.MD)

## Table of Contents
-----------------

* [Features](#features)
* [Getting Started](#getting-started)
* [Usage](#usage)
* [API Documentation (DEPRECATED)](#api-documentation)
* [Contributing](#contributing)
* [License](#license)

## Features
--------

AminoDorks contains a many features as a library for AminoApps, for example
* So much methods to interacting with API
* Generation of special signature from Android with KeyStore bypassing
* Non-limited requests rate limit for signatures generation
* Huge priority for creating user bots for stressing
* Supporting of so much types with API interacting
* [Fully open source code of server-side](https://github.com/thatcelt/dorks_api)

## Getting Started
---------------

To get started with AminoDorks, follow these steps:
1. Initialize npm package: `npm init`
2. Install TypeScript: `npm i -g typescript`
3. Initialize TypeScript config and configure it: `tsc --init`
4. Install package via npm: `npm i amino.dorks`
5. Get your individual API_KEY from our [Telegram Bot](https://t.me/aminodorks_bot)

## Usage
-----
### Basic authorization

```typescript
import { AminoDorks } from 'amino.dorks';

const main = async () => {
    const aminoDorks = new AminoDorks({
        apiKey: 'API_KEY',
        context: {
            enviroment: 'global'
        }
    });
    const response = await aminoDorks.security.login('email@example.com', 'password');
    console.log(`Logged in ${response.userProfile.nickname}`);
};

main();
```

### Actions in other communities

```typescript
import { AminoDorks } from 'amino.dorks';

const main = async () => {
    const aminoDorks = new AminoDorks({
        apiKey: 'API_KEY',
        context: {
            enviroment: 'global'
        }
    });
    await aminoDorks.security.login('email@example.com', 'password');
    
    const ndc = aminoDorks.as('NDC_ID') // now we can use this instance for interacting with community
    await ndc.playLottery() // for example, for play lottery to get some coins
};

main();
```

## API Documentation (DEPRECATED)
-----------------

### 1. `AminoDorks(apiKey: string)`
A main class to interacting with API in global namespace of app.
* apiKey - special key to interact with our generators server. Getting from our [Telegram Bot](https://t.me/aminodorks_bot)

#### AminoDorks Properties

1. `AminoDorks.accountInfo: UserProfile` - Your user profile information after authorization
2. `AminoDorks.aminodorksNDC: AminoDorksNDC` - Instance for interacting with community

#### AminoDorks Methods

1. `setNdcId(ndcId: number): AminoDorksNDC` - Set ndc id to interact with community, returns client for it

2. `uploadMedia(file: Buffer): UploadMediaResponse` - Method for uploading media files to aminoapps server

3. `getLinkResolution(link: string): LinkResolutionResponse` - Method for getting link information

4. `authenticate(email: string, password: string): UserProfile` - Method for authorization

5. `authenticateSession(sessionId: string, deviceId: string): UserProfile` - Method for authorization with session id

6. `requestResetPassword(email: string): BasicResponse` - Method for requesting password reset

7. `requestVerifyAccount(email: string): BasicResponse` - Method for requesting account verification

8. `resetPassword(email: string, code: string, newPassword: string): BasicResponse` - Method for resetting password

9. `verifyAccount(email: string, code: string): BasicResponse` - Method for verifying account

10. `deleteAccount(password: string): BasicResponse` - Method for deleting account

11. `getCommunities(start: number = 0, size: number = 25): Promise<GetCommunitiesResponse>` - Method for getting list of communities

12. `searchCommunity(title: string): Promise<SearchCommunityResponse>` - Method for searching community by title

13. `joinCommunity(ndcId: number): Promise<BasicResponse>` - Method for joining community

14. `leaveCommunity(ndcId: number): Promise<BasicResponse>` - Method for leaving community

15. `membershipRequest(ndcId: number, message?: string): Promise<BasicResponse>` - Method for requesting membership in community

16. `changeAminoId(aminoId: string): Promise<BasicResponse>` - Method for changing amino id

17. `getWalletInfo(): Promise<GlobalResponses.GetWalletInfoResponse>` - Method for getting wallet information

18. `getWalletHistory(start: number = 0, size: number = 25): Promise<GetWalletHistoryResponse>` - Method for getting wallet history

19. `getCommunnityOnLink(link: string): Promise<Community>` - Method for getting community by link

-----------------

### 2. `AminoDorksNDC(httpWorkflow: HttpWorkflow, accountInfo: UserProfile, ndcId: number)`
AminoDorksNDC is a class for interacting with community. It has same methods as AminoDorks, but for specific community.
* httpWorkflow - instance of HttpWorkflow class
* accountInfo - user profile of your account
* ndcId - community id

#### AminoDorksNDC Methods

1. `getInviteCodes(start: number = 0, size: number = 10): Promise<GetInviteCodesResponse>` - Method for getting invite codes

2. `createInviteCode(duration: number = INVITE_CODE_DEFAULT_DURATION): Promise<InviteCode>` - Method for creating invite code

3. `deleteInviteCode(invitationId: string): Promise<BasicResponse>` - Method for deleting invite code

4. `getInfluencers(): Promise<GetUserProfilesResponse>` - Method for getting influencers

5. `createBlog(title: string, content: string, builder: BlogBuilder = { mediaList: [] }): Promise<GetCreateBlogResponse>` - Method for creating blog

6. `createWiki(label: string, content: string, builder: WikiBuilder = { mediaList: [] }, keywords: string = SIGNATURE_STUB): Promise<GetCreateWikiResponse>` - Method for creating wiki

7. `deleteBlog(blogId: string): Promise<BasicResponse>` - Method for deleting blog

8. `deleteWiki(itemId: string): Promise<BasicResponse>` - Method for deleting wiki

9. `playLottery(timezone: number = GLOBAL_TIMEZONE): Promise<PlayLotteryResponse>` - Method for playing lottery

10. `sendActivityTime(timers: Timer[], timezone: number = GLOBAL_TIMEZONE): Promise<BasicResponse>` - Method for sending activity time

11. `setOnlineStatus(status: OnlineStatus, duration: number = 86400): Promise<BasicResponse>` - Method for setting online status

12. `getOnlineUsers(start: number = 0, size: number = 25): Promise<GetOnlineUsersResponse>` - Method for getting online users

13. `getUserBlogs(userId: string, start: number = 0, size: number = 25): Promise<GetBlogsResponse>` - Method for getting user blogs

14. `getUserWikis(userId: string, start: number = 0, size: number = 25): Promise<GetWikisResponse>` - Method for getting user wikis

15. `getPublicChatThreads(start: number = 0, size: number = 25, type: ChatThreadTypes = 'recommended'): Promise<GetChatThreadsResponse>` - Method for getting public chat threads

16. `getPublicBlogs(start: number = 0, size: number = 25): Promise<GetPublicBlogsResponse>` - Method for getting public blogs

17. `getPublicBlogsPage(pageToken: string, size: number = 25): Promise<GetPublicBlogsResponse>` - Method for getting public blogs page

18. `hideUser(userId: string, reason: string = SIGNATURE_STUB): Promise<BasicResponse>` - Method for hiding user

19. `hideChatThread(threadId: string, reason: string = SIGNATURE_STUB): Promise<BasicResponse>` - Method for hiding chat thread

20. `hidePost(objectId: string, postType: PostTypes, reason: string = SIGNATURE_STUB): Promise<BasicResponse>` - Method for hiding post

21. `unhideUser(userId: string, reason: string = SIGNATURE_STUB): Promise<BasicResponse>` - Method for unhiding user

22. `unhideChatThread(threadId: string, reason: string = SIGNATURE_STUB): Promise<BasicResponse>` - Method for unhiding chat thread

23. `unhidePost(objectId: string, postType: PostTypes, reason: string = SIGNATURE_STUB): Promise<BasicResponse>` - Method for unhiding post

24. `banUser(userId: string, reason: string = SIGNATURE_STUB): Promise<BasicResponse>` - Method for banning user

25. `unbanUser(userId: string, reason: string = SIGNATURE_STUB): Promise<BasicResponse>` - Method for unbanning user

### 3. `Implementary Methods`
Methods for both classes `AminoDorks` and `AminoDorksNDC`

#### AminoDorks Methods

1. `getUserInfo(userId: string): Promise<GetUserInfoResponse>` - Method for getting user info

2. `getChatThreads(start: number, size: number): Promise<GetChatThreadsResponse>` - Method for getting chat threads

3. `getChatThread(threadId: string): Promise<GetChatThreadResponse>` - Method for getting chat thread

4. `getChatThreadUsers(threadId: string, start: number, size: number): Promise<GetChatThreadUsersResponse>` - Method for getting chat thread users

5. `joinChatThread(threadId: string): Promise<BasicResponse>` - Method for joining chat thread

6. `leaveChatThread(threadId: string): Promise<BasicResponse>` - Method for leaving chat thread

7. `createChatThread(startMessage: string, chatThreadSettings: ChatThreadSettings): Promise<GetChatThreadResponse>` - Method for creating chat thread

8. `inviteToChatThread(threadId: string, userIds: string[]): Promise<BasicResponse>` - Method for inviting to chat thread

9. `kickFromChatThread(threadId: string, userId: string, allowRejoin: boolean): Promise<BasicResponse>` - Method for kicking from chat thread

10. `getChatThreadMessages(threadId: string, size: number): Promise<BasicResponse>` - Method for getting chat thread messages

11. `getChatThreadMessagesPage(threadId: string, size: number, pageToken: string): Promise<BasicResponse>` - Method for getting chat thread messages page

12. `getUserFollowing(followingArguments: FollowingArguments): Promise<GetUserProfilesResponse>` - Method for getting user following

13. `getUserFollowers(followingArguments: FollowingArguments): Promise<BasicResponse>` - Method for getting user followers

14. `getBlogInfo(blogId: string): Promise<GetCreateBlogResponse>` - Method for getting blog info

15. `getWikiInfo(itemId: string): Promise<GetCreateWikiResponse>` - Method for getting wiki info

16. `getWallComments(userId: string, sorting: CommentsSorting, start: number, size: number): Promise<GetCommentsResponse>` - Method for getting wall comments

17. `sendMessage(threadId: string, content: string, messageType: MessageTypes, messageSettings?: MessageSettings): Promise<SendMessageResponse>` - Method for sending message

18. `sendEmbededMessage(threadId: string, content: string, embed: Embed, messageSettings?: MessageSettings): Promise<SendMessageResponse>` - Method for sending embeded message

19. `sendSticker(threadId: string, stickerId: string): Promise<SendMessageResponse>` - Method for sending sticker

20. `sendImage(mediaArguments: MediaArguments): Promise<SendMessageResponse>` - Method for sending image

21. `sendAudio(mediaArguments: MediaArguments): Promise<SendMessageResponse>` - Method for sending audio

22. `deleteMessage(threadId: string, messageId: string): Promise<BasicResponse>` - Method for deleting message

23. `deleteMessageAsAdmin(threadId: string, messageId: string, reason: string): Promise<BasicResponse>` - Method for deleting message as admin

24. `editChatThread(threadId: string, builder: EditChatThreadBuilder): Promise<GetChatThreadResponse>` - Method for editing chat thread

25. `setChatThreadBackground(threadId: string, background: string): Promise<BasicResponse>` - Method for setting chat thread background

26. `addCoHosts(threadId: string, userIds: string[]): Promise<BasicResponse>` - Method for adding co-hosts

27. `setViewOnly(editingArguments: EditChatArguments): Promise<BasicResponse>` - Method for setting view only

28. `setCanInvite(editingArguments: EditChatArguments): Promise<BasicResponse>` - Method for setting can invite

29. `setCanTip(editingArguments: EditChatArguments): Promise<BasicResponse>` - Method for setting can tip

30. `tipCoinsBlog(coins: number, blogId: string): Promise<BasicResponse>` - Method for tipping coins blog

31. `tipCoinsChatThread(coins: number, threadId: string): Promise<BasicResponse>` - Method for tipping coins chat thread

32. `follow(userId: string): Promise<BasicResponse>` - Method for following

33. `followMultiple(userId: string[]): Promise<BasicResponse>` - Method for following multiple users

## Contributing
------------

Contributions are welcome! Please submit a pull request with your changes.

## License
-------

AminoDorksTS is licensed under the MIT License. See LICENSE for more information.
If you're will use my generators - write about it to my [DM](https://t.me/celt_is_god)
