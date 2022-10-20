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

class CommentNavigatorProps {
    query: CommentQuery;
    ref: any;
    component: string;
}

class CommentNavigatorState {
    comments: DisintComment<any>[] = [];
}

export class CommentNavigator extends React.Component<CommentNavigatorProps, CommentNavigatorState> {
    _parentComment: DisintComment<any>;
    _loading = false;
    _lastUsedQuery: CommentQuery;

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

    async reloadCommentsIfQueryChanged() {
        if (!this._lastUsedQuery) return;

        const isSameQuery = await this._lastUsedQuery.isEqual(this.props.query);

        if (!isSameQuery) {
            await this.loadComments();
        }
    }

    render() {
        this.reloadCommentsIfQueryChanged();

        let comments = this.state.comments?.map((c: DisintComment<any>) => {
            return <IonItem button key={c.id} style={{ marginBottom: '10px' }}>
                <LazyAvatar userId={c.userId}>

                </LazyAvatar>
                <Link className="nostyle" to={"/comments/" + c.id} key={c.id}>
                    {this.commentComponent(c)}
                    <div style={{ marginBottom: '10px' }}></div>
                </Link>

            </IonItem>
            // return <div key={c.id}>
            //     {this.commentComponent(c)}
            // </div>
        })

        return <div>
            <h3 className="nostyle">
                Comments
            </h3>
            <IonList>
                {comments}
            </IonList>
        </div>

    }
}
