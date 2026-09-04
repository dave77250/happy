import { FlexBox, FlexBoxDirection, Text } from "@ui5/webcomponents-react";

export function Home() {
    return 
        <FlexBox direction={FlexBoxDirection.Column} style={{width: '100%' }}>
            <Text>Hello world !</Text>
        </FlexBox>;
}