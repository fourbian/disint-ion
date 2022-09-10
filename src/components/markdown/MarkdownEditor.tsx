import React from 'react';
import { Editor, rootCtx, defaultValueCtx, editorViewCtx, serializerCtx, parserCtx } from '@milkdown/core';
import { nord } from '@milkdown/theme-nord';
import { ReactEditor, useEditor } from '@milkdown/react';
import { commonmark } from '@milkdown/preset-commonmark';
import { history } from '@milkdown/plugin-history';
import { clipboard } from '@milkdown/plugin-clipboard';
import { slash } from '@milkdown/plugin-slash';
import { menu } from '@milkdown/plugin-menu';
import { listener, listenerCtx } from '@milkdown/plugin-listener';

import './MarkdownEditor.css'
import { MarkdownController } from './MarkdownController';

//  more at https://programming.vip/docs/milkdown-editor-integration-guide.html
// binary at /usr/local/lib/node_modules/@ceramicnetwork/cli/node_modules/go-ipfs/bin/ipfs
export const MarkdownEditor: React.FC<{ onMarkdownControllerChange: (markdownController: MarkdownController) => void, markdown: string }> = (props) => {
    //let editor: Editor;
    let [changingInternally, setChangingInternally] = React.useState(false);
    let [markdownController, setMarkdownController] = React.useState<MarkdownController>(null as any);

    React.useEffect(() => {
        if (!changingInternally) {
            setTimeout(() => markdownController?.setMarkdown(''), 0);
        }

        return () => { // onDestroy
            
        }
    }, [props.markdown]);

    const reactEditor = useEditor((root) => {
        console.log("useEditor()");
        let createdEditor = Editor.make()
            .config((ctx) => {
                console.log("configEditor()");
                ctx.set(rootCtx, root);
                ctx.get<any>(listenerCtx).markdownUpdated((ctx: any, markdown: string, prevMarkdown: string) => {
                    setChangingInternally(previous => true);
                    markdownController?.subject.next(markdown);
                    setChangingInternally(previous => false);
                });
            })
            .use(nord)
            .use(history)
            .use(clipboard)
            .use(listener)
            .use(slash)
            //.use(menu())
            .use(commonmark);

        if (!markdownController) {
            markdownController = new MarkdownController();
            setMarkdownController(markdownController);
        }
        markdownController?.setEditor(createdEditor);
        setTimeout(() => markdownController?.setMarkdown(props.markdown), 1000);
        props.onMarkdownControllerChange(markdownController as any);
        return createdEditor;

    });

    if (markdownController) props.onMarkdownControllerChange(markdownController);


    return <ReactEditor editor={reactEditor} />;
};