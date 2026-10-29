import { Page, Bar, Button, Label } from "@ui5/webcomponents-react";
import { ProductId } from "../model/ProductInfo";
import { ProductList } from "./ProductList";
import { ProductDetails } from "./ProductDetails";
import { PrefsEditor } from "./PrefsEditor";
import "@ui5/webcomponents-icons/dist/home.js";
import "@ui5/webcomponents-icons/dist/settings.js";
import { useState } from "react";

enum CurrentScreen {
    ProductList = 'ProductList',
    ProductDetails = 'ProductDetails',
    Prefs = 'Prefs'
};

export type HomeProps = {
};

// ex de produit avec rappel : 3560071492809
// ex de produit sans rappel : 7622210449283

function getCurrentScreen(screen: CurrentScreen, ean: ProductId, setEan: (ean: ProductId) => void) {
    switch(screen) {
        case CurrentScreen.ProductList: return <ProductList showProductDetails={setEan}/>;
        case CurrentScreen.ProductDetails: return <ProductDetails ean={ean}/>;
        case CurrentScreen.Prefs: return <PrefsEditor/>;
    }
}

export function Home(_props: HomeProps) {
    const [currentScreen, setCurrentScreen] = useState<CurrentScreen>(CurrentScreen.ProductList);
    const [currentEan, setCurrentEan] = useState<ProductId>('0000');

    const openProductDetails = (ean: ProductId) => {
        setCurrentEan(ean);
        setCurrentScreen(CurrentScreen.ProductDetails);
    };
    const goHome = () => {
        setCurrentScreen(CurrentScreen.ProductList);
    };
    const openSettings = () => {
        setCurrentScreen(CurrentScreen.Prefs);
    };
    const displayedScreen = getCurrentScreen(currentScreen, currentEan, openProductDetails);
    const header = <Bar design="Header"
        endContent={<Button accessibleName="Settings" icon="settings" title="Go to Settings" onClick={openSettings}/>}
        startContent={<Button accessibleName="Home" icon="home" title="Go Home" onClick={goHome}/>}>
            <Label>Happy</Label>
    </Bar>;

    const footer = <div>
        <Bar design="FloatingFooter" endContent={<><Button design="Positive">Accept</Button><Button design="Negative">Decline</Button><Button design="Transparent">Cancel</Button></>}/>
    </div>;

    return <Page
        backgroundDesign="Solid"
        footer={footer}
        header={header}
        style={{ height: '100dvh' }}
    >
        {displayedScreen}
    </Page>
}
