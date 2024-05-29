/**
 * Contract source: https://git.io/JOdz5
 *
 * Feel free to let us know via PR, if you find something broken in this
 * file.
 */

import { ChainableContract, ExcutableQueryBuilderContract } from '@ioc:Adonis/Lucid/Database'

declare module '@ioc:Adonis/Lucid/Orm' {
  /*
  |--------------------------------------------------------------------------
  | Providers
  |--------------------------------------------------------------------------
  |
  | The providers are used to fetch users. The Auth module comes pre-bundled
  | with two providers that are `Lucid` and `Database`. Both uses database
  | to fetch user details.
  |
  | You can also create and register your own custom providers.
  |
  */
  interface PreloadChain<Model extends LucidRow, Builder> {
    <
      Name extends ExtractModelRelations<Model>,
      RelatedBuilder = Model[Name] extends ModelRelations ? Model[Name]['builder'] : never
    >(
      relation: Name,
      callback?: (builder: RelatedBuilder, metadata: { isParent: boolean }) => void,
      onChildPreload?: (builder: RelatedBuilder) => void
    ): Builder
  }

  interface IfPreloaded<Model extends LucidRow, Builder> {
    <Name extends ExtractModelRelations<Model>>(
      relation: Name,
      callback: (
        builder: Model[Name] extends ModelRelations ? Model[Name]['builder'] : never
      ) => void
    ): Builder
  }

  interface WhenPreloaded<Model extends LucidRow, Builder> {
    <Name extends ExtractModelRelations<Model>>(
      relation: Name,
      callback: (
        builder: Model[Name] extends ModelRelations ? Model[Name]['builder'] : never
      ) => void
    ): Builder
  }

  interface OnPreloeded<Model extends LucidRow, Builder> {
    <Name extends ExtractModelRelations<Model>>(
      relation: Name,
      callback: (
        builder: Model[Name] extends ModelRelations ? Model[Name]['builder'] : never
      ) => void
    ): Builder
  }

  interface ModelQueryBuilderContract<Model extends LucidModel, Result = InstanceType<Model>>
    extends ChainableContract,
      ExcutableQueryBuilderContract<Result[]> {
    preloadChain: PreloadChain<InstanceType<Model>, this>
    ifPreloaded: IfPreloaded<InstanceType<Model>, this>
    whenPreloadedChain: WhenPreloaded<InstanceType<Model>, this>
    onPreloadedChain: OnPreloeded<InstanceType<Model>, this>
  }
}
