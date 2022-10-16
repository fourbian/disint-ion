import { Editor, rootCtx, defaultValueCtx, editorViewCtx, serializerCtx, parserCtx, editorViewOptionsCtx } from '@milkdown/core';
import { Slice } from "prosemirror-model";
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

export class MarkdownController {
    public subject = new BehaviorSubject<string>("");
    constructor(private editor: Editor | null = null) {
        // constructor has to be intentionally light because it may get instantiated several times by react's renderer
    }

    setEditor(editor: Editor | null) {
        this.editor = editor;
    }

    getMarkdown(): string {
        return this.editor?.action((ctx) => {
            const editorView = ctx.get(editorViewCtx);
            const serializer = ctx.get(serializerCtx);
            return serializer(editorView.state?.doc);
        }) || "";
    }

    setReadonly(readonly: boolean) {
        const editable = () => !readonly;
        this.editor?.config((ctx) => {
            ctx.set(editorViewOptionsCtx, { editable });
        });
    }

    setMarkdown(markdown: string, fallbackEditor: Editor | null = null) {
        this.editor = this.editor || fallbackEditor;
        this.editor?.action((ctx) => {

            const view = ctx.get(editorViewCtx);
            const parser = ctx.get(parserCtx);
            const doc = parser(markdown);
            if (!doc) return;
            const state = view.state;
            view.dispatch(
                state.tr.replace(
                    0,
                    state.doc.content.size,
                    new Slice(doc.content, 0, 0)
                )
            );
        });
    }

    clear() {
        this.setMarkdown("");
    }

    $input(): Observable<string> {
        return this.subject as Observable<string>;
    }

}