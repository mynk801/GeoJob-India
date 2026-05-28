import React, { useState, useEffect } from 'react';
import FilterPanel from './components/FilterPanel';
import MapComponent from './components/MapComponent';
import JobCard from './components/JobCard';
import { fetchJobs } from './services/api';

function App() {
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState({ tech: [], roles: [], experience: 0, sort: 'newest' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadJobs = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchJobs(filters);
        setJobs(data);
      } catch (err) {
        setError('Failed to fetch jobs. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col max-w-[1600px] mx-auto">
      <header className="mb-6 md:mb-8 shrink-0">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent inline-block">
          GeoJob India
        </h1>
        <p className="text-text-secondary mt-1">Explore B.Tech CSE opportunities across India.</p>
      </header>
      
      <main className="flex flex-col lg:flex-row gap-6 md:gap-8 flex-1 min-h-0">
        <aside className="w-full lg:w-80 shrink-0">
          <FilterPanel onFilterChange={handleFilterChange} />
        </aside>
        
        <div className="flex-1 flex flex-col gap-6 min-w-0">
          <section className="h-[400px] md:h-[500px] lg:h-[60vh] shrink-0 border border-border rounded-xl overflow-hidden shadow-lg">
            <MapComponent jobs={jobs} />
          </section>

          <section className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-text-primary">
                Available Positions <span className="text-primary ml-2">({jobs.length})</span>
              </h2>
            </div>
            
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-surface h-40 rounded-xl border border-border animate-pulse"></div>
                ))}
              </div>
            ) : error ? (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl text-center">
                {error}
              </div>
            ) : jobs.length === 0 ? (
              <div className="bg-surface border border-border text-text-secondary p-12 rounded-xl text-center flex flex-col items-center justify-center gap-2">
                <svg className="w-12 h-12 text-border" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>No jobs found matching your criteria.</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {jobs.map(job => (
                  <JobCard key={job._id} job={job} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}

export default App;
