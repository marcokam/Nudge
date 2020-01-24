import * as React from "react";
import uuid from "uuid";

import { 
    ControlInstance,
    ControlInstanceFactory,
    ComponentConstructor,
    ControlInstanceFactorySettings
} from "../ConfigUIInterfaces";
import {
    SimpleControlInstance,
    sfcAsClass
} from "../Helpers";
import LazyValue from "~/Util/LazyValue";
import registry from "~/Util/registry";
import NudgeIterable from "~/Util/NudgeIterable";
import SdkLogCategories from "~/Logging/Category/SdkLogCategories";

const logger = registry.categoryLoggers.create(SdkLogCategories.ConfigUI);

interface GetChildInstances{ 
    getChildInstances(): ControlInstance[];
}
type NestingControlInstanceFactorySettings = ControlInstanceFactorySettings & GetChildInstances;
export const simpleNestingClassFactory = (constructor: (settings: NestingControlInstanceFactorySettings) => ComponentConstructor): ControlInstanceFactory => {
    return settings => {
        let myInstance: SimpleControlInstance | null = null;
        const { controlConfiguration, controlManager, parent } = settings;
        const createChildren = () => controlConfiguration.children.map(child => controlManager.create(child, myInstance as SimpleControlInstance))
        const lazyChildInstances = new LazyValue<ControlInstance[]>(createChildren);
        const getChildInstances = () => lazyChildInstances.getValue();
        const myComponent: ComponentConstructor = constructor({ 
            ...settings, 
            getChildInstances
        });
        
        myInstance = new SimpleControlInstance(controlConfiguration, myComponent, settings.context, parent);
        return myInstance;
    }
}

export const conditionalStacked = (predicate: () => boolean) => simpleNestingClassFactory((settings: NestingControlInstanceFactorySettings): ComponentConstructor => {
    const sfc: React.SFC = () => {
        const { className } = settings.controlConfiguration.parameters;
        return (
            <div className={className || "stacked"}>
                {
                    predicate() ? settings.getChildInstances().map(child => {
                        const ChildComponent: ComponentConstructor = child.component;                    
                        return <ChildComponent key={child.key} />;
                    }) : null
                }
            </div>
        );
    };
    sfc.displayName = "Stacked";
    return sfcAsClass(sfc, settings);
});

export const Stacked: ControlInstanceFactory = conditionalStacked(() => true);

class GridViewEmptyCell extends React.Component {
    render = () => {
        return (<div className="gridView-emptyCell"></div>);
    }
}

export const GridView: ControlInstanceFactory = simpleNestingClassFactory((settings: NestingControlInstanceFactorySettings): ComponentConstructor => {
    const myKey = uuid();

    // Implictly assume that children are specified left-to-right then top-to-bottom
    const sfc: React.SFC = () => {
        
        //TODO: casting any to number, assumes values exist.
        const { parameters = {} } = settings.controlConfiguration;
        const { 
            className = "gridView",
            rowClassName = "gridView-row", 
            cellClassName = "gridView-cell"
        } = parameters;

        const rows: number = parameters.rows;
        const columns: number = parameters.columns;
        const children = settings.getChildInstances();
        const getChildComponent = (row: number, column: number): ComponentConstructor => {
            const index = ((row - 1) * columns) + (column - 1);
            if (index >= children.length) {
                return GridViewEmptyCell;
            }
            const child = children[index];
            logger.debug(`GridView: cell (${row},${column}) = index ${index}`, child)
            return child.component;
        };

        logger.debug(`rendering GridView with rows=${rows}, columns=${columns}`);
        return (            
            <div className={className} key={`gridView-${myKey}`}>
                {
                    NudgeIterable.fromRange(1, rows).map(rowNum => {   
                        logger.debug(`rendering GridView row ${rowNum}`);
                        return (<div className={rowClassName} key={`gridView-${myKey}-row-${rowNum}`}>
                            {
                                NudgeIterable.fromRange(1, columns).map(columnNum => {
                                    const ChildComponent = getChildComponent(rowNum, columnNum);
                                    return (
                                        <div className={cellClassName} key={`gridView-${myKey}-row-${rowNum}-col-${columnNum}`}>
                                            <ChildComponent />
                                        </div>
                                    );
                                }).toArray()
                            }
                        </div>);
                    }).toArray()
                }
            </div>            
        );
    };
    sfc.displayName = "GridView";
    return sfcAsClass(sfc, settings);
});