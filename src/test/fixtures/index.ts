import { createDefaultDbItem, DbRefFor, EntityDb, EntityKeys } from '@mojule/entity-app'
import { randId } from '@mojule/util'
import { createFsDb } from '../..'

export const withDb = async ( 
  cb: ( db: EntityDb<TypeMap> ) => Promise<void>,
  formatJson?: boolean
) => {
  const name = 'test-fs-db-' + randId()
  
  const db = await createFsDb( 
    name, entityKeys, 
    createDefaultDbItem, { dataPath: './data', formatJson } 
  )

  await cb( db )

  // does nothing but coverage
  await db.close()

  await db.drop()
}

export type Foo = {
  name: string
  value: number
}

export type Bar = {
  name: string
  value: number
  foo: DbRefFor<TypeMap,'foo'>
}

export type TypeMap = {
  foo: Foo
  bar: Bar
}

export const entityKeys: EntityKeys<TypeMap> = {
  foo: 'foo',
  bar: 'bar'
}
