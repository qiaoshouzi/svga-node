export const getVersion = (dataHeader: Uint8Array): number => {
  if (dataHeader[0] === 80 && dataHeader[1] === 75 && dataHeader[2] === 3 && dataHeader[3] === 4) {
    return 1
  }
  return 2
}
