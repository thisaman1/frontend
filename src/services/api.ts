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
    
    updateProfile: async (data: FormData, options:any) => {
        const response = await apiClient.post(`/users/update`, data, options);
        return response.data;
    },

    getCurrentUser: async () => {
        const response = await apiClient.get('/users/get-current-user');
        return response.data;
    },

    updateAvatar: async (data: FormData, options: any) => {
        const response = await apiClient.post('/users/avatar', data, options);
        // console.log(response);
        return response.data;
    },

    updateCover: async (data: FormData, options: any) => {
        const response = await apiClient.post('/users/coverimage', data, options);
        return response.data;
    },

    

    login: async (email: string, password: string) => {
        const response = await apiClient.post('/users/login', { email, password });
        return response.data;
    },

    register: async(formdata: FormData,options:any) => {
        console.log(formdata);
        console.log(options);
        const response = await apiClient.post('/users/register', formdata, options);
        console.log(response);
        return response.data;
    }
}

export const videoApi = {
    getVideoById: async (videoId:string) => {
        const response = await apiClient.get(`/videos/video/${videoId}`);
        return response.data;
    },

    getVideos: async (params:any) => {
        // console.log(params);
        const response = await apiClient.get('/videos/', {params});
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
    },

    toggleCommentLike: async (commentId:string) => {
        const response = await apiClient.get(`/likes/c/${commentId}`);
        return response.data;
    },

    getAllLikedVideos: async () => {
        const response = await apiClient.get('/likes/');
        return response.data;
    }
}






