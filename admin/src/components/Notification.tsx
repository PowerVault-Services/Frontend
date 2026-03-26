import React, { useState, useEffect } from 'react';

interface NotificationProps {
  message: string | null;
  duration?: number; // ระยะเวลาให้แสดงผล (มิลลิวินาที) ค่าเริ่มต้น 3000ms
  onClose: () => void; // ฟังก์ชันเคลียร์ค่าจาก Parent เมื่อเฟดดับเสร็จ
}

const Notification: React.FC<NotificationProps> = ({ 
  message, 
  duration = 3000, 
  onClose 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (message) {
      // 1. เซ็ตค่าเริ่มต้นให้แสดงผล
      setIsVisible(true);
      setIsFadingOut(false);
      setProgress(0);

      // 2. เริ่มให้เส้น Progress วิ่งจาก 0 ไป 100% (ดีเลย์ 50ms ให้ React วาด UI ก่อน)
      const progressTimer = setTimeout(() => {
        setProgress(100);
      }, 50);

      // 3. เริ่มเฟดดับเมื่อครบเวลา duration
      const fadeOutTimer = setTimeout(() => {
        setIsFadingOut(true);
      }, duration);

      // 4. ซ่อน Component จริงๆ และบอก Parent ให้เคลียร์ค่า message
      const hideTimer = setTimeout(() => {
        setIsVisible(false);
        onClose();
      }, duration + 300); // บวกเวลาเฟดของ CSS ไปอีก 300ms

      return () => {
        clearTimeout(progressTimer);
        clearTimeout(fadeOutTimer);
        clearTimeout(hideTimer);
      };
    }
  }, [message, duration, onClose]);

  // ถ้าไม่มีข้อความ และไม่ได้อยู่ในสถานะกำลังแสดงผล ให้ return null
  if (!isVisible && !message) return null;

  return (
    <div
      className={`fixed top-5 right-5 bg-green-600 text-white px-5 py-3 rounded-md shadow-lg text-sm z-50 overflow-hidden transform transition-all duration-300 ease-in-out ${
        isFadingOut 
          ? 'opacity-0 translate-x-5' // ตอนเฟดดับ ให้เลื่อนไปทางขวานิดๆ แล้วจางหาย
          : 'opacity-100 translate-x-0 animate-fade-in' // ตอนโชว์
      }`}
    >
      {/* ข้อความหลัก */}
      <span className="relative z-10">{message}</span>

      {/* เส้น Progress Bar สีเขียวอ่อน */}
      <div
        className="absolute bottom-0 left-0 h-1 bg-green-300 transition-all ease-linear"
        style={{
          width: `${progress}%`,
          transitionDuration: `${duration}ms`,
        }}
      />
    </div>
  );
};

export default Notification;