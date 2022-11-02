export function swap(arr: Array<string>, r: number, l: number) {
  const priv = arr[r];
  arr[r] = arr[l];
  arr[l] = priv;
}