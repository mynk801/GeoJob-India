import React, { useState } from 'react';

const TECH_STACKS = ['Java', 'C++', 'MERN', 'Python', 'React', 'Node.js', 'AWS'];
const ROLE_TYPES = ['Software Engineer', 'Full-Stack', 'Frontend', 'Backend', 'Data Scientist'];

const FilterPanel = ({ onFilterChange }) => {
  const [selectedTechs, setSelectedTechs] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [experience, setExperience] = useState(0);
  const [sort, setSort] = useState('newest');

  const handleTechChange = (tech) => {
    const updated = selectedTechs.includes(tech)
      ? selectedTechs.filter(t => t !== tech)
      : [...selectedTechs, tech];
    setSelectedTechs(updated);
    onFilterChange({ tech: updated, roles: selectedRoles, experience, sort });
  };

  const handleRoleChange = (role) => {
    const updated = selectedRoles.includes(role)
      ? selectedRoles.filter(r => r !== role)
      : [...selectedRoles, role];
    setSelectedRoles(updated);
    onFilterChange({ tech: selectedTechs, roles: updated, experience, sort });
  };

  const handleExperienceChange = (e) => {
    const val = e.target.value;
    setExperience(val);
    onFilterChange({ tech: selectedTechs, roles: selectedRoles, experience: val, sort });
  };

  const handleSortChange = (e) => {
    const val = e.target.value;
    setSort(val);
    onFilterChange({ tech: selectedTechs, roles: selectedRoles, experience, sort: val });
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-6 shadow-lg w-full max-w-sm flex flex-col gap-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold text-text-primary mb-1">Filters</h2>
          <p className="text-sm text-text-secondary">Refine your job search</p>
        </div>
        <select 
          value={sort} 
          onChange={handleSortChange}
          className="bg-background border border-border text-text-primary text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-primary transition-colors cursor-pointer"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      {/* Tech Stack */}
      <div>
        <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-3">Tech Stack</h3>
        <div className="flex flex-wrap gap-2">
          {TECH_STACKS.map(tech => (
            <label
              key={tech}
              className={`cursor-pointer px-3 py-1.5 rounded-full border text-sm transition-all duration-200 ${
                selectedTechs.includes(tech)
                  ? 'bg-primary/20 border-primary text-primary shadow-[0_0_10px_rgba(59,130,246,0.3)]'
                  : 'bg-background border-border text-text-secondary hover:border-primary/50 hover:text-text-primary'
              }`}
            >
              <input
                type="checkbox"
                className="hidden"
                checked={selectedTechs.includes(tech)}
                onChange={() => handleTechChange(tech)}
              />
              {tech}
            </label>
          ))}
        </div>
      </div>

      {/* Role Type */}
      <div>
        <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-3">Role Type</h3>
        <div className="flex flex-col gap-2">
          {ROLE_TYPES.map(role => (
            <label key={role} className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                selectedRoles.includes(role) 
                  ? 'bg-accent border-accent' 
                  : 'bg-background border-border group-hover:border-accent/50'
              }`}>
                {selectedRoles.includes(role) && (
                  <svg className="w-3.5 h-3.5 text-background" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <input
                type="checkbox"
                className="hidden"
                checked={selectedRoles.includes(role)}
                onChange={() => handleRoleChange(role)}
              />
              <span className={`text-sm transition-colors ${
                selectedRoles.includes(role) ? 'text-text-primary font-medium' : 'text-text-secondary group-hover:text-text-primary'
              }`}>
                {role}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Experience Level */}
      <div>
        <div className="flex justify-between items-end mb-3">
          <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider">Experience</h3>
          <span className="text-xs text-accent font-mono bg-accent/10 px-2 py-0.5 rounded">
            {experience == 0 ? 'Fresher' : `${experience}+ Years`}
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="15"
          step="1"
          value={experience}
          onChange={handleExperienceChange}
          className="w-full h-1.5 bg-border rounded-lg appearance-none cursor-pointer accent-accent"
        />
        <div className="flex justify-between text-xs text-text-secondary mt-2">
          <span>0 (Fresher)</span>
          <span>15+</span>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
