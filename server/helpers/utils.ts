function findUniqueName(array: string | any[], prefix: string) {
  let i = 1
  let uniqueName = prefix + i
  while (array.includes(uniqueName)) {
    i++
    uniqueName = prefix + i
  }
  return uniqueName
}