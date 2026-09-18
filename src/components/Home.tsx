import { FlexBox, FlexBoxDirection, Text } from "@ui5/webcomponents-react";
import { useState, useEffect } from "react";
import { loadOffProductInfo } from "../model/ProductInfo";

export type HomeProps = {
};

export function Home(_props: HomeProps) {
    const [productInfo, setProductInfo] = useState("In progress");
    const [imageUrl, setImageUrl] = useState<string|undefined>(undefined);
    const [recallJson, setRecallJson] = useState("Not yet");
    useEffect(() => {
        loadOffProductInfo("7622210449283").then(pi => {
            if (pi) {
                setProductInfo(JSON.stringify(pi));
                setImageUrl(pi.imageUrl);
            } else {
                setProductInfo("erreur lors de la lecture du produit");
            }
        });
        fetch("https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/rappelconso-v2-gtin-trie/exports/json/?lang=fr&timezone=Europe%2FParis&where=%28%28%60gtin%60+%3D+3560071492809%29%29")
        .then(response => response.json()).then(setRecallJson);
    }, []);
    return (
        <FlexBox direction={FlexBoxDirection.Column} style={{width: '100%' }}>
            <Text>Hello world !</Text>
            <Text>{productInfo}</Text>
            {imageUrl ? <img src={imageUrl}/> : <></>}
            <Text>{recallJson}</Text>
        </FlexBox>
    );
}
