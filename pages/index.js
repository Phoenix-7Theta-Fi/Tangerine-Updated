import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-900 dark:text-white">
        Tangerine Wellness Platform
      </h1>
      
      <div className="grid md:grid-cols-2 gap-6 max-w-2xl w-full">
        <DashboardCard 
          href="/dashboard/practitioner"
          title="Practitioner Portal"
          description="Access blog management, AI tools, and professional resources"
          icon="🩺"
        />
        
        <DashboardCard 
          href="/dashboard/user"
          title="User Portal"
          description="Read blogs, get wellness advice, and explore Ayurvedic insights"
          icon="🌿"
        />
      </div>
    </div>
  );
}

function DashboardCard({ href, title, description, icon }) {
  return (
    <Link 
      href={href} 
      className="block p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all text-gray-900 dark:text-white"
    >
      <div className="text-4xl mb-4">{icon}</div>
      <h2 className="text-2xl font-semibold mb-2">{title}</h2>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </Link>
  );
}
