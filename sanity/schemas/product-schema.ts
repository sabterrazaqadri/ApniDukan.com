import { defineType, defineField } from "sanity";

export const product = defineType({
    name: 'product',
    title: 'Products',
    type: 'document',
    fields: [
        defineField({
            name: 'name',
            title: 'Name',
            type: 'string'
        }),
        {
            name: 'price',
            title: 'Price',
            type: 'number'
        },
        {
            name: 'category',
            title: 'Category',
            type: "reference",
  to: [{ type: "category" }]
        },
        {
            name: 'description',
            title: 'Description',
            type: 'text'
        },
        {
            name: 'image',
            title: 'Image',
            type: 'image',
            options: {hotspot:true}
        },
        {
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
              source: 'name', // Generate slug from the category name
              maxLength: 96,
            },
          },
          
    ]
})