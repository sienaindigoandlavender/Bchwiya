/** Each level gets its own pastel, in path order. Used by the path and level pages. */
const FILLS = ["bg-peach", "bg-blush", "bg-lilac", "bg-sky", "bg-butter", "bg-mint", "bg-blush"];

export function levelFill(index: number): string {
  return FILLS[index % FILLS.length]!;
}
