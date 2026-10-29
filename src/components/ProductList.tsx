import { FlexBox, FlexBoxDirection, Text } from "@ui5/webcomponents-react";
import { ProductId } from "../model/ProductInfo";
// import { useState, useEffect } from "react";

export type ProductListProps = {
    showProductDetails: (ean: ProductId) => void
};

export function ProductList(_props: ProductListProps) {
    return (
        <FlexBox direction={FlexBoxDirection.Column} style={{width: '100%' }}>
            <Text>I am the Product List</Text>
        </FlexBox>
    );
}
