import React from "react";
import { DisintComment } from "../models/DisintComment";
import "./CommentStandard.css"
import { MarkdownController } from "./markdown/MarkdownController";
import { MarkdownEditor } from "./markdown/MarkdownEditor";

export class CommentStandard extends React.Component<{ comment: DisintComment<any> }> {
  markdownController: MarkdownController = new MarkdownController();
  

  render() {

    return <div className="comment-hover" >
      <p>
        id: {this.props.comment.id}
      </p>
      <p>
        tip: {this.props.comment.tipCid.toString()}
      </p>
      <p>
        cid: {this.props.comment.cid}
      </p>
      <MarkdownEditor markdown={this.props.comment.content} onMarkdownControllerChange={(_) => this.markdownController = _}></MarkdownEditor>
      <pre>
        content: {JSON.stringify(this.props.comment.content, null, 2)}
      </pre>
      {this.props.comment.allCommitIds.map((commitId: any, i: any) => {
        return <p key={commitId.toString()}>
          commit {i}: {commitId.toString()}
        </p>
      })}
      {this.props.comment.controllers.map((c: any, i: number) => {
        return <p key={c}>
          controller {i}: {c}
        </p>
      })}
      <p>
        commit id: {this.props.comment.commitId.toString()}
      </p>
      <pre>
        meta: {JSON.stringify(this.props.comment.metadata, null, 2)}
      </pre>
      <pre>
        state: {JSON.stringify(this.props.comment.id, null, 2)}
      </pre>
    </div>
  }
} 
