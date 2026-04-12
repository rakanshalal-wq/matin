'use client';
export const dynamic = 'force-dynamic';
import { useState, useEffect, useCallback } from 'react';

interface Student {
  id: number;
  name: string;
  avatar?: string;
  boarded: boolean;
}

interface Trip {
  id: number;
  bus_id: number;
  bus_number: string;
  route_name: string;
  students: Student[];
}

export default function DriverAppPage() {
  const [token, setToken] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [activeTrip, setActiveTrip] = useState<Trip | null>(null);
  const [tracking, setTracking] = useState(false);
  const [locationWatchId, setLocationWatchId] = useState<number | null>(null);
  const [lastLocation, setLastLocation] = useState<{lat: number, lng: number} | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tripType, setTripType] = useState<'morning' | 'afternoon'>('morning');

  // Login with phone + OTP
  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: phone, password: phone, action: 'login' })
      });
      const data = await res.json();
      if (data.token) {
        setToken(data.token);
        setIsLoggedIn(true);
        localStorage.setItem('driver_token', data.token);
      } else if (data.requires_otp) {
        setOtpSent(true);
      } else {
        setError(data.error || 'فشل تسجيل الدخول');
      }
    } catch (e) {
      setError('خطأ في الاتصال');
    }
    setLoading(false);
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: phone, code: otp, action: 'verify_otp' })
      });
      const data = await res.json();
      if (data.token) {
        setToken(data.token);
        setIsLoggedIn(true);
        localStorage.setItem('driver_token', data.token);
      } else {
        setError(data.error || 'رمز خاطئ');
      }
    } catch (e) {
      setError('خطأ في الاتصال');
    }
    setLoading(false);
  };

  // Load trips
  const loadTrips = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/transport?type=buses', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.data) {
        const tripsData = data.data.map((bus: any) => ({
          id: bus.id,
          bus_id: bus.id,
          bus_number: bus.bus_number || bus.plate_number,
          route_name: bus.route_name || 'المسار الرئيسي',
          students: (bus.riders || []).map((r: any) => ({
            id: r.student_id || r.id,
            name: r.student_name || r.name || 'طالب',
            avatar: r.avatar,
            boarded: false
          }))
        }));
        setTrips(tripsData);
      }
    } catch (e) {
      console.error('Error loading trips:', e);
    }
  }, [token]);

  useEffect(() => {
    const savedToken = localStorage.getItem('driver_token');
    if (savedToken) {
      setToken(savedToken);
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) loadTrips();
  }, [isLoggedIn, loadTrips]);

  // Start trip - begin GPS tracking
  const startTrip = (trip: Trip) => {
    setActiveTrip(trip);
    setTracking(true);

    if ('geolocation' in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLastLocation({ lat: latitude, lng: longitude });
          // Send location to server
          fetch('/api/transport/location', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              bus_id: trip.bus_id,
              latitude,
              longitude,
              speed: position.coords.speed || 0,
              heading: position.coords.heading || 0
            })
          }).catch(console.error);
        },
        (err) => console.error('GPS Error:', err),
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 15000 }
      );
      setLocationWatchId(watchId);
    }
  };

  // Board student
  const boardStudent = async (studentId: number) => {
    if (!activeTrip) return;
    try {
      await fetch('/api/transport/board', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          student_id: studentId,
          bus_id: activeTrip.bus_id,
          trip_type: tripType,
          action: 'boarded'
        })
      });
      setActiveTrip(prev => {
        if (!prev) return null;
        return {
          ...prev,
          students: prev.students.map(s =>
            s.id === studentId ? { ...s, boarded: true } : s
          )
        };
      });
    } catch (e) {
      console.error('Error boarding student:', e);
    }
  };

  // End trip
  const endTrip = () => {
    if (locationWatchId !== null) {
      navigator.geolocation.clearWatch(locationWatchId);
    }
    setTracking(false);
    setActiveTrip(null);
    setLocationWatchId(null);
  };

  // Login Screen
  if (!isLoggedIn) {
    return (
      <div dir="rtl" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1e3a5f 0%, #06060E 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ background: 'white', borderRadius: '20px', padding: '40px', maxWidth: '400px', width: '100%', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>🚌</div>
          <h1 style={{ fontSize: '24px', color: '#1e3a5f', marginBottom: '5px' }}>تطبيق السائق</h1>
          <p style={{ color: '#666', marginBottom: '30px' }}>منصة متين - نظام النقل المدرسي</p>
          
          {error && <div style={{ background: '#fee', color: '#c00', padding: '10px', borderRadius: '8px', marginBottom: '15px' }}>{error}</div>}
          
          {!otpSent ? (
            <>
              <input
                type="tel"
                placeholder="رقم الجوال أو البريد الإلكتروني"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{ width: '100%', padding: '14px', border: '2px solid #e0e0e0', borderRadius: '12px', fontSize: '16px', marginBottom: '15px', textAlign: 'center', boxSizing: 'border-box' }}
              />
              <button
                onClick={handleLogin}
                disabled={loading}
                style={{ width: '100%', padding: '14px', background: '#1e3a5f', color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', cursor: 'pointer' }}
              >
                {loading ? 'جاري التحقق...' : 'تسجيل الدخول'}
              </button>
            </>
          ) : (
            <>
              <p style={{ marginBottom: '15px', color: '#666' }}>أدخل رمز التحقق المرسل</p>
              <input
                type="text"
                placeholder="رمز التحقق"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                style={{ width: '100%', padding: '14px', border: '2px solid #e0e0e0', borderRadius: '12px', fontSize: '24px', marginBottom: '15px', textAlign: 'center', letterSpacing: '8px', boxSizing: 'border-box' }}
              />
              <button
                onClick={handleVerifyOtp}
                disabled={loading}
                style={{ width: '100%', padding: '14px', background: '#1e3a5f', color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', cursor: 'pointer' }}
              >
                {loading ? 'جاري التحقق...' : 'تأكيد'}
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  // Active Trip Screen
  if (activeTrip) {
    const boardedCount = activeTrip.students.filter(s => s.boarded).length;
    return (
      <div dir="rtl" style={{ minHeight: '100vh', background: '#f5f5f5' }}>
        {/* Header */}
        <div style={{ background: '#1e3a5f', color: 'white', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '18px' }}>🚌 {activeTrip.bus_number}</h2>
            <p style={{ margin: '5px 0 0', fontSize: '14px', opacity: 0.8 }}>{activeTrip.route_name}</p>
          </div>
          <div style={{ textAlign: 'left' }}>
            {tracking && <span style={{ display: 'inline-block', width: '10px', height: '10px', background: '#4caf50', borderRadius: '50%', marginLeft: '5px', animation: 'pulse 1s infinite' }}></span>}
            <span style={{ fontSize: '14px' }}>GPS {tracking ? 'نشط' : 'متوقف'}</span>
          </div>
        </div>

        {/* Trip Type Toggle */}
        <div style={{ display: 'flex', margin: '15px', borderRadius: '12px', overflow: 'hidden', border: '2px solid #1e3a5f' }}>
          <button onClick={() => setTripType('morning')} style={{ flex: 1, padding: '10px', background: tripType === 'morning' ? '#1e3a5f' : 'white', color: tripType === 'morning' ? 'white' : '#1e3a5f', border: 'none', fontSize: '14px', cursor: 'pointer' }}>
            🌅 رحلة الصباح
          </button>
          <button onClick={() => setTripType('afternoon')} style={{ flex: 1, padding: '10px', background: tripType === 'afternoon' ? '#1e3a5f' : 'white', color: tripType === 'afternoon' ? 'white' : '#1e3a5f', border: 'none', fontSize: '14px', cursor: 'pointer' }}>
            🌆 رحلة العودة
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: '10px', margin: '0 15px 15px' }}>
          <div style={{ flex: 1, background: 'white', borderRadius: '12px', padding: '15px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#4caf50' }}>{boardedCount}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>ركبوا</div>
          </div>
          <div style={{ flex: 1, background: 'white', borderRadius: '12px', padding: '15px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff9800' }}>{activeTrip.students.length - boardedCount}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>متبقي</div>
          </div>
          <div style={{ flex: 1, background: 'white', borderRadius: '12px', padding: '15px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e3a5f' }}>{activeTrip.students.length}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>إجمالي</div>
          </div>
        </div>

        {/* Location */}
        {lastLocation && (
          <div style={{ margin: '0 15px 15px', background: '#e8f5e9', borderRadius: '12px', padding: '10px 15px', fontSize: '12px', color: '#2e7d32' }}>
            📍 الموقع: {lastLocation.lat.toFixed(4)}, {lastLocation.lng.toFixed(4)}
          </div>
        )}

        {/* Students List */}
        <div style={{ margin: '0 15px' }}>
          <h3 style={{ fontSize: '16px', marginBottom: '10px', color: '#333' }}>قائمة الطلاب</h3>
          {activeTrip.students.map(student => (
            <div
              key={student.id}
              onClick={() => !student.boarded && boardStudent(student.id)}
              style={{
                background: student.boarded ? '#e8f5e9' : 'white',
                borderRadius: '12px',
                padding: '15px',
                marginBottom: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                cursor: student.boarded ? 'default' : 'pointer',
                border: student.boarded ? '2px solid #4caf50' : '2px solid transparent',
                transition: 'all 0.3s'
              }}
            >
              <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: student.boarded ? '#4caf50' : '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', color: 'white' }}>
                {student.boarded ? '✓' : student.name.charAt(0)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{student.name}</div>
                <div style={{ fontSize: '12px', color: '#666' }}>{student.boarded ? 'تم التسجيل ✅' : 'اضغط للتسجيل'}</div>
              </div>
            </div>
          ))}
        </div>

        {/* End Trip Button */}
        <div style={{ padding: '20px 15px' }}>
          <button
            onClick={endTrip}
            style={{ width: '100%', padding: '16px', background: '#c62828', color: 'white', border: 'none', borderRadius: '12px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            🏁 إنهاء الرحلة
          </button>
        </div>
      </div>
    );
  }

  // Trips List Screen
  return (
    <div dir="rtl" style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <div style={{ background: '#1e3a5f', color: 'white', padding: '20px' }}>
        <h1 style={{ margin: 0, fontSize: '22px' }}>🚌 تطبيق السائق</h1>
        <p style={{ margin: '5px 0 0', fontSize: '14px', opacity: 0.8 }}>منصة متين - نظام النقل المدرسي</p>
      </div>

      <div style={{ padding: '20px' }}>
        <h2 style={{ fontSize: '18px', marginBottom: '15px', color: '#333' }}>الرحلات المتاحة</h2>
        
        {trips.length === 0 ? (
          <div style={{ background: 'white', borderRadius: '16px', padding: '40px', textAlign: 'center', color: '#999' }}>
            <div style={{ fontSize: '48px', marginBottom: '10px' }}>🚌</div>
            <p>لا توجد رحلات متاحة حالياً</p>
          </div>
        ) : (
          trips.map(trip => (
            <div key={trip.id} style={{ background: 'white', borderRadius: '16px', padding: '20px', marginBottom: '15px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h3 style={{ margin: 0, fontSize: '18px', color: '#1e3a5f' }}>🚌 {trip.bus_number}</h3>
                <span style={{ background: '#e3f2fd', color: '#1565c0', padding: '4px 12px', borderRadius: '20px', fontSize: '12px' }}>
                  {trip.students.length} طالب
                </span>
              </div>
              <p style={{ color: '#666', fontSize: '14px', margin: '0 0 15px' }}>📍 {trip.route_name}</p>
              <button
                onClick={() => startTrip(trip)}
                style={{ width: '100%', padding: '14px', background: '#4caf50', color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                ▶ بدء الرحلة
              </button>
            </div>
          ))
        )}
      </div>

      <div style={{ padding: '0 20px 20px' }}>
        <button
          onClick={() => { localStorage.removeItem('driver_token'); setIsLoggedIn(false); setToken(''); }}
          style={{ width: '100%', padding: '12px', background: 'transparent', color: '#999', border: '1px solid #ddd', borderRadius: '12px', fontSize: '14px', cursor: 'pointer' }}
        >
          تسجيل الخروج
        </button>
      </div>
    </div>
  );
}
