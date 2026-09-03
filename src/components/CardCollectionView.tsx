import { FlexBox, FlexBoxDirection, FlexBoxJustifyContent, StepInput, Button, FileUploader } from "@ui5/webcomponents-react";
import { Card, CardId } from "../model/Card"
import { CardCollection, DreambornCollection, DreambornCollectionCard, importDreambornCollection } from "../model/Collection";
import { SearchableCardGrid } from "./SearchableCardGrid";
import { debugLog } from "../tools/Debug";
import "@ui5/webcomponents-icons/dist/upload.js"

export type CardCollectionViewProps = {
    cardDefinitions: Card[],
    collection: CardCollection,
    setInCollection: (id: CardId, owned: number) => void,
    setCollection: (collection: CardCollection) => void
}

// (event) => props.setInCollection(id, event.target.value)
export function CardCollectionView(props: CardCollectionViewProps) {
    const onStep = (id: CardId, value: number) => {
        props.setInCollection(id, value);
    };
    const getOwnedDetailsView = (id: CardId) => {
        return (
          <FlexBox direction={FlexBoxDirection.Row} justifyContent={FlexBoxJustifyContent.Center}>
              <StepInput value={props.collection.get(id) ?? 0} min={0} onChange={(event) => onStep(id, event.target.value)}/>
          </FlexBox>
        );
      };
    const extraToolBar = <FlexBox direction={FlexBoxDirection.Row}>
            <FileUploader
                hideInput
                accept=".csv"
                multiple={false}
                onChange={(event) => {
                    debugLog("Evenement upload");
                    const files = event?.detail?.files;
                    if ((files?.length ?? 0) > 0) {
                        const file = files?.item(0);
                        const reader = new FileReader();
                        reader.readAsText(file as any as Blob, "UTF-8");
                        reader.onloadend = (readerEvent) => {
                            if (readerEvent?.target?.result) {
                                debugLog("csv");
                                debugLog(readerEvent?.target?.result);
                                const csv = readerEvent?.target?.result.toString();
                                const lines = csv.split("\n");
                                debugLog("lines:");
                                debugLog(lines);
                                const dbItems: DreambornCollection = [];
                                lines.filter((_, index) => index > 0).forEach(line => {
                                    const values = line.split(",");
                                    if(values.length > 4) {
                                        const dbCard: DreambornCollectionCard = {
                                            setCode: values[0],
                                            number: Number.parseInt(values[1]),
                                            owned: Number.parseInt(values[3])
                                        };
                                        dbItems.push(dbCard);
                                    }
                                });
                                debugLog("Appel de importDreambornCollection");
                                const newCollection = importDreambornCollection(dbItems, props.cardDefinitions);
                                debugLog("Appel de setCollection");
                                props.setCollection(newCollection);
                            }
                        }
                    }
                }}
                valueState="None"
            >
                <Button icon="upload"/>
            </FileUploader>
        </FlexBox>;
    return (
        <SearchableCardGrid cardCollection={props.cardDefinitions} getExtraCardComponent={getOwnedDetailsView} extraToolBarComponent={extraToolBar}/>
    );
}