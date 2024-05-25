import { ITask } from '@/model/Task';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
// import { FaLock, FaLockOpen } from "react-icons/fa"; 
import { cn } from "@/lib/utils"
import { Switch } from "@/components/ui/switch"
import { Eclipse } from 'lucide-react';
import { format } from 'date-fns';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { AnimatedTooltip, UserTooltipItem } from './animated-tooltip';
import { Label } from './label';
// import { toast } from './use-toast';


export interface TaskProps {
    taskId: string
}

const Task: React.FC<TaskProps> = ({ taskId }) => {
    const [taskData, setTaskData] = useState<ITask | null>(null);
    const [assignee, setAssignee] = useState<UserTooltipItem[]>([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    // Function to toggle lockStatus
    const toggleLockStatus = async () => {
        try {
            const taskId = taskData?._id;
            const lockStatus = taskData?.lockStatus;
            const response = await axios.post(`/api/tasks/toggle-tasklock`, { taskId, lockStatus });
            setAssignee((prevMembers) => [...prevMembers, response.data.user]);
        } catch (error) {
            setError('Error while fetching project member details');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAssignedMember = async (userId: string) => {
        try {
            const response = await axios.get(`/api/project/get-member/${userId}`);
            const newUser = response.data.user;

            setAssignee((prevAssignees) => {
                if (prevAssignees.some(member => member._id === newUser._id)) {
                    return prevAssignees;
                } else {
                    return [...prevAssignees, newUser];
                }
            });
 
        } catch (error) {
            setError('Error while fetching project member details');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTask = async () => {
        try {
            const resp = await axios.post(`/api/tasks/get-task-data`, { taskId });

            setTaskData(resp.data.task);
            await fetchAssignedMember(resp.data.task.assignedTo);
        } catch (error) {
            console.log('Error while fetching task');
        }
    }

    useEffect(() => {
        fetchTask();
    }, [fetchTask])

    return (
        <Card className={`bg-slate-900 text-slate-100 mx-6 my-7 p-3 
        rounded-tr-md rounded-bl-md rounded-br-lg ring-1 ring-slate-950 ${cn("w-[380px]")}`}
        >
            {/* ${taskData?.lockStatus === false ? '' : 'pointer-events-none'} */}
            <CardHeader>
                <CardTitle className='text-xl'>{taskData?.taskTitle}</CardTitle>
                <CardDescription className='text-slate-400 text-sm'>{taskData?.taskDescription}</CardDescription>
            </CardHeader>
            <div className="flex items-center space-x-4 rounded-md p-2 mb-1 text-sm">
                <Eclipse />
                <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                        Toggle Edit Feature
                    </p>
                </div>
                <Switch onClick={toggleLockStatus} checked={taskData?.lockStatus} />
            </div>
            <CardContent>
                <strong className='text-red-600 font-semibold'>Deadline:</strong> {taskData?.deadline ? format(new Date(taskData?.deadline), 'PPP') : 'No deadline'}
            </CardContent>
            <div className="flex flex-col space-y-1.5 bg-inherit">
                <a href={taskData?.link} target='_blank' className='cursor-pointer underline pb-1'>
                    <Label htmlFor="name">Task Link</Label>
                </a>
            </div>
            <CardFooter className='gap-1 w-fit p-0 my-1'>
                <p>Assignee</p>
                <AnimatedTooltip items={assignee} />
            </CardFooter>
        </Card>
    );
};

export default Task;


{/* <div className='flex justify-end bottom-0'>
    toggle option should be given only to admin and some users
    {
        (lockStatus === false) ?
            <FaLockOpen className='text-slate-800 text-xl cursor-pointer' onClick={toggleLockStatus} />
            :
            <FaLock className='text-slate-800 text-xl cursor-pointer' onClick={toggleLockStatus} />
    }

</div> */}