import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { forumApi } from '@/lib/api/forum';
import { queryKeys } from '@/lib/queryKeys';
import { toast } from 'sonner';

// Categories
export function useForumCategories() {
  return useQuery({
    queryKey: queryKeys.forum.categories,
    queryFn: () => forumApi.getCategories().then((res) => res.data),
  });
}

// Topics
export function useForumTopics(categorySlug: string, params: { search?: string; page?: number } = {}) {
  return useQuery({
    queryKey: [...queryKeys.forum.topics(categorySlug), params],
    queryFn: () => forumApi.getTopics(categorySlug, params).then((res) => res.data),
    enabled: !!categorySlug,
  });
}

export function useForumTopic(id: string) {
  return useQuery({
    queryKey: queryKeys.forum.topic(id),
    queryFn: () => forumApi.getTopic(id).then((res) => res.data),
    enabled: !!id,
  });
}

// Mutations
export function useCreateTopic() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { categoryId: string; title: string; content: string }) =>
      forumApi.createTopic(data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.forum.categories });
      toast.success('Téma bola úspešne vytvorená');
    },
    onError: () => {
      toast.error('Nepodarilo sa vytvoriť tému');
    },
  });
}

export function useCreatePost(topicId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { content: string }) =>
      forumApi.createPost(topicId, data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.forum.topic(topicId) });
      toast.success('Odpoveď bola pridaná');
    },
    onError: () => {
      toast.error('Nepodarilo sa pridať odpoveď');
    },
  });
}

export function useToggleLike() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId: string) =>
      forumApi.toggleLike(postId).then((res) => res.data),
    onSuccess: () => {
      // Invalidate the topic to refresh like counts
      queryClient.invalidateQueries({ queryKey: ['forumTopic'] });
    },
    onError: () => {
      toast.error('Nepodarilo sa zmeniť like');
    },
  });
}

export function useDeletePost(topicId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId: string) =>
      forumApi.deletePost(postId).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.forum.topic(topicId) });
      toast.success('Príspevok bol zmazaný');
    },
    onError: () => {
      toast.error('Nepodarilo sa zmazať príspevok');
    },
  });
}
