import * as assert from 'assert'

import { withDb } from './fixtures'

describe('fs db', () => {
  it('creates and drops a db', async () => {
    await withDb(
      async db => {
        assert(db)
        assert(db.collections)
        assert(db.collections.foo)
        assert(db.collections.bar)
      }
    )
  })

  it('creates and drops a db with formatJson', async () => {
    await withDb(
      async db => {
        assert(db)
        assert(db.collections)
        assert(db.collections.foo)
        assert(db.collections.bar)
      },
      true
    )
  })  

  it('create', async () => {
    await withDb(
      async db => {
        const _id = await db.collections.foo.create({ name: 'Foo', value: 42 })

        assert(typeof _id === 'string' && _id.length)
      }
    )
  })

  it('load', async () => {
    await withDb(
      async db => {
        const doc = { name: 'Foo', value: 42 }
        const _id = await db.collections.foo.create(doc)
        const expect = { _id, ...doc }
        const entity = await db.collections.foo.load(_id)

        assert.deepStrictEqual(entity, expect)
      }
    )
  })

  it('load with formatJson', async () => {
    await withDb(
      async db => {
        const doc = { name: 'Foo', value: 42 }
        const _id = await db.collections.foo.create(doc)
        const expect = { _id, ...doc }
        const entity = await db.collections.foo.load(_id)

        assert.deepStrictEqual(entity, expect)
      },
      true
    )
  })  

  it('save', async () => {
    await withDb(
      async db => {
        const doc = { name: 'Foo', value: 42 }

        const _id = await db.collections.foo.create(doc)

        const save = { _id, value: 69 } // nice

        await db.collections.foo.save(save)

        const expect = { _id, name: doc.name, value: save.value }
        const entity = await db.collections.foo.load(_id)

        assert.deepStrictEqual(entity, expect)
      }
    )
  })

  it('save fails no _id', async () => {
    await withDb(
      async db => {
        const doc = { name: 'Foo', value: 42 }
        
        await db.collections.foo.create(doc)

        const save = { value: 69 } // nice

        await assert.rejects(
          () => db.collections.foo.save(save as any)
        )
      }
    )
  })
})
