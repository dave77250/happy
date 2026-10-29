import { FlexBox, FlexBoxDirection, Text } from "@ui5/webcomponents-react";
// import { useState, useEffect } from "react";

export type PrefsEditorProps = {
};

export function PrefsEditor(_props: PrefsEditorProps) {
    return (
        <FlexBox direction={FlexBoxDirection.Column} style={{width: '100%' }}>
            <Text>I am the Prefs Editor</Text>
        </FlexBox>
    );
}
