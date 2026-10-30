import { FlexBox, FlexBoxDirection, Avatar, CardHeader, Card, Icon } from "@ui5/webcomponents-react";
import { ProductId } from "../model/ProductInfo";
import { ScannedProduct, getProduct } from "../model/ScannedProduct";
import { getRecallInfo, RecallInfo } from "../model/RecallInfo";
import { useState, useEffect } from "react"
import "@ui5/webcomponents-icons/dist/busy.js";
import "@ui5/webcomponents-icons/dist/error.js";

export type ProductDetailsProps = {
    ean: ProductId
};

export function ProductDetails(props: ProductDetailsProps) {
    const [scannedProduct, setScannedProduct] = useState<ScannedProduct | undefined>(undefined);
    const [recallInfo, setRecallInfo] = useState<RecallInfo | undefined>(undefined);
    useEffect(() => {
        getProduct(props.ean).then(setScannedProduct);
        getRecallInfo(props.ean).then(setRecallInfo);
    }, []);
    const productImageUrl = scannedProduct?.imageUrl || undefined;
    const avatar = productImageUrl
        ? <Avatar
            fallbackIcon="error"
        >
            <img
                style={{ width: '10rem', height: '10rem' }}
                alt="Product"
                src={productImageUrl}
            />
        </Avatar>
        : <Icon name="busy" />;
    const productName = scannedProduct?.name || undefined;
    const cardHeader = <CardHeader loading={scannedProduct === undefined} avatar={avatar} titleText={productName}/>
    return (
        <FlexBox direction={FlexBoxDirection.Column} style={{width: '100%' }}>
            <Card
                header={cardHeader}
                style={{
                    width: '100%'
                }}
            >
                {JSON.stringify(recallInfo ?? "still loading")}
            </Card>
        </FlexBox>
    );
}
