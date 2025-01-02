import withAuth from '../../components/withAuth';
import Link from 'next/link';

function UserDashboard() {
  return (
    <div className="dashboard-container">
      <h1>User Dashboard</h1>
      <nav className="dashboard-nav">
        <Link href="/blog" className="nav-link">
          View Blogs
        </Link>
        <Link href="/ai-chat" className="nav-link">
          AI Chat
        </Link>
        <Link href="/profile" className="nav-link">
          My Profile
        </Link>
      </nav>

      <style jsx>{`
        .dashboard-container {
          max-width: 1200px;
          margin: 2rem auto;
          padding: 2rem;
        }
        .dashboard-nav {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-top: 2rem;
        }
        .nav-link {
          padding: 1.5rem;
          background-color: #f0f4f8;
          border-radius: 8px;
          text-align: center;
          text-decoration: none;
          color: #1a365d;
          transition: all 0.2s;
        }
        .nav-link:hover {
          background-color: #e2e8f0;
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
}

export default withAuth(UserDashboard, ['user', 'practitioner']);