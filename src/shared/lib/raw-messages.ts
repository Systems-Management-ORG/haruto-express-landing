// next-intl types `t.raw` against leaf keys only, so an id-keyed list (an object of items) cannot
// be read with it directly. This is the one cast for those lists.
type RawReader = (key: string) => unknown;

export function rawRecord<T>(t: { raw: unknown }, key: string): Record<string, T> {
  return (t.raw as RawReader)(key) as Record<string, T>;
}
