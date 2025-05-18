import { motion } from 'framer-motion';
import JobCard from '../../components/JobCard';
import Pagination from '../../components/Pagination';

export default function JobsAnimated({
  search,
  jobs,
  loading,
  totalPages,
  currentPage,
  setCurrentPage,
  mapJobToCard,
  categories,
  levels,
  searchValue,
  setSearchValue,
  locationValue,
  setLocationValue,
  categoryValue,
  setCategoryValue,
  levelValue,
  setLevelValue,
  handleApplyFilters,
}) {
  return (
    <main className="w-full min-h-screen bg-[#f7fafc] flex flex-col items-center">
      <div className="w-full max-w-[1440px] flex flex-col lg:flex-row gap-8 px-4 md:px-[72px] pt-[60px] pb-[120px]">
        {/* Sidebar + Banner */}
        <motion.aside initial={{ x: -40, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="w-full lg:w-[340px] flex flex-col gap-6">
          {/* Sidebar Filters */}
          <div className="bg-[#EBF5F4] rounded-[20px] p-6 flex flex-col gap-6 shadow border border-[#d1e7e4]">
            <div>
              <label className="block text-[16px] font-semibold font-['Figtree'] mb-2">Từ khóa</label>
              <input type="text" value={searchValue} onChange={e => setSearchValue(e.target.value)} placeholder="Tìm kiếm việc làm..." className="w-full rounded-lg px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#309689]" />
            </div>
            <div>
              <label className="block text-[16px] font-semibold font-['Figtree'] mb-2">Địa điểm</label>
              <input type="text" value={locationValue} onChange={e => setLocationValue(e.target.value)} placeholder="Địa điểm" className="w-full rounded-lg px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#309689]" />
            </div>
            <div>
              <label className="block text-[16px] font-semibold font-['Figtree'] mb-2">Ngành nghề</label>
              <select value={categoryValue} onChange={e => setCategoryValue(e.target.value)} className="w-full rounded-lg px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#309689]">
                <option value="">Tất cả</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[16px] font-semibold font-['Figtree'] mb-2">Trình độ</label>
              <select value={levelValue} onChange={e => setLevelValue(e.target.value)} className="w-full rounded-lg px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#309689]">
                <option value="">Tất cả</option>
                {levels.map((level) => (
                  <option key={level.id} value={level.id}>{level.name}</option>
                ))}
              </select>
            </div>
            <button onClick={handleApplyFilters} className="bg-gradient-to-r from-[#309689] to-[#3ad29f] text-white px-6 py-3 rounded-lg font-semibold font-['Figtree'] shadow hover:from-[#26786b] hover:to-[#309689] transition mt-2">Áp dụng bộ lọc</button>
          </div>
          {/* Banner */}
          <div className="bg-[#309689] rounded-[12px] p-6 flex flex-col items-center gap-2 shadow-lg mt-4 relative overflow-hidden">
            <img src="/assets/jobs/jobs-banner.png" alt="We are hiring" className="w-full h-32 object-cover rounded-lg mb-3" />
            <h3 className="text-[32px] font-bold font-['Figtree'] text-white uppercase leading-tight">Chúng tôi đang tuyển dụng</h3>
            <p className="text-[24px] font-medium font-['Figtree'] text-white">Ứng tuyển ngay hôm nay!</p>
          </div>
        </motion.aside>
        {/* Main Content */}
        <motion.section initial={{ y: 40, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1 }} className="flex-1 flex flex-col gap-10">
          {/* Results header */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {search ? (
              <span className="text-[20px] font-medium font-['Figtree'] text-[#6C757D]">Kết quả tìm kiếm cho: "{search}"</span>
            ) : (
              <span className="text-[20px] font-medium font-['Figtree'] text-[#6C757D]">Nhập từ khóa để tìm kiếm công việc.</span>
            )}
          </div>
          {/* Job Cards */}
          <div className="flex flex-col gap-8">
            {loading ? (
              <div>Đang tìm kiếm...</div>
            ) : search && jobs.length === 0 ? (
              <div>Không tìm thấy công việc phù hợp.</div>
            ) : (
              jobs.map((job, idx) => (
                <motion.div key={job.id || idx} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: idx * 0.08 }}>
                  <JobCard {...mapJobToCard(job)} />
                </motion.div>
              ))
            )}
          </div>
          {/* Pagination: only show if jobs exist and more than 1 page */}
          {jobs.length > 0 && totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </motion.section>
      </div>
    </main>
  );
} 