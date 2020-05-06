import { User } from './User';

export interface Project {
    id?: string,
    projectName: string,
    startDate: any,
    location: string,
    assignedUsers?: User[],
    isComplete?: boolean,
    budget?: number,
    estimeCost?: number,
    estimeTime?: Date,
    description?: string,
}
