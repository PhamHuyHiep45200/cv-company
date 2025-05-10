'use client'
import React from 'react';
import { format } from 'date-fns';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import CloseIcon from '@mui/icons-material/Close';

interface JobPost {
  id: string;
  title: string;
  description: string;
  requirements: string;
  benefits: string;
  salary: string;
  location: string;
  experience: string;
  deadline: string;
  status: string;
  category: {
    id: string;
    name: string;
  };
  level: {
    id: string;
    name: string;
  };
  posted_by: {
    id: string;
    name: string;
  };
  created_at: string;
  updated_at: string;
}

interface JobPostPreviewProps {
  jobPost: JobPost;
  onClose: () => void;
}

export default function JobPostPreview({ jobPost, onClose }: JobPostPreviewProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center">
            <WorkOutlineIcon className="text-blue-600 mr-2" style={{ fontSize: '1.5rem' }} />
            <h2 className="text-xl font-bold text-gray-800">Job Post Preview</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">{jobPost.title}</h1>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="text-sm font-medium text-gray-500">Category</h2>
              <p className="mt-1">{jobPost.category.name}</p>
            </div>
            <div>
              <h2 className="text-sm font-medium text-gray-500">Level</h2>
              <p className="mt-1">{jobPost.level.name}</p>
            </div>
            <div>
              <h2 className="text-sm font-medium text-gray-500">Salary</h2>
              <p className="mt-1">{jobPost.salary} VND</p>
            </div>
            <div>
              <h2 className="text-sm font-medium text-gray-500">Experience</h2>
              <p className="mt-1">{jobPost.experience} years</p>
            </div>
            <div>
              <h2 className="text-sm font-medium text-gray-500">Location</h2>
              <p className="mt-1">{jobPost.location}</p>
            </div>
            <div>
              <h2 className="text-sm font-medium text-gray-500">Deadline</h2>
              <p className="mt-1">{format(new Date(jobPost.deadline), 'dd/MM/yyyy')}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-2">Description</h2>
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: jobPost.description }} />
            </div>

            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-2">Requirements</h2>
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: jobPost.requirements }} />
            </div>

            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-2">Benefits</h2>
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: jobPost.benefits }} />
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
              <div>
                <p>Posted by: {jobPost.posted_by.name}</p>
                <p>Created: {format(new Date(jobPost.created_at), 'dd/MM/yyyy HH:mm')}</p>
              </div>
              <div className="text-right">
                <p>Status: <span className={`font-medium ${jobPost.status === 'OPEN' ? 'text-green-600' : 'text-red-600'}`}>{jobPost.status}</span></p>
                <p>Last updated: {format(new Date(jobPost.updated_at), 'dd/MM/yyyy HH:mm')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 