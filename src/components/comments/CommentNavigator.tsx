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
import { IonButton, useIonAlert } from '@ionic/react';

const customRedraw = () => null;

interface CommentOrDroppable {
    comment?: DisintComment<any>;
    domId: string;
    index: number;
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

    onDrop(comment?: DraggableItem, index?: number, isCopyOperation?: boolean): boolean {
        // TODO: next up:
        // * implement support for turning on/off order ability (i.e. dragging inbetween items vs just dropping onto a container only)
        // * multiple dnd
        // * ordering (see loadComments below)
        // * other TODO:s in this file
        // * don't show LINK button in alert if moving item to the same container
        console.log("onDrop", this.props.id, index, comment);

        //this.setState({ comments: comments as any });
        return true;
    }

    onRemove(comment?: DraggableItem): boolean {
        console.log("onRemove", this.props.id, comment);
        return true;
    }

    doesUserOwn(comment?: DraggableItem): boolean {
        console.log("doesUserOwn", this.props.id, comment);
        // TODO: if no parentId then return false
        // if user owns either containerItem (this.props.query.parentId) or draggable item
        return true;
    }

    async loadComments() {
        if (this._loading) return
        this._loading = true;

        this._lastUsedQuery = this.props.query;
        const comments = await commentQueryService.query(this.props.query);

        this.setState({ comments });

        selectionService.registerContainer({
            domId: this.props.id,
            items: comments,
            containerItemId: this.props.query.parentId,
            doesAllowOrdering: true, // TODO: don't hardcode this
            onDrop: this.onDrop.bind(this),
            onRemove: this.onRemove.bind(this),
            doesUserOwn: this.doesUserOwn.bind(this)
        });

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
        const domId = this.props.id + selectionService.separator + comment.id;
        return domId;
    }

    domIdsForComments() {
        return
    }

    commentsAndDroppables(): CommentOrDroppable[] {
        const comments = this.state?.comments || [];
        const sep = "____"; // TODO: make this avail via selection service

        const commentsAndDroppables: CommentOrDroppable[] = [];

        let lastDomId = "";
        let index = 0;

        for (const comment of comments) {
            const domId = this.domId(comment);

            commentsAndDroppables.push({ domId: lastDomId + sep + domId, index: index });
            commentsAndDroppables.push({ domId: domId, comment: comment, index: index })

            lastDomId = domId;
            index = index + 1;
        }

        const newDomId = this.domId({ id: "new" } as DisintComment<any>);
        commentsAndDroppables.push({ domId: lastDomId + sep + newDomId, index: index });

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
                            return <Droppable key={c.domId} id={c.domId} containerId={this.props.id} index={c.index}>
                                <div id={c.domId} style={{ width: '100%', height: '1px' }} >

                                </div>
                            </Droppable>
                        }
                    })}
                </SortableContext>

            </div>
        )

    }

}
