export interface CurrentUserSettings {
    conversationsDefaults?: any;
    relationshipsDefaults?: any;
    orgChartDefaults?: any;
}
export interface License {
    licenseStatus: string;
}
export interface CurrentUser {
    licenses?: License[];
}
