/*
               <pre>
TODO: 
* https://github.com/atlassian/react-beautiful-dnd/issues/2300 set side menus to invisible to get beautiful dnd to recognize them?
* opening menus when close to sides in mobile mode
* opening or toggling accordians while dragging
* Dropping, copying, moving
* Dragging multiple
* Keyboard navigation and selecting multiple
       </pre>*/

import { BeforeCapture, DraggableProvided, DraggableRubric, DraggableStateSnapshot, DragStart, DragUpdate, DropResult, ResponderProvided } from "react-beautiful-dnd";
import { sanitize } from 'dompurify';
import './SelectionService.css'
import { isMobile } from 'react-device-detect';
import { menuController } from "@ionic/core";

export class SelectionService {
    innerClone: any;
    lastDroppableContainerId: string = "";
    lastDroppableItemId: string = "";
    separator = "_-_";
    isDragging: boolean;
    leftMenuOpen: boolean;
    rightMenuOpen: boolean;

    constructor() {
        window.addEventListener('mousemove', this.dragMoved.bind(this));
        window.addEventListener('touchmove', this.dragMoved.bind(this));
    }

    clearClass(id: string, className: string) {
        if (!id) return;
        const node = document.querySelector(`#${id}`);
        if (node) {
            node.classList.remove(className);
        }
    }

    setClass(id: string, className: string) {
        if (!id) return;
        const node = document.querySelector(`#${id}`);
        if (node) {
            node.classList.add(className);
        }
    }

    setDroppableContainerStyling(id: string) {
        if (this.lastDroppableContainerId == id) return;
        this.clearClass(this.lastDroppableContainerId, "dnd-drop-target-container");
        this.lastDroppableContainerId = id;
        this.setClass(id, "dnd-drop-target-container");
    }

    setDroppableItemStyling(id: string) {
        if (this.lastDroppableItemId == id) return;
        this.clearClass(this.lastDroppableItemId, "dnd-drop-target-item");
        this.lastDroppableItemId = id;
        this.setClass(id, "dnd-drop-target-item");
    }

    onBeforeCapture(before: BeforeCapture) {
        //console.log("onBeforeCapture", before);
    }

    onBeforeDragStart(initial: DragStart) {
        //console.log("onBeforeDragStart", initial);
    }

    onDragStart(initial: DragStart, provided: ResponderProvided) {
        //console.log("onDragStart", initial, provided);
        this.isDragging = true;
    }

    onDragUpdate(initial: DragUpdate, provided: ResponderProvided) {
        //console.log("onDragUpdate", initial, provided);
        const droppableContainerId = initial.destination?.droppableId || "";
        this.setDroppableContainerStyling(droppableContainerId);
        const droppableItemId = initial.combine?.draggableId || "";
        this.setDroppableItemStyling(droppableItemId);
    }

    onDragEnd(result: DropResult, provided: ResponderProvided) {
        this.innerClone = null;
        this.isDragging = false;
        this.setDroppableContainerStyling("");
        this.setDroppableItemStyling("");
        //console.log("onDragEnd", result, provided);
    };

    getInnerClone(domId: string, provided: DraggableProvided, componentFunc: (domId: string, provided: DraggableProvided) => JSX.Element) {
        const notFound = <div className="dnd-inner-clone">Not Found</div>;
        if (!componentFunc) { // Approach 1: clone the HTML node.  Do we need to sanitize?  If so, it ruins the styling
            const domNode = domId ? document.querySelector(`#${domId}`) : null;
            if (!domNode) {
                return notFound;
            } else {
                const sanitizedHtml = sanitize(domNode.outerHTML);
                return <div className="dnd-inner-clone" dangerouslySetInnerHTML={{ __html: sanitizedHtml }}></div>;
            }
        } else { // Aproach 2: just new up a component using the function passed in, and leave the rendering up to the caller
            return <div className="dnd-inner-clone">{componentFunc(domId, provided) || notFound}</div>
        }
    }

    getOuterClone(componentFunc: (domId: string, provided: DraggableProvided) => JSX.Element, provided: DraggableProvided, snapshot: DraggableStateSnapshot, rubric: DraggableRubric) {
        if (!this.innerClone) {
            this.innerClone = this.getInnerClone(rubric.draggableId, provided, componentFunc);
        }

        return <div className="dnd-outer-clone"
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
        >
            {this.innerClone}
        </div>
    }

    getCoordinates(e: any): { x: any, y: any } {
        let x, y;
        if (e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend' || e.type == 'touchcancel') {
            let evt = (typeof e.originalEvent === 'undefined') ? e : e.originalEvent;
            let touch = evt.touches[0] || evt.changedTouches[0];
            x = touch.pageX;
            y = touch.pageY;
        } else if (e.type == 'mousedown' || e.type == 'mouseup' || e.type == 'mousemove' || e.type == 'mouseover' || e.type == 'mouseout' || e.type == 'mouseenter' || e.type == 'mouseleave') {
            x = e.clientX;
            y = e.clientY;
        }
        return { x, y };
    }

    public dragMoved(event: any) {
        if (!this.isDragging) return;

        let { x, y } = this.getCoordinates(event);

        let el = document.elementFromPoint(x, y);

        //console.log(event.pointerPosition.x, event.pointerPosition.y, window.screen.width);

        // react beautiful dnd takes care of this for us.  if that goes away, uncomment the line below.
        //this.scrollParent(el, x, y);

        console.log(x, y);
        if (el?.nodeName == "ION-MENU") {
            if (isMobile) {
                this.openMenu(false, 'start');
                this.openMenu(false, 'end');
            }
        } else if (x < 30) {
            this.openMenu(true, 'start');
        } else if (x > (window.screen.width - 30)) {
            this.openMenu(true, 'end');
        }
    }

    scrollParent(element: any, x: any, y: any) {
        let container = this.getScrollParent(element);
        if (container) {
            const targetRect = container.getBoundingClientRect();
            const oneFifth = targetRect.height / 5;

            if (y - targetRect.top < oneFifth) {
                container.scrollTop -= 10;
                //console.log('scroll up');
            } else if (y - targetRect.top > 4 * oneFifth) {
                container.scrollTop += 10;
                //console.log('scroll down');
            }

        }
    }

    getScrollParent(element: any) {
        let ionContent = element?.closest('ion-content');
        let mainEl = ionContent?.shadowRoot?.querySelector('.inner-scroll');
        //console.log(mainEl);
        return mainEl;
    }

    /* these functions are crutches because menuController doesn't seem to work in react? */
    menuController_isOpen(side: string) {
        let ionMenuEl = document.querySelector(`ion-menu[side='${side}']`) as any;
        return ionMenuEl.style.display && ionMenuEl.style.display != 'none';
    }

    menuController_open(side: string) {
        if (!this.menuController_isOpen(side)) {
            let b = document.querySelector(`ion-menu-button[menu='${side}']`);
            (b as any)?.click();
        }
    }

    menuController_close(side: string) {
        if (this.menuController_isOpen(side)) {
            let b = document.querySelector(`ion-menu-button[menu='${side}']`);
            (b as any)?.click();
        }
    }

    openMenu(open: boolean, side: string) {
        console.log("open left menu", open);
        if (open) {
            this.menuController_open(side);
        } else {
            this.menuController_close(side);
        }
    }

    async openLeftMenu(open: boolean) {
        console.log("open left menu", open);
        if (open) {
            this.menuController_open('start');
        } else {
            this.menuController_close('start');
        }
        setTimeout(async () => this.leftMenuOpen = this.menuController_isOpen('start'), 1000);
    }

    async toggleLeftMenu() {
        menuController.toggle('start');
        setTimeout(async () => this.leftMenuOpen = await menuController.isOpen('start'), 1000);
    }

    async openRightMenu(open: boolean) {
        let isDesktop = !isMobile;
        let mobileAction = open ? () => menuController.open('end') : () => menuController.close('end');
        let action = isDesktop ? () => menuController.enable(open, 'end') : mobileAction;
        let enabled = await menuController.isEnabled('end');

        if (!isDesktop && !enabled) {
            menuController.enable(true, 'end'); // user switched from desktop to mobile
        }

        this.rightMenuOpen = open;

        action();
    }

    async toggleRightMenu() {
        let isDesktop = !isMobile;

        let enabled = await menuController.isEnabled('end');
        let open = isDesktop ? enabled : await menuController.isOpen('end');

        this.openRightMenu(!open);

        //console.log('enabled', await this.menuController.isEnabled('end'));
        //console.log('open', await this.menuController.isOpen('end'));
    }

}

export const selectionService = new SelectionService();