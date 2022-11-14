import React from "react";
import config from '../../config.json'
import { DisintComment } from "../../models/DisintComment";
import { CommentStandard } from "./CommentStandard";
import { Link } from "react-router-dom";
import { commentQueryService } from "../../services/comments/CommentQueryService"
import { CommentQuery } from "../../models/CommentQuery";
import { CommentBrief } from "./CommentBrief";
import './CommentNavigator.css'
import { IonAvatar, IonItem, IonLabel, IonList } from "@ionic/react";
import { LazyAvatar } from "../users/LazyAvatar";
import { PopoverButton } from "../shared/PopoverButton";
import { DragDropContext, Draggable, DraggableProvided, DraggableRubric, DraggableStateSnapshot, Droppable } from 'react-beautiful-dnd';
import { selectionService } from "../../services/SelectionService";

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
    _parentComment: DisintComment<any>;
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

    commentComponent(comment: DisintComment<any>) {

        if (this.props.component == "CommentStandard") {
            return <CommentStandard comment={comment}></CommentStandard>
        } else if (this.props.component == "CommentBrief") {
            return <CommentBrief comment={comment}></CommentBrief>
        } else {
            return null;
        }
    }

    /*
        cloneOfDomNode - If this is non-null, it means this is the dragged
        node that a user sees when they are dragging an item.  So, for example, this could also display the number of
        items being dragged (i.e. +7 more) somewhere on the element, or customize it a certain way like making the
        rendering more effecient so it doesn't have to new up a complicated comment right off the bat
    */
    outerCommentComponent(c: DisintComment<any>, provided: DraggableProvided, cloneOfDomNode: any = null): JSX.Element {
        return <IonItem id={provided.draggableProps["data-rbd-draggable-id"]} button style={{ marginBottom: '10px', left: '0px!important' }} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
            <LazyAvatar userId={c.userId}>

            </LazyAvatar>
            <Link className="nostyle" to={"/comments/" + c.id} key={c.id} style={{ display: 'flex', flex: 'auto' }}>
                {this.commentComponent(c)}
                <div style={{ marginBottom: '10px' }}></div>
            </Link>
            <span style={{ marginBottom: 'auto' }}>
                <PopoverButton>
                </PopoverButton>
            </span>

        </IonItem>
    }

    getCloneCommentComponent(domId: string, provided: DraggableProvided): JSX.Element {
        if (!domId) return null as any;
        const commentId = domId.split(selectionService.separator).last();
        if (!commentId) return null as any;
        const comment = this.state.comments.filter(c => c.id == commentId).last();
        if (!comment) return null as any;
        const node = document.querySelector(`#${domId}`);
        return this.outerCommentComponent(comment, provided, node);
    }

    async reloadCommentsIfQueryChanged() {
        //console.log("CommentNavigator", this.props.query)
        if (!this._lastUsedQuery) return;

        const isSameQuery = await this._lastUsedQuery.isEqual(this.props.query);

        if (!isSameQuery) {
            await this.loadComments();
        }
    }

    render() {
        this.reloadCommentsIfQueryChanged();

        let comments = this.state.comments?.map((c: DisintComment<any>, index: number) => {
            return (
                <Draggable draggableId={this.props.id + selectionService.separator + c.id} index={index} key={c.id} >
                    {(provided, snapshot) => this.outerCommentComponent(c, provided)}
                </Draggable>
            )
        })

        return (
            <Droppable droppableId={this.props.id} isCombineEnabled
                renderClone={(provided, snapshot, rubric) => selectionService.getOuterClone(this.getCloneCommentComponent.bind(this), provided, snapshot, rubric)}
            >
                {(provided, snapshot) => (
                    <IonList id={this.props.id}>
                        <div ref={provided.innerRef} {...provided.droppableProps}>
                            {comments}
                        </div>
                        <div style={{ display: 'none' }}>
                            {provided.placeholder}
                        </div>

                    </IonList>
                )}
            </Droppable>
        )

    }
}
