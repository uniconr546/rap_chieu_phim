// app/admin/combos/page.tsx
'use client';

import { useState,useRef,useEffect } from 'react';
import Link from 'next/link';
import api from '@/services/api';

interface Concession{

 id:number

 name:string

 description:string

 price:number

 status:string

 image:string

}

export default function AdminCombos() {
const [
 concessions,
 setConcessions
]=useState<
 Concession[]
>([])

  // 2. TRẠNG THÁI FORM & POPUP
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [comboName, setComboName] = useState('');
  const [comboDesc, setComboDesc] = useState('');
  const [comboPrice, setComboPrice] = useState('');
  const [comboStatus,setComboStatus]=useState('selling');
  
  // TRẠNG THÁI UP ẢNH
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile,setImageFile]=useState<File|null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
useEffect(()=>{

 fetchConcessions()

},[])

const fetchConcessions=
async()=>{

 try{

  const res=
  await api.get(
   '/concessions/'
  )

  setConcessions(
   res.data
  )

 }catch(error){

  console.log(error)

 }

}
const handleFileChange = (
event: React.ChangeEvent<HTMLInputElement>
) => {

const file=
event.target.files?.[0];

if(file){

if(
!file.type.startsWith('image/')
){

alert(
'Vui lòng chỉ chọn file ảnh!'
);

return;

}

setImageFile(file);

const reader=
new FileReader();

reader.onloadend=()=>{

setImagePreview(
reader.result as string
);

};

reader.readAsDataURL(file);

}

};
  const clearSelectedImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

const handleSaveCombo=
async()=>{

if(
!comboName||
!comboDesc||
!comboPrice||
!imageFile
){

alert(
'Vui lòng điền đủ thông tin'
);

return;

}

try{

const formData=
new FormData();

formData.append(
'name',
comboName
);

formData.append(
'description',
comboDesc
);

formData.append(
'price',
comboPrice
);

formData.append(
'status',
comboStatus
);

formData.append(
'image',
imageFile
);

await api.post(
'/concessions/create/',
formData,
{

headers:{

'Content-Type':
'multipart/form-data'

}

}
);

fetchConcessions();

setComboName('');
setComboDesc('');
setComboPrice('');

clearSelectedImage();

setIsModalOpen(false);

}catch(error:any){

console.log(

"Django lỗi:",

error.response?.data

)

alert(

JSON.stringify(
error.response?.data
)

)

}

};

const handleDelete=
async(id:number)=>{

if(
!confirm(
'Ngài có chắc chắn muốn xóa Combo này không?'
)
){

return;

}

try{

await api.delete(
`/concessions/${id}/delete/`
);

fetchConcessions();

}catch(error){

console.log(error);

}

};

  return (
    <div className="bg-dark flex flex-col md:flex-row w-screen max-w-full min-h-screen overflow-x-hidden">     
      
      {/* =========================================
        CỘT BÊN TRÁI: SIDEBAR CHUẨN UX MỚI CỦA NGÀI
        =========================================
      */}
<aside className="w-full md:w-[240px] lg:w-[260px] bg-darkPanel border-r border-gray-800 z-10 shrink-0 overflow-hidden min-h-screen">
  <div className="px-4 py-5 flex flex-col h-full">
    <h2 className="text-lg lg:text-xl font-black text-white tracking-wider mb-8 text-center md:text-left mt-2">
      <span className="text-neonYellow">ADMIN</span> PANEL
    </h2>
    
    <nav className="space-y-2 flex-1">
      <Link href="/admin/dashboard" className="block w-full text-left px-4 py-3 text-sm text-gray-400 hover:bg-gray-800 hover:text-white font-medium rounded-lg transition-all">
        📊 Tổng Quan
      </Link>
      <Link href="/admin/movies" className="block w-full text-left px-4 py-3 text-sm text-gray-400 hover:bg-gray-800 hover:text-white font-medium rounded-lg transition-all">
        🎬 Quản lý Phim
      </Link>
      <Link href="/admin/showtimes" className="block w-full text-left px-4 py-3 text-sm text-gray-400 hover:bg-gray-800 hover:text-white font-medium rounded-lg transition-all">
        🗓️ Lịch Chiếu
      </Link>
      <Link href="/admin/bookings" className="block w-full text-left px-4 py-3 text-sm text-gray-400 hover:bg-gray-800 hover:text-white font-medium rounded-lg transition-all">
        🎟️ Đơn Hàng
      </Link>
      {/* Nút Combo đây ạ */}
      <Link href="/admin/combos" className="block w-full text-left px-4 py-3 text-sm text-gray-400 hover:bg-gray-800 hover:text-white font-medium rounded-lg transition-all">
        🍿 Quản lý Combo
      </Link>

      <div className="h-px bg-gray-700 my-6 mx-2 opacity-50"></div>

      <Link href="/" className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-400 hover:bg-gray-800 hover:text-netflix font-bold rounded-lg transition-all">
        <span className="text-lg leading-none">🔙</span> Về Trang Chủ
      </Link>
    </nav>
  </div>
</aside>

      {/* =========================================
        CỘT BÊN PHẢI: NỘI DUNG CHÍNH COMBO
        =========================================
      */}
      <main className="flex-1 w-0 min-w-0 overflow-x-hidden p-3 md:p-4 lg:p-5 mt-2">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Quản Lý Combo</h1>
            <p className="text-gray-400 text-xs sm:text-sm">Thiết lập các gói Bắp & Nước để tăng doanh thu</p>
          </div>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-netflix hover:bg-red-700 text-white font-bold py-2.5 px-5 rounded-lg transition-all shadow-[0_0_15px_rgba(229,9,20,0.4)] flex items-center gap-2 text-sm"
          >
            <span className="text-lg leading-none">+</span> Thêm Combo
          </button>
        </div>

        {/* BẢNG DANH SÁCH COMBO */}
        <div className="bg-darkPanel rounded-xl border border-gray-800 shadow-xl overflow-hidden mb-8">
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-400 min-w-[700px]">
              <thead className="bg-black/40 text-gray-300 uppercase font-bold text-[10px] tracking-widest">
                <tr>
                  <th className="px-6 py-4">Hình Ảnh</th>
                  <th className="px-6 py-4">Tên Combo</th>
                  <th className="px-6 py-4 w-1/3">Mô tả chi tiết</th>
                  <th className="px-6 py-4">Giá Bán</th>
                  <th className="px-6 py-4">Trạng Thái</th>
                  <th className="px-6 py-4 text-center">Hành Động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {concessions.map((item)=>(
                  <tr key={item.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-3">
                      <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center p-2 border border-gray-700">
                        <img
src={item.image}
alt={item.name}
className="
w-full
h-full
object-contain
"/>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-white text-sm">{item.name}</td>
                    <td className="px-6 py-4 text-xs leading-relaxed">{item.description}</td>
                    <td className="px-6 py-4 text-neonYellow font-bold">{item.price.toLocaleString('vi-VN')} đ</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase 
                        ${item.status === 'Đang bán' ? 'bg-green-900/40 text-green-400 border border-green-800' : 'bg-gray-800/60 text-gray-500 border border-gray-700'}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-4">
                        <button className="text-neonYellow hover:text-yellow-300 transition-colors font-bold text-xs uppercase tracking-wider">✏️ Sửa</button>
                        <button onClick={() => handleDelete(item.id)} className="text-netflix hover:text-red-400 transition-colors font-bold text-xs uppercase tracking-wider">🗑️ Xóa</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* =========================================
        POPUP THÊM COMBO
        ========================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          
          <div className="bg-darkPanel border border-gray-700 rounded-2xl shadow-2xl w-full max-w-lg relative z-10 animate-[fadeIn_0.2s_ease-out]">
            <div className="p-5 md:p-6 border-b border-gray-800 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Thêm Combo Mới</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white text-2xl font-bold leading-none">&times;</button>
            </div>
            
            <div className="p-5 md:p-6 space-y-4">
              
              {/* UP ẢNH COMBO */}
              <div className="flex flex-col items-center mb-6">
                {imagePreview ? (
                  <div className="relative w-24 h-24 rounded-full border-2 border-dashed border-netflix overflow-hidden group shadow-lg bg-white/10 p-2">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
                    <button onClick={clearSelectedImage} className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold">Xóa</button>
                  </div>
                ) : (
                  <button onClick={() => fileInputRef.current?.click()} className="w-24 h-24 rounded-full border-2 border-dashed border-gray-700 hover:border-netflix hover:bg-netflix/5 flex flex-col items-center justify-center gap-1 text-gray-500 hover:text-netflix transition-all group">
                    <span className="text-2xl transition-transform group-hover:scale-110">🍿</span>
                    <span className="text-[9px] font-medium px-2 text-center">Up ảnh</span>
                  </button>
                )}
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Tên Combo</label>
                <input type="text" value={comboName} onChange={(e) => setComboName(e.target.value)} className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:ring-1 focus:ring-netflix outline-none" placeholder="VD: Combo Couple" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Mô tả chi tiết</label>
                <input type="text" value={comboDesc} onChange={(e) => setComboDesc(e.target.value)} className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:ring-1 focus:ring-netflix outline-none" placeholder="VD: 1 Bắp lớn + 2 Nước vừa" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Giá Bán (VNĐ)</label>
                <input type="number" value={comboPrice} onChange={(e) => setComboPrice(e.target.value)} className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:ring-1 focus:ring-netflix outline-none" placeholder="VD: 105000" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                  Trạng Thái
                </label>

                <select
                  value={comboStatus}
                  onChange={(e) => setComboStatus(e.target.value)}
                  className="w-full rounded-lg border border-gray-700 bg-black/50 px-4 py-3 text-white text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-netflix transition-all cursor-pointer"
                >
                  <option value="selling" className="bg-gray-900">
                    Đang bán
                  </option>
                  <option value="stopped" className="bg-gray-900">
                    Ngừng bán
                  </option>
                </select>
              </div>

            </div>
            <div className="p-5 md:p-6 border-t border-gray-800 flex justify-end gap-3 bg-black/20 rounded-b-2xl">
              <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-lg font-bold text-sm text-gray-300 hover:bg-gray-800">Hủy</button>
              <button onClick={handleSaveCombo} className="px-6 py-2.5 bg-netflix hover:bg-red-700 text-white font-bold text-sm rounded-lg shadow-[0_0_15px_rgba(229,9,20,0.4)]">Thêm Combo</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
} 