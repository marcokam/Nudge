import React, { Fragment } from "react";

export default function RoleSelector({ roles = [], NoRoles = () => null, selectedRole = "", onSelectRole, className = "" }) {
    return (
        <Fragment>
            {roles.length === 0 ? (
                <NoRoles />
            ) : (
                <select className={className} onChange={onSelectRole} value={selectedRole}>
                    <option value="">All Roles</option>
                    {roles.map(([roleUri, roleDescription]) => (
                        <option key={roleUri} value={roleUri}>
                            {roleDescription}
                        </option>
                    ))}
                </select>
            )}
        </Fragment>
    );
}
