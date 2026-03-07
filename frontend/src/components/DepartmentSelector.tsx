import React from 'react';
import { type Department } from '../types';
import { Building2, Home } from 'lucide-react';

interface Props {
  selected: Department;
  onChange: (department: Department) => void;
}

export const DepartmentSelector: React.FC<Props> = ({ selected, onChange }) => {
  const departments: { value: Department; label: string; icon: React.ReactNode }[] = [
    {
      value: 'ILLAM',
      label: 'ILLAM',
      icon: <Home className="w-4 h-4" />
    },
    {
      value: 'AMBALAM',
      label: 'AMBALAM',
      icon: <Building2 className="w-4 h-4" />
    }
  ];

  return (
    <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
      {departments.map((dept) => (
        <button
          key={dept.value}
          onClick={() => onChange(dept.value)}
          className={`
            flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all
            ${selected === dept.value
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
            }
          `}
        >
          {dept.icon}
          <span>{dept.label}</span>
        </button>
      ))}
    </div>
  );
};