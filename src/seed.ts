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
    const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD;
    const superAdminUsername = process.env.SUPER_ADMIN_USERNAME;

    // Validate environment variables
    if (!superAdminEmail || !superAdminPassword || !superAdminUsername) {
      console.error(
        "❌ Error: Missing required environment variables:\n" +
          "   - SUPER_ADMIN_EMAIL\n" +
          "   - SUPER_ADMIN_PASSWORD\n" +
          "   - SUPER_ADMIN_USERNAME\n"
      );
      process.exit(1);
    }

    // Check if super-admin already exists
    console.log(`🔍 Checking if super-admin exists (${superAdminEmail})...`);
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
          `   ID: ${existingUsers.docs[0].id}\n`
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
          `   Roles: ${superAdmin.roles?.join(", ")}\n`
      );
    }

    // ============================================================
    // SEED CATEGORIES
    // ============================================================
    console.log("📂 Seeding categories...");

    // Define categories with hierarchical structure
    const categoriesData = [
      // Parent categories
      { name: "Digital Art", slug: "digital-art", color: "#FF6B6B" },
      { name: "Music & Audio", slug: "music-audio", color: "#4ECDC4" },
      { name: "Photography", slug: "photography", color: "#FFD93D" },
      { name: "Writing & Literature", slug: "writing-literature", color: "#95E1D3" },
      { name: "Software & Tools", slug: "software-tools", color: "#A8E6CF" },
      { name: "Education & Courses", slug: "education-courses", color: "#C7CEEA" },
      { name: "Design & Graphics", slug: "design-graphics", color: "#FFA07A" },
      { name: "Video & Animation", slug: "video-animation", color: "#98D8C8" },
    ];

    let categoriesCreated = 0;
    const createdCategories: Record<string, { id: string; name: string }> = {};

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
        createdCategories[categoryData.slug] = existing.docs[0];
        console.log(`   ⏭️  Exists: ${categoryData.name}`);
      }
    }

    // Create subcategories (child categories)
    const subcategoriesData = [
      { name: "Illustrations", slug: "illustrations", parent: "digital-art", color: "#FF8787" },
      { name: "3D Models", slug: "3d-models", parent: "digital-art", color: "#FF9999" },
      { name: "Music Tracks", slug: "music-tracks", parent: "music-audio", color: "#6FD5CC" },
      { name: "Sound Effects", slug: "sound-effects", parent: "music-audio", color: "#87E5DD" },
      { name: "Stock Photos", slug: "stock-photos", parent: "photography", color: "#FFE066" },
      { name: "Lightroom Presets", slug: "lightroom-presets", parent: "photography", color: "#FFEB99" },
      { name: "eBooks", slug: "ebooks", parent: "writing-literature", color: "#AEEDDA" },
      { name: "Templates", slug: "templates", parent: "writing-literature", color: "#C1F5E5" },
    ];

    for (const subcategoryData of subcategoriesData) {
      const existing = await payload.find({
        collection: "categories",
        where: { slug: { equals: subcategoryData.slug } },
        limit: 1,
      });

      if (existing.docs.length === 0) {
        const parentCategory = createdCategories[subcategoryData.parent];
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
        console.log(`   ✓ Created: ${subcategoryData.name} (child of ${parentCategory.name})`);
      } else {
        console.log(`   ⏭️  Exists: ${subcategoryData.name}`);
      }
    }

    console.log(`✅ Categories seeded: ${categoriesCreated} new categories created\n`);

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

    console.log(`✅ Tags seeded: ${tagsCreated} new tags created\n`);

    // ============================================================
    // FINAL MESSAGE
    // ============================================================
    console.log("🎉 You can now login to Payload Admin at:");
    console.log(`   ${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/admin\n`);

    console.log("✨ Seed script completed successfully!");
    console.log("📦 Summary:");
    console.log(`   - Super-admin: ${existingUsers.docs.length > 0 ? "Already exists" : "Created"}`);
    console.log(`   - Categories: ${categoriesCreated} created`);
    console.log(`   - Tags: ${tagsCreated} created`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during seed script execution:");
    console.error(error);
    process.exit(1);
  }
}

// Run the seed function
seed();
