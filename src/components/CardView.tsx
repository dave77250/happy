import { FlexBox, FlexBoxDirection, Text } from "@ui5/webcomponents-react";
import { Card } from "../model/Card";

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

export interface CardViewProps {
    card: Card
}

//  ajouter bordure
export function CardView(props: CardViewProps) {
    return <FlexBox key={props.card.id} direction={FlexBoxDirection.Column} style={{width: '100%' }}>
        <img src={props.card.image} style={{ width: '100%', height: 'auto ', borderRadius: '5%'}}/>
        <Text style={{ width: '100%', textAlign: 'center' }}>{props.card.fullName}</Text>
    </FlexBox>;
}