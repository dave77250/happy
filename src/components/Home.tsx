import { Page, Bar, Button, Label } from "@ui5/webcomponents-react";
import { ProductId } from "../model/ProductInfo";
import { ProductList } from "./ProductList";
import { ProductDetails } from "./ProductDetails";
import { PrefsEditor } from "./PrefsEditor";
import { DesktopEanReader } from "./DesktopEanReader";
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

function getCurrentScreen(screen: CurrentScreen, ean: ProductId,
    setEan: (ean: ProductId) => void,
    setTitle: (title: string) => void
) {
    switch(screen) {
        case CurrentScreen.ProductList: return <ProductList showProductDetails={setEan}/>;
        case CurrentScreen.ProductDetails: return <ProductDetails ean={ean} setTitle={setTitle}/>;
        case CurrentScreen.Prefs: return <PrefsEditor/>;
    }
}

function getEanReader(eanRead: (ean: ProductId) => void) {
    return <DesktopEanReader eanRead={eanRead}/>
}

export function Home(_props: HomeProps) {
    const DEFAULT_APP_TITLE = "Happy";
    const [currentEan, setCurrentEan] = useState<ProductId>('0000');
    const [title, setTitle] = useState(DEFAULT_APP_TITLE);
    const [currentScreen, setCurrentScreen] = useState<CurrentScreen>(CurrentScreen.ProductList);

    const openProductDetails = (ean: ProductId) => {
        setCurrentEan(ean);
        setTitle(ean);
        setCurrentScreen(CurrentScreen.ProductDetails);
    };
    const goHome = () => {
        setTitle(DEFAULT_APP_TITLE);
        setCurrentScreen(CurrentScreen.ProductList);
    };
    const openSettings = () => {
        setTitle("Préférences");
        setCurrentScreen(CurrentScreen.Prefs);
    };
    const displayedScreen = getCurrentScreen(currentScreen, currentEan, openProductDetails, setTitle);
    const header = <Bar design="Header"
        endContent={<Button accessibleName="Settings" icon="settings" title="Go to Settings" onClick={openSettings}/>}
        startContent={<Button accessibleName="Home" icon="home" title="Go Home" onClick={goHome}/>}>
            <Label>{title}</Label>
    </Bar>;

    const eanReader = getEanReader(openProductDetails);
    const footer = <div>
        <Bar design="FloatingFooter" endContent={eanReader}/>
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
