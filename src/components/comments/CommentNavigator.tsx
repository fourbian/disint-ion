import React from "react";
import { DisintComment } from "../../models/DisintComment";
import { commentQueryService } from "../../services/comments/CommentQueryService"
import { CommentQuery } from "../../models/CommentQuery";
import './CommentNavigator.css'
import { IonList } from "@ionic/react";
import {
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CommentNavigatorItem } from "./CommentNavigatorItem";
import { SortableItem } from "../test/SortableItem";
import { DragOverlay } from "@dnd-kit/core";
import { selectionService } from "../../services/dnd/SelectionService";
import { Droppable } from "../../services/dnd/Droppable";
import { MultipleContainers } from "../test/SortableTest";

class CommentNavigatorProps {
    query: CommentQuery;
    ref: any;
    component: string;
    id: string;
}

class CommentNavigatorState {
    comments: DisintComment<any>[] = [];
}

export class CommentNavigator extends React.Component<CommentNavigatorProps, CommentNavigatorState> {
    items = [2, 3, 4];
    items2 = [5, 6, 7];
    _loading = false;
    _lastUsedQuery: CommentQuery;
    innerClone: JSX.Element;

    public constructor(props: CommentNavigatorProps) {
        super(props);
        this.state = new CommentNavigatorState();
    }

    async componentDidMount() {
        await this.loadComments();
    }

    async loadComments() {
        if (this._loading) return
        this._loading = true;

        this._lastUsedQuery = this.props.query;
        const comments = await commentQueryService.query(this.props.query);

        this.setState({ comments });

        this._loading = false;
    }

    async reloadCommentsIfQueryChanged() {
        //console.log("CommentNavigator", this.props.query)
        if (!this._lastUsedQuery) return;

        const isSameQuery = await this._lastUsedQuery.isEqual(this.props.query);

        if (!isSameQuery) {
            await this.loadComments();
        }
    }

    domId(comment: DisintComment<any>) {
        return this.props.id + selectionService.separator + comment.id;
    }

    render() {
        return <MultipleContainers vertical={true}></MultipleContainers>
    }
/*
    render() {
        this.reloadCommentsIfQueryChanged();

        return (
            <div>
                <SortableContext
                    items={this.items}
                    strategy={verticalListSortingStrategy}
                >
                    <Droppable id="one">
                        {this.items.map((id, index) => <SortableItem key={id} id={id} />)}
                    </Droppable>
                </SortableContext>

                <SortableContext
                    items={this.items2}
                    strategy={verticalListSortingStrategy}
                >
                    <Droppable id="one">
                        {this.items2.map((id, index) => <SortableItem key={id} id={id} />)}
                    </Droppable>
                </SortableContext>

                <SortableContext items={this.state.comments.map(c => this.domId(c))} strategy={verticalListSortingStrategy}>
                    <Droppable id="two">
                        {this.state.comments?.map((c, index) => {
                            let domId = this.domId(c);
                            //let domId = index.toString();
                            //let domId = c.id;
                            //console.log("using id", domId);
                            return <CommentNavigatorItem domId={domId} key={c.id} comment={c} component={this.props.component}></CommentNavigatorItem>
                        })}
                    </Droppable>
                </SortableContext>
            </div>
        )

    }
    */
}
