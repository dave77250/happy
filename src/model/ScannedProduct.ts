import { ProductId, ProductInfo, loadOffProductInfo } from "./ProductInfo"
import { Dexie, type EntityTable } from "dexie"

export type ScannedProduct = ProductInfo & {
    scanDate: number,
    isFavorite: boolean
}

const db = new Dexie("ProductsDatabase") as Dexie & {
  products: EntityTable<ScannedProduct, "ean">
}

// Schema declaration:
db.version(1).stores({
  products: "ean, name, imageUrl, scanDate, isFavorite",
})

function createScannedProduct(info: ProductInfo): ScannedProduct {
    return {
        ...info,
        scanDate: Date.now(),
        isFavorite: false
    }
}

export async function getProduct(ean: ProductId) {
  var product: ScannedProduct | undefined = await db.products.get({ean});
  if (product === undefined) {
    const productInfo = await loadOffProductInfo(ean);
    if (productInfo === undefined) {
      // default values, do not store in db
      product = createScannedProduct({
        ean,
        name: "Produit inconnu",
        imageUrl: "???"
      });
    } else {
      product = createScannedProduct(productInfo);
      await db.products.add(product);
    }
  }
  return product;
}

export async function setFavorite(ean: ProductId, isFavorite: boolean) {
  await db.products.update(ean, {isFavorite});
}

export async function deleteOldProducts(nDays: number) {
  const cutoff = Date.now() - nDays * 24 * 60 * 60 * 1000;
  
  await db.products
    .where('scanDate')
    .below(cutoff)
    .delete();
}
