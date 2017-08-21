import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Observable, Subject, BehaviorSubject } from 'rxjs';

import { View } from './view';

// Domain / utils
interface Issue {
    id: number;
    title: string;
}

// Dispatcher
interface Dispatcher {
    issueId: Subject<number>;
}

// Epic
class Epic {
    private _dispatcher: Dispatcher;
    private _issueRepository: IssueRepository;

    constructor(dispatcher: Dispatcher, issueRepository: IssueRepository) {
        this._dispatcher = dispatcher;
        this._issueRepository = issueRepository;
    }

    activate(): void {
        const issue = this._dispatcher.issueId.asObservable().distinctUntilChanged()
            .flatMap((id) => Observable.fromPromise(getIssue(id)));
        issue.subscribe((v) => this._issueRepository.push(v));
    }
}

async function getIssue(issueId: number): Promise<Issue | undefined> {
    const WAIT = 2000;
    const wait = () => new Promise((resolve) => setTimeout(resolve, WAIT));
    await wait();
    const issue: Issue = {
        id: issueId,
        title: 'test issue',
    };
    return issue;
}

// Repository
interface Repository<T> {
    asObservable: () => Observable<T>;
}

class IssueRepository implements Repository<Issue | undefined> {
    private _issue: BehaviorSubject<Issue | undefined>;

    constructor() {
        this._issue = new BehaviorSubject(undefined);
    }

    push(v: Issue | undefined): void {
        this._issue.next(v);
    }

    asObservable(): Observable<Issue | undefined> {
        return this._issue.asObservable();
    }
}

// Store
class Store {
    private _dispatcher: Dispatcher;
    private _issueRepository: IssueRepository;

    constructor(dispatcher: Dispatcher, issueRepository: IssueRepository) {
        this._dispatcher = dispatcher;
        this._issueRepository = issueRepository;
    }

    compose(): Observable<State> {
        const issueId = this._dispatcher.issueId.asObservable();
        const issue = this._issueRepository.asObservable();

        return issueId.combineLatest(issue, (issueId, issue) => {
            return { issueId, issue };
        });
    }
}

// State
interface State {
    issueId: number;
    issue: Issue | undefined;
}

// View
export interface ViewProps {
    state: State;
}

// booting up application
class Context {
    private _dispatcher: Dispatcher;
    private _issueRepository: IssueRepository;

    constructor() {
        this._dispatcher = {
            issueId: new Subject(),
        };
        this._issueRepository = new IssueRepository();
    }

    activate(mountpoint: HTMLElement): void {
        // write stack
        const epic = new Epic(this._dispatcher, this._issueRepository);
        epic.activate();

        // read stack
        const store = new Store(this._dispatcher, this._issueRepository);
        store.compose().subscribe((state) => {
            const props = { state };
            const view = React.createElement<ViewProps>(View, props);
            ReactDOM.render(view, mountpoint);
        });

        const issueId: number = 1234;
        this._dispatcher.issueId.next(issueId);
    }
}

const context = new Context();
const mountpoint = document.getElementById('js-application-mountpoint');
if (mountpoint !== null) {
    context.activate(mountpoint);
} else {
    console.error('mountpoint was not found');
}
