# Manage DB with Typeorm
## Create Database and Connection
if you use sqlite, typeorm create DB automatically.
else, you should Create database matched with `ormconfig.ts`

`ormconfig.ts`
```typescript
const ORMConfig = {
  type: 'sqlite',
  database: 'dev.sqlite',
  synchronize: true,
  logging: true,
  entities: ['src/entity/**/*.ts'],
  migrations: ['src/migration/**/*.ts'],
  subscribers: ['src/subscriber/**/*.ts'],
  cli: {
    entitiesDir: 'src/entity',
    migrationsDir: 'src/migration',
    subscribersDir: 'src/subscriber',
  },
};

export = ORMConfig;
```
See Official docs
- [Connection Option](https://typeorm.io/#/connection-options)

## Entity
Only you need to do is to create [`Entity`](https://typeorm.io/#/entities) to use.
Option and column types is [here](https://typeorm.io/#/entities/column-types)

See `src/entity` folder to find entity examples

You can also create Relation (one-to-many etc.)
to learn about relation, see [this](https://typeorm.io/#/relations)

## migration
if `synchronize` is `true` in ORMConfig, TypeORM synchronize Entity and DB schema.
So, You don't need to make Migration file and Write SQL.

If you want to insert Data to table (like Initializing first user),
please create migration file.
```shell script
yarn typeorm migration:generate -n 'MIGRATION_FILE_NAME'
```
