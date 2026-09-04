import { FlexBox, FlexBoxDirection, Text } from "@ui5/webcomponents-react";

export type HomeProps = {
};

export function Home(props: HomeProps) {
    return 
        <FlexBox direction={FlexBoxDirection.Column} style={{width: '100%' }}>
            <Text>Hello world !</Text>
        </FlexBox>;
}