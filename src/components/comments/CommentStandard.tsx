import React from "react";
import { DisintComment } from "../../models/DisintComment";
import "./CommentStandard.css"
import { MarkdownController } from "../markdown/MarkdownController";
import { MarkdownEditor } from "../markdown/MarkdownEditor";
import { commentService } from "../../services/comments/CommentService";
import { commentQueryService } from "../../services/comments/CommentQueryService";

export class CommentStandardProps {
  comment?: DisintComment<any>;
  commentId?: string;
}

export class CommentStandardState {
  constructor(state?: any) {
    if (state) {
      Object.assign(this, state);
    }
  }

  public comment: DisintComment<any>;
}

export class CommentStandard extends React.Component<CommentStandardProps, CommentStandardState> {
  loadCommentPromise: Promise<DisintComment<any>>;
  markdownController: MarkdownController = new MarkdownController();

  constructor(props: CommentStandardProps) {
    super(props);
    this.state = new CommentStandardState({ comment: this.props.comment });
  }

  loadComment() {
    if (!this.props.comment && !this.state.comment && this.props.commentId) {
      this.loadCommentPromise = this.loadCommentPromise || commentService.load(this.props.commentId)
        .then(comment => this.setState({ comment }));
    }
  }

  render() {
    this.loadComment();

    if (!this.state.comment) return null;
    else return <div className="comment-hover" >
      <p>
        id: {this.state.comment.id}
      </p>
      <p>
        tip: {this.state.comment.tipCid?.toString()}
      </p>
      <p>
        cid: {this.state.comment.cid}
      </p>
      <MarkdownEditor markdown={this.state.comment.content} onMarkdownControllerChange={(_) => this.markdownController = _}></MarkdownEditor>
      <pre>
        content: {JSON.stringify(this.state.comment.content, null, 2)}
      </pre>
      {this.state.comment.allCommitIds?.map((commitId: any, i: any) => {
        return <p key={commitId.toString()}>
          commit {i}: {commitId.toString()}
        </p>
      })}
      {this.state.comment.controllers?.map((c: any, i: number) => {
        return <p key={c}>
          controller {i}: {c}
        </p>
      })}
      <p>
        commit id: {this.state.comment.commitId?.toString()}
      </p>
      <pre>
        meta: {JSON.stringify(this.state.comment.metadata, null, 2)}
      </pre>
      <pre>
        state: {JSON.stringify(this.state.comment.id, null, 2)}
      </pre>
    </div>
  }
} 
