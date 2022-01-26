/**
 * Describes an entity in Personal Capital's data model.
 *
 * Also provides access to the raw API response for additional inspection.
 */
export class Entity<TRaw> {
  _raw!: TRaw

  constructor(raw: TRaw) {
    Object.defineProperty(this, '_raw', {
      value: raw,
      enumerable: false,
    })
  }
}
