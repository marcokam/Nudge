import React from "react";
import { apiStates } from "@nudge/client-sdk/Util/apiUtils";

export default function TeamSelector({ apiState = apiStates.error, teams = [], NoTeams = () => null, selectedTeam = "", onSelectTeam }) {
    return (
        <div className="f7 flex items-center">
            {apiState === apiStates.fetching ? (
                <select className="f7 mw5 bg-white pa1 outline-0" disabled>
                    <option>Loading Teams...</option>
                </select>
            ) : teams.length === 0 ? (
                <NoTeams />
            ) : (
                <select className="f7 mw5 bg-white pa1 outline-0" onChange={onSelectTeam} value={selectedTeam}>
                    {teams.map(t => (
                        <option key={t.uri} value={t.uri}>
                            {t.teamName}
                        </option>
                    ))}
                </select>
            )}
        </div>
    );
}
