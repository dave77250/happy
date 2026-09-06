import { OpenFoodFacts } from "@openfoodfacts/openfoodfacts-nodejs";

export type ProductId = string;

type ProductInfo = {
    ean: ProductId,
    name?: string,
    imageUrl?: string
}

const offClient = new OpenFoodFacts(window.fetch);

export async function loadOffProductInfo(ean: ProductId): Promise<ProductInfo | undefined> {
    const res = await offClient.getProductV3(ean);

    if (res.error || !res.data) {
        return undefined;
    }

    const data = res.data;

    if (data.status === "failure") {
        return undefined;
    }

    const product = data.product;

    const prodInfo: ProductInfo = {
        ean,
        name: product.product_name_fr || product.product_name,
        imageUrl: product.image_front_small_url
    };
    return prodInfo;
}

