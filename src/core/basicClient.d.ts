import { ChatThreadSettings, MessageSettings, MessageTypes } from '../types/other';
import { BasicResponse, ImplementaryResponses, NDCResponses } from '../types/responses';
import { CommentsSorting } from '../types/types';

export interface BasicClient {
    getUserInfo(userId: Safe<string>): Promise<ImplementaryResponses.GetUserInfoResponse>;
    getChatThreads(start: Safe<number>, size: Safe<number>): Promise<ImplementaryResponses.GetChatThreadsResponse>;
    getChatThread(threadId: Safe<string>): Promise<ImplementaryResponses.GetChatThreadRespones>;
    getChatThreadUsers(threadId: Safe<string>, start: Safe<number>, size: Safe<number>): Promise<ImplementaryResponses.GetChatThreadUsersResponse>;
    joinChatThread(threadId: Safe<string>): Promise<BasicResponse>;
    leaveChatThread(threadId: Safe<string>): Promise<BasicResponse>;
    createChatThread(startMessage: Safe<string>, chatThreadSettings: Safe<ChatThreadSettings>): Promise<ImplementaryResponses.GetChatThreadRespones>;
    inviteToChatThread(threadId: Safe<string>, userIds: Safe<string[]>): Promise<BasicResponse>;
    kickFromChatThread(threadId: Safe<string>, userId: Safe<string>, allowRejoin: Safe<boolean>): Promise<BasicResponse>;
    getChatThreadMessages(threadId: Safe<string>, size: Safe<number>): Promise<BasicResponse>;
    getChatThreadMessagesAfter(threadId: Safe<string>, size: Safe<number>, pageToken: Safe<string>): Promise<BasicResponse>;
    getUserFollowing(followingArguments: FollowingArguments): Promise<NDCResponses.GetUserProfilesResponse>;
    getUserFollowers(followingArguments: FollowingArguments): Promise<BasicResponse>;
    getBlogInfo(blogId: Safe<string>): Promise<ImplementaryResponses.GetCreateBlogResponse>;
    getWikiInfo(itemId: Safe<string>): Promise<ImplementaryResponses.GetCreateWikiResponse>;
    getWallComments(userId: Safe<string>, sorting: Safe<CommentsSorting>, start: Safe<number>, size: Safe<number>): Promise<ImplementaryResponses.GetCommentsResponse>;
    sendMessage(threadId: Safe<string>, content: Safe<string>, messageType: Safe<MessageTypes>, messageSettings?: MayUndefined<MessageSettings>): Promise<BasicResponse>;
    sendSticker(threadId: Safe<string>, stickerId: Safe<string>): Promise<BasicResponse>;
    sendImage(mediaArguments: MediaArguments): Promise<BasicResponse>;
    sendAudio(mediaArguments: MediaArguments): Promise<BasicResponse>;
    // deleteMessage(threadId: Safe<string>, messageId: Safe<string>);
    // deleteMessageAsAdmin(threadId: Safe<string>, messageId: Safe<string>, reason: Safe<string>);
    // editChatThread(threadId: Safe<string>): Promise<string>
    // tipCoinsBlog(coins: Safe<number>, blogId: Safe<string>): Promise<BasicResponse>;
    // tipCoinsChatThread(coins: Safe<number>, threadId: Safe<string>): Promise<BasicResponse>;
    // follow(userIds: Safe<string[]>): Promise<BasicResponse>;
    // unfollow(userId: Safe<string>): Promise<BasicResponse>;
    // editProfile(): Promise<BasicResponse>;
    // commentWall(content: Safe<string>, userId: Safe<string>, repliedCommentId: MayUndefined<string>): Promise<BasicResponse>;
    // commentPost(content: Safe<string>, objectId: Safe<string>, postType: Safe<PostTypes>, repliedCommentId: MayUndefined<string>): Promise<BasicResponse>;
    // deleteWallComment(commentId: Safe<string>, userId: Safe<string>): Promise<BasicResponse>;
    // likePost(objectId: Safe<string>, postType: Safe<PostTypes>): Promise<BasicResponse>;
    // unlikePost(objectId: Safe<string>, postType: Safe<PostTypes>): Promise<BasicResponse>;
    // likeMultipleBlogs(blogIds: Safe<string[]>): Promise<BasicResponse>;
    // getAllUsers(usersType: Safe<MembersType>, start: Safe<number>, size: Safe<number>): Promise<BasicResponse>;
    // transferHostRequest(threadId: Safe<string>, userId: Safe<string>): Promise<BasicResponse>;
    // transferHostAccept(threadId: Safe<string>, requestId: Safe<string>): Promise<BasicResponse>;
}