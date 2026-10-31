import { Button, BarcodeScannerDialog } from "@ui5/webcomponents-react";
import { ProductId } from "../model/ProductInfo";
import { useState } from "react";
import "@ui5/webcomponents-icons/dist/search.js";

export type DesktopEanReaderProps = {
    slot?: string, // for proper positioning in the footer
    eanRead: (ean: ProductId) => void
}

export function DesktopEanReader(props: DesktopEanReaderProps) {
    const [isDialogOpen, setDialogOpen] = useState<boolean>(false);
    return <>
        <Button accessibleName="Chercher" icon="search" title="Chercher" onClick={() => setDialogOpen(true)}/>
        <BarcodeScannerDialog
            open={isDialogOpen}
            onClose={() => setDialogOpen(false)}
            onScanSuccess={(event) => {
                setDialogOpen(false);
                props.eanRead(event.detail.text);
            } }
        />
    </>
}