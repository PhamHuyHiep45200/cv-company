import CategorySection from '@/components/CategorySection';
import HeroSection from '@/components/HeroSection';
import InfoBlock from '@/components/InfoBlock';
import HeroSectionBottom from '@/components/NewJobs';
import { motion } from 'framer-motion';

export default function HomeSections() {
  return (
    <>
      <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1 }}>
        <HeroSection />
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2 }}>
        <HeroSectionBottom />
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.3 }}>
        <CategorySection />
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.4 }}>
        <InfoBlock />
      </motion.div>
    </>
  );
} 