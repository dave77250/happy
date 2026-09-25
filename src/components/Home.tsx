import { FlexBox, FlexBoxDirection, Text } from "@ui5/webcomponents-react";
import { useState, useEffect } from "react";
import { loadOffProductInfo } from "../model/ProductInfo";
import { getRecallInfo } from "../model/RecallInfo";

export type HomeProps = {
};

export function Home(_props: HomeProps) {
    const [productInfo, setProductInfo] = useState("In progress");
    const [recallJson, setRecallJson] = useState("Chargement du rappel");
    useEffect(() => {
        loadOffProductInfo("7622210449283").then(pi => {
            if (pi) {
                setProductInfo(JSON.stringify(pi));
            } else {
                setProductInfo("erreur lors de la lecture du produit");
            }
        });
        getRecallInfo("3560071492809").then(info => setRecallJson(JSON.stringify(info)));
    }, []);
    return (
        <FlexBox direction={FlexBoxDirection.Column} style={{width: '100%' }}>
            <Text>Hello world !</Text>
            <Text>{productInfo}</Text>
            <Text>{recallJson}</Text>
        </FlexBox>
    );
}
