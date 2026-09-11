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
  } else {
    // update the scan date, the product was just scanned
    product = {
      ...product,
      scanDate: Date.now()
    };
    await db.products.update(product.ean, { scanDate: product.scanDate });
  }
  return product;
}

export async function setFavorite(product: ScannedProduct, newIsFavorite: boolean) {
  await db.products.update(product.ean, {isFavorite: newIsFavorite});
  return {
    ...product,
    isFavorite: newIsFavorite
  }
}

export async function deleteOldProducts(nDays: number) {
  const cutoff = Date.now() - nDays * 24 * 60 * 60 * 1000;
  
  const nbDeleted = await db.products
    .where('scanDate')
    .below(cutoff)
    .and(product => !product.isFavorite)
    .delete();

  return nbDeleted;
}
