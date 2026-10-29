import { writeFileSync } from 'node:fs'
import { products } from '../src/data/products'
import { sales } from '../src/data/sales'

const users = [
  { id: 'u1', name: 'Owner', email: 'owner@shop.com', role: 'OWNER' },
  { id: 'u2', name: 'Cashier', email: 'cashier@shop.com', role: 'CASHIER' },
]

const db = {
  users,
  products,
  sales: sales.map(({ items, ...sale }) => sale),
  saleItems: sales.flatMap((s) => s.items),
  stockMovements: [],
}

writeFileSync('db.json', JSON.stringify(db, null, 2))
console.log('db.json created')