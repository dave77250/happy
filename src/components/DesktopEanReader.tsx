import { FlexBox, FlexBoxDirection, Button, Input, FlexBoxAlignItems } from "@ui5/webcomponents-react";
import { ProductId } from "../model/ProductInfo";
import { useState } from "react";
import "@ui5/webcomponents-icons/dist/search.js";

export type DesktopEanReaderProps = {
    slot?: string, // for proper positioning in the footer
    eanRead: (ean: ProductId) => void
}

export function DesktopEanReader(props: DesktopEanReaderProps) {
    const [currentText, setCurrentText] = useState("");
    return <FlexBox direction = {FlexBoxDirection.Row} alignItems={FlexBoxAlignItems.Center} slot={props.slot}>
        <Input showClearIcon={true} placeholder="Code barres" value={currentText} onInput={(event) => setCurrentText(event.target.value)}></Input>
        <Button accessibleName="Chercher" icon="search" title="Chercher" onClick={() => props.eanRead(currentText)}/>
    </FlexBox>
}