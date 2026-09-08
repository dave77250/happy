import { ProductInfo } from "./ProductInfo"

export type ScannedProduct = ProductInfo & {
    scanDate: number,
    isFavorite: boolean
}