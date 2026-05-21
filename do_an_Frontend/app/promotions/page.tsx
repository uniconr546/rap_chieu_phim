'use client';
export default function PromotionsPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-black text-white mb-8">KHUYẾN MÃI</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['GIẢM 50% VÉ ĐẦU', 'TẶNG BẮP NƯỚC', 'ƯU ĐÃI SINH VIÊN'].map((promo, i) => (
          <div key={i} className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl border border-neonYellow/30 text-center">
            <div className="text-5xl mb-4">🎁</div>
            <h2 className="text-xl font-bold text-neonYellow mb-2">{promo}</h2>
            <p className="text-gray-400 mb-6">Nhập mã UNICORN{i+1} để nhận ưu đãi cực hời tại rạp!</p>
            <button className="bg-white text-black px-6 py-2 rounded-full font-bold hover:bg-neonYellow transition-colors">Sử dụng ngay</button>
          </div>
        ))}
      </div>
    </div>
  );
}