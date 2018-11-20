export const clamp = (value, min, max) => {
  const c = value < min ? min : value
  return c > max ? max : c
}
