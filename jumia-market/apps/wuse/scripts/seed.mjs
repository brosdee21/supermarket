import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { branches, categories, products } from "./catalog.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const branchSlug = process.env.BRANCH || process.argv[2] || "wuse";

if (!branches[branchSlug]) {
  console.error(`Unknown branch "${branchSlug}". Use "wuse" or "garki".`);
  process.exit(1);
}

const branchIndex = branchSlug === "wuse" ? 0 : 1;

const seeded = {
  branch: branches[branchSlug],
  categories,
  products: products.map((p, i) => ({
    id: `prod-${String(i + 1).padStart(3, "0")}`,
    slug: p.slug,
    name: p.name,
    description: p.description,
    price: p.price,
    originalPrice: p.originalPrice,
    categorySlug: p.categorySlug,
    image: `https://picsum.photos/seed/${p.imgSeed}/700/700`,
    gallery: [
      `https://picsum.photos/seed/${p.imgSeed}/700/700`,
      `https://picsum.photos/seed/${p.imgSeed}-2/700/700`,
      `https://picsum.photos/seed/${p.imgSeed}-3/700/700`,
    ],
    rating: p.rating,
    reviewCount: p.reviewCount,
    stock: p.stock[branchIndex],
    isFeatured: !!p.isFeatured,
    tags: p.tags || [],
  })),
  orders: [],
  inquiries: [],
};

const dataDir = join(__dirname, "..", "data");
mkdirSync(dataDir, { recursive: true });
writeFileSync(join(dataDir, "store.json"), JSON.stringify(seeded, null, 2));

console.log(
  `Seeded data/store.json for ${branches[branchSlug].name} with ${seeded.products.length} products.`
);
