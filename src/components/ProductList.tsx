import { FlexBox, FlexBoxDirection, Text } from "@ui5/webcomponents-react";
import { useState, useEffect } from "react";
import { loadOffProductInfo } from "../model/ProductInfo";
import { getRecallInfo } from "../model/RecallInfo";

export type ProductListProps = {
};

export function ProductList(_props: ProductListProps) {
    return (
        <FlexBox direction={FlexBoxDirection.Column} style={{width: '100%' }}>
            <Text>I am the Product List</Text>
        </FlexBox>
    );
}
