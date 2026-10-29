export type ProductForm = {
  name: string
  sku: string
  sellingPrice: number
  stockQuantity: number
  lowStockThreshold: number
  active: boolean
}

export function validateProduct(f: ProductForm, takenSkus: string[]) {
  const errors: Partial<Record<keyof ProductForm, string>> = {}
  if (!f.name.trim()) errors.name = 'Name is required.'
  if (!f.sku.trim()) errors.sku = 'SKU is required.'
  else if (takenSkus.includes(f.sku.trim().toUpperCase())) errors.sku = 'This SKU is already used.'
  if (!(f.sellingPrice > 0)) errors.sellingPrice = 'Price must be greater than 0.'
  if (!Number.isInteger(f.stockQuantity) || f.stockQuantity < 0)
    errors.stockQuantity = 'Stock must be a whole number, 0 or more.'
  if (!Number.isInteger(f.lowStockThreshold) || f.lowStockThreshold < 0)
    errors.lowStockThreshold = 'Threshold must be a whole number, 0 or more.'
  return errors
}