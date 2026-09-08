import { ProductInfo } from "./ProductInfo"
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
