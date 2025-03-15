import { add } from 'date-fns';
import {apiClient} from './apiClient';

export const userApi= {
    getProfile: async (userId: string) => {
        const response = await apiClient.get(`/users/${userId}`);
        return response.data;
    },
    
    getChannelProfile: async (channelId: string) => {
        const response = await apiClient.get(`/users/channel/${channelId}`);
        return response.data;
    },
    
    updateProfile: async (data: any) => {
        const response = await apiClient.post(`/users/profile`, data);
        return response.data;
    },

    getCurrentUser: async () => {
        const response = await apiClient.get('/users/get-current-user');
        return response.data;
    },

    login: async (email: string, password: string) => {
        const response = await apiClient.post('/users/login', { email, password });
        return response.data;
    },

    register: async(username: string, email: string, password: string) => {
        const response = await apiClient.post('/users/register', { username, email, password });
        return response.data;
    }
}

export const videoApi = {
    getVideoById: async (videoId:string) => {
        const response = await apiClient.get(`/videos/video/${videoId}`);
        return response.data;
    },

    getVideos: async (params:any) => {
        const response = await apiClient.get('/videos/', params);
        return response.data;
    }
}

export const commentApi = {
    getVideoComments: async (parameter:any) => {
        const params = parameter.params;
        const response = await apiClient.get(`/comments/videos/${params.videoId}`);
        return response.data;
    },

    addVideoComment: async (parameter:any) => {
        const params = parameter.params;
        const response = await apiClient.post(`/comments/v/${params.videoId}`, params);
        return response.data;
    }
}

export const likeApi = {
    toggleVideoLike: async (videoId:string) => {        
        const response = await apiClient.get(`/likes/v/${videoId}`);
        return response.data;
    }
}






