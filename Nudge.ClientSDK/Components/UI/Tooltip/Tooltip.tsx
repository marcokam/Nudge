import React, { useRef, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { numCompareByDir } from "~/Util/sortUtils";
import { Compare } from "~/Util/fp/Instances/Compare";

interface TooltipProps {
    parent: Element | null;
    targetSelector: string;
    hide: () => void;
    className?: string;
    bounds?: Partial<ClientRect>;
}

export const Tooltip: React.FunctionComponent<TooltipProps> = ({ children, parent, targetSelector, hide, className = "", ...restProps }) => {
    const [target, setTarget] = useState();
    const [selfBounds, setSelfBounds] = useState({ width: 0 });

    // focus when shown
    const portalRef = useRef(null);
    useEffect(() => {
        const el = portalRef.current;
        const target = document.querySelector(targetSelector);
        if (!el || !target) return;
        (el as HTMLElement).focus();
        const bounds = (el as HTMLElement).getBoundingClientRect();
        setSelfBounds(bounds);
        setTarget(target);

        const onClick = (event: Event) => {
            if (!(event.target as Element).closest(`div.NudgeTooltip`)) {
                hide();
            }
        }
        document.addEventListener("click", onClick, { capture: true, passive: true })
        return () => {
            document.removeEventListener("click", onClick, { capture: true });
        }
    }, [hide, targetSelector]);

    // remove when any scroll events happen
    // also hide when escape is used
    useEffect(() => {
        const hideOnEscape = (event: KeyboardEvent) => {
            if (event && event.keyCode === 27) {
                hide();
            }
        }
        document.addEventListener("scroll", hide, { capture: true, once: true, passive: true });
        document.addEventListener("keyup", hideOnEscape, { capture: true, passive: true });
        return () => {
            document.removeEventListener("scroll", hide, { capture: true });
            document.removeEventListener("keyup", hideOnEscape, { capture: true });
        };
    }, [hide]);

    const allClassNames = `NudgeTooltip fixed border-box ${className}`;

    /**
     * We have the bounds of a parent and target element.  We want to calculate the best placement for this tooltip by calculating
     *   which direction has the most room between the bounds of the target and the parent.
     */
    const parentNode = parent ? parent : document.body;
    const parentBounds = parentNode && parentNode.getBoundingClientRect() || { top: 0, left: 0, right: Infinity, bottom: Infinity };
    const bounds = target && target.getBoundingClientRect();
    const leftSpace = bounds && (bounds.left - parentBounds.left);
    const rightSpace = bounds && (parentBounds.right - bounds.right);
    const byValue = Compare.of(numCompareByDir(false))
        .contramap<[string, number]>(([_, s]) => s);
    const bestX = ([["left", leftSpace], ["right", rightSpace]] as [string, number][])
        .sort(byValue.run)
        .map(([dir]) => dir)
        .shift();
    const topSpace = bounds && (bounds.top - parentBounds.top);
    const bottomSpace = bounds && (parentBounds.bottom - bounds.bottom);
    const bestY = ([["top", topSpace], ["bottom", bottomSpace]] as [string, number][])
        .sort(byValue.run)
        .map(([dir]) => dir)
        .shift();
    const portalChildren = (
        <div
            ref={portalRef}
            tabIndex={0}
            // onBlur={hide}
            className={allClassNames}
            style={{
                opacity: selfBounds.width === 0 ? 0 : 1,
                top: (bestY === "top" || !bounds) ? "auto" : bounds.top,
                bottom: (bestY === "top" && bounds) ? window.innerHeight - bounds.bottom : "auto",
                left: (bestX === "left" || !bounds) ? "auto" : bounds.right,
                right: (bestX === "left" && bounds) ? window.innerWidth - bounds.left : "auto",
            }}
            {...restProps}
        >
            {children}
        </div>
    );

    return ReactDOM.createPortal(portalChildren, document.body);
};