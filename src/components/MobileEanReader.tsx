import { Button, BarcodeScannerDialog, FlexBox, FlexBoxDirection, FlexBoxAlignItems } from "@ui5/webcomponents-react";
import { ProductId } from "../model/ProductInfo";
import { useState } from "react";
import "@ui5/webcomponents-icons/dist/bar-code.js";

export type MobileEanReaderProps = {
    slot?: string, // for proper positioning in the footer
    eanRead: (ean: ProductId) => void
}

export function MobileEanReader(props: MobileEanReaderProps) {
    const [isDialogOpen, setDialogOpen] = useState<boolean>(false);
    return <FlexBox direction = {FlexBoxDirection.Row} alignItems={FlexBoxAlignItems.Center} slot={props.slot}>
        <Button accessibleName="Scanner" icon="bar-code" title="Scanner" onClick={() => setDialogOpen(true)}/>
        <BarcodeScannerDialog
            open={isDialogOpen}
            onClose={() => setDialogOpen(false)}
            onScanSuccess={(event) => {
                setDialogOpen(false);
                props.eanRead(event.detail.text);
            } }
        />
    </FlexBox>
}