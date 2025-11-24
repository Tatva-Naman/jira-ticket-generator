export enum SubTaskType {
    FE = "FE",
    BE = "BE",
    Both = "Both",
}

export interface Story {
    id: number;
    text: string;
    type: SubTaskType;
    story_point?: number | 0;   
  }

export interface PreviewItem {
    summary: string;
    exist: boolean;
}