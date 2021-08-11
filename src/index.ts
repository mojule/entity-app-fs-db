import {
  CreateDbItem, DbCollections, DbItem, defaultDrop, EntityDb, EntityKeys
} from '@mojule/entity-app'

import { kebabCase } from '@mojule/util'

import { createCollection } from './create-collection'
import { promises, MakeDirectoryOptions } from 'fs'
import { posix } from 'path'
import { FsOptions } from './types'
import { retry } from './retry'

const { mkdir, rmdir } = promises

const mkdirSafe = async (path: string, options?: MakeDirectoryOptions) =>
  retry( () => mkdir(path, options) )

const initCollections = async <TEntityMap, D extends DbItem>(
  path: string, keys: EntityKeys<TEntityMap>, createDbItem: CreateDbItem<D>,
  formatJson = false
) => {
  const collections: DbCollections<TEntityMap, D> = <any>{}

  for (const key in keys) {
    const collectionPath = posix.join(path, key)

    await mkdirSafe(collectionPath, { recursive: true })

    collections[key] = createCollection(
      collectionPath, createDbItem, formatJson
    )
  }

  return collections
}

export const createFsDb = async <TEntityMap, D extends DbItem>(
  name: string, keys: EntityKeys<TEntityMap>,
  createDbItem: CreateDbItem<D>,
  { dataPath, formatJson }: FsOptions
) => {
  name = kebabCase(name)

  const path = posix.join(dataPath, name)

  await mkdirSafe(path, { recursive: true })

  const drop = async () => {
    await defaultDrop(db)()

    await retry( () => rmdir( path, { recursive: true } ) )
  }

  const close = async () => {}

  const collections = await initCollections(
    path, keys, createDbItem, formatJson
  )

  const db: EntityDb<TEntityMap, D> = { drop, close, collections }

  return db
}
