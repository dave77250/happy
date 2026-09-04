import { FlexBox, FlexBoxDirection, Text } from "@ui5/webcomponents-react";
import { useState, useEffect } from "react";
import { OpenFoodFacts } from "@openfoodfacts/openfoodfacts-nodejs";

export type HomeProps = {
};

type OpenFoodFactsResponse = {
    data?: any,
    error?: any
};

type ProductInfo ={
    name: string,
    imageUrl: string
}

export function Home(_props: HomeProps) {
    const [productInfo, setProductInfo] = useState("In progress");
    useEffect(() => {
        const client = new OpenFoodFacts(window.fetch);
        client.getProductV3("5000112546415").then((res: OpenFoodFactsResponse) => {
            if(res.error) {
                setProductInfo("ERROR : " + res?.error?.toString());
            } else {
                const data = res.data;
                const prodInfo: ProductInfo = {
                    name: data?.product?.product_name_fr || data?.product?.product_name
                    imageUrl: data?.product?.image_front_small_url ?? "no url"
                }
                setProductInfo(JSON.stringify(prodInfo));
            }
        });
    }, []);
    return (
        <FlexBox direction={FlexBoxDirection.Column} style={{width: '100%' }}>
            <Text>Hello world !</Text>
            <Text>{productInfo}</Text>
        </FlexBox>
    );
}
