import { OpenFoodFacts } from "@openfoodfacts/openfoodfacts-nodejs";

export type ProductId = string;

type ProductInfo = {
    ean: ProductId,
    name: string,
    imageUrl: string
}

const offClient = new OpenFoodFacts(window.fetch);

export async function loadOffProductInfo(ean: ProductId): Promise<ProductInfo | undefined> {
    const res = await offClient.getProductV3(ean);
    if(res.error) {
        return undefined;
    } else {
        const data = res.data;
        const prodInfo: ProductInfo = {
            ean,
            name: data?.product?.product_name_fr || data?.product?.product_name,
            imageUrl: data?.product?.image_front_small_url ?? "no url"
        }
        return prodInfo;
    }
}

