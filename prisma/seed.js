const { PrismaClient } = require('@prisma/client');

const db = new PrismaClient({
  datasourceUrl: 'file:/home/z/my-project/db/custom.db',
});

async function seed() {
  console.log('🌱 Seeding Editorial Horizonte database...');

  // Clear existing data (in order due to foreign keys)
  await db.inventoryAuditLog.deleteMany();
  await db.orderItem.deleteMany();
  await db.order.deleteMany();
  await db.inventory.deleteMany();
  await db.bookCategory.deleteMany();
  await db.bookAuthor.deleteMany();
  await db.book.deleteMany();
  await db.warehouse.deleteMany();
  await db.publisher.deleteMany();
  await db.category.deleteMany();
  await db.author.deleteMany();
  await db.adminUser.deleteMany();

  // ─── 1. Admin Users ───
  console.log('  Creating admin users...');
  const admins = await Promise.all([
    db.adminUser.create({
      data: {
        email: 'juan@editorialhorizonte.com',
        name: 'Juan Damonte',
        passwordHash: 'horizonte2026',
        role: 'SUPER_ADMIN',
        isActive: true,
      },
    }),
    db.adminUser.create({
      data: {
        email: 'maria@editorialhorizonte.com',
        name: 'María López',
        passwordHash: 'staff123',
        role: 'ADMIN',
        isActive: true,
      },
    }),
    db.adminUser.create({
      data: {
        email: 'carlos@editorialhorizonte.com',
        name: 'Carlos Ruiz',
        passwordHash: 'staff123',
        role: 'STAFF',
        isActive: true,
      },
    }),
  ]);

  // ─── 2. Authors ───
  console.log('  Creating authors...');
  const authors = await Promise.all([
    db.author.create({
      data: {
        name: 'Jorge Luis Borges',
        bio: 'Escritor argentino, uno de los autores más influyentes del siglo XX. Maestro del cuento y la poesía.',
        nationality: 'Argentina',
      },
    }),
    db.author.create({
      data: {
        name: 'Gabriel García Márquez',
        bio: 'Novelista colombiano, premio Nobel de Literatura 1982. Padre del realismo mágico.',
        nationality: 'Colombia',
      },
    }),
    db.author.create({
      data: {
        name: 'Isabel Allende',
        bio: 'Escritora chilena, una de las voces más leídas de la literatura latinoamericana contemporánea.',
        nationality: 'Chile',
      },
    }),
    db.author.create({
      data: {
        name: 'Pablo Neruda',
        bio: 'Poeta chileno, premio Nobel de Literatura 1971. Su poesía abarca desde lo íntimo hasta lo político.',
        nationality: 'Chile',
      },
    }),
    db.author.create({
      data: {
        name: 'Julio Cortázar',
        bio: 'Escritor argentino, maestro del cuento fantástico y la novela experimental. Autor de Rayuela.',
        nationality: 'Argentina',
      },
    }),
  ]);

  // ─── 3. Categories ───
  console.log('  Creating categories...');
  const categories = await Promise.all([
    db.category.create({
      data: { name: 'Narrativa', slug: 'narrativa', description: 'Novelas, cuentos y relatos' },
    }),
    db.category.create({
      data: { name: 'Poesía', slug: 'poesia', description: 'Poesía latinoamericana y universal' },
    }),
    db.category.create({
      data: { name: 'Ensayo', slug: 'ensayo', description: 'Ensayos, crítica y reflexión' },
    }),
    db.category.create({
      data: { name: 'Historia', slug: 'historia', description: 'Historia de América Latina y el mundo' },
    }),
  ]);

  // ─── 4. Publishers (third-party) ───
  console.log('  Creating publishers...');
  const publishers = await Promise.all([
    db.publisher.create({
      data: {
        name: 'Penguin Random House',
        country: 'Estados Unidos',
        contactEmail: 'dist@penguinrandomhouse.com',
        commissionRate: 0.15,
        isActive: true,
      },
    }),
    db.publisher.create({
      data: {
        name: 'Alfaguara',
        country: 'España',
        contactEmail: 'ventas@alfaguara.com',
        commissionRate: 0.12,
        isActive: true,
      },
    }),
  ]);

  // ─── 5. Warehouses ───
  console.log('  Creating warehouses...');
  const warehouses = await Promise.all([
    db.warehouse.create({
      data: {
        name: 'Almacén Central',
        slug: 'almacen-central',
        address: 'Av. Corrientes 1234, Buenos Aires',
        city: 'Buenos Aires',
        phone: '+54 11 4567-8901',
        contactName: 'Roberto Sánchez',
        warehouseType: 'PHYSICAL',
        isActive: true,
      },
    }),
    db.warehouse.create({
      data: {
        name: 'Librería SUR',
        slug: 'libreria-sur',
        address: 'Calle 10 #5-32, Bogotá',
        city: 'Bogotá',
        phone: '+57 1 234-5678',
        contactName: 'Ana Martínez',
        warehouseType: 'PHYSICAL',
        isActive: true,
      },
    }),
    db.warehouse.create({
      data: {
        name: 'El Virrey',
        slug: 'el-virrey',
        address: 'Av. Paseo de la Reforma 250, CDMX',
        city: 'Ciudad de México',
        phone: '+52 55 1234-5678',
        contactName: 'Luis Hernández',
        warehouseType: 'PHYSICAL',
        isActive: true,
      },
    }),
    db.warehouse.create({
      data: {
        name: 'Tienda Online',
        slug: 'tienda-online',
        address: 'Virtual',
        city: 'Buenos Aires',
        phone: '+54 11 5555-0000',
        contactName: 'Soporte Web',
        warehouseType: 'VIRTUAL',
        isActive: true,
      },
    }),
  ]);

  // ─── 6. Books ───
  console.log('  Creating books...');
  const bookData = [
    // PROPIO books (10)
    {
      title: 'El Aleph',
      slug: 'el-aleph',
      isbn: '978-987-01-0001-1',
      synopsis: 'Una colección de cuentos que exploran los laberintos del tiempo, el infinito y la identidad. Borges nos sumerge en mundos donde la realidad y la ficción se confunden.',
      pages: 146,
      language: 'Español',
      publicationYear: 2019,
      price: 8900,
      costPrice: 3200,
      weightKg: 0.25,
      isActive: true,
      isFeatured: true,
      originType: 'PROPIO',
      publisherId: null,
      authorIds: [authors[0].id],
      categoryIds: [categories[0].id],
    },
    {
      title: 'Cien años de soledad',
      slug: 'cien-anos-de-soledad',
      isbn: '978-987-01-0002-8',
      synopsis: 'La saga de la familia Buendía en el pueblo ficticio de Macondo. Una obra maestra del realismo mágico que narra siete generaciones de amor, guerra y destino.',
      pages: 471,
      language: 'Español',
      publicationYear: 2020,
      price: 12500,
      costPrice: 4500,
      weightKg: 0.45,
      isActive: true,
      isFeatured: true,
      originType: 'PROPIO',
      publisherId: null,
      authorIds: [authors[1].id],
      categoryIds: [categories[0].id],
    },
    {
      title: 'La casa de los espíritus',
      slug: 'la-casa-de-los-espiritus',
      isbn: '978-987-01-0003-5',
      synopsis: 'La historia de la familia Trueba a lo largo de cuatro generaciones, entrelazada con los acontecimientos políticos y sociales de Chile.',
      pages: 433,
      language: 'Español',
      publicationYear: 2021,
      price: 11800,
      costPrice: 4200,
      weightKg: 0.42,
      isActive: true,
      isFeatured: false,
      originType: 'PROPIO',
      publisherId: null,
      authorIds: [authors[2].id],
      categoryIds: [categories[0].id],
    },
    {
      title: 'Veinte poemas de amor y una canción desesperada',
      slug: 'veinte-poemas-de-amor',
      isbn: '978-987-01-0004-2',
      synopsis: 'La obra más célebre de Pablo Neruda, una colección de poemas que captura la pasión, el deseo y la melancolía del amor juvenil.',
      pages: 64,
      language: 'Español',
      publicationYear: 2022,
      price: 6500,
      costPrice: 2100,
      weightKg: 0.15,
      isActive: true,
      isFeatured: true,
      originType: 'PROPIO',
      publisherId: null,
      authorIds: [authors[3].id],
      categoryIds: [categories[1].id],
    },
    {
      title: 'Rayuela',
      slug: 'rayuela',
      isbn: '978-987-01-0005-9',
      synopsis: 'Una novela revolucionaria que puede leerse de múltiples maneras. La historia de Horacio Oliveira entre París y Buenos Aires en una búsqueda existencial.',
      pages: 600,
      language: 'Español',
      publicationYear: 2020,
      price: 13200,
      costPrice: 5000,
      weightKg: 0.55,
      isActive: true,
      isFeatured: true,
      originType: 'PROPIO',
      publisherId: null,
      authorIds: [authors[4].id],
      categoryIds: [categories[0].id],
    },
    {
      title: 'Ficciones',
      slug: 'ficciones',
      isbn: '978-987-01-0006-6',
      synopsis: 'Colección de cuentos donde Borges explora las paradojas de la literatura, la filosofía y el tiempo. Incluye clásicos como "Tlön, Uqbar, Orbis Tertius".',
      pages: 174,
      language: 'Español',
      publicationYear: 2021,
      price: 9200,
      costPrice: 3400,
      weightKg: 0.28,
      isActive: true,
      isFeatured: false,
      originType: 'PROPIO',
      publisherId: null,
      authorIds: [authors[0].id],
      categoryIds: [categories[0].id, categories[2].id],
    },
    {
      title: 'Canto General',
      slug: 'canto-general',
      isbn: '978-987-01-0007-3',
      synopsis: 'Poema épico de Pablo Neruda que recorre la historia de América Latina. Una obra monumental de la poesía política y social.',
      pages: 384,
      language: 'Español',
      publicationYear: 2022,
      price: 10800,
      costPrice: 3900,
      weightKg: 0.40,
      isActive: true,
      isFeatured: false,
      originType: 'PROPIO',
      publisherId: null,
      authorIds: [authors[3].id],
      categoryIds: [categories[1].id, categories[3].id],
    },
    {
      title: 'Bestiario',
      slug: 'bestiario',
      isbn: '978-987-01-0008-0',
      synopsis: 'La primera colección de cuentos de Cortázar, donde lo cotidiano se transforma en algo inquietante y fantástico.',
      pages: 148,
      language: 'Español',
      publicationYear: 2023,
      price: 7800,
      costPrice: 2800,
      weightKg: 0.22,
      isActive: true,
      isFeatured: false,
      originType: 'PROPIO',
      publisherId: null,
      authorIds: [authors[4].id],
      categoryIds: [categories[0].id],
    },
    {
      title: 'El libro de los abrazos',
      slug: 'el-libro-de-los-abrazos',
      isbn: '978-987-01-0009-7',
      synopsis: 'Una obra híbrida de Galeano que mezcla relatos cortos, reflexiones y textos poéticos sobre América Latina.',
      pages: 256,
      language: 'Español',
      publicationYear: 2023,
      price: 8500,
      costPrice: 3100,
      weightKg: 0.32,
      isActive: true,
      isFeatured: false,
      originType: 'PROPIO',
      publisherId: null,
      authorIds: [authors[1].id],
      categoryIds: [categories[2].id],
    },
    {
      title: 'Eva Luna',
      slug: 'eva-luna',
      isbn: '978-987-01-0010-3',
      synopsis: 'La historia de Eva Luna, una narradora nata que teje historias de amor, aventura y supervivencia en un país latinoamericano.',
      pages: 302,
      language: 'Español',
      publicationYear: 2024,
      price: 10200,
      costPrice: 3700,
      weightKg: 0.35,
      isActive: true,
      isFeatured: true,
      originType: 'PROPIO',
      publisherId: null,
      authorIds: [authors[2].id],
      categoryIds: [categories[0].id],
    },
    // TERCERO books (5)
    {
      title: 'Crónica de una muerte anunciada',
      slug: 'cronica-de-una-muerte-anunciada',
      isbn: '978-84-376-0494-7',
      synopsis: 'Un periodista regresa al pueblo donde ocurrió un crimen anunciado. García Márquez reconstruye la historia con maestría periodística y literaria.',
      pages: 120,
      language: 'Español',
      publicationYear: 2021,
      price: 7500,
      costPrice: 5200,
      weightKg: 0.20,
      isActive: true,
      isFeatured: false,
      originType: 'TERCERO',
      publisherId: publishers[1].id,
      authorIds: [authors[1].id],
      categoryIds: [categories[0].id],
    },
    {
      title: 'El amor en los tiempos del cólera',
      slug: 'el-amor-en-los-tiempos-del-colera',
      isbn: '978-84-397-1182-6',
      synopsis: 'Una historia de amor que dura más de medio siglo. Florentino Ariza espera cincuenta años para reconquistar a Fermina Daza.',
      pages: 368,
      language: 'Español',
      publicationYear: 2022,
      price: 11900,
      costPrice: 8500,
      weightKg: 0.40,
      isActive: true,
      isFeatured: true,
      originType: 'TERCERO',
      publisherId: publishers[1].id,
      authorIds: [authors[1].id],
      categoryIds: [categories[0].id],
    },
    {
      title: 'Los detective salvajes',
      slug: 'los-detectives-salvajes',
      isbn: '978-0-14-028329-0',
      synopsis: 'La búsqueda de una poeta desaparecida lleva a un grupo de jóvenes poetas por México y el mundo. Obra cumbre de Roberto Bolaño.',
      pages: 598,
      language: 'Español',
      publicationYear: 2023,
      price: 14500,
      costPrice: 10200,
      weightKg: 0.58,
      isActive: true,
      isFeatured: false,
      originType: 'TERCERO',
      publisherId: publishers[0].id,
      authorIds: [authors[4].id],
      categoryIds: [categories[0].id],
    },
    {
      title: 'La sombra del viento',
      slug: 'la-sombra-del-viento',
      isbn: '978-84-08-04317-4',
      synopsis: 'En la Barcelona de posguerra, un joven descubre un libro maldito que cambiará su vida. Una novela sobre el poder de la literatura.',
      pages: 576,
      language: 'Español',
      publicationYear: 2022,
      price: 13500,
      costPrice: 9800,
      weightKg: 0.52,
      isActive: true,
      isFeatured: true,
      originType: 'TERCERO',
      publisherId: publishers[0].id,
      authorIds: [authors[0].id],
      categoryIds: [categories[0].id],
    },
    {
      title: 'Pedro Páramo',
      slug: 'pedro-paramo',
      isbn: '978-607-07-0100-5',
      synopsis: 'Juan Rulfo viaja a Comala en busca de su padre y encuentra un pueblo de fantasmas. Una obra fundamental de la literatura mexicana.',
      pages: 124,
      language: 'Español',
      publicationYear: 2023,
      price: 6900,
      costPrice: 4800,
      weightKg: 0.18,
      isActive: true,
      isFeatured: false,
      originType: 'TERCERO',
      publisherId: publishers[1].id,
      authorIds: [authors[1].id],
      categoryIds: [categories[0].id],
    },
  ];

  const books = [];
  for (const bd of bookData) {
    const { authorIds, categoryIds, ...bookFields } = bd;
    const book = await db.book.create({
      data: bookFields,
    });
    // Create author relations
    for (let i = 0; i < authorIds.length; i++) {
      await db.bookAuthor.create({
        data: { bookId: book.id, authorId: authorIds[i], order: i },
      });
    }
    // Create category relations
    for (const catId of categoryIds) {
      await db.bookCategory.create({
        data: { bookId: book.id, categoryId: catId },
      });
    }
    books.push(book);
  }

  // ─── 7. Inventory ───
  console.log('  Creating inventory records...');
  const stockLevels = [
    // [almacen-central, libreria-sur, el-virrey, tienda-online]
    [45, 20, 15, 30],  // Book 0
    [60, 25, 20, 40],  // Book 1
    [35, 18, 12, 25],  // Book 2
    [50, 30, 22, 35],  // Book 3
    [25, 10, 8, 15],   // Book 4
    [40, 15, 10, 20],  // Book 5
    [20, 8, 5, 12],    // Book 6
    [30, 12, 10, 18],  // Book 7
    [28, 14, 8, 16],   // Book 8
    [22, 10, 6, 14],   // Book 9
    [38, 16, 12, 22],  // Book 10 (tercero)
    [42, 18, 14, 28],  // Book 11 (tercero)
    [15, 5, 3, 8],     // Book 12 (tercero)
    [32, 14, 10, 20],  // Book 13 (tercero)
    [48, 22, 18, 32],  // Book 14 (tercero)
  ];

  for (let i = 0; i < books.length; i++) {
    for (let w = 0; w < warehouses.length; w++) {
      const stock = stockLevels[i][w];
      const consigned = Math.floor(stock * 0.3);
      await db.inventory.create({
        data: {
          bookId: books[i].id,
          warehouseId: warehouses[w].id,
          stockDisponible: stock - consigned,
          stockConsignado: consigned,
          stockMinimo: 5,
          stockReposicion: 20,
        },
      });
    }
  }

  // ─── 8. Sample Orders ───
  console.log('  Creating sample orders...');
  const ordersData = [
    {
      customerName: 'Lucía Fernández',
      customerEmail: 'lucia@email.com',
      customerPhone: '+54 11 5555-1111',
      customerAddress: 'Av. Santa Fe 1500, Piso 3',
      customerCity: 'Buenos Aires',
      status: 'DELIVERED',
      source: 'ONLINE',
      warehouseId: warehouses[3].id, // Tienda Online
      discountAmount: 0,
      shippingCost: 1200,
      paymentMethod: 'MERCADO_PAGO',
      items: [
        { bookIdx: 0, qty: 1 },
        { bookIdx: 3, qty: 2 },
      ],
    },
    {
      customerName: 'Diego Morales',
      customerEmail: 'diego@email.com',
      customerPhone: '+57 1 555-2222',
      customerAddress: 'Calle 72 #10-45, Apartamento 402',
      customerCity: 'Bogotá',
      status: 'CONFIRMED',
      source: 'ONLINE',
      warehouseId: warehouses[1].id, // Librería SUR
      discountAmount: 0,
      shippingCost: 2800,
      paymentMethod: 'TRANSFERENCIA',
      items: [
        { bookIdx: 1, qty: 1 },
        { bookIdx: 4, qty: 1 },
      ],
    },
    {
      customerName: 'Valentina Rojas',
      customerEmail: 'valentina@email.com',
      customerPhone: '+52 55 5555-3333',
      customerAddress: 'Col. Roma Norte, Av. Álvaro Obregón 188',
      customerCity: 'Ciudad de México',
      status: 'PENDING',
      source: 'ONLINE',
      warehouseId: warehouses[2].id, // El Virrey
      discountAmount: 1500,
      shippingCost: 0,
      paymentMethod: 'EFECTIVO',
      items: [
        { bookIdx: 2, qty: 1 },
        { bookIdx: 9, qty: 1 },
        { bookIdx: 11, qty: 1 },
      ],
    },
    {
      customerName: 'Martín Gutiérrez',
      customerEmail: 'martin@email.com',
      customerPhone: '+54 11 5555-4444',
      customerAddress: 'Av. Córdoba 2800',
      customerCity: 'Buenos Aires',
      status: 'SHIPPED',
      source: 'MANUAL',
      warehouseId: warehouses[0].id, // Almacén Central
      discountAmount: 0,
      shippingCost: 800,
      paymentMethod: 'TRANSFERENCIA',
      items: [
        { bookIdx: 5, qty: 2 },
        { bookIdx: 7, qty: 1 },
      ],
    },
    {
      customerName: 'Camila Herrera',
      customerEmail: 'camila@email.com',
      customerPhone: '+54 11 5555-5555',
      customerAddress: 'Caballito, Av. Rivadavia 5200',
      customerCity: 'Buenos Aires',
      status: 'CANCELLED',
      source: 'ONLINE',
      warehouseId: warehouses[3].id, // Tienda Online
      discountAmount: 0,
      shippingCost: 1200,
      paymentMethod: null,
      items: [
        { bookIdx: 13, qty: 1 },
      ],
    },
  ];

  const orders = [];
  for (let i = 0; i < ordersData.length; i++) {
    const od = ordersData[i];
    const itemBooks = od.items.map((item) => ({
      book: books[item.bookIdx],
      qty: item.qty,
    }));

    const subtotal = itemBooks.reduce(
      (sum, item) => sum + item.book.price * item.qty,
      0
    );
    const totalAmount = subtotal - od.discountAmount + od.shippingCost;

    const order = await db.order.create({
      data: {
        orderNumber: `EH-2026-${String(i + 1).padStart(3, '0')}`,
        customerName: od.customerName,
        customerEmail: od.customerEmail,
        customerPhone: od.customerPhone,
        customerAddress: od.customerAddress,
        customerCity: od.customerCity,
        status: od.status,
        source: od.source,
        warehouseId: od.warehouseId,
        subtotal,
        discountAmount: od.discountAmount,
        shippingCost: od.shippingCost,
        totalAmount,
        paymentMethod: od.paymentMethod,
        confirmedAt: ['DELIVERED', 'CONFIRMED', 'SHIPPED'].includes(od.status)
          ? new Date(2026, 0, 10 + i)
          : null,
        shippedAt: ['DELIVERED', 'SHIPPED'].includes(od.status)
          ? new Date(2026, 0, 12 + i)
          : null,
        deliveredAt: od.status === 'DELIVERED' ? new Date(2026, 0, 15 + i) : null,
        cancelledAt: od.status === 'CANCELLED' ? new Date(2026, 0, 11) : null,
      },
    });

    // Create order items
    for (const item of itemBooks) {
      let commissionRate = null;
      if (item.book.originType === 'TERCERO' && item.book.publisherId) {
        const pub = await db.publisher.findUnique({ where: { id: item.book.publisherId } });
        commissionRate = pub ? pub.commissionRate : null;
      }
      const commissionAmount =
        commissionRate !== null
          ? item.book.price * item.qty * commissionRate
          : null;

      await db.orderItem.create({
        data: {
          orderId: order.id,
          bookId: item.book.id,
          title: item.book.title,
          unitPrice: item.book.price,
          quantity: item.qty,
          subtotal: item.book.price * item.qty,
          commissionRate,
          commissionAmount,
        },
      });
    }

    orders.push(order);
  }

  // ─── 9. Audit Logs ───
  console.log('  Creating audit log entries...');
  let logCount = 0;
  for (const order of orders) {
    if (order.status === 'CANCELLED') continue;
    const items = await db.orderItem.findMany({
      where: { orderId: order.id },
    });
    for (const item of items) {
      const whId = order.warehouseId;
      if (!whId) continue;
      const inv = await db.inventory.findFirst({
        where: {
          bookId: item.bookId,
          warehouseId: whId,
        },
      });
      if (inv) {
        const before = inv.stockDisponible;
        const after = before - item.quantity;
        await db.inventoryAuditLog.create({
          data: {
            bookId: item.bookId,
            warehouseId: whId,
            orderId: order.id,
            movementType: 'SALE',
            quantityBefore: before,
            quantityAfter: after,
            quantityDelta: -item.quantity,
            performedById: admins[0].id,
            notes: `Venta automática por orden ${order.orderNumber}`,
          },
        });
        logCount++;
      }
    }
  }

  console.log(`✅ Seed completed successfully!`);
  console.log(`   📊 Summary:`);
  console.log(`   - ${admins.length} Admin users`);
  console.log(`   - ${authors.length} Authors`);
  console.log(`   - ${categories.length} Categories`);
  console.log(`   - ${publishers.length} Publishers`);
  console.log(`   - ${warehouses.length} Warehouses`);
  console.log(`   - ${books.length} Books`);
  console.log(`   - ${books.length * warehouses.length} Inventory records`);
  console.log(`   - ${orders.length} Orders`);
  console.log(`   - ${logCount} Audit log entries`);
}

seed()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });