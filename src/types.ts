export enum SubTaskType {
    FE = "FE",
    BE = "BE",
    Both = "Both",
}

export interface Story {
    id: number;
    text: string;
    type: SubTaskType;
}

export interface PreviewItem {
    summary: string;
    exist: boolean;
}