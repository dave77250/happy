import { Slider, Text, FlexBox, FlexBoxDirection, FlexBoxJustifyContent } from "@ui5/webcomponents-react";
import { useState } from "react";

type SliderAndValueProps = {
    max: number,
    value: number,
    onChange: (updatedValue: number) => void
}

export function SliderAndValue(props: SliderAndValueProps) {
    const [currentValue, setCurrentValue] = useState(props.value);
    return <FlexBox direction={FlexBoxDirection.Row} justifyContent={FlexBoxJustifyContent.SpaceBetween} alignItems="Center">
        <Slider min={0} max={props.max} step={1} value={props.value} onInput={(event) => {
            const updatedValue = event.target.value;
            setCurrentValue(updatedValue);
            props.onChange(updatedValue);
        }}/>
        <Text>{currentValue}</Text>
    </FlexBox>;
}