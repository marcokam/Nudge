import { CurrentUser } from "~/Data/User/UserInterfaces";

declare global {
    const Nudge: {
        userDetailData: CurrentUser;
    }
}