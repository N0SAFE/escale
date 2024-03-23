import { Exception } from '@adonisjs/core/build/standalone'
import {
  LucidModel,
  ModelQueryBuilderContract,
  RelationQueryBuilderContract,
} from '@ioc:Adonis/Lucid/Orm'

export function filterHasUseCustomFilter (filter: any) {
  return !!filter.$loadedRelation
}

export function preloadQuery (
  relation: Relation,
  query: ModelQueryBuilderContract<LucidModel>,
  paths: string[],
  callback: (query: ModelQueryBuilderContract<LucidModel>) => void
) {
  if (paths.length === 0) {
    console.log('paths', paths)
    callback(query)
    return
  }
  console.log('paths', paths)
  console.log('relation', relation)
  const recWithQuery = (
    relation: Relation | undefined,
    paths: string[],
    query: ModelQueryBuilderContract<LucidModel>
  ) => {
    // create a new relation if it not exist and add a waiter for when the relation will be preload after that
    console.log('recWithQuery', paths)
    if (paths.length === 0) {
      callback(query)
      return
    }
    if (relation) {
      rec(relation, paths)
    }
    const [first, ...rest] = paths
    console.log((query as any).preloader.preloads)
    if ((query as any).preloader.preloads[first]) {
      query.preloadChain(first as any, (queryRelation) => {
        recWithQuery(undefined, rest, queryRelation)
      })
    } else {
      if (query.model.$getRelation(first)) {
        query.whenPreloadedChain(first as any, (queryRelation) => {
          recWithQuery(undefined, rest, queryRelation)
        })
      } else {
        throw new Exception(
          `the relation ${query.model.table}:${first} does not exist`,
          500,
          'E_RELATION_DOES_NOT_EXIST'
        )
      }
    }
  }

  const rec = (relation: Relation, paths: string[]) => {
    console.log('rec', paths)
    console.log(relation)
    console.log(paths.length)
    if (paths.length === 0) {
      // console.log('relation.tableName', relation.tableName)
      console.log(paths)
      console.log(
        'define callback ' + relation.tableName + ' : ' + paths.join('.') + ' : ' + paths[0]
      )
      relation.queryFunction.push((query) => callback(query))
      return
    }
    const [first, ...rest] = paths
    const childRelation = Object.entries(relation.child).find(([key]) => key === first)?.[1]
    if (childRelation) {
      // console.log('preload :', first)
      rec(childRelation, rest)
    } else {
      recWithQuery(undefined, paths, query)
    }
  }
  if (!paths.length) {
    callback(query)
  }
  console.log('relation', relation)
  if (!relation) {
    console.log('relation is undefined')
    recWithQuery(relation, paths, query)
  } else {
    console.log('relation is defined')
    rec(relation, paths)
  }
}

export type Relation = {
  queryFunction: ((query: ModelQueryBuilderContract<LucidModel>) => void)[]
  parent?: {
    tableName: string
    useField: string
  }
  tableName: string
  fields: string[]
  child: {
    [key: string]: Relation
  }
}

export function preloadFromGroups (groups: string[], query: ModelQueryBuilderContract<LucidModel>) {
  const map = new Map<string, string[]>()
  groups.forEach((group) => {
    const [from, to] = group.split(':')
    if (map.has(from)) {
      map.get(from)?.push(to)
    } else {
      map.set(from, [to])
    }
  })
  // console.log(map)
  const relationCreated = new Set<`${string}:${string}`>()
  const recPreload = (
    relationQuery: RelationQueryBuilderContract<LucidModel, InstanceType<LucidModel>>,
    relation: Relation
  ) => {
    const tableName = relationQuery.model.table
    const fields = map.get(tableName)

    // console.log({
    //   tableName,
    //   fields,
    // })
    if (fields) {
      fields.forEach((field) => {
        // console.log('preload :', field + ' from ' + tableName)
        relationQuery.preloadChain(field as any, (queryRelation) => {
          // console.log(relation)
          relation.child[field].queryFunction.forEach((fn) => {
            fn(relationQuery)
          })
          recPreload(queryRelation, relation.child[field])
        })
      })
    }
    relation.queryFunction.forEach((fn) => {
      fn(relationQuery)
    })
  }
  const recCreateRelationMap = (
    parentTableName: string,
    thisModel: LucidModel,
    field: string
  ): Relation => {
    // console.log('recCreateRelationMap', parentTableName, thisModel.table, field)
    if (relationCreated.has(`${parentTableName}:${field}`)) {
      throw new Exception(
        `the relation as already been preloaded for the relation ${parentTableName}:${field}`,
        500,
        'E_GROUPS_INFINITE_PRELOAD'
      )
    }
    relationCreated.add(`${parentTableName}:${field}`)
    const thisTableName = thisModel.table
    const fields = map.get(thisTableName)
    if (fields) {
      return {
        queryFunction: [],
        parent: {
          tableName: parentTableName,
          useField: field,
        },
        tableName: thisTableName,
        fields: fields,
        child: fields.reduce((acc, field) => {
          if (!thisModel.$getRelation(field)) {
            throw new Exception(
              `the relation ${thisTableName}:${field} does not exist`,
              500,
              'E_GROUPS_RELATION_DOES_NOT_EXIST'
            )
          }
          return {
            ...acc,
            [field]: recCreateRelationMap(
              thisTableName,
              thisModel.$getRelation(field).relatedModel(),
              field
            ),
          }
        }, {} as any),
      }
    }
    return {
      queryFunction: [],
      parent: {
        tableName: parentTableName,
        useField: field,
      },
      tableName: thisTableName,
      fields: [],
      child: {},
    }
  }

  const parentTableName = query.model.table
  const fields = map.get(parentTableName)

  const relation: Relation = {
    queryFunction: [],
    tableName: parentTableName,
    fields: fields || [],
    child: {},
  }

  if (fields) {
    fields.forEach((field) => {
      // console.log('recCreateRelationMap', parentTableName, query.model.table, field)
      if (!query.model.$getRelation(field)) {
        throw new Exception(
          `the relation ${parentTableName}:${field} does not exist`,
          500,
          'E_GROUPS_RELATION_DOES_NOT_EXIST'
        )
      }
      relation.child[field] = recCreateRelationMap(
        parentTableName,
        query.model.$getRelation(field).relatedModel(),
        field
      )
    })
  }

  function launchPreload () {
    console.log('launchPreload')
    console.log(fields)
    if (fields) {
      fields.forEach((field) => {
        query.preloadChain(field as any, (queryRelation) => {
          recPreload(queryRelation, relation.child[field])
          relation.queryFunction.forEach((fn) => {
            fn(queryRelation)
          })
        })
      })
    }
  }
  return {
    map,
    relation,
    launchPreload: launchPreload,
  }
}

export function isFilterUseGroups (filter: any) {
  return !!filter.$loadedRelation
}

export type RecursiveValue =
  | string
  | string[]
  | true
  | {
    [key: string]: RecursiveValue
  }

export type RelationPath = {
  path?: string[]
  relationPath: string[]
  values: string[]
}

// i want to return [{path: ['path', 'to', 'field'], values: ['value1', 'value2']}]
export function nestedRelationToArray (
  relation: RecursiveValue,
  query: ModelQueryBuilderContract<LucidModel>
): RelationPath[] {
  const rec = (
    relation: RecursiveValue,
    model: LucidModel,
    path: string[] = []
  ): RelationPath[] => {
    if (typeof relation === 'string') {
      if (model.$getColumn(relation)) {
        return [
          {
            relationPath: path,
            path: [...path, relation],
            values: [relation],
          },
        ]
      } else {
        throw new Exception(
          `the column ${relation} does not exist in the model ${model.table}`,
          500,
          'E_GROUPS_COLUMN_DOES_NOT_EXIST'
        )
      }
    }
    if (Array.isArray(relation)) {
      return relation.flatMap((value) => {
        return rec(value, model, path)
      })
    }
    return Object.entries(relation).flatMap(([key, value]) => {
      if (!isNaN(parseInt(key))) {
        return rec(value, model, path)
      }
      console.log(model.table)
      console.log(key)
      if (model.$getRelation(key)) {
        if (value === true) {
          return [
            {
              relationPath: path,
              path: [...path, key],
              values: [key],
            },
            ...rec(value, model.$getRelation(key).relatedModel(), [...path, key]),
          ]
        }

        return rec(value, model.$getRelation(key).relatedModel(), [...path, key])
      } else {
        throw new Exception(
          `the relation ${key} does not exist in the model ${model.table}`,
          500,
          'E_GROUPS_RELATION_DOES_NOT_EXIST'
        )
      }
    })
  }

  return Array.from(
    rec(relation, query.model)
      .reduce((acc, { relationPath, values }) => {
        const key = relationPath.join('.')
        if (acc.has(key)) {
          acc.get(key)?.push(...values)
        } else {
          acc.set(key, values)
        }
        return acc
      }, new Map<string, string[]>())
      .entries()
  ).map(([key, values]) => {
    return {
      relationPath: key === '' ? [] : key.split('.'),
      values,
    }
  })
}

export function relationPathExists (model: LucidModel, relationPath: string[], property?: string) {
  let currentModel = model
  for (const relation of relationPath) {
    console.log('relation', relation)
    if (!currentModel.$getRelation(relation)) {
      return false
    }
    currentModel = currentModel.$getRelation(relation).relatedModel()
  }
  if (property) {
    if (!currentModel.$getColumn(property)) {
      return false
    }
  }
  return true
}

export function hasStatement (query: ModelQueryBuilderContract<LucidModel>, column: string) {
  return query.knexQuery['_statements'].some((statement) => {
    return statement.value === column
  })
}
