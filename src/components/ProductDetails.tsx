import { FlexBox, FlexBoxDirection, Text } from "@ui5/webcomponents-react";
import { ProductId } from "../model/ProductInfo";
import { ScannedProduct, getProduct } from "../model/ScannedProduct";
import { getRecallInfo, RecallInfo } from "../model/RecallInfo";
import { useState, useEffect } from "react"

export type ProductDetailsProps = {
    ean: ProductId,
    setTitle: (title: string) => void
};

export function ProductDetails(props: ProductDetailsProps) {
    const [scannedProduct, setScannedProduct] = useState<ScannedProduct | undefined>(undefined);
    const [recallInfo, setRecallInfo] = useState<RecallInfo | undefined>(undefined);
    useEffect(() => {
        getProduct(props.ean).then(setScannedProduct);
        getRecallInfo(props.ean).then(setRecallInfo);
    }, []);
    return (
        <FlexBox direction={FlexBoxDirection.Column} style={{width: '100%' }}>
            <Text>I am the Product Details for product {props.ean}</Text>
        </FlexBox>
    );
}
