// OfferBanners.jsx
import { motion } from "framer-motion";

const offerData = [
  {
    title: "🔥 Deal of the Day",
    desc: "Get up to 40% off on ergonomic chairs",
    bg: "bg-gradient-to-r from-red-500 to-pink-500"
  },
  {
    title: "🌿 Eco Essentials",
    desc: "Sustainable wood crafted products",
    bg: "bg-gradient-to-r from-green-500 to-lime-500"
  },
  {
    title: "🛋️ Luxe Comforts",
    desc: "Premium sofas starting at just $499",
    bg: "bg-gradient-to-r from-blue-500 to-purple-500"
  }
];

const OfferBanners = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 mt-10">
      {offerData.map((offer, index) => (
        <motion.div
          key={index}
          className={`text-white p-6 rounded-xl shadow-lg ${offer.bg}`}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.2 }}
          viewport={{ once: true }}
        >
          <h3 className="text-xl font-semibold mb-1">{offer.title}</h3>
          <p className="text-sm opacity-90">{offer.desc}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default OfferBanners;
