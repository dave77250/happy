import { ProductInfo } from "./ProductInfo"

export type ScannedProduct = ProductInfo & {
    scanDate: number,
    isFavorite: boolean
}

function createScannedProduct(info: ProductInfo): ScannedProduct {
    return {
        ...info,
        scanDate: Date.now(),
        isFavorite: false
    }
}