import React, { Fragment } from "react";

export default function JobLevelSelector({ jobLevels = [], NoLevels = () => null, selectedLevel = "", onSelectLevel, className = "" }) {
    return (
        <Fragment>
            {jobLevels.length === 0 ? (
                <NoLevels />
            ) : (
                <select className={className} onChange={onSelectLevel} value={selectedLevel}>
                    <option value="">All Levels</option>
                    {jobLevels.map(([jobLevel, jobLevelText]) => (
                        <option key={jobLevel} value={jobLevel}>
                            {jobLevelText}
                        </option>
                    ))}
                </select>
            )}
        </Fragment>
    );
}
 