
import { ProjectItem } from "@/model/Member";
import { TaskItem } from "@/model/Project";

export interface MatchedUserInterface {
    _id: string;
    username: string;
};
// we are standardising the API response format
// for all API responses 
// as we are considering future => messages bhi store krenge for dashboard of user

export interface ApiResponse {
    success: boolean;
    message: string;
    projects?: Array<ProjectItem>;
    tasks?: Array<TaskItem>;
    task?: TaskItem;
    description?: string;
    matchedUsers?: MatchedUserInterface[];
}