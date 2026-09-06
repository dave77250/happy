import { FlexBox, FlexBoxDirection, Text } from "@ui5/webcomponents-react";
import { useState, useEffect } from "react";
import { loadOffProductInfo } from "../model/ProductInfo";

export type HomeProps = {
};

export function Home(_props: HomeProps) {
    const [productInfo, setProductInfo] = useState("In progress");
    const [imageUrl, setImageUrl] = useState<string|undefined>(undefined);
    useEffect(() => {
        loadOffProductInfo("7622210449283").then(pi => {
            if (pi) {
                setProductInfo(JSON.stringify(pi));
                setImageUrl(pi.imageUrl);
            } else {
                setProductInfo("erreur lors de la lecture du produit");
            }
        })
    }, []);
    return (
        <FlexBox direction={FlexBoxDirection.Column} style={{width: '100%' }}>
            <Text>Hello world !</Text>
            <Text>{productInfo}</Text>
            {imageUrl ? <img src={imageUrl}/> : <></>}
        </FlexBox>
    );
}
