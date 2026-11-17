import { readFile } from 'node:fs/promises';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const database = JSON.parse(
  await readFile(new URL('../../frontend/db.json', import.meta.url), 'utf8'),
);
const ownerPassword = process.env.DEMO_OWNER_PASSWORD;
const cashierPassword = process.env.DEMO_CASHIER_PASSWORD;

if (!ownerPassword || !cashierPassword) {
  throw new Error('DEMO_OWNER_PASSWORD and DEMO_CASHIER_PASSWORD are required');
}

const businessId = 'demo-business';

try {
  await prisma.$transaction(async (tx) => {
    await tx.business.upsert({
      where: { id: businessId },
      update: { name: 'Demo Shop', businessType: 'Retail' },
      create: { id: businessId, name: 'Demo Shop', businessType: 'Retail' },
    });

    for (const user of database.users) {
      await tx.user.upsert({
        where: { email: user.email },
        update: { id: user.id, businessId, name: user.name, role: user.role, active: user.active },
        create: {
          id: user.id,
          businessId,
          name: user.name,
          email: user.email,
          passwordHash: await hashPassword(user.role === 'OWNER' ? ownerPassword : cashierPassword),
          role: user.role,
          active: user.active,
        },
      });
    }

    for (const product of database.products) {
      await tx.product.upsert({
        where: { id_businessId: { id: product.id, businessId } },
        update: { ...product, businessId },
        create: { ...product, businessId },
      });
    }

    for (const sale of database.sales) {
      await tx.sale.upsert({
        where: { id: sale.id },
        update: { businessId, saleNumber: sale.id, createdById: sale.createdBy, saleDate: new Date(sale.saleDate), totalAmount: sale.totalAmount },
        create: { id: sale.id, businessId, saleNumber: sale.id, createdById: sale.createdBy, saleDate: new Date(sale.saleDate), totalAmount: sale.totalAmount },
      });
    }

    for (const item of database.saleItems) {
      await tx.saleItem.upsert({
        where: { id: item.id },
        update: { businessId, saleId: item.saleId, productId: item.productId, quantity: item.quantity, unitPrice: item.unitPrice, subtotal: item.subtotal },
        create: { id: item.id, businessId, saleId: item.saleId, productId: item.productId, quantity: item.quantity, unitPrice: item.unitPrice, subtotal: item.subtotal },
      });
    }

    for (const movement of database.stockMovements) {
      await tx.stockMovement.upsert({
        where: { id: movement.id },
        update: { ...movement, businessId, createdAt: new Date(movement.createdAt) },
        create: { ...movement, businessId, createdAt: new Date(movement.createdAt) },
      });
    }
  });
} finally {
  await prisma.$disconnect();
}

async function hashPassword(password) {
  const { hash } = await import('bcryptjs');
  return hash(password, 12);
}
