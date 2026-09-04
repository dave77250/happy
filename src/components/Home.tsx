import { FlexBox, FlexBoxDirection, Text } from "@ui5/webcomponents-react";
import { useState, useEffect } from "react";
import { OpenFoodFacts } from "@openfoodfacts/openfoodfacts-nodejs";

export type HomeProps = {
};

type OpenFoodFactsResponse = {
    data?: any,
    error?: any
};

export function Home(_props: HomeProps) {
    const [productInfo, setProductInfo] = useState("In progress");
    useEffect(() ={
        const client = new OpenFoodFacts(window.fetch);
        client.getProductV3("5000112546415").then((res: OpenFoodFactsResponse) => {
            if(res.error) {
                setProductInfo("ERROR : " + res?.error?.toString() ?? "undefined");
            } else {
                setProductInfo(res?.data?.toString() ?? "undefined");
            }
        });
    }, []);
    return (
        <FlexBox direction={FlexBoxDirection.Column} style={{width: '100%' }}>
            <Text>Hello world !</Text>
            <Text>productInfo</Text>
        </FlexBox>
    );
}

import { OpenFoodFacts } from "@openfoodfacts/openfoodfacts-nodejs";

// if you're on the browser, you can pass the fetch function as a parameter
const client = new OpenFoodFacts(window.fetch);
// or if you're on Node.js, you can pass the global fetch function
const client = new OpenFoodFacts(globalThis.fetch);
// or if you're using a custom fetch implementation
import fetch from "node-fetch";

const client = new OpenFoodFacts(fetch);

(async () => {
  // then you can use the client to access the Open Food Facts API
  const { data, error } = await client.getProductV3("5000112546415");
  if (!data) {
    console.error("Error fetching product:", error);
    return;
  }
  console.log("Product data:", data);
})();