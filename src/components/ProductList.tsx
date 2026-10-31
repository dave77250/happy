import { FlexBox, FlexBoxDirection, Text } from "@ui5/webcomponents-react";
import { ProductId } from "../model/ProductInfo";
// import { useState, useEffect } from "react";

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
            {products.map(p => <ProductListItem product={p} onClick={() => showProductDetails(p.ean)}/>)}
        </FlexBox>
    );
}
