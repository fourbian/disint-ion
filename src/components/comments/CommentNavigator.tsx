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
import { DraggableItem, selectionService } from "../../services/dnd/SelectionService";
import { Droppable } from "../../services/dnd/Droppable";
import { createPortal } from "react-dom";

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
        this.setState({comments: comments as any});
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

    /*render() {
        return <MultipleContainers vertical={true} id={this.props.id}></MultipleContainers>
    }*/

    render() {
        this.reloadCommentsIfQueryChanged();

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

                <SortableContext items={this.state.comments.map(c => this.domId(c))} strategy={verticalListSortingStrategy}>
                    <Droppable id={this.props.id}>
                        {this.state.comments?.map((c, index) => {
                            let domId = this.domId(c);
                            //let domId = index.toString();
                            //let domId = c.id;
                            //console.log("using id", domId);
                            return <CommentNavigatorItem overlay={true} domId={domId} containerId={this.props.id} key={domId} comment={c} component={this.props.component}></CommentNavigatorItem>
                        })}
                    </Droppable>
                </SortableContext>

            </div>
        )

    }

}
