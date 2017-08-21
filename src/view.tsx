import * as React from 'react';

import { ViewProps } from './';

export function View(props: ViewProps): JSX.Element {
    const title: string = props.state.issue === undefined ? 'Now Loading...' : props.state.issue.title;
    return (
        <div>
            <dl>
                <dt>{'id'}</dt>
                <dd>{props.state.issueId}</dd>
                <dt>{'title'}</dt>
                <dd>{title}</dd>
            </dl>
        </div>
    );
}
