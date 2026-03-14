import axios from 'axios';

async function runTests() {
  const baseURL = 'http://localhost:5000/api';
  try {
    const loginRes = await axios.post(`${baseURL}/auth/login`, {
      email: 'priya.sharma@gmail.com',
      password: 'Password@123'
    });
    const token = loginRes.data.data.accessToken;
    const axiosInstance = axios.create({
      baseURL,
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('✅ Logged in successfully');

    let res = await axiosInstance.get('/users/profile');
    console.log('✅ GET /api/users/profile:', res.data.data.firstName, res.data.data.lastName);

    res = await axiosInstance.get('/careers?page=1&limit=5');
    console.log('✅ GET /api/careers (count):', res.data.data.careers.length);

    try {
        res = await axiosInstance.get('/careers/software-engineer');
        console.log('✅ GET /api/careers/software-engineer:', res.data.data?.title);
    } catch(err: any) {
        console.log('⚠️ /careers/software-engineer not found, this is fine if not seeded.');
    }

    res = await axiosInstance.get('/careers/categories');
    console.log('✅ GET /api/careers/categories:', res.data.data.length);

    res = await axiosInstance.get('/careers/recommended');
    console.log('✅ GET /api/careers/recommended:', res.data.data.length);

    res = await axiosInstance.get('/student/dashboard-stats');
    console.log('✅ GET /api/student/dashboard-stats:', res.data.data);

    res = await axiosInstance.get('/student/upcoming-appointments');
    console.log('✅ GET /api/student/upcoming-appointments:', res.data.data.length);

    res = await axiosInstance.get('/notifications');
    console.log('✅ GET /api/notifications:', res.data.data.notifications.length, 'unread:', res.data.data.unreadCount);

    res = await axiosInstance.get('/resources/featured');
    console.log('✅ GET /api/resources/featured:', res.data.data.length);

  } catch (error: any) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

runTests();
