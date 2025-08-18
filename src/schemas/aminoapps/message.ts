import { z } from 'zod';

import { UserSchema } from './user';

export const MessageSchema = z.object({
  includedInSummary: z.boolean(),
  uid: z.string(),
  author: UserSchema.nullable().optional(),
  isHidden: z.boolean(),
  messageId: z.string(),
  mediaType: z.number(),
  content: z.string().nullable().optional(),
  clientRefId: z.number(),
  threadId: z.string(),
  createdTime: z.string(),
  type: z.number(),
  mediaValue: z.string().nullable(),
  extensions: z.object({
    replyMessageId: z.string().nullable(),
    replyMessage: z.object({
      author: UserSchema.nullable().optional(),
    }).nullable().optional()
  }).nullable().optional()
});

export type Message = z.infer<typeof MessageSchema>;
