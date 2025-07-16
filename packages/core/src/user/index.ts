import { z } from 'zod/v4';
import { fn } from '../util/fn';
import { AppService } from '../db';
import { createID } from '../util/id';
import { Common } from '../common';
import { Actor } from '../actor';

export module User {
  export const Info = z.object({
    userId: z.string().describe('The user ID'),
    email: z.string().email().describe('The email address of the user'),
    name: z.string().describe('The name of the user').optional().default(''),
    phone: z.string().describe('The phone number of the user').optional().default(''),
    birthDate: z.string().describe('The birth date of the user').optional().default(''),
    address: Common.AddressField.optional(),
    createdAt: z.number().describe('The creation date of the user'),
    updatedAt: z.number().describe('The last update date of the user'),
  });

  export type Info = z.infer<typeof Info>;

  export const Update = Info.omit({
    userId: true,
    createdAt: true,
    updatedAt: true,
    email: true,
  }).partial();

  export const create = fn(Info.pick({ email: true }), async (info): Promise<User.Info> => {
    const user = await AppService.entities.user
      .create({
        email: info.email,
        userId: createID('user'),
        address: {
          address1: '',
          address2: '',
          city: '',
          state: '',
          zip: '',
        },
        phone: '',
        name: '',
        birthDate: ''
      })
      .go();

    return Info.parse(user.data);
  });

  export const update = fn(Update, async (info): Promise<User.Info> => {
    const user = await AppService.entities.user
      .patch({
        userId: Actor.userId(),
      })
      .set(info)
      .go({
        response: 'all_new',
      });

    return Info.parse(user.data);
  });

  export const fromEmail = fn(z.string().email(), async (email): Promise<User.Info | undefined> => {
    const users = await AppService.entities.user.query
      .byEmail({
        email,
      })
      .go({
        limit: 1,
      });

    if (users.data.length === 0) {
      return undefined;
    }

    return Info.parse(users.data[0]);
  });

  export const fromId = fn(z.string(), async (userId): Promise<User.Info | undefined> => {
    const users = await AppService.entities.user.query
      .users({
        userId,
      })
      .go({
        limit: 1,
      });

    if (users.data.length === 0) {
      return undefined;
    }

    return Info.parse(users.data[0]);
  });
}
