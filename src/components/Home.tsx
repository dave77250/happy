import { FlexBox, FlexBoxDirection, Text } from "@ui5/webcomponents-react";
import { useState, useEffect } from "react";
import { loadOffProductInfo } from "../model/ProductInfo";

export type HomeProps = {
};

export function Home(_props: HomeProps) {
    const [productInfo, setProductInfo] = useState("In progress");
    useEffect(() => {
        loadOffProductInfo("7622210449283").then(pi => setProductInfo(JSON.stringify(pi ?? "undefined")));
    }, []);
    return (
        <FlexBox direction={FlexBoxDirection.Column} style={{width: '100%' }}>
            <Text>Hello world !</Text>
            <Text>{productInfo}</Text>
            {productInfo?.imageUrl ? <img src={productInfo.imageUrl}/> : <></>}
        </FlexBox>
    );
}
