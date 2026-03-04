import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSidebarStore } from '../../store/sidebarStore';
import { SectionItem } from './SectionItem';
import { Spinner } from '../common/Button';

export function SubjectSidebar({ currentVideoId }) {
  const { subjectId } = useParams();
  const { tree, loading, error, fetchTree } = useSidebarStore();

  useEffect(() => {
    if (subjectId) {
      fetchTree(subjectId);
    }
  }, [subjectId, fetchTree]);

  if (loading) {
    return (
      <div className="p-4 flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-600">
        Failed to load course content
      </div>
    );
  }

  if (!tree) {
    return null;
  }

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        {tree.title}
      </h2>
      <div className="space-y-2">
        {tree.sections.map((section) => (
          <SectionItem
            key={section.id}
            section={section}
            currentVideoId={currentVideoId}
            subjectId={subjectId}
          />
        ))}
      </div>
    </div>
  );
}
