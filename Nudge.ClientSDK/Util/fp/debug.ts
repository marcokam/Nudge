import registry from "~/Util/registry";

export const tag = (label: string) => (value: any) => (registry.logger.debug(label, value), value);