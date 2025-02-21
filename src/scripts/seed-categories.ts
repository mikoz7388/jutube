import { db } from "@/db";
import { categories } from "@/db/schema/categories";

const categoryNames = [
  "Cars and Vehicles",
  "Comedy",
  "Education",
  "Gaming",
  "Entertainment",
  "Film and Animation",
  "How-to and Style",
  "Music",
  "News and Politics",
  "People and Blogs",
  "Pets and Animals",
  "Science and Technology",
  "Sports",
  "Travel and Events",
];

async function main() {
  console.log("Seeding categories...");

  try {
    const values = categoryNames.map((name) => {
      return {
        name,
        description: `All ${name} related videos`,
      };
    });

    await db.insert(categories).values(values);
    console.log("Categories seeded successfully");
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

main();
