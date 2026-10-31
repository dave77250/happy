import { FlexBox, FlexBoxDirection } from "@ui5/webcomponents-react";
import { ProductListItem } from "./ProductListItem";
import { ProductId } from "../model/ProductInfo";
import { ScannedProduct, getScannedProducts } from "../model/ScannedProduct";
import { useState, useEffect } from "react";

export type ProductListProps = {
    showProductDetails: (ean: ProductId) => void
};

export function ProductList(_props: ProductListProps) {
    const [products, setProducts] = useState<ScannedProduct[]>([]);
    useEffect(() => {
        getScannedProducts().then(setProducts);
    }, []);
    return (
        <FlexBox direction={FlexBoxDirection.Column} style={{width: '100%' }}>
            {products.map((p: ScannedProduct) => <ProductListItem product={p} onClick={() => props.showProductDetails(p.ean)}/>)}
        </FlexBox>
    );
}
