import React from "react";
import { DisintComment } from "../../models/DisintComment";
import { commentQueryService } from "../../services/comments/CommentQueryService"
import { CommentQuery } from "../../models/CommentQuery";
import './CommentNavigator.css'
import { IonList } from "@ionic/react";
import {
    rectSortingStrategy,
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CommentNavigatorItem } from "./CommentNavigatorItem";
import { SortableItem } from "../test/SortableItem";
import { DragOverlay } from "@dnd-kit/core";
import { DraggableItem, selectionService } from "../../services/dnd/SelectionService";
import { Droppable } from "../../services/dnd/Droppable";
import { createPortal } from "react-dom";

const customRedraw = () => null;

interface CommentOrDroppable {
    comment?: DisintComment<any>;
    domId: string;
}

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

    async componentWillUnmount() {

    }

    onDragUpdate(comments: DraggableItem[]): boolean {
        this.setState({ comments: comments as any });
        return true;
    }

    async loadComments() {
        if (this._loading) return
        this._loading = true;

        this._lastUsedQuery = this.props.query;
        const comments = await commentQueryService.query(this.props.query);

        this.setState({ comments });

        selectionService.registerContainer(this.props.id, comments, this.onDragUpdate.bind(this));

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
        // HACK: this should probably be encapsulated by selection service somehow, but dnd kit does not update
        // the active domId while an item has been dragged to a new list.  So, we need to tell the comment when
        // it is redrawn in that list to use the same domId that dnd kit is using internally, so that dnd kit
        // knows how to find the currently dragged item in the new container.
        const overrideDomId = (comment as any)._dragDomId;

        const domId = this.props.id + selectionService.separator + comment.id;
        return overrideDomId || domId;
    }

    domIdsForComments() {
        return
    }

    commentsAndDroppables(): CommentOrDroppable[] {
        const comments = this.state?.comments || [];
        const sep = "____"; // TODO: make this avail via selection service
        if (!comments.length) {
            return [];
        }

        const commentsAndDroppables: CommentOrDroppable[] = [
            //{ domId: sep + this.domId(comments[0]) }
        ];

        let lastDomId = "";

        for (const comment of comments) {
            const domId = this.domId(comment);

            commentsAndDroppables.push({ domId: lastDomId + sep + domId });
            commentsAndDroppables.push({ domId: domId, comment: comment })

            lastDomId = domId;
        }

        return commentsAndDroppables;
    }

    /*render() {
        return <MultipleContainers vertical={true} id={this.props.id}></MultipleContainers>
    }*/

    render() {
        this.reloadCommentsIfQueryChanged();
        const commentsAndDroppables = this.commentsAndDroppables();

        return (
            <div>
                {/*<SortableContext
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
        */}
                <SortableContext items={commentsAndDroppables.map(c => c.domId)} strategy={customRedraw}>
                    {commentsAndDroppables.map((c, index) => {
                        if (c.comment) {
                            return <CommentNavigatorItem key={c.domId} overlay={true} domId={c.domId} containerId={this.props.id} comment={c.comment} component={this.props.component}></CommentNavigatorItem>
                        } else {
                            return <Droppable key={c.domId} id={c.domId}>
                                <div id={c.domId} style={{ width: '100%', height: '5px' }}>

                                </div>
                            </Droppable>
                        }
                    })}
                </SortableContext>

            </div>
        )

    }

}
