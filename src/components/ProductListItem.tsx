import { FlexBox, FlexBoxDirection, FlexBoxAlignItems, Label } from "@ui5/webcomponents-react";
import { RecallInfo, getRecallInfo } from "../model/RecallInfo";
import "@ui5/webcomponents-icons/dist/favorite.js";

export type ProductListItemProps ={
    product: ScannedProduct,
    onClick: () => void
};

export function ProductListItem(props: ProductListItemProps) {
    const [recallInfo, setRecallInfo] = useState<RecallInfo | undefined>(undefined);
    useEffect(() => {
        getRecallInfo(props.ean).then(setRecallInfo);
    }, []);
    return <FlexBox
        direction={FlexBoxDirection.Row}
        alignItems={FlexBoxAlignItems.Center}
        justifyContent="SpaceBetween"
        style={{
            width: '100%',
            borderTop: '1px solid var(--sapList_BorderColor)',
            borderBottom: '1px solid var(--sapList_BorderColor)',
        }}
        onClick={props.onClick}
        >
            <img
                style={{ width: '10%' }}
                alt="Product"
                src={props.product.imageUrl}
            />
            <FlexBox direction={FlexBoxDirection.Column} style={{ width: '85%'}}>
                <Label>{props.product.name}</Label>
                <RecallInfoMessageStrip recallInfo={recallInfo}/>
            </FlexBox>
            {
                props.product.isFavorite
                    ? <Icon name="favorite"/>
                    : <></>
            }
    </FlexBox>;
}