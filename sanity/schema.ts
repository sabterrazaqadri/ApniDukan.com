import { type SchemaTypeDefinition } from 'sanity'
import { product } from './schemas/product-schema'
import { order } from './schemas/order'
import { category } from './schemas/category'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [product, order, category],
}
