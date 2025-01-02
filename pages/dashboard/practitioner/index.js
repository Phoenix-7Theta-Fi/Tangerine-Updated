import Link from 'next/link';

export default function PractitionerDashboard() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">
        Practitioner Dashboard
      </h1>
      
      <div className="space-y-4">
        <DashboardLink 
          href="/blog" 
          title="View Blog Posts" 
          description="Browse all published blog articles"
        />
        
        <DashboardLink 
          href="/dashboard/practitioner/create" 
          title="Create Blog Post" 
          description="Write and publish new blog articles"
        />
        
        <DashboardLink 
          href="/ai-chat" 
          title="AI Wellness Assistant" 
          description="Interact with AI for wellness insights"
        />
      </div>
    </div>
  );
}

function DashboardLink({ href, title, description }) {
  return (
    <Link 
      href={href} 
      className="block p-4 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-900 dark:text-white"
    >
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </Link>
  );
}