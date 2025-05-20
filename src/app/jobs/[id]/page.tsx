"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  FaMapMarkerAlt,
  FaBriefcase,
  FaDollarSign,
  FaRegClock,
} from "react-icons/fa";
import JobCard from "../../../components/JobCard";
import { formatDistance } from "date-fns";
import { vi } from "date-fns/locale";
import { useAuth } from '@/hooks/useAuth';
import ApplyModal from './ApplyModal';
import ConfirmDialog from '@/components/ConfirmDialog';

export default function JobDetailPage() {
  const params = useParams();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showApply, setShowApply] = useState(false);
  const { user } = useAuth();
  const [relatedJobs, setRelatedJobs] = useState<any[]>([]);
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  useEffect(() => {
    async function fetchJob() {
      if (!params?.id) return;
      setLoading(true);
      const res = await fetch(`/api/job-posts/${params.id}`);
      const data = await res.json();
      setJob(data);
      setLoading(false);
    }
    fetchJob();
  }, [params?.id]);

  useEffect(() => {
    async function fetchRelatedJobs() {
      if (!params?.id) return;
      const res = await fetch(`/api/job-posts/${Array.isArray(params.id) ? params.id[0] : params.id}/related`);
      if (res.ok) {
        const data = await res.json();
        setRelatedJobs(data);
      } else {
        setRelatedJobs([]);
      }
    }
    fetchRelatedJobs();
  }, [params?.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }
  if (!job) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Không tìm thấy công việc
      </div>
    );
  }

  function mapJobToJobCard(job: any) {
    return {
      badge: job.level?.name || "",
      icon: "/assets/logos/job-card-icon.svg",
      logo: job.category?.thumbnail || "/assets/job-detail/job-detail-logo.svg",
      title: job.title,
      timePost: job.updated_at
        ? formatDistance(new Date(job.updated_at), new Date(), { addSuffix: true, locale: vi })
        : "",
      category: {
        icon: "/assets/logos/job-card-briefcase.svg",
        text: job.category?.name || "",
      },
      type: {
        icon: "/assets/logos/job-card-clock.svg",
        text: job.deadline ? new Date(job.deadline).toLocaleDateString() : "",
      },
      salary: {
        icon: "/assets/logos/job-card-salary.svg",
        text: job.salary ? `${job.salary} VND` : "",
      },
      location: {
        icon: "/assets/logos/job-card-map-pin.svg",
        text: job.location || "",
      },
      onDetailsClick: () => {
        window.location.href = `/jobs/${job.id}`;
      },
    };
  }

  const handleApplyClick = () => {
    if (!user) {
      setShowLoginDialog(true);
    } else {
      setShowApply(true);
    }
  };

  return (
    <main className="bg-white min-h-screen w-full flex flex-col items-center">
      {/* Hero Section */}
      <section
        className="w-full relative flex flex-col items-center"
        style={{
          background: `url(${
            job.heroBg || "/assets/job-detail/job-detail-hero-bg.png"
          }) center/cover no-repeat`,
        }}
      >
        <div className="absolute inset-0 bg-black/60 z-0" />
        <div className="w-full h-[500px] flex flex-col items-center relative z-10">
          {/* Header */}
          <img
            src={"/assets/job-detail.png"}
            alt="Hero background"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Main Content */}
      <section className="w-full max-w-[1296px] flex flex-col lg:flex-row gap-8 px-4 py-10">
        {/* Main Card */}
        <div className="flex-1 bg-white rounded-[20px] shadow-2xl border border-[#e6f4f1] p-10 flex flex-col gap-10">
          {/* Job Info */}
          <div className="flex flex-col md:flex-row md:items-center gap-8 justify-between">
            <div className="flex items-center gap-6">
              <div className="rounded-xl bg-white p-2 shadow-md">
                <Image
                  src={
                    job.category?.thumbnail ||
                    "/assets/job-detail/job-detail-logo.svg"
                  }
                  alt="Logo công ty"
                  width={60}
                  height={60}
                />
              </div>
              <div>
                <h2 className="text-3xl font-bold font-['Figtree'] text-[#309689]">
                  {job.title}
                </h2>
                <div className="text-gray-500 font-['Figtree']">
                  {formatDistance(new Date(job.updated_at), new Date(), {
                    addSuffix: true,
                    locale: vi,
                  })}
                </div>
              </div>
            </div>
            <div className="flex gap-4 flex-wrap">
              <span className="flex items-center gap-2 bg-[#3096891A] text-[#309689] rounded-[8px] px-4 py-1 text-[16px] font-medium font-['Figtree'] shadow-sm">
                <FaBriefcase /> {job.level?.name || ""}
              </span>
              <span className="flex items-center gap-2 bg-[#3096891A] text-[#309689] rounded-[8px] px-4 py-1 text-[16px] font-medium font-['Figtree'] shadow-sm">
                <FaDollarSign /> {job.salary ? `${job.salary} VND` : ""}
              </span>
              <span className="flex items-center gap-2 bg-[#3096891A] text-[#309689] rounded-[8px] px-4 py-1 text-[16px] font-medium font-['Figtree'] shadow-sm">
                <FaRegClock />{" "}
                {job.deadline
                  ? new Date(job.deadline).toLocaleDateString()
                  : ""}
              </span>
            </div>
          </div>
          {/* Divider */}
          <div className="w-full h-px bg-gradient-to-r from-[#e6f4f1] via-[#30968933] to-[#e6f4f1] my-2" />
          {/* Description */}
          <div>
            <h3 className="text-2xl font-bold font-['Figtree'] text-[#309689] mb-3">
              Mô tả công việc
            </h3>
            <div
              className="text-gray-700 font-['Figtree'] mb-6"
              dangerouslySetInnerHTML={{ __html: job.description || "" }}
            />
            <h4 className="text-xl font-semibold font-['Figtree'] text-[#309689] mb-2">
              Yêu cầu công việc
            </h4>
            <div className="mb-6">
              <div
                className="prose max-w-none text-gray-700 font-['Figtree']"
                dangerouslySetInnerHTML={{ __html: job.requirements || "" }}
              />
            </div>
            <h4 className="text-xl font-semibold font-['Figtree'] text-[#309689] mb-2">
              Quyền lợi
            </h4>
            <div
              className="prose max-w-none text-gray-700 font-['Figtree'] mb-6"
              dangerouslySetInnerHTML={{ __html: job.benefits || "" }}
            />
            <h4 className="text-xl font-semibold font-['Figtree'] text-[#309689] mb-2">
              Địa điểm làm việc
            </h4>
            <div
              className="prose max-w-none text-gray-700 font-['Figtree']"
              dangerouslySetInnerHTML={{ __html: job.location || "" }}
            />
          </div>
          <div className="flex justify-end">
            <button
              className="bg-gradient-to-r from-[#309689] to-[#3ad29f] text-white px-10 py-4 rounded-lg font-bold font-['Figtree'] shadow-lg hover:from-[#26786b] hover:to-[#309689] transition text-lg"
              onClick={handleApplyClick}
            >
              Ứng tuyển ngay
            </button>
          </div>
        </div>
        {/* Sidebar */}
        <aside className="w-full lg:w-[340px] flex flex-col gap-8">
          <div className="bg-[#EBF5F4] rounded-[20px] p-8 flex flex-col gap-4 shadow-md border border-[#d1e7e4]">
            <h4 className="text-xl font-bold font-['Figtree'] text-[#309689] mb-2">
              Tổng quan công việc
            </h4>
            <div className="flex flex-col gap-3 text-gray-700 font-['Figtree']">
              <span className="flex items-start gap-2">
                <div className="flex items-center gap-2">
                  <div>
                    <FaMapMarkerAlt className="text-[#309689] w-4 min-h-4 text-[20px]" />
                  </div>{" "}
                  <b className="text-nowrap">Địa điểm:</b>
                </div>{" "}
                {job.location}
              </span>
              <span className="flex items-center gap-2">
                <div>
                  <FaBriefcase className="text-[#309689] w-4 min-h-4 text-[20px]" />
                </div>{" "}
                <b className="text-nowrap">Vị trí:</b> {job.level?.name || ""}
              </span>
              <span className="flex items-center gap-2">
                <div>
                  <FaDollarSign className="text-[#309689] w-4 min-h-4 text-[20px]" />
                </div>{" "}
                <b className="text-nowrap">Lương:</b>{" "}
                {job.salary ? `${job.salary}` : ""}
              </span>
              <span className="flex items-center gap-2">
                <FaRegClock className="text-[#309689]" />{" "}
                <b className="text-nowrap">Hạn tuyển dụng:</b>{" "}
                {job.deadline
                  ? new Date(job.deadline).toLocaleDateString()
                  : ""}
              </span>
            </div>
          </div>
        </aside>
      </section>

      {/* Related Jobs Section */}
      {relatedJobs.length > 0 && (
      <section className="w-full max-w-[1296px] px-4 py-10">
          <h2 className="text-[32px] md:text-[40px] font-bold font-['Figtree'] text-[#309689] mb-8 text-center">
            Việc làm liên quan
          </h2>
        <div className="flex flex-col gap-8">
          {relatedJobs.map((job, idx) => (
              <JobCard key={job.id || idx} {...mapJobToJobCard(job)} />
          ))}
        </div>
      </section>
      )}

      <ApplyModal open={showApply} onClose={() => setShowApply(false)} user={user || undefined} jobId={Array.isArray(params.id) ? params.id[0] : params.id} />
      <ConfirmDialog
        isOpen={showLoginDialog}
        title="Thông báo"
        message="Bạn cần đăng nhập để ứng tuyển."
        onConfirm={() => {
          setShowLoginDialog(false);
          // Save current path for redirect after login
          const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
          window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
        }}
        onCancel={() => setShowLoginDialog(false)}
        confirmText="OK"
        cancelText="Hủy"
      />
    </main>
  );
} 
