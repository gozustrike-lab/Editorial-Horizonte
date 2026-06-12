import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// ─── GET /api?resource=books|categories|warehouses|orders|inventory|dashboard|authors|publishers|allbooks ───

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const resource = searchParams.get("resource");

  try {
    switch (resource) {
      case "books": {
        const search = searchParams.get("search") || undefined;
        const categoryId = searchParams.get("categoryId") || undefined;
        const originType = searchParams.get("originType") || undefined;
        const minPrice = searchParams.get("minPrice")
          ? Number(searchParams.get("minPrice"))
          : undefined;
        const maxPrice = searchParams.get("maxPrice")
          ? Number(searchParams.get("maxPrice"))
          : undefined;

        const where: Record<string, unknown> = { isActive: true };

        if (search) {
          where.OR = [
            { title: { contains: search } },
            {
              authors: {
                some: { author: { name: { contains: search } } },
              },
            },
          ];
        }
        if (categoryId) {
          where.categories = { some: { categoryId } };
        }
        if (originType) {
          where.originType = originType;
        }
        if (minPrice !== undefined) {
          where.price = { ...(where.price as Record<string, unknown>), gte: minPrice };
        }
        if (maxPrice !== undefined) {
          where.price = { ...(where.price as Record<string, unknown>), lte: maxPrice };
        }

        const books = await db.book.findMany({
          where,
          include: {
            authors: {
              include: { author: { select: { id: true, name: true, nationality: true } } },
              orderBy: { order: "asc" },
            },
            categories: {
              include: { category: { select: { id: true, name: true, slug: true } } },
            },
            publisher: { select: { id: true, name: true, country: true } },
            inventory: { select: { stockDisponible: true } },
          },
          orderBy: { isFeatured: "desc" },
        });

        const result = books.map((b) => ({
          ...b,
          totalStock: b.inventory.reduce((s: number, i: { stockDisponible: number }) => s + i.stockDisponible, 0),
          inventory: undefined,
        }));

        return NextResponse.json(result);
      }

      case "categories": {
        const categories = await db.category.findMany({ orderBy: { name: "asc" } });
        return NextResponse.json(categories);
      }

      case "warehouses": {
        const warehouses = await db.warehouse.findMany({
          where: { isActive: true },
          orderBy: { name: "asc" },
        });
        return NextResponse.json(warehouses);
      }

      case "orders": {
        const orders = await db.order.findMany({
          include: {
            items: true,
            warehouse: { select: { id: true, name: true } },
          },
          orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(orders);
      }

      case "inventory": {
        const warehouseId = searchParams.get("warehouseId") || undefined;
        const where: Record<string, unknown> = {};
        if (warehouseId) where.warehouseId = warehouseId;

        const inventory = await db.inventory.findMany({
          where,
          include: {
            book: { select: { id: true, title: true, isbn: true, price: true, originType: true } },
            warehouse: { select: { id: true, name: true, city: true } },
          },
          orderBy: [{ warehouse: { name: "asc" } }, { book: { title: "asc" } }],
        });
        return NextResponse.json(inventory);
      }

      case "dashboard": {
        const [totalSalesResult, pendingOrders, totalBooks, orders, books] =
          await Promise.all([
            db.order.aggregate({
              where: { status: { not: "CANCELLED" } },
              _sum: { totalAmount: true },
            }),
            db.order.count({ where: { status: "PENDING" } }),
            db.book.count({ where: { isActive: true } }),
            db.order.findMany({
              where: { status: { not: "CANCELLED" } },
              include: { warehouse: { select: { name: true } }, items: true },
            }),
            db.book.findMany({
              select: { originType: true },
              where: { isActive: true },
            }),
          ]);

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

        const propio = books.filter((b) => b.originType === "PROPIO").length;
        const tercero = books.filter((b) => b.originType === "TERCERO").length;
        const booksByOrigin = [
          { name: "Fondo Propio", value: propio, fill: "var(--color-primary)" },
          { name: "Terceros", value: tercero, fill: "oklch(0.75 0.14 75)" },
        ];

        const totalStock = await db.inventory.aggregate({
          _sum: { stockDisponible: true },
        });

        return NextResponse.json({
          totalSales: totalSalesResult._sum.totalAmount || 0,
          totalStock: totalStock._sum.stockDisponible || 0,
          pendingOrders,
          totalBooks,
          salesByWarehouse,
          booksByOrigin,
        });
      }

      case "authors": {
        const authors = await db.author.findMany({ orderBy: { name: "asc" } });
        return NextResponse.json(authors);
      }

      case "publishers": {
        const publishers = await db.publisher.findMany({
          where: { isActive: true },
          orderBy: { name: "asc" },
        });
        return NextResponse.json(publishers);
      }

      case "allbooks": {
        const allBooks = await db.book.findMany({
          include: {
            authors: {
              include: { author: { select: { id: true, name: true } } },
              orderBy: { order: "asc" },
            },
            categories: {
              include: { category: { select: { id: true, name: true } } },
            },
            publisher: { select: { id: true, name: true } },
          },
          orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(allBooks);
      }

      default:
        return NextResponse.json({ error: "Unknown resource" }, { status: 400 });
    }
  } catch (error) {
    console.error("API GET error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal error" },
      { status: 500 }
    );
  }
}

// ─── POST /api?action=createOrder|updateBook|updateInventory|loginAdmin ───

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");

  try {
    const body = await request.json();

    switch (action) {
      case "createOrder": {
        const orderNumber = `EH-${new Date().getFullYear()}-${String(
          Math.floor(Math.random() * 9000) + 1000
        ).padStart(4, "0")}`;

        const items = body.items as Array<{
          bookId: string;
          title: string;
          price: number;
          quantity: number;
          originType: string;
        }>;

        const subtotal = items.reduce(
          (sum: number, i: { price: number; quantity: number }) =>
            sum + i.price * i.quantity,
          0
        );

        const result = await db.$transaction(async (tx) => {
          const order = await tx.order.create({
            data: {
              orderNumber,
              customerName: body.customerName,
              customerEmail: body.customerEmail,
              customerPhone: body.customerPhone,
              customerAddress: body.customerAddress,
              customerCity: body.customerCity,
              warehouseId: body.warehouseId,
              status: "PENDING",
              source: "ONLINE",
              subtotal,
              discountAmount: 0,
              shippingCost: 0,
              totalAmount: subtotal,
            },
          });

          for (const item of items) {
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

            const inv = await tx.inventory.findFirst({
              where: {
                bookId: item.bookId,
                warehouseId: body.warehouseId,
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
                warehouseId: body.warehouseId,
                orderId: order.id,
                movementType: "SALE",
                quantityBefore: inv.stockDisponible,
                quantityAfter: newStock,
                quantityDelta: -item.quantity,
                notes: `Venta online - Orden ${orderNumber}`,
              },
            });
          }

          return order;
        });

        return NextResponse.json({ success: true, orderNumber: result.orderNumber });
      }

      case "updateBook": {
        const { id, ...data } = body;
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

        const book = await db.book.update({
          where: { id },
          data: updateData,
        });
        return NextResponse.json(book);
      }

      case "updateInventory": {
        const { bookId, warehouseId, delta, movementType } = body;

        const inv = await db.inventory.findFirst({
          where: { bookId, warehouseId },
        });

        if (!inv) {
          return NextResponse.json(
            { error: "Registro de inventario no encontrado" },
            { status: 404 }
          );
        }

        const newStock = inv.stockDisponible + delta;
        if (newStock < 0) {
          return NextResponse.json(
            { error: "Stock no puede ser negativo" },
            { status: 400 }
          );
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

        return NextResponse.json({ newStock });
      }

      case "loginAdmin": {
        const { password } = body;
        if (password === "horizonte2026") {
          return NextResponse.json({ success: true });
        }
        return NextResponse.json({ success: false }, { status: 401 });
      }

      case "createBook": {
        const slug = (body.title as string)
          .toLowerCase()
          .replace(/[^a-z0-9áéíóúñü]+/g, '-')
          .replace(/^-|-$/g, '');

        const book = await db.book.create({
          data: {
            title: body.title,
            slug,
            isbn: body.isbn || null,
            synopsis: body.synopsis || null,
            pages: body.pages || null,
            language: body.language || 'Español',
            publicationYear: body.publicationYear || null,
            price: body.price,
            costPrice: body.costPrice || null,
            originType: body.originType,
            publisherId: body.publisherId || null,
          },
        });

        if (body.authorIds?.length) {
          await Promise.all(
            (body.authorIds as string[]).map((aId: string, idx: number) =>
              db.bookAuthor.create({
                data: { bookId: book.id, authorId: aId, order: idx },
              })
            )
          );
        }

        if (body.categoryIds?.length) {
          await Promise.all(
            (body.categoryIds as string[]).map((cId: string) =>
              db.bookCategory.create({
                data: { bookId: book.id, categoryId: cId },
              })
            )
          );
        }

        return NextResponse.json(book);
      }

      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }
  } catch (error) {
    console.error("API POST error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal error" },
      { status: 500 }
    );
  }
}