import Screen from './Screen'

export default interface SiteData {
    name: string;
    url: string;
    captured: string;
    screens: Screen[];
    meta: any | undefined;
}