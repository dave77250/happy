import { ProductId } from "./ProductInfo"

// const fetch = window.fetch;

export type RecallInfo = {
    isRecalled: boolean,
    recallDetailsUrl?: string
}

export async function getRecallInfo(_ean: ProductId) {
    
}