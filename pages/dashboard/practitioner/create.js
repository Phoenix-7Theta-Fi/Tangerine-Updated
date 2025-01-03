import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { withPageAuth } from '../../../lib/withAuth';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

export default function CreateBlogPost() {
  const { data: session } = useSession();
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [useSimpleForm, setUseSimpleForm] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const newPost = {
      title,
      excerpt,
      content,
      tags: tags.split(',').map(tag => tag.trim()),
      author: session.user.name,
      date: new Date().toISOString().split('T')[0]
    };

    try {
      const response = await fetch('/api/blog/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPost),
      });

      if (response.ok) {
        router.push('/blog');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to create blog post');
      }
    } catch (error) {
      console.error('Error creating blog post:', error);
      setError('An error occurred while creating the post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ]
  };

  return (
    <div className="container mx-auto p-6 bg-white dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Create Blog Post</h1>
      
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="mb-4">
        <button
          onClick={() => setUseSimpleForm(!useSimpleForm)}
          className="text-blue-500 hover:text-blue-600"
        >
          Switch to {useSimpleForm ? 'Rich Text Editor' : 'Simple Form'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2 text-gray-700 dark:text-gray-300">Title</label>
          <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
            required 
          />
        </div>

        <div>
          <label className="block mb-2 text-gray-700 dark:text-gray-300">Excerpt</label>
          <textarea 
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="w-full p-2 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
            required 
          />
        </div>

        {useSimpleForm ? (
          <div>
            <label className="block mb-2 text-gray-700 dark:text-gray-300">Content</label>
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-2 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 min-h-[200px]"
              required 
            />
          </div>
        ) : (
          <div>
            <label className="block mb-2 text-gray-700 dark:text-gray-300">Content</label>
            <ReactQuill 
              value={content}
              onChange={setContent}
              modules={quillModules}
              className="h-64 mb-12"
              theme="snow"
            />
          </div>
        )}

        <div>
          <label className="block mb-2 text-gray-700 dark:text-gray-300">Tags (comma-separated)</label>
          <input 
            type="text" 
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full p-2 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
            placeholder="ayurveda, health, wellness"
          />
        </div>

        <button 
          type="submit" 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create Post'}
        </button>
      </form>
    </div>
  );
}

export const getServerSideProps = withPageAuth(null, ['practitioner']);