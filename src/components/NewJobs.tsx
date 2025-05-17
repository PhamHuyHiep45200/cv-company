'use client'
import React, { useEffect, useState } from 'react';
import JobCard from './JobCard';
import { formatDistance } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useRouter } from 'next/navigation';
import Pagination from './Pagination';

export default function HeroSectionBottom() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

  useEffect(() => {
    async function fetchJobs() {
      const res = await fetch(`/api/job-posts?page=${page}&limit=10`);
      const data = await res.json();
      setJobs(data.data || []);
      setTotalPages(data.pagination?.totalPages || 1);
    }
    fetchJobs();
  }, [page]);

  // Helper to map API job to JobCard props
  const mapJobToCard = (job: any) => ({
    badge: job.category?.name || '',
    icon: '/assets/logos/job-card-icon.svg',
    logo: job.category?.thumbnail || '/assets/logos/job-card-logo-vector1.svg',
    title: job.title,
    timePost: formatDistance(new Date(job.created_at), new Date(), { addSuffix: true, locale: vi }) || '',
    category: { icon: '/assets/logos/job-card-briefcase.svg', text: job.level?.name || '' },
    type: { icon: '/assets/logos/job-card-clock.svg', text: new Date(job.deadline).toLocaleDateString() || '' },
    salary: { icon: '/assets/logos/job-card-salary.svg', text: job.salary ? `${job.salary} VND` : '' },
    location: { icon: '/assets/logos/job-card-map-pin.svg', text: job.location || '' },
    onDetailsClick: () => router.push(`/jobs/${job.id}`),
  });

  return (
    <section className="flex flex-col items-center gap-[60px] py-[60px] w-full bg-gradient-to-b from-white via-[#f7fafc] to-[#e6f4f1]">
      {/* Header */}
      <div className="flex w-full max-w-[1296px] justify-between items-end gap-10 px-4 md:px-0">
        <div className="flex flex-col gap-10 max-w-[900px]">
          <h2 className="text-[40px] md:text-[50px] font-bold leading-[1.1] capitalize font-['Figtree'] tracking-tight bg-gradient-to-r from-[#309689] via-[#3ad29f] to-[#309689] bg-clip-text text-transparent drop-shadow-md">
            Việc làm mới nhất
          </h2>
          <p className="text-[16px] font-normal leading-[22px] text-black opacity-80 font-['Figtree']">
            Tại eu lobortis pretium tincidunt amet lacus ut aenean aliquet. Blandit a massa elementum id scelerisque rhoncus. Lectus dolor blandit massa pretium id ultrices phasellus tortor. Risus risus lectus augue justo lacus viverra sit. Ultricies purus dolor viverra mi laoreet at cursus justo. Ultrices purus diam egestas amet faucibus tempor blandit. Elit velit mauris aliquam est diam. Leo sagittis consectetur diam morbi erat aenean. Vulputate praesent congue faucibus in euismod feugiat euismod volutpat. Adipiscing risus amet phasellus imperdiet eget vel pulvinar. Risus in felis faucibus sit. Scelerisque consequat iaculis mauris amet vel felis id tincidunt nunc.
          </p>
        </div>
        <a href="#" className="text-[#309689] text-[20px] md:text-[24px] font-semibold font-['Figtree'] leading-[29px] transition-colors hover:text-[#26786b]">Xem tất cả</a>
      </div>
      {/* Job Cards */}
      <div className="flex flex-col items-center gap-6 w-full">
        {jobs.map((job, idx) => (
          <JobCard key={job.id || idx} {...mapJobToCard(job)} />
        ))}
      </div>
      {/* Pagination */}
      {jobs.length > 0 && totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}
    </section>
  );
} 