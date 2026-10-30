import { FlexBox, FlexBoxDirection, Icon, Title, MessageStrip } from "@ui5/webcomponents-react";
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
        ? <img
                style={{ width: '20%' }}
                alt="Product"
                src={productImageUrl}
            />
        : <Icon name="busy" />;
    const productName = scannedProduct?.name || undefined;
    const getRecallInfoMessageStrip = () => {
        if (recallInfo !== undefined) {
            return recallInfo.isRecalled
                ? <MessageStrip design="Critical" hideCloseButton={true}>Ce produit fait l'objet d'un rappel</MessageStrip>
                : <MessageStrip design="Positive" hideCloseButton={true}>Ce produit ne fait pas l'objet d'un rappel</MessageStrip>;
        } else {
            return <MessageStrip design="Information" hideCloseButton={true}>Chargement des informations de rappel en cours</MessageStrip>;
        }
    }
    return (
        <FlexBox direction={FlexBoxDirection.Column} style={{width: '100%' }}>
            <FlexBox direction={FlexBoxDirection.Row} style={{width: '100%' }}>
                {avatar}
                <FlexBox direction={FlexBoxDirection.Column} style={{ width: '80%', margin: '5px' }}>
                    <Title level="H2" size="H2">{productName}</Title>
                    <p></p>
                    {getRecallInfoMessageStrip()}
                </FlexBox>
            </FlexBox>
        </FlexBox>
    );
}
