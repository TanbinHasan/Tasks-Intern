import vine from '@vinejs/vine'

export const testById = vine.compile(
  vine.object({
    id: vine.number().positive()
  })
)

export const testAll = vine.compile(
  vine.object({})
)