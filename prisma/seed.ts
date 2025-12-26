import { PrismaClient } from '@prisma/client'
import { products } from '../app/data/products'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Xóa tất cả sản phẩm cũ (nếu có)
  await prisma.product.deleteMany()

  // Import sản phẩm từ data/products.ts
  for (const product of products) {
    await prisma.product.create({
      data: {
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice || null,
        image: product.image,
        category: product.category,
        brand: product.brand || null,
        description: product.description,
        inStock: product.inStock,
        specs: product.specs || undefined,
      },
    })
  }

  console.log(`✅ Seeded ${products.length} products`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

