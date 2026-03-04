import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppShell } from '../components/Layout/AppShell';
import { Spinner, Alert } from '../components/common/Button';
import { AuthGuard } from '../components/Auth/AuthGuard';
import apiClient from '../lib/apiClient';

export function SubjectOverview() {
  return (
    <AuthGuard>
      <SubjectOverviewContent />
    </AuthGuard>
  );
}

function SubjectOverviewContent() {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFirstVideo = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/subjects/${subjectId}/first-video`);
        const { video_id } = response.data.data;
        
        if (video_id) {
          navigate(`/subjects/${subjectId}/video/${video_id}`, { replace: true });
        } else {
          setError('No videos available in this subject');
        }
      } catch (err) {
        setError('Failed to load subject');
      } finally {
        setLoading(false);
      }
    };

    fetchFirstVideo();
  }, [subjectId, navigate]);

  return (
    <AppShell>
      <div className="flex items-center justify-center min-h-[60vh]">
        {loading ? (
          <div className="text-center">
            <Spinner size="lg" />
            <p className="mt-4 text-gray-600">Loading course...</p>
          </div>
        ) : error ? (
          <Alert type="error" message={error} />
        ) : null}
      </div>
    </AppShell>
  );
}
