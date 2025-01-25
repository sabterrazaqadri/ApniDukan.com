import { type SchemaTypeDefinition } from 'sanity'
import { product } from '../schemas/product-schema'
import { category } from '../schemas/category'
import { order } from '../schemas/order'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [product, category, order],
}
