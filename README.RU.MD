<div align="center">
    <h1>AminoDorksTS</h1>
    <a href="https://t.me/aminodorks"><img src="https://img.shields.io/badge/Telegram-2CA5E0?style=for-the-badge&logo=telegram&logoColor=white" alt="Telegram"></a>
    <a href="https://www.npmjs.com/package/amino.dorks"><img src="https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white" alt="NPM"></a>
</div>
<div align="center">
    <img src="https://img.shields.io/npm/dm/amino.dorks" alt="Downloads">
    <img src="https://img.shields.io/npm/v/amino.dorks.svg" alt="Version">
    <h2>AminoDorksTS это библиотека на TypeScript для взаимодействия с API приложения Amino</h2>
</div>

##[README on English](https://github.com/thatcelt/AminoDorksTS/blob/master/README.MD)
##[README на Русском](https://github.com/thatcelt/AminoDorksTS/blob/master/README.RU.MD)

## Содержание
-----------------

* [Функции](#функции)
* [Начало Работы](#начало-работы)
* [Использование](#использование)
* [API Документация (УСТАРЕЛО)](#api-документация)
* [Вклад](#вклад)
* [Лицензия](#лицензия)

## Функции
--------

АминоДоркс содержит много функций как библиотека для AminoApps, например
* Много методов для взаимодействия с API
* Генерация специальных подписей из Android с KeyStore обходом
* Неограниченное количества запросов для генерации подписей
* Огромный приоритет для создания пользовательских ботов
* Поддержка большого количества типов
* [Полностью открытый исходный код серверной части](https://github.com/thatcelt/dorks_api)

## Начало Работы
---------------

Чтобы начать работать с АминоДоркс, производите следующие действия:
1. Создай новый проект: `npm init`
2. Установите TypeScript: `npm i -g typescript`
3. Инициализируй TypeScript конфигурацию: `tsc --init`
4. Установите пакет: `npm i amino.dorks`
5. Получите ваш индивидуальный API_KEY из нашего [Телеграм Бота](https://t.me/aminodorks_bot)

## Использование
-----
### Базовая авторизация

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

### Действия в других сообществах

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
    
    const ndc = aminoDorks.as('NDC_ID') // теперь мы можем использовать экземпляр для взаимодействия с сообществом
    await ndc.playLottery() // например, чтобы сыграть в лотерею
};

main();
```

## API Документация (УСТАРЕЛО)

-----------------

### 1. `AminoDorks(apiKey: string)`
Основной класс для взаимодействия с глобальным пространством приложения
* apiKey - API_KEY из [Telegram Bot](https://t.me/aminodorks_bot)

#### Характеристики AminoDorks

1. `AminoDorks.accountInfo: UserProfile` - Информация о вашем профиле после авторизации
2. `AminoDorks.aminodorksNDC: AminoDorksNDC` - Экземпляр класса для взаимодействия с сообществом

#### Методы AminoDorks

1. `setNdcId(ndcId: number): AminoDorksNDC` - Установите ndc id для взаимодействия с сообществом, возвращает клиент для него

2. `uploadMedia(file: Buffer): UploadMediaResponse` - Метод для загрузки медиафайлов на сервер aminoapps

3. `getLinkResolution(link: string): LinkResolutionResponse` - Метод для получения информации о ссылке

4. `authenticate(email: string, password: string): UserProfile` - Метод для авторизации

5. `authenticateSession(sessionId: string, deviceId: string): UserProfile` - Метод для авторизации с помощью идентификатора сессии

6. `requestResetPassword(email: string): BasicResponse` - Метод для запроса сброса пароля

7. `requestVerifyAccount(email: string): BasicResponse` - Метод для запроса верификации аккаунта

8. `resetPassword(email: string, code: string, newPassword: string): BasicResponse` - Метод для сброса пароля

9. `verifyAccount(email: string, code: string): BasicResponse` - Метод для верификации аккаунта

10. `deleteAccount(password: string): BasicResponse` - Метод для удаления аккаунта

11. `getCommunities(start: number = 0, size: number = 25): Promise<GetCommunitiesResponse>` - Метод для получения списка сообществ

12. `searchCommunity(title: string): Promise<SearchCommunityResponse>` - Метод для поиска сообщества по названию

13. `joinCommunity(ndcId: number): Promise<BasicResponse>` - Метод для присоединения к сообществу

14. `leaveCommunity(ndcId: number): Promise<BasicResponse>` - Метод для выхода из сообщества

15. `membershipRequest(ndcId: number, message?: string): Promise<BasicResponse>` - Метод для запроса участия в сообществе

16. `changeAminoId(aminoId: string): Promise<BasicResponse>` - Метод для изменения идентификатора Амино

17. `getWalletInfo(): Promise<GlobalResponses.GetWalletInfoResponse>` - Метод для получения информации о кошельке

18. `getWalletHistory(start: number = 0, size: number = 25): Promise<GetWalletHistoryResponse>` - Метод для получения истории кошелька

19. `getCommunnityOnLink(link: string): Promise<Community>` - Метод для получения сообщества по ссылке

-----------------

### 2. `AminoDorksNDC(httpWorkflow: HttpWorkflow, accountInfo: UserProfile, ndcId: number)`
AminoDorksNDC - это класс для взаимодействия с сообществом. Он имеет те же методы, что и AminoDorks, но для конкретного сообщества.
* httpWorkflow - экземпляр класса HttpWorkflow
* accountInfo - профиль пользователя вашего аккаунта
* ndcId - идентификатор сообщества

#### Методы AminoDorksNDC

1. `getInviteCodes(start: number = 0, size: number = 10): Promise<GetInviteCodesResponse>` - Метод для получения кодов приглашения

2. `createInviteCode(duration: number = INVITE_CODE_DEFAULT_DURATION): Promise<InviteCode>` - Метод для создания кода приглашения

3. `deleteInviteCode(invitationId: string): Promise<BasicResponse>` - Метод для удаления кода приглашения

4. `getInfluencers(): Promise<GetUserProfilesResponse>` - Метод для получения списока инфлюенсеров

5. `createBlog(title: string, content: string, builder: BlogBuilder = { mediaList: [] }): Promise<GetCreateBlogResponse>` - Метод для создания блога

6. `createWiki(label: string, content: string, builder: WikiBuilder = { mediaList: [] }, keywords: string = SIGNATURE_STUB): Promise<GetCreateWikiResponse>` - Метод для создания вики

7. `deleteBlog(blogId: string): Promise<BasicResponse>` - Метод для удаления блога

8. `deleteWiki(itemId: string): Promise<BasicResponse>` - Метод для удаления вики

9. `playLottery(timezone: number = GLOBAL_TIMEZONE): Promise<PlayLotteryResponse>` - Метод для участия в лотерее

10. `sendActivityTime(timers: Timer[], timezone: number = GLOBAL_TIMEZONE): Promise<BasicResponse>` - Метод для отправки времени активности

11. `setOnlineStatus(status: OnlineStatus, duration: number = 86400): Promise<BasicResponse>` - Метод для установки онлайн-статуса

12. `getOnlineUsers(start: number = 0, size: number = 25): Promise<GetOnlineUsersResponse>` - Метод для получения списка онлайн-пользователей

13. `getUserBlogs(userId: string, start: number = 0, size: number = 25): Promise<GetBlogsResponse>` - Метод для получения блогов пользователя

14. `getUserWikis(userId: string, start: number = 0, size: number = 25): Promise<GetWikisResponse>` - Метод для получения вики пользователя

15. `getPublicChatThreads(start: number = 0, size: number = 25, type: ChatThreadTypes = 'recommended'): Promise<GetChatThreadsResponse>` - Метод для получения списка публичных чатов

16. `getPublicBlogs(start: number = 0, size: number = 25): Promise<GetPublicBlogsResponse>` - Метод для получения списка публичных блогов

17. `getPublicBlogsPage(pageToken: string, size: number = 25): Promise<GetPublicBlogsResponse>` - Метод для получения страницы публичных блогов

18. `hideUser(userId: string, reason: string = SIGNATURE_STUB): Promise<BasicResponse>` - Метод для скрытия пользователя

19. `hideChatThread(threadId: string, reason: string = SIGNATURE_STUB): Promise<BasicResponse>` - Метод для скрытия чата

20. `hidePost(objectId: string, postType: PostTypes, reason: string = SIGNATURE_STUB): Promise<BasicResponse>` - Метод для скрытия поста

21. `unhideUser(userId: string, reason: string = SIGNATURE_STUB): Promise<BasicResponse>` - Метод для раскрытия пользователя

22. `unhideChatThread(threadId: string, reason: string = SIGNATURE_STUB): Promise<BasicResponse>` - Метод для раскрытия чата

23. `unhidePost(objectId: string, postType: PostTypes, reason: string = SIGNATURE_STUB): Promise<BasicResponse>` - Метод для раскрытия поста

24. `banUser(userId: string, reason: string = SIGNATURE_STUB): Promise<BasicResponse>` - Метод для блокировки пользователя

25. `unbanUser(userId: string, reason: string = SIGNATURE_STUB): Promise<BasicResponse>` - Метод для разблокировки пользователя

### 3. `Реализованные методы`
Методы для обоих классов `AminoDorks` и `AminoDorksNDC`

#### Методы AminoDorks

1. `getUserInfo(userId: string): Promise<GetUserInfoResponse>` - Метод для получения информации о пользователе

2. `getChatThreads(start: number, size: number): Promise<GetChatThreadsResponse>` - Метод для получения списка чатов

3. `getChatThread(threadId: string): Promise<GetChatThreadResponse>` - Метод для получения информации о чате

4. `getChatThreadUsers(threadId: string, start: number, size: number): Promise<GetChatThreadUsersResponse>` - Метод для получения списка пользователей в чате

5. `joinChatThread(threadId: string): Promise<BasicResponse>` - Метод для присоединения к чату

6. `leaveChatThread(threadId: string): Promise<BasicResponse>` - Метод для выхода из чата

7. `createChatThread(startMessage: string, chatThreadSettings: ChatThreadSettings): Promise<GetChatThreadResponse>` - Метод для создания нового чата

8. `inviteToChatThread(threadId: string, userIds: string[]): Promise<BasicResponse>` - Метод для приглашения пользователей в чат

9. `kickFromChatThread(threadId: string, userId: string, allowRejoin: boolean): Promise<BasicResponse>` - Метод для исключения пользователя из чата

10. `getChatThreadMessages(threadId: string, size: number): Promise<BasicResponse>` - Метод для получения сообщений в чате

11. `getChatThreadMessagesPage(threadId: string, size: number, pageToken: string): Promise<BasicResponse>` - Метод для получения страницы сообщений в чате

12. `getUserFollowing(followingArguments: FollowingArguments): Promise<GetUserProfilesResponse>` - Метод для получения списка пользователей, которых пользователь подписан

13. `getUserFollowers(followingArguments: FollowingArguments): Promise<BasicResponse>` - Метод для получения списка пользователей, которые подписаны на пользователя

14. `getBlogInfo(blogId: string): Promise<GetCreateBlogResponse>` - Метод для получения информации о блоге

15. `getWikiInfo(itemId: string): Promise<GetCreateWikiResponse>` - Метод для получения информации о вики

16. `getWallComments(userId: string, sorting: CommentsSorting, start: number, size: number): Promise<GetCommentsResponse>` - Метод для получения комментариев на стене пользователя

17. `sendMessage(threadId: string, content: string, messageType: MessageTypes, messageSettings?: MessageSettings): Promise<SendMessageResponse>` - Метод для отправки сообщения

18. `sendEmbededMessage(threadId: string, content: string, embed: Embed, messageSettings?: MessageSettings): Promise<SendMessageResponse>` - Метод для отправки сообщения с Embed

19. `sendSticker(threadId: string, stickerId: string): Promise<SendMessageResponse>` - Метод для отправки стикера

20. `sendImage(mediaArguments: MediaArguments): Promise<SendMessageResponse>` - Метод для отправки изображения

21. `sendAudio(mediaArguments: MediaArguments): Promise<SendMessageResponse>` - Метод для отправки аудио

22. `deleteMessage(threadId: string, messageId: string): Promise<BasicResponse>` - Метод для удаления сообщения

23. `deleteMessageAsAdmin(threadId: string, messageId: string, reason: string): Promise<BasicResponse>` - Метод для удаления сообщения администратором

24. `editChatThread(threadId: string, builder: EditChatThreadBuilder): Promise<GetChatThreadResponse>` - Метод для редактирования чата

25. `setChatThreadBackground(threadId: string, background: string): Promise<BasicResponse>` - Метод для установки фона чата

26. `addCoHosts(threadId: string, userIds: string[]): Promise<BasicResponse>` - Метод для добавления помощников

27. `setViewOnly(editingArguments: EditChatArguments): Promise<BasicResponse>` - Метод для установки режима "Только для просмотра"

28. `setCanInvite(editingArguments: EditChatArguments): Promise<BasicResponse>` - Метод для установки разрешения на приглашение

29. `setCanTip(editingArguments: EditChatArguments): Promise<BasicResponse>` - Метод для установки разрешения на отправку монет

30. `tipCoinsBlog(coins: number, blogId: string): Promise<BasicResponse>` - Метод для отправки монет на блог

31. `tipCoinsChatThread(coins: number, threadId: string): Promise<BasicResponse>` - Метод для отправки монет в чат

32. `follow(userId: string): Promise<BasicResponse>` - Метод для подписки на пользователя

33. `followMultiple(userId: string[]): Promise<BasicResponse>` - Метод для подписки на несколько пользователей

## Вклад
------------

Вы можете внести свой вклад в развитие библиотеки, создавая issues и pull-requests на GitHub.

## License
-------

АминоДоркс распространяется под лицензией MIT.
Если вы будете использовать мои генераторы, сообщите мне об этом в [личку](https://t.me/celt_is_god)
