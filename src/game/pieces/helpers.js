export const getRecipes = building => {
  return building.recipes.concat(
    building.mods.reduce((acc, m) => acc.concat(m.recipes), [])
  )
}
