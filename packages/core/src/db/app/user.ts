import { type CreateEntityItem, Entity, type EntityItem } from "electrodb";

export const user = new Entity({
  model: {
    entity: 'user',
    version: '1',
    service: 'app'
  },
  attributes: {
    userId: {
      type: 'string',
      required: true,
    },
    email: {
      type: 'string',
      required: true,
    },
    name: {
      type: 'string',
      required: true,
      default: '',
    },
    phone: {
      type: 'string',
      required: false,
      default: ''
    },
    birthDate: {
      type: 'string',
      required: false,
      default: ''
    },
    address: {
      type: 'map',
      required: false,
      properties: {
        address1: {
          type: 'string',
          required: true,
          default: ''
        },
        address2: {
          type: 'string',
          required: false,
          default: ''
        },
        city: {
          type: 'string',
          required: true,
          default: ''
        },
        state: {
          type: 'string',
          required: true,
          default: ''
        },
        zip: {
          type: 'string',
          required: true,
          default: ''
        }
      }
    },
    createdAt: {
      type: "number",
      readOnly: true,
      required: true,
      default: () => Date.now(),
      set: () => Date.now(),
    },
    updatedAt: {
      type: "number",
      watch: "*",
      required: true,
      default: () => Date.now(),
      set: () => Date.now(),
    }
  },
  indexes: {
    users: {
      pk: {
        field: 'pk',
        composite: ['userId'],
      },
      sk: {
        field: 'sk',
        composite: [],
      }
    },
    byEmail: {
      index: 'GSI1',
      pk: {
        field: 'gsi1pk',
        composite: ['email'],
      },
      sk: {
        field: 'gsi1sk',
        composite: [],
      }
    }
  }
})

export type UserItem = EntityItem<typeof user>
export type CreateUserItem = CreateEntityItem<typeof user>