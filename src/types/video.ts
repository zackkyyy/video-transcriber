export interface Video {
  id: string;
  entityId?: string;
  userId?: string;
  saved?: boolean;
  videoUrl: string;
  thumbUrl?: string;
  videoTitle?: string;
  videoType?: string;
  createdAt: string;
  status?: string;
}
