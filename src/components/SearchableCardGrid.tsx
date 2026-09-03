import { FlexBox, FlexBoxDirection, IllustratedMessage } from '@ui5/webcomponents-react';
import { ReactNode, useState } from 'react';
import { CardGridToolBar } from './CardGridToolBar';
import { getColumns, setColumns } from '../model/Preferences';
import { Card, CardId } from '../model/Card';
import { BasicGrid } from './BasicGrid';
import { CardView } from './CardView';
import "@ui5/webcomponents-fiori/dist/illustrations/NoEntries.js"

export type SeachableCardGridProps = {
    cardCollection: Card[],
    extraToolBarComponent?: ReactNode,
    getExtraCardComponent?: (cardId: CardId) => ReactNode,
    shouldHighlight?: (cardId: CardId) => boolean,
    searchText?: string,
    onSearchTextChange?: (searchText: string) => void
};

const colorMap =new Map<string, string>();

const AMBER = "#FFBF00";
const AMETHYST = "#9966cc";
const EMERALD = "#50C878";
const RUBY = "#E0115F";
const SAPPHIRE = "#0F52BA";
const STEEL = "#71797E";

colorMap.set("Ambre", AMBER);
colorMap.set("Améthyste", AMETHYST);
colorMap.set("Émeraude", EMERALD);
colorMap.set("Rubis", RUBY);
colorMap.set("Saphir", SAPPHIRE);
colorMap.set("Acier", STEEL);
colorMap.set("Ambre-Acier", AMBER + " " + STEEL);
colorMap.set("Ambre-Saphir", AMBER + " " + SAPPHIRE);
colorMap.set("Ambre-Émeraude", AMBER + " " + EMERALD);
colorMap.set("Ambre-Rubis", AMBER + " " + RUBY);
colorMap.set("Ambre-Améthyste", AMBER + " " + AMETHYST);
colorMap.set("Améthyste-Acier", AMETHYST + " " + STEEL);
colorMap.set("Améthyste-Rubis", AMETHYST + " " + RUBY);
colorMap.set("Améthyste-Émeraude", AMETHYST + " " + EMERALD);
colorMap.set("Améthyste-Saphir", AMETHYST + " " + SAPPHIRE);
colorMap.set("Émeraude-Rubis", EMERALD + " " + RUBY);
colorMap.set("Émeraude-Saphir", EMERALD +  " " + SAPPHIRE);
colorMap.set("Émeraude-Acier", EMERALD + " " + STEEL);
colorMap.set("Rubis-Acier", RUBY + " " + STEEL);
colorMap.set("Rubis-Saphir", RUBY + " " + SAPPHIRE);
colorMap.set("Saphir-Acier", SAPPHIRE + " " + STEEL);

export function SearchableCardGrid(props: SeachableCardGridProps) {
    const [searchText, setSearchText] = useState(props.searchText ?? "");
    const [nbCols, setNbCols] = useState(getColumns()) ;

    const changeNbCols = (nbCols: number) => {
        setNbCols(nbCols);
        setColumns(nbCols);
    }
    const displayedCards = searchText !== ""
        ? props.cardCollection.filter(c => c.name.toLocaleUpperCase().indexOf(searchText.toLocaleUpperCase()) !== -1)
        : props.cardCollection;

    const noHighlight = (_cardId: CardId) => false;
    const shouldHighlightCard = props.shouldHighlight ?? noHighlight;

    const performSearch = (searchText: string) => {
        setSearchText(searchText);
        if (props.onSearchTextChange) {
            props.onSearchTextChange(searchText);
        }
    }

    return (
        <FlexBox direction={FlexBoxDirection.Column} style={{width: '100%'}}>
            <CardGridToolBar nbCols={nbCols} onColumnNbChange={changeNbCols} searchText={searchText} onSearch={performSearch} extraToolBarComponent={props.extraToolBarComponent}/>
            { displayedCards.length > 0
            ? <BasicGrid columns={nbCols}>
                {displayedCards.map(card => {
                    const cardColor = colorMap.get(card.color) ?? "";
                    const normalStyle: React.CSSProperties = { padding: '5px', width: '100%', margin: '2px' };
                    const highlightedStyle: React.CSSProperties = { padding: '5px', width: '100%', borderColor: cardColor, borderStyle: 'solid', borderWidth: 'thick', borderRadius: '5%', margin: '2px' };
                    const cardStyle = shouldHighlightCard(card.id) ? highlightedStyle : normalStyle;
                    return (
                        <FlexBox key={card.id} direction={FlexBoxDirection.Column} style={cardStyle}>
                            <CardView card={card}/>
                            { props.getExtraCardComponent ? props.getExtraCardComponent(card.id) : null }
                        </FlexBox>);
                })}
            </BasicGrid>
            : <IllustratedMessage name="NoEntries" titleText="Pas de cartes trouvées, désolé" subtitleText='Essayez une autre recherche'/>
        }
        </FlexBox>
    );
}