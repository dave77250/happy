import { FlexBox, FlexBoxDirection, Text } from "@ui5/webcomponents-react";
// import { useState, useEffect } from "react"

export type ProductDetailsProps = {
    ean: ProductId
};

export function ProductDetails(props: ProductDetailsProps) {
    return (
        <FlexBox direction={FlexBoxDirection.Column} style={{width: '100%' }}>
            <Text>I am the Product Details for product {props.ean}</Text>
        </FlexBox>
    );
}
