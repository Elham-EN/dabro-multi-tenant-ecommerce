/**
 * SEED SCRIPT - PLATFORM INITIALIZATION
 *
 * This script initializes the platform with essential data:
 * - Super-admin account for platform management
 * - Common categories for products
 * - Popular tags for product organization
 *
 * It's idempotent - safe to run multiple times without creating duplicates.
 *
 * Usage:
 *   npm run seed
 *
 * Environment Variables Required:
 *   - SUPER_ADMIN_EMAIL
 *   - SUPER_ADMIN_PASSWORD
 *   - SUPER_ADMIN_USERNAME
 */

import { getPayload } from "payload";
import config from "@payload-config";

async function seed() {
  console.log("🌱 Starting seed script...\n");

  try {
    // Initialize Payload CMS
    console.log("📦 Connecting to Payload CMS...");
    const payload = await getPayload({ config });
    console.log("✅ Connected to Payload CMS\n");

    // Get super-admin credentials from environment variables
    const superAdminEmail = process.env.SUPER_ADMIN_EMAIL;
    const superAdminPassword =
      process.env.SUPER_ADMIN_PASSWORD;
    const superAdminUsername =
      process.env.SUPER_ADMIN_USERNAME;

    // Validate environment variables
    if (
      !superAdminEmail ||
      !superAdminPassword ||
      !superAdminUsername
    ) {
      console.error(
        "❌ Error: Missing required environment variables:\n" +
          "   - SUPER_ADMIN_EMAIL\n" +
          "   - SUPER_ADMIN_PASSWORD\n" +
          "   - SUPER_ADMIN_USERNAME\n",
      );
      process.exit(1);
    }

    // Check if super-admin already exists
    console.log(
      `🔍 Checking if super-admin exists (${superAdminEmail})...`,
    );
    const existingUsers = await payload.find({
      collection: "users",
      where: {
        email: {
          equals: superAdminEmail,
        },
      },
      limit: 1,
    });

    if (existingUsers.docs.length > 0) {
      console.log(
        "⏭️  Super-admin already exists. Skipping creation.\n" +
          `   Email: ${superAdminEmail}\n` +
          `   ID: ${existingUsers.docs[0].id}\n`,
      );
    } else {
      // Create super-admin user
      console.log("👤 Creating super-admin user...");
      const superAdmin = await payload.create({
        collection: "users",
        data: {
          email: superAdminEmail,
          password: superAdminPassword,
          username: superAdminUsername,
          roles: ["super-admin"],
        },
      });

      console.log(
        "✅ Super-admin created successfully!\n" +
          `   Email: ${superAdmin.email}\n` +
          `   Username: ${superAdmin.username}\n` +
          `   ID: ${superAdmin.id}\n` +
          `   Roles: ${superAdmin.roles?.join(", ")}\n`,
      );
    }

    // ============================================================
    // SEED CATEGORIES
    // ============================================================
    console.log("📂 Seeding categories...");

    // Define categories with hierarchical structure
    const categoriesData = [
      // Parent categories
      {
        name: "Digital Art",
        slug: "digital-art",
        color: "#FF6B6B",
      },
      {
        name: "Music & Audio",
        slug: "music-audio",
        color: "#4ECDC4",
      },
      {
        name: "Photography",
        slug: "photography",
        color: "#FFD93D",
      },
      {
        name: "Writing & Literature",
        slug: "writing-literature",
        color: "#95E1D3",
      },
      {
        name: "Software & Tools",
        slug: "software-tools",
        color: "#A8E6CF",
      },
      {
        name: "Education & Courses",
        slug: "education-courses",
        color: "#C7CEEA",
      },
      {
        name: "Design & Graphics",
        slug: "design-graphics",
        color: "#FFA07A",
      },
      {
        name: "Video & Animation",
        slug: "video-animation",
        color: "#98D8C8",
      },
    ];

    let categoriesCreated = 0;
    const createdCategories: Record<
      string,
      { id: string; name: string }
    > = {};

    for (const categoryData of categoriesData) {
      // Check if category already exists
      const existing = await payload.find({
        collection: "categories",
        where: { slug: { equals: categoryData.slug } },
        limit: 1,
      });

      if (existing.docs.length === 0) {
        const category = await payload.create({
          collection: "categories",
          data: categoryData,
        });
        createdCategories[categoryData.slug] = category;
        categoriesCreated++;
        console.log(`   ✓ Created: ${categoryData.name}`);
      } else {
        createdCategories[categoryData.slug] =
          existing.docs[0];
        console.log(`   ⏭️  Exists: ${categoryData.name}`);
      }
    }

    // Create subcategories (child categories)
    const subcategoriesData = [
      {
        name: "Illustrations",
        slug: "illustrations",
        parent: "digital-art",
        color: "#FF8787",
      },
      {
        name: "3D Models",
        slug: "3d-models",
        parent: "digital-art",
        color: "#FF9999",
      },
      {
        name: "Music Tracks",
        slug: "music-tracks",
        parent: "music-audio",
        color: "#6FD5CC",
      },
      {
        name: "Sound Effects",
        slug: "sound-effects",
        parent: "music-audio",
        color: "#87E5DD",
      },
      {
        name: "Stock Photos",
        slug: "stock-photos",
        parent: "photography",
        color: "#FFE066",
      },
      {
        name: "Lightroom Presets",
        slug: "lightroom-presets",
        parent: "photography",
        color: "#FFEB99",
      },
      {
        name: "eBooks",
        slug: "ebooks",
        parent: "writing-literature",
        color: "#AEEDDA",
      },
      {
        name: "Templates",
        slug: "templates",
        parent: "writing-literature",
        color: "#C1F5E5",
      },
    ];

    for (const subcategoryData of subcategoriesData) {
      const existing = await payload.find({
        collection: "categories",
        where: { slug: { equals: subcategoryData.slug } },
        limit: 1,
      });

      if (existing.docs.length === 0) {
        const parentCategory =
          createdCategories[subcategoryData.parent];
        await payload.create({
          collection: "categories",
          data: {
            name: subcategoryData.name,
            slug: subcategoryData.slug,
            color: subcategoryData.color,
            parent: parentCategory.id,
          },
        });
        categoriesCreated++;
        console.log(
          `   ✓ Created: ${subcategoryData.name} (child of ${parentCategory.name})`,
        );
      } else {
        console.log(
          `   ⏭️  Exists: ${subcategoryData.name}`,
        );
      }
    }

    console.log(
      `✅ Categories seeded: ${categoriesCreated} new categories created\n`,
    );

    // ============================================================
    // SEED TAGS
    // ============================================================
    console.log("🏷️  Seeding tags...");

    const tagsData = [
      "Digital Download",
      "Instant Access",
      "Commercial Use",
      "Personal Use",
      "Beginner Friendly",
      "Professional",
      "Premium Quality",
      "Best Seller",
      "New Release",
      "Trending",
      "Limited Edition",
      "Bundle",
      "High Resolution",
      "Customizable",
      "Royalty Free",
    ];

    let tagsCreated = 0;

    for (const tagName of tagsData) {
      const existing = await payload.find({
        collection: "tags",
        where: { name: { equals: tagName } },
        limit: 1,
      });

      if (existing.docs.length === 0) {
        await payload.create({
          collection: "tags",
          data: { name: tagName },
        });
        tagsCreated++;
        console.log(`   ✓ Created: ${tagName}`);
      } else {
        console.log(`   ⏭️  Exists: ${tagName}`);
      }
    }

    console.log(
      `✅ Tags seeded: ${tagsCreated} new tags created\n`,
    );

    // ============================================================
    // SEED TENANTS (STORES)
    // ============================================================
    console.log("🏪 Seeding tenants (stores)...");

    const tenantsData = [
      { name: "PixelCraft Studios", slug: "pixelcraft-studios" },
      { name: "SoundWave Audio", slug: "soundwave-audio" },
      { name: "CodeMaster Academy", slug: "codemaster-academy" },
      { name: "CinePro Visuals", slug: "cinepro-visuals" },
      { name: "ArtNova Creations", slug: "artnova-creations" },
      { name: "LensLight Photography", slug: "lenslight-photography" },
      { name: "DevBooks Publishing", slug: "devbooks-publishing" },
      { name: "3D Forge Assets", slug: "3d-forge-assets" },
      { name: "ProductivityHub", slug: "productivity-hub" },
      { name: "BeatLab Productions", slug: "beatlab-productions" },
    ];

    const createdTenants: Record<string, { id: string; name: string }> =
      {};
    let tenantsCreated = 0;

    for (const tenantData of tenantsData) {
      const existing = await payload.find({
        collection: "tenants",
        where: { slug: { equals: tenantData.slug } },
        limit: 1,
      });

      if (existing.docs.length === 0) {
        const tenant = await payload.create({
          collection: "tenants",
          data: {
            name: tenantData.name,
            slug: tenantData.slug,
            stripeAccountId: `acct_demo_${tenantData.slug.replace(/-/g, "_")}`,
            stripeDetailsSubmitted: true,
          },
        });
        createdTenants[tenantData.slug] = tenant;
        tenantsCreated++;
        console.log(`   ✓ Created: ${tenantData.name}`);
      } else {
        createdTenants[tenantData.slug] = existing.docs[0];
        console.log(`   ⏭️  Exists: ${tenantData.name}`);
      }
    }

    console.log(
      `✅ Tenants seeded: ${tenantsCreated} new stores created\n`,
    );

    // ============================================================
    // SEED MEDIA (PRODUCT IMAGES)
    // ============================================================
    console.log("🖼️  Seeding media (product images)...");

    const fs = await import("fs");
    const path = await import("path");

    const imageFiles = [
      { file: "product-1.webp", alt: "Product showcase" },
      { file: "productImage.png", alt: "Digital product" },
      { file: "keyboardkitpro.jpg", alt: "Keyboard kit pro" },
      { file: "coursebanner.png", alt: "Course banner" },
      { file: "Harmonics Cover FINAL.jpg", alt: "Harmonics album cover" },
      { file: "100MM_SP.png", alt: "100MM special product" },
      { file: "new_publi_gumroad_1.png", alt: "New publication" },
      { file: "TIKTOK AI STORIES.png", alt: "TikTok AI Stories" },
      { file: "Flair.png", alt: "Flair design" },
      { file: "Hero.png", alt: "Hero banner" },
    ];

    const createdMedia: string[] = [];

    for (const imageData of imageFiles) {
      const existing = await payload.find({
        collection: "media",
        where: { alt: { equals: imageData.alt } },
        limit: 1,
      });

      if (existing.docs.length === 0) {
        const filePath = path.join(
          process.cwd(),
          "public",
          imageData.file
        );

        if (fs.existsSync(filePath)) {
          try {
            const media = await payload.create({
              collection: "media",
              data: {
                alt: imageData.alt,
              },
              filePath,
            });
            createdMedia.push(media.id);
            console.log(`   ✓ Uploaded: ${imageData.file}`);
          } catch {
            console.log(`   ⚠️  Failed to upload: ${imageData.file}`);
          }
        } else {
          console.log(`   ⚠️  File not found: ${imageData.file}`);
        }
      } else {
        createdMedia.push(existing.docs[0].id);
        console.log(`   ⏭️  Exists: ${imageData.alt}`);
      }
    }

    console.log(
      `✅ Media seeded: ${createdMedia.length} images available\n`,
    );

    // ============================================================
    // SEED PRODUCTS
    // ============================================================
    console.log("📦 Seeding products...");

    // Get all categories and tags for reference
    const allCategories = await payload.find({
      collection: "categories",
      limit: 100,
    });
    const allTags = await payload.find({
      collection: "tags",
      limit: 100,
    });

    const categoryMap = new Map(
      allCategories.docs.map((c) => [c.slug, c.id])
    );
    const tagMap = new Map(
      allTags.docs.map((t) => [t.name, t.id])
    );

    const productsData = [
      {
        name: "Ultimate UI Kit for Figma",
        price: 49,
        category: "design-graphics",
        tags: ["Premium Quality", "Commercial Use", "Customizable"],
        refundPolicy: "30-day" as const,
        tenant: "pixelcraft-studios",
        imageIndex: 0,
      },
      {
        name: "Ambient Music Collection Vol. 1",
        price: 29,
        category: "music-tracks",
        tags: ["Royalty Free", "Digital Download", "Commercial Use"],
        refundPolicy: "14-day" as const,
        tenant: "soundwave-audio",
        imageIndex: 4,
      },
      {
        name: "Python for Data Science Course",
        price: 99,
        category: "education-courses",
        tags: ["Beginner Friendly", "Instant Access", "Best Seller"],
        refundPolicy: "30-day" as const,
        tenant: "codemaster-academy",
        imageIndex: 3,
      },
      {
        name: "100 Cinematic LUTs Pack",
        price: 39,
        category: "video-animation",
        tags: ["Professional", "High Resolution", "Commercial Use"],
        refundPolicy: "14-day" as const,
        tenant: "cinepro-visuals",
        imageIndex: 5,
      },
      {
        name: "Fantasy Character Illustrations",
        price: 25,
        category: "illustrations",
        tags: ["Digital Download", "Personal Use", "High Resolution"],
        refundPolicy: "7-day" as const,
        tenant: "artnova-creations",
        imageIndex: 8,
      },
      {
        name: "Sci-Fi Sound Effects Bundle",
        price: 45,
        category: "sound-effects",
        tags: ["Bundle", "Royalty Free", "Premium Quality"],
        refundPolicy: "14-day" as const,
        tenant: "soundwave-audio",
        imageIndex: 4,
      },
      {
        name: "Urban Photography Preset Pack",
        price: 19,
        category: "lightroom-presets",
        tags: ["Instant Access", "Customizable", "Trending"],
        refundPolicy: "7-day" as const,
        tenant: "lenslight-photography",
        imageIndex: 9,
      },
      {
        name: "The Complete JavaScript Guide eBook",
        price: 35,
        category: "ebooks",
        tags: ["Beginner Friendly", "Digital Download", "Best Seller"],
        refundPolicy: "30-day" as const,
        tenant: "devbooks-publishing",
        imageIndex: 6,
      },
      {
        name: "Low Poly 3D Asset Pack",
        price: 59,
        category: "3d-models",
        tags: ["Commercial Use", "Bundle", "Professional"],
        refundPolicy: "14-day" as const,
        tenant: "3d-forge-assets",
        imageIndex: 1,
      },
      {
        name: "Nature Stock Photo Collection",
        price: 79,
        category: "stock-photos",
        tags: ["High Resolution", "Royalty Free", "Premium Quality"],
        refundPolicy: "30-day" as const,
        tenant: "lenslight-photography",
        imageIndex: 9,
      },
      {
        name: "Notion Life Planner Template",
        price: 15,
        category: "templates",
        tags: ["Customizable", "Instant Access", "Personal Use"],
        refundPolicy: "7-day" as const,
        tenant: "productivity-hub",
        imageIndex: 7,
      },
      {
        name: "Electronic Music Production Course",
        price: 149,
        category: "education-courses",
        tags: ["Professional", "Best Seller", "Trending"],
        refundPolicy: "30-day" as const,
        tenant: "beatlab-productions",
        imageIndex: 4,
      },
      {
        name: "Abstract Digital Art Collection",
        price: 35,
        category: "digital-art",
        tags: ["Limited Edition", "High Resolution", "New Release"],
        refundPolicy: "14-day" as const,
        tenant: "artnova-creations",
        imageIndex: 8,
      },
      {
        name: "Podcast Intro Music Pack",
        price: 25,
        category: "music-tracks",
        tags: ["Royalty Free", "Commercial Use", "Instant Access"],
        refundPolicy: "7-day" as const,
        tenant: "beatlab-productions",
        imageIndex: 4,
      },
      {
        name: "Mobile App UI Templates",
        price: 69,
        category: "design-graphics",
        tags: ["Customizable", "Professional", "Bundle"],
        refundPolicy: "30-day" as const,
        tenant: "pixelcraft-studios",
        imageIndex: 0,
      },
      {
        name: "Motion Graphics Elements Pack",
        price: 89,
        category: "video-animation",
        tags: ["Premium Quality", "Commercial Use", "High Resolution"],
        refundPolicy: "14-day" as const,
        tenant: "cinepro-visuals",
        imageIndex: 5,
      },
      {
        name: "Portrait Photography Masterclass",
        price: 79,
        category: "education-courses",
        tags: ["Beginner Friendly", "Professional", "Best Seller"],
        refundPolicy: "30-day" as const,
        tenant: "lenslight-photography",
        imageIndex: 3,
      },
      {
        name: "Vintage Film Lightroom Presets",
        price: 29,
        category: "lightroom-presets",
        tags: ["Trending", "Customizable", "New Release"],
        refundPolicy: "7-day" as const,
        tenant: "lenslight-photography",
        imageIndex: 9,
      },
      {
        name: "Business Plan Template Bundle",
        price: 45,
        category: "templates",
        tags: ["Commercial Use", "Bundle", "Professional"],
        refundPolicy: "14-day" as const,
        tenant: "productivity-hub",
        imageIndex: 6,
      },
      {
        name: "Character Design Illustration Pack",
        price: 55,
        category: "illustrations",
        tags: ["High Resolution", "Commercial Use", "Premium Quality"],
        refundPolicy: "30-day" as const,
        tenant: "artnova-creations",
        imageIndex: 8,
      },
    ];

    let productsCreated = 0;

    for (const productData of productsData) {
      // Check if product already exists
      const existing = await payload.find({
        collection: "products",
        where: { name: { equals: productData.name } },
        limit: 1,
      });

      const categoryId = categoryMap.get(productData.category);
      const tagIds = productData.tags
        .map((tagName) => tagMap.get(tagName))
        .filter(Boolean) as string[];
      const tenant = createdTenants[productData.tenant];
      const imageId = createdMedia[productData.imageIndex];

      if (existing.docs.length === 0) {
        await payload.create({
          collection: "products",
          data: {
            name: productData.name,
            price: productData.price,
            category: categoryId,
            tags: tagIds,
            refundPolicy: productData.refundPolicy,
            tenant: tenant?.id,
            image: imageId,
          },
        });
        productsCreated++;
        console.log(
          `   ✓ Created: ${productData.name} (${tenant?.name})`,
        );
      } else {
        // Update existing product with image if missing
        const existingProduct = existing.docs[0];
        if (!existingProduct.image && imageId) {
          await payload.update({
            collection: "products",
            id: existingProduct.id,
            data: {
              image: imageId,
            },
          });
          console.log(`   🔄 Updated image: ${productData.name}`);
        } else {
          console.log(`   ⏭️  Exists: ${productData.name}`);
        }
      }
    }

    console.log(
      `✅ Products seeded: ${productsCreated} new products created\n`,
    );

    // ============================================================
    // FINAL MESSAGE
    // ============================================================
    console.log(
      "🎉 You can now login to Payload Admin at:",
    );
    console.log(
      `   ${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/admin\n`,
    );

    console.log("✨ Seed script completed successfully!");
    console.log("📦 Summary:");
    console.log(
      `   - Super-admin: ${existingUsers.docs.length > 0 ? "Already exists" : "Created"}`,
    );
    console.log(
      `   - Categories: ${categoriesCreated} created`,
    );
    console.log(`   - Tags: ${tagsCreated} created`);
    console.log(`   - Tenants: ${tenantsCreated} created`);
    console.log(`   - Products: ${productsCreated} created`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during seed script execution:");
    console.error(error);
    process.exit(1);
  }
}

// Run the seed function
seed();
