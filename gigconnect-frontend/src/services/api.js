import axios from 'axios';

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000, // Reduced timeout to 5 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Declare mockUsers before use
const mockUsers = [
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    role: "freelancer",
    location: "Los Angeles, CA",
    createdAt: "2024-01-05T00:00:00Z"
  },
  {
    id: 3,
    name: "Admin User",
    email: "admin@gigconnect.com",
    role: "admin",
    location: "San Francisco, CA",
    createdAt: "2024-01-01T00:00:00Z"
  },
  {
    id: 4,
    name: "Bob Wilson",
    email: "bob@example.com",
    role: "client",
    location: "Chicago, IL",
    createdAt: "2024-01-08T00:00:00Z"
  }
];

// Mock data for development
const mockFreelancers = [
  {
    id: 1,
    name: "Shankar Yerra",
    email: "sarah@example.com",
    location: "New York, NY",
    rating: 4.8,
    reviewCount: 42,
    bio: "Full-stack developer with 5+ years of experience in React and Node.js. I specialize in building scalable web applications and have worked with startups and enterprises alike.",
    skills: ["React", "Node.js", "JavaScript", "MongoDB", "Express", "TypeScript"],
    hourlyRate: 75,
    isOnline: true,
    availability: 'available',
    experience: 'expert'
  },
  {
    id: 2,
    name: "Siva Kumar",
    email: "mike@example.com",
    location: "San Francisco, CA",
    rating: 4.9,
    reviewCount: 38,
    bio: "UI/UX designer specializing in modern web applications and mobile interfaces. I create beautiful, user-friendly designs that convert.",
    skills: ["UI/UX Design", "Figma", "Adobe Creative Suite", "Prototyping", "Sketch"],
    hourlyRate: 65,
    isOnline: false,
    availability: 'busy',
    experience: 'expert'
  },
  {
    id: 3,
    name: "Saketh",
    email: "emily@example.com",
    location: "Austin, TX",
    rating: 4.7,
    reviewCount: 29,
    bio: "Digital marketing expert with focus on social media and content strategy. I help businesses grow their online presence and engage with customers.",
    skills: ["Digital Marketing", "SEO", "Content Strategy", "Social Media", "Analytics"],
    hourlyRate: 50,
    isOnline: true,
    availability: 'available',
    experience: 'intermediate'
  },
  {
    id: 4,
    name: "Santhosh",
    email: "Santhosh@example.com",
    location: "Seattle, WA",
    rating: 4.6,
    reviewCount: 51,
    bio: "Mobile app developer for iOS and Android platforms. I build native and cross-platform applications using the latest technologies.",
    skills: ["iOS Development", "Android", "React Native", "Swift", "Kotlin"],
    hourlyRate: 80,
    isOnline: false,
    availability: 'available',
    experience: 'expert'
  }
];

const mockGigs = [
  {
    id: 1,
    title: "E-commerce Website Development",
    description: "Need a modern e-commerce website with payment integration, user management, product catalog, and admin dashboard. The site should be responsive and SEO optimized.",
    budget: 2500,
    deadline: "2024-03-15",
    status: "open",
    skills: ["React", "Node.js", "Payment Integration", "Database", "SEO"],
    location: "Remote",
    category: "Web Development",
    experienceLevel: "intermediate",
    projectType: "one-time",
    clientId: 1,
    client: { name: "shankar Yerra", email: "yerrashankar9392@gamail.com" },
    applicationCount: 12,
    createdAt: "2025-09-09T00:00:00Z"
  },
  {
    id: 2,
    name: "siva kumar",
    email: "siva@example.com",
    role: "freelancer",
    location: "Los Angeles, CA",
    createdAt: "2025-018-011T00:00:00Z"
  },
  {
    id: 3,
    name: "Admin User",
    email: "admin@gigconnect.com",
    role: "admin",
    location: "San Francisco, CA",
    createdAt: "2025-010-01T00:00:00Z"
  },
  {
    id: 4,
    name: "saketh",
    email: "saketh@example.com",
    role: "client",
    location: "Chicago, IL",
    createdAt: "2025-011-06T00:00:00Z"
  }
];

const mockConversations = [
  {
    id: 1,
    participants: [1, 2],
    otherUser: { id: 2, name: "Shankar Yerra", role: "freelancer" },
    lastMessage: {
      id: 1,
      content: "Thanks for your interest in the project! When can we schedule a call?",
      senderId: 1,
      createdAt: "2025-08-15T10:30:00Z"
    },
    createdAt: "2025-08-15T10:00:00Z"
  },
  {
    id: 2,
    participants: [1, 3],
    otherUser: { id: 3, name: "Siva Kumar", role: "freelancer" },
    lastMessage: {
      id: 2,
      content: "I've reviewed your requirements. When can we start the project?",
      senderId: 3,
      createdAt: "2025-09-16T15:45:00Z"
    },
    createdAt: "2025-09-16T15:00:00Z"
  }
];

const mockMessages = [
  {
    id: 1,
    conversationId: 1,
    content: "Hi! I'm interested in your e-commerce project.",
    senderId: 2,
    createdAt: "2025-07-15T10:00:00Z"
  },
  {
    id: 2,
    conversationId: 1,
    content: "Great! I'd love to discuss the requirements in detail.",
    senderId: 1,
    createdAt: "2025-08-15T10:15:00Z"
  },
  {
    id: 3,
    conversationId: 1,
    content: "Thanks for your interest in the project! When can we schedule a call?",
    senderId: 1,
    createdAt: "2025-09-15T10:30:00Z"
  }
];

// Simulate API delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API responses for development
const mockResponses = {
  // Authentication
  login: async (credentials) => {
    await delay(800);
    
    if (credentials.email === 'admin@gigconnect.com' && credentials.password === 'admin123') {
      return {
        data: {
          id: 3,
          name: "Admin User",
          email: "admin@gigconnect.com",
          role: "admin",
          location: "San Francisco, CA",
          token: "mock_admin_token_" + Date.now()
        }
      };
    }
    
    if (credentials.email && credentials.password) {
      const isFreelancer = credentials.email.toLowerCase().includes('freelancer');
      return {
        data: {
          id: Math.floor(Math.random() * 1000) + 100,
          name: "Demo User",
          email: credentials.email,
          role: isFreelancer ? 'freelancer' : 'client',
          location: "Demo City, ST",
          token: "mock_token_" + Date.now()
        }
      };
    }
    
    throw new Error('Invalid credentials');
  },
  
  register: async (userData) => {
    await delay(1000);
    
    if (!userData.email || !userData.password || !userData.name) {
      throw new Error('All fields are required');
    }
    
    return {
      data: {
        id: Math.floor(Math.random() * 1000) + 100,
        ...userData,
        token: "mock_token_" + Date.now()
      }
    };
  },

  // Freelancers
  searchFreelancers: async (params) => {
    await delay();
    let results = [...mockFreelancers];
    
    if (params.skills) {
      const searchSkills = params.skills.toLowerCase().split(',').map(s => s.trim());
      results = results.filter(f => 
        f.skills.some(skill => 
          searchSkills.some(searchSkill => 
            skill.toLowerCase().includes(searchSkill)
          )
        )
      );
    }
    
    if (params.location) {
      results = results.filter(f => 
        f.location.toLowerCase().includes(params.location.toLowerCase())
      );
    }
    
    if (params.minPrice) {
      results = results.filter(f => f.hourlyRate >= parseInt(params.minPrice));
    }
    
    if (params.maxPrice) {
      results = results.filter(f => f.hourlyRate <= parseInt(params.maxPrice));
    }
    
    if (params.minRating) {
      results = results.filter(f => f.rating >= parseFloat(params.minRating));
    }
    
    return { data: results };
  },
  
  getFreelancerById: async (id) => {
    await delay();
    const freelancer = mockFreelancers.find(f => f.id === parseInt(id));
    if (!freelancer) {
      throw new Error('Freelancer not found');
    }
    return { data: freelancer };
  },

  // Gigs
  getMyGigs: async () => {
    await delay();
    return { data: mockGigs };
  },
  
  createGig: async (data) => {
    await delay(800);
    
    if (!data.title || !data.description || !data.budget) {
      throw new Error('Required fields are missing');
    }
    
    return {
      data: {
        id: Math.floor(Math.random() * 1000) + 100,
        ...data,
        status: 'open',
        applicationCount: 0,
        createdAt: new Date().toISOString(),
        client: { name: "Demo User", email: "demo@example.com" }
      }
    };
  },
  
  deleteGig: async (id) => {
    await delay(300);
    return { data: { success: true, message: 'Gig deleted successfully' } };
  },

  // Messages
  getConversations: async () => {
    await delay();
    return { data: mockConversations };
  },
  
  getMessages: async (conversationId) => {
    await delay();
    const messages = mockMessages.filter(m => m.conversationId === parseInt(conversationId));
    return { data: messages };
  },
  
  sendMessage: async (data) => {
    await delay(300);
    return {
      data: {
        id: Math.floor(Math.random() * 1000) + 100,
        ...data,
        createdAt: new Date().toISOString()
      }
    };
  },

  // Admin
  getAdminStats: async () => {
    await delay();
    return {
      data: {
        totalUsers: 1250,
        totalGigs: 456,
        totalTransactions: 89
      }
    };
  },
  
  getAdminUsers: async () => {
    await delay();
    return { data: mockUsers };
  },
  
  getAdminGigs: async () => {
    await delay();
    return { data: mockGigs };
  },

  // Payments
  createPaymentOrder: async (data) => {
    await delay(1000);
    return {
      data: {
        orderId: `order_${Date.now()}`,
        amount: data.amount,
        currency: 'USD',
        key: 'rzp_test_mock_key'
      }
    };
  },
  
  verifyPayment: async (data) => {
    await delay(500);
    return {
      data: {
        success: true,
        transactionId: `txn_${Date.now()}`,
        message: 'Payment verified successfully'
      }
    };
  }
};

// Development mode - use mock data
if (process.env.NODE_ENV === 'development' || !process.env.REACT_APP_API_URL) {
  console.log('🚧 Running in development mode with mock data');
  
  // Override API calls with mock responses
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const { config } = error;
      const method = config.method.toLowerCase();
      const url = config.url;
      
      console.log(`Mock API: ${method.toUpperCase()} ${url}`, config.data || config.params);
      
      try {
        // Route requests to mock responses
        if (method === 'post' && url === '/auth/login') {
          return await mockResponses.login(JSON.parse(config.data));
        }
        
        if (method === 'post' && url === '/auth/register') {
          return await mockResponses.register(JSON.parse(config.data));
        }
        
        if (method === 'get' && url.includes('/freelancers/search')) {
          return await mockResponses.searchFreelancers(config.params || {});
        }
        
        if (method === 'get' && url.match(/\/freelancers\/\d+$/)) {
          const id = url.split('/').pop();
          return await mockResponses.getFreelancerById(id);
        }
        
        if (method === 'get' && url === '/gigs/my-gigs') {
          return await mockResponses.getMyGigs();
        }
        
        if (method === 'post' && url === '/gigs') {
          return await mockResponses.createGig(JSON.parse(config.data));
        }
        
        if (method === 'delete' && url.match(/\/gigs\/\d+$/)) {
          const id = url.split('/').pop();
          return await mockResponses.deleteGig(id);
        }
        
        if (method === 'get' && url === '/messages/conversations') {
          return await mockResponses.getConversations();
        }
        
        if (method === 'get' && url.match(/\/messages\/\d+$/)) {
          const conversationId = url.split('/').pop();
          return await mockResponses.getMessages(conversationId);
        }
        
        if (method === 'post' && url === '/messages') {
          return await mockResponses.sendMessage(JSON.parse(config.data));
        }
        
        if (method === 'get' && url === '/admin/stats') {
          return await mockResponses.getAdminStats();
        }
        
        if (method === 'get' && url === '/admin/users') {
          return await mockResponses.getAdminUsers();
        }
        
        if (method === 'get' && url === '/admin/gigs') {
          return await mockResponses.getAdminGigs();
        }
        
        if (method === 'post' && url === '/payments/create-order') {
          return await mockResponses.createPaymentOrder(JSON.parse(config.data));
        }
        
        if (method === 'post' && url === '/payments/verify') {
          return await mockResponses.verifyPayment(JSON.parse(config.data));
        }
        
      } catch (mockError) {
        // Return mock error response
        return Promise.reject({
          response: {
            status: 400,
            data: { message: mockError.message }
          }
        });
      }
      
      // If no mock response found, return original error
      return Promise.reject(error);
    }
  );
}

// API Functions
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  refreshToken: () => api.post('/auth/refresh')
};

export const freelancerAPI = {
  getAll: (params) => api.get('/freelancers', { params }),
  getById: (id) => api.get(`/freelancers/${id}`),
  update: (id, data) => api.put(`/freelancers/${id}`, data),
  search: (params) => api.get('/freelancers/search', { params }),
  getProfile: () => api.get('/freelancers/profile')
};

export const gigAPI = {
  getAll: (params) => api.get('/gigs', { params }),
  getMyGigs: () => api.get('/gigs/my-gigs'),
  getById: (id) => api.get(`/gigs/${id}`),
  create: (data) => api.post('/gigs', data),
  update: (id, data) => api.put(`/gigs/${id}`, data),
  delete: (id) => api.delete(`/gigs/${id}`),
  getApplications: (id) => api.get(`/gigs/${id}/applications`)
};

export const messageAPI = {
  getConversations: () => api.get('/messages/conversations'),
  getMessages: (conversationId) => api.get(`/messages/${conversationId}`),
  sendMessage: (data) => api.post('/messages', data),
  markAsRead: (messageId) => api.put(`/messages/${messageId}/read`)
};

export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getUsers: (params) => api.get('/admin/users', { params }),
  getGigs: (params) => api.get('/admin/gigs', { params }),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  suspendUser: (id) => api.put(`/admin/users/${id}/suspend`)
};

export const paymentAPI = {
  createOrder: (data) => api.post('/payments/create-order', data),
  verifyPayment: (data) => api.post('/payments/verify', data),
  getTransactions: () => api.get('/payments/transactions')
};

export default api;





// import axios from 'axios';

// const API_URL = 'http://localhost:5000/api';

// const getToken = () => localStorage.getItem('token');

// // Auth APIs
// export const authAPI = {
//   register: (data) => axios.post(`${API_URL}/auth/register`, data),
//   login: (data) => axios.post(`${API_URL}/auth/login`, data),
// };

// // Freelancer APIs
// export const freelancerAPI = {
//   upsertProfile: (data) =>
//     axios.post(`${API_URL}/freelancers/profile`, data, {
//       headers: { Authorization: `Bearer ${getToken()}` },
//     }),
//   getProfiles: () => axios.get(`${API_URL}/freelancers/profiles`),
// };

// // Gig APIs
// export const gigAPI = {
//   createGig: (data) =>
//     axios.post(`${API_URL}/gigs`, data, {
//       headers: { Authorization: `Bearer ${getToken()}` },
//     }),
//   getGigs: () => axios.get(`${API_URL}/gigs`),
//   getMyGigs: () =>
//     axios.get(`${API_URL}/gigs/my`, {
//       headers: { Authorization: `Bearer ${getToken()}` },
//     }),
//   deleteGig: (id) =>
//     axios.delete(`${API_URL}/gigs/${id}`, {
//       headers: { Authorization: `Bearer ${getToken()}` },
//     }),
// };
// export const adminAPI = {
//   getStats: () => api.get('/admin/stats'),
//   getUsers: (params) => api.get('/admin/users', { params }),
//   getGigs: (params) => api.get('/admin/gigs', { params }),
//   updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
//   deleteUser: (id) => api.delete(`/admin/users/${id}`),
//   suspendUser: (id) => api.put(`/admin/users/${id}/suspend`)
// };

// export const messageAPI = {
//   getConversations: () => api.get('/messages/conversations'),
//   getMessages: (conversationId) => api.get(`/messages/${conversationId}`),
//   sendMessage: (data) => api.post('/messages', data),
//   markAsRead: (messageId) => api.put(`/messages/${messageId}/read`)
// };
