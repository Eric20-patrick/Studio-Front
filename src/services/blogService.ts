import { BlogPost } from '@/types';
import { mockBlogPosts } from '@/mock/blogPosts';

export async function getBlogPosts(): Promise<BlogPost[]> {
  return Promise.resolve(mockBlogPosts);
}
