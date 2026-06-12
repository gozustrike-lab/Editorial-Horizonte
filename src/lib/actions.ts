'use server';

import { db } from '@/lib/db';
import type { BookFilters, CheckoutData, DashboardStats } from '@/lib/types';

// ─── Get Books with filters ───

export async function getBooks(filters?: BookFilters) {
  const where: Record<string, unknown> = { isActive: true };

  if (filters?.search) {
    where.OR = [
      { title: { contains: filters.search } },
      { authors: { some: { author: { name: { contains: filters.search } } } } },
    ];
  }

  if (filters?.categoryId) {
    where.categories = { some: { categoryId: filters.categoryId } };
  }

  if (filters?.originType) {
    where.originType = filters.originType;
  }

  if (filters?.minPrice !== undefined) {
    where.price = { ...(where.price as Record<string, unknown> | undefined), gte: filters.minPrice };
  }
  if (filters?.maxPrice !== undefined) {
    where.price = { ...(where.price as Record<string, unknown> | undefined), lte: filters.maxPrice };
  }

  const books = await db.book.findMany({
    where,
    include: {
      authors: {
        include: { author: { select: { id: true, name: true, nationality: true } } },
        orderBy: { order: 'asc' },
      },
      categories: {
        include: { category: { select: { id: true, name: true, slug: true } } },
      },
      publisher: { select: { id: true, name: true, country: true } },
      inventory: { select: { stockDisponible: true } },
    },
    orderBy: { isFeatured: 'desc' },
  });

  return books.map((b) => ({
    ...b,
    totalStock: b.inventory.reduce((s, i) => s + i.stockDisponible, 0),
    inventory: undefined,
  }));
}

// ─── Get Categories ───

export async function getCategories() {
  return db.category.findMany({ orderBy: { name: 'asc' } });
}

// ─── Get Warehouses ───

export async function getWarehouses() {
  return db.warehouse.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
  });
}

// ─── Get Orders ───

export async function getOrders() {
  return db.order.findMany({
    include: {
      items: true,
      warehouse: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
}

// ─── Get Inventory by Warehouse ───

export async function getInventoryByWarehouse(warehouseId?: string) {
  const where: Record<string, unknown> = {};
  if (warehouseId) {
    where.warehouseId = warehouseId;
  }

  return db.inventory.findMany({
    where,
    include: {
      book: { select: { id: true, title: true, isbn: true, price: true, originType: true } },
      warehouse: { select: { id: true, name: true, city: true } },
    },
    orderBy: [
      { warehouse: { name: 'asc' } },
      { book: { title: 'asc' } },
    ],
  });
}

// ─── Get Dashboard Stats ───

export async function getDashboardStats(): Promise<DashboardStats> {
  const [totalSalesResult, pendingOrders, totalBooks, orders, books] =
    await Promise.all([
      db.order.aggregate({
        where: { status: { not: 'CANCELLED' } },
        _sum: { totalAmount: true },
      }),
      db.order.count({ where: { status: 'PENDING' } }),
      db.book.count({ where: { isActive: true } }),
      db.order.findMany({
        where: { status: { not: 'CANCELLED' } },
        include: { warehouse: { select: { name: true } }, items: true },
      }),
      db.book.findMany({
        select: { originType: true },
        where: { isActive: true },
      }),
    ]);

  // Sales by warehouse
  const warehouseSales: Record<string, number> = {};
  for (const order of orders) {
    if (order.warehouse) {
      warehouseSales[order.warehouse.name] =
        (warehouseSales[order.warehouse.name] || 0) + order.totalAmount;
    }
  }
  const salesByWarehouse = Object.entries(warehouseSales).map(
    ([name, sales]) => ({ name, sales: Math.round(sales) })
  );

  // Books by origin
  const propio = books.filter((b) => b.originType === 'PROPIO').length;
  const tercero = books.filter((b) => b.originType === 'TERCERO').length;
  const booksByOrigin = [
    { name: 'Fondo Propio', value: propio, fill: 'var(--color-primary)' },
    { name: 'Terceros', value: tercero, fill: 'var(--color-amber-500)' },
  ];

  // Total stock
  const totalStock = await db.inventory.aggregate({
    _sum: { stockDisponible: true },
  });

  return {
    totalSales: totalSalesResult._sum.totalAmount || 0,
    totalStock: totalStock._sum.stockDisponible || 0,
    pendingOrders,
    totalBooks,
    salesByWarehouse,
    booksByOrigin,
  };
}

// ─── Create Order (with inventory discount) ───

export async function createOrder(data: CheckoutData) {
  const orderNumber = `EH-${new Date().getFullYear()}-${String(
    Math.floor(Math.random() * 9000) + 1000
  ).padStart(4, '0')}`;

  const subtotal = data.items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  const result = await db.$transaction(async (tx) => {
    // Create the order
    const order = await tx.order.create({
      data: {
        orderNumber,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        customerAddress: data.customerAddress,
        customerCity: data.customerCity,
        warehouseId: data.warehouseId,
        status: 'PENDING',
        source: 'ONLINE',
        subtotal,
        discountAmount: 0,
        shippingCost: 0,
        totalAmount: subtotal,
      },
    });

    // Create order items and discount inventory
    for (const item of data.items) {
      await tx.orderItem.create({
        data: {
          orderId: order.id,
          bookId: item.bookId,
          title: item.title,
          unitPrice: item.price,
          quantity: item.quantity,
          subtotal: item.price * item.quantity,
        },
      });

      // Discount inventory
      const inv = await tx.inventory.findFirst({
        where: {
          bookId: item.bookId,
          warehouseId: data.warehouseId,
        },
      });

      if (!inv || inv.stockDisponible < item.quantity) {
        throw new Error(
          `Stock insuficiente para "${item.title}". Disponible: ${inv?.stockDisponible || 0}`
        );
      }

      const newStock = inv.stockDisponible - item.quantity;
      await tx.inventory.update({
        where: { id: inv.id },
        data: { stockDisponible: newStock },
      });

      await tx.inventoryAuditLog.create({
        data: {
          bookId: item.bookId,
          warehouseId: data.warehouseId,
          orderId: order.id,
          movementType: 'SALE',
          quantityBefore: inv.stockDisponible,
          quantityAfter: newStock,
          quantityDelta: -item.quantity,
          notes: `Venta online - Orden ${orderNumber}`,
        },
      });
    }

    return order;
  });

  return { success: true, orderNumber: result.orderNumber };
}

// ─── CRUD for Books (Admin) ───

export async function createBook(data: {
  title: string;
  isbn?: string;
  synopsis?: string;
  pages?: number;
  language?: string;
  publicationYear?: number;
  price: number;
  costPrice?: number;
  originType: string;
  publisherId?: string;
  authorIds?: string[];
  categoryIds?: string[];
}) {
  const slug = data.title
    .toLowerCase()
    .replace(/[^a-z0-9áéíóúñü]+/g, '-')
    .replace(/^-|-$/g, '');

  const book = await db.book.create({
    data: {
      title: data.title,
      slug,
      isbn: data.isbn || null,
      synopsis: data.synopsis || null,
      pages: data.pages || null,
      language: data.language || 'Español',
      publicationYear: data.publicationYear || null,
      price: data.price,
      costPrice: data.costPrice || null,
      originType: data.originType,
      publisherId: data.publisherId || null,
    },
  });

  if (data.authorIds?.length) {
    await Promise.all(
      data.authorIds.map((aId, idx) =>
        db.bookAuthor.create({
          data: { bookId: book.id, authorId: aId, order: idx },
        })
      )
    );
  }

  if (data.categoryIds?.length) {
    await Promise.all(
      data.categoryIds.map((cId) =>
        db.bookCategory.create({
          data: { bookId: book.id, categoryId: cId },
        })
      )
    );
  }

  return book;
}

export async function updateBook(
  id: string,
  data: {
    title?: string;
    price?: number;
    costPrice?: number;
    isActive?: boolean;
    isFeatured?: boolean;
    synopsis?: string;
    pages?: number;
    publicationYear?: number;
  }
) {
  const updateData: Record<string, unknown> = {};
  if (data.title !== undefined) updateData.title = data.title;
  if (data.price !== undefined) updateData.price = data.price;
  if (data.costPrice !== undefined) updateData.costPrice = data.costPrice;
  if (data.isActive !== undefined) updateData.isActive = data.isActive;
  if (data.isFeatured !== undefined) updateData.isFeatured = data.isFeatured;
  if (data.synopsis !== undefined) updateData.synopsis = data.synopsis;
  if (data.pages !== undefined) updateData.pages = data.pages;
  if (data.publicationYear !== undefined)
    updateData.publicationYear = data.publicationYear;

  return db.book.update({
    where: { id },
    data: updateData,
  });
}

// ─── Update Inventory ───

export async function updateInventory(
  bookId: string,
  warehouseId: string,
  delta: number,
  movementType: string
) {
  const inv = await db.inventory.findFirst({
    where: { bookId, warehouseId },
  });

  if (!inv) {
    throw new Error('Registro de inventario no encontrado');
  }

  const newStock = inv.stockDisponible + delta;
  if (newStock < 0) {
    throw new Error('Stock no puede ser negativo');
  }

  await db.$transaction([
    db.inventory.update({
      where: { id: inv.id },
      data: { stockDisponible: newStock },
    }),
    db.inventoryAuditLog.create({
      data: {
        bookId,
        warehouseId,
        movementType,
        quantityBefore: inv.stockDisponible,
        quantityAfter: newStock,
        quantityDelta: delta,
        notes: `Ajuste manual (${movementType})`,
      },
    }),
  ]);

  return newStock;
}

// ─── Login Admin ───

export async function loginAdmin(password: string): Promise<boolean> {
  if (password === 'horizonte2026') {
    return true;
  }
  return false;
}

// ─── Get all books (admin, includes inactive) ───

export async function getAllBooks() {
  return db.book.findMany({
    include: {
      authors: {
        include: { author: { select: { id: true, name: true } } },
        orderBy: { order: 'asc' },
      },
      categories: {
        include: { category: { select: { id: true, name: true } } },
      },
      publisher: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
}

// ─── Get all authors ───

export async function getAllAuthors() {
  return db.author.findMany({ orderBy: { name: 'asc' } });
}

// ─── Get all publishers ───

export async function getAllPublishers() {
  return db.publisher.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } });
}