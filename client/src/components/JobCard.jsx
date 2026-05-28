import React, { useState } from 'react';
import { MapPin, Calendar, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';

const JobCard = ({ job }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-surface border border-border rounded-xl p-5 hover:border-primary/50 transition-colors duration-300 shadow-lg flex flex-col gap-3">
      <div className="flex justify-between items-start gap-4">
        <div>
          <h3 className="text-lg font-bold text-text-primary transition-colors line-clamp-2">
            {job.title}
          </h3>
          <p className="text-sm text-text-secondary mt-0.5">{job.company}</p>
        </div>
        {job.experience_level && (
          <span className="shrink-0 px-2 py-1 bg-surface-hover border border-border rounded text-xs font-medium text-text-secondary">
            {job.experience_level === '0' ? 'Fresher' : `${job.experience_level}+ Yrs`}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-4 text-xs text-text-secondary mt-1">
        <div className="flex items-center gap-1.5">
          <MapPin size={14} className="text-accent" />
          <span>{job.location}</span>
        </div>
        {job.posted_date && (
          <div className="flex items-center gap-1.5">
            <Calendar size={14} className="text-primary" />
            <span>{new Date(job.posted_date).toLocaleDateString()}</span>
          </div>
        )}
      </div>

      <div className="mt-2 text-sm text-text-secondary">
        <p className={expanded ? '' : 'line-clamp-2'}>
          {job.description}
        </p>
        <button 
          onClick={() => setExpanded(!expanded)} 
          className="text-primary text-xs font-semibold mt-1 flex items-center hover:underline focus:outline-none"
        >
          {expanded ? (
            <>Read Less <ChevronUp size={14} className="ml-0.5" /></>
          ) : (
            <>Read More <ChevronDown size={14} className="ml-0.5" /></>
          )}
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-border/50">
        {job.tags && job.tags.slice(0, 4).map((tag, idx) => (
          <span key={idx} className="px-2 py-1 bg-primary/10 text-primary text-[10px] uppercase tracking-wider font-semibold rounded">
            {tag}
          </span>
        ))}
      </div>

      {job.apply_url && (
        <a 
          href={job.apply_url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="mt-3 w-full py-2 bg-primary hover:bg-primary/90 text-white rounded-lg flex items-center justify-center gap-2 text-sm font-semibold transition-colors shadow-[0_0_10px_rgba(59,130,246,0.2)]"
        >
          Apply Now <ExternalLink size={16} />
        </a>
      )}
    </div>
  );
};

export default JobCard;
