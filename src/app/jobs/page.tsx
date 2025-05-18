'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useRouter } from 'next/navigation';
import JobsAnimated from './JobsAnimated';

export default function JobsPage() {
  const searchParams = useSearchParams();
  const search = searchParams.get('search') || '';
  const locationQuery = searchParams.get('location') || '';
  const categoryQuery = searchParams.get('category') || '';
  const levelQuery = searchParams.get('level') || '';
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState<any[]>([]);
  const [levels, setLevels] = useState<any[]>([]);
  const [searchValue, setSearchValue] = useState(search);
  const [locationValue, setLocationValue] = useState(locationQuery);
  const [categoryValue, setCategoryValue] = useState(categoryQuery);
  const [levelValue, setLevelValue] = useState(levelQuery);
  const router = useRouter();
  const limit = 10;

  // Fetch categories and levels
  useEffect(() => {
    fetch('/api/categories').then(res => res.json()).then(setCategories);
    fetch('/api/levels').then(res => res.json()).then(setLevels);
  }, []);

  // Map API job to JobCardProps
  const mapJobToCard = (job: any) => ({
    badge: job.category?.name || '',
    icon: '/assets/logos/job-card-icon.svg',
    logo: job.category?.thumbnail || '/assets/logos/job-card-logo-vector1.svg',
    title: job.title,
    timePost: job.created_at ? formatDistanceToNow(new Date(job.created_at), { addSuffix: true, locale: vi }) : '',
    category: { icon: '/assets/logos/job-card-briefcase.svg', text: job.level?.name || '' },
    type: { icon: '/assets/logos/job-card-clock.svg', text: job.type || '' },
    salary: { icon: '/assets/logos/job-card-salary.svg', text: job.salary ? `${job.salary} VND` : '' },
    location: { icon: '/assets/logos/job-card-map-pin.svg', text: job.location || '' },
    onDetailsClick: () => router.push(`/jobs/${job.id}`),
  });

  // Fetch jobs with filters
  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (locationQuery) params.append('location', locationQuery);
    if (categoryQuery) params.append('category', categoryQuery);
    if (levelQuery) params.append('level', levelQuery);
    params.append('page', String(currentPage));
    params.append('limit', String(limit));
    setLoading(true);
    fetch(`/api/job-posts?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        setJobs(data.data || []);
        setTotalPages(data.pagination?.totalPages || 1);
      })
      .finally(() => setLoading(false));
  }, [search, locationQuery, categoryQuery, levelQuery, currentPage]);

  // Reset to page 1 when any filter changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [search, locationQuery, categoryQuery, levelQuery]);

  // Keep filter state in sync with query
  useEffect(() => {
    setSearchValue(search);
    setLocationValue(locationQuery);
    setCategoryValue(categoryQuery);
    setLevelValue(levelQuery);
  }, [search, locationQuery, categoryQuery, levelQuery]);

  // Handle filter apply
  const handleApplyFilters = () => {
    const params = new URLSearchParams();
    if (searchValue) params.append('search', searchValue);
    if (locationValue) params.append('location', locationValue);
    if (categoryValue) params.append('category', categoryValue);
    if (levelValue) params.append('level', levelValue);
    router.push(`/jobs?${params.toString()}`);
  };

  return (
    <JobsAnimated
      search={search}
      jobs={jobs}
      loading={loading}
      totalPages={totalPages}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      mapJobToCard={mapJobToCard}
      categories={categories}
      levels={levels}
      searchValue={searchValue}
      setSearchValue={setSearchValue}
      locationValue={locationValue}
      setLocationValue={setLocationValue}
      categoryValue={categoryValue}
      setCategoryValue={setCategoryValue}
      levelValue={levelValue}
      setLevelValue={setLevelValue}
      handleApplyFilters={handleApplyFilters}
    />
  );
}
