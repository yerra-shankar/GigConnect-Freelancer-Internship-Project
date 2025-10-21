// //Login.js
// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { useAppContext } from '../../context/AppContext';
// import { authAPI } from '../../services/api';


// const Login = () => {
//   const [formData, setFormData] = useState({
//     email: '',
//     password: ''
//   });
//   const [errors, setErrors] = useState({});
  
//   const { login, setLoading, showAlert } = useAppContext();
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
    
//     // Clear error when user starts typing
//     if (errors[name]) {
//       setErrors(prev => ({
//         ...prev,
//         [name]: ''
//       }));
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};
    
//     if (!formData.email) {
//       newErrors.email = 'Email is required';
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = 'Email is invalid';
//     }
    
//     if (!formData.password) {
//       newErrors.password = 'Password is required';
//     } else if (formData.password.length < 6) {
//       newErrors.password = 'Password must be at least 6 characters';
//     }
    
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       return;
//     }

//     setLoading(true);

//     try {
//       const response = await authAPI.login(formData);
//       login(response.data);
//       showAlert('Login successful! Welcome back!', 'success');
//       navigate('/');
//     } catch (error) {
//       const errorMessage = error.response?.data?.message || error.message || 'Login failed';
//       showAlert(errorMessage, 'danger');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="login-page-wrapper">
//       <div className="container mt-5 login-container">
//         <div className="row justify-content-center">
//           <div className="col-md-5 col-lg-4">
//             <div className="card shadow login-card">
//               <div className="card-body p-4 login-card-body">
//                 <div className="text-center mb-4 login-header">
//                   <div className="login-icon-wrapper">
//                     <i className="fas fa-handshake login-brand-icon"></i>
//                   </div>
//                   <h3 className="login-title">Welcome Back</h3>
//                   <p className="login-subtitle">Sign in to your account</p>
//                 </div>
                
//                 <form onSubmit={handleSubmit} noValidate className="login-form">
//                   <div className="mb-3 input-group-wrapper">
//                     <label htmlFor="email" className="form-label input-label">
//                       <i className="fas fa-envelope input-label-icon"></i>
//                       Email Address
//                     </label>
//                     <input
//                       type="email"
//                       className={`form-control input-custom ${errors.email ? 'is-invalid' : ''}`}
//                       id="email"
//                       name="email"
//                       value={formData.email}
//                       onChange={handleChange}
//                       placeholder="Enter your email"
//                       required
//                     />
//                     {errors.email && <div className="invalid-feedback error-message">{errors.email}</div>}
//                   </div>
                  
//                   <div className="mb-3 input-group-wrapper">
//                     <label htmlFor="password" className="form-label input-label">
//                       <i className="fas fa-lock input-label-icon"></i>
//                       Password
//                     </label>
//                     <input
//                       type="password"
//                       className={`form-control input-custom ${errors.password ? 'is-invalid' : ''}`}
//                       id="password"
//                       name="password"
//                       value={formData.password}
//                       onChange={handleChange}
//                       placeholder="Enter your password"
//                       required
//                     />
//                     {errors.password && <div className="invalid-feedback error-message">{errors.password}</div>}
//                   </div>

//                   <div className="mb-3 text-end">
//                     <Link to="/" className="forgot-link">
//                       Forgot Password?
//                     </Link>
//                   </div>
                  
//                   <button type="submit" className="btn btn-primary w-100 mb-3 login-btn">
//                     <i className="fas fa-sign-in-alt me-2 btn-icon"></i>
//                     Sign In
//                   </button>
//                 </form>
                
//                 <div className="text-center login-footer">
//                   <p className="mb-0 footer-text">
//                     Don't have an account?{' '}
//                     <Link to="/register" className="register-link">
//                       Create one here
//                     </Link>
//                   </p>
//                 </div>

//                 <div className="divider-wrapper">
//                   <div className="divider">
//                     <span className="divider-text">OR</span>
//                   </div>
//                 </div>

//                 <div className="social-login">
//                   <button className="btn btn-outline-secondary w-100 mb-2 social-btn google-btn">
//                     <i className="fab fa-google me-2"></i>
//                     Continue with Google
//                   </button>
//                   <button className="btn btn-outline-secondary w-100 social-btn linkedin-btn">
//                     <i className="fab fa-linkedin me-2"></i>
//                     Continue with LinkedIn
//                   </button>
//                 </div>

//                 {/* Demo Credentials */}
//                 <div className="mt-4 p-3 bg-light rounded">
//                 <h6 className="text-muted">Demo Credentials:</h6>
//                 <small className="text-muted">
//                   Admin: admin@gigconnect.com / admin123<br/>
//                   Or use any email/password combination
//                 </small>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;


// Login.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { authAPI } from '../../services/api';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  
  const { login, setLoading, showAlert } = useAppContext();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await authAPI.login(formData); // axios response
      // response.data should be { token, user }
      login(response.data); // set token & user in context + localStorage

      showAlert('Login successful! Welcome back!', 'success');

      // Redirect based on role
      const role = response.data?.user?.role;
      if (role === 'freelancer') navigate('/profile');
      else if (role === 'client') navigate('/gigs');
      else if (role === 'admin') navigate('/admin');
      else navigate('/');
    } catch (error) {
      const resp = error.response?.data;
      let errorMessage = 'Login failed';
      if (resp) {
        errorMessage = resp.message || resp.msg || (resp.errors && resp.errors[0]?.msg) || JSON.stringify(resp);
      } else {
        errorMessage = error.message || error.toString();
      }
      showAlert(errorMessage, 'danger');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="container mt-5 login-container">
        <div className="row justify-content-center">
          <div className="col-md-5 col-lg-4">
            <div className="card shadow login-card">
              <div className="card-body p-4 login-card-body">
                <div className="text-center mb-4 login-header">
                  <div className="login-icon-wrapper">
                    <i className="fas fa-handshake login-brand-icon"></i>
                  </div>
                  <h3 className="login-title">Welcome Back</h3>
                  <p className="login-subtitle">Sign in to your account</p>
                </div>
                
                <form onSubmit={handleSubmit} noValidate className="login-form">
                  <div className="mb-3 input-group-wrapper">
                    <label htmlFor="email" className="form-label input-label">
                      <i className="fas fa-envelope input-label-icon"></i>
                      Email Address
                    </label>
                    <input
                      type="email"
                      className={`form-control input-custom ${errors.email ? 'is-invalid' : ''}`}
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                    />
                    {errors.email && <div className="invalid-feedback error-message">{errors.email}</div>}
                  </div>
                  
                  <div className="mb-3 input-group-wrapper">
                    <label htmlFor="password" className="form-label input-label">
                      <i className="fas fa-lock input-label-icon"></i>
                      Password
                    </label>
                    <input
                      type="password"
                      className={`form-control input-custom ${errors.password ? 'is-invalid' : ''}`}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      required
                    />
                    {errors.password && <div className="invalid-feedback error-message">{errors.password}</div>}
                  </div>

                  <div className="mb-3 text-end">
                    <Link to="/" className="forgot-link">
                      Forgot Password?
                    </Link>
                  </div>
                  
                  <button type="submit" className="btn btn-primary w-100 mb-3 login-btn">
                    <i className="fas fa-sign-in-alt me-2 btn-icon"></i>
                    Sign In
                  </button>
                </form>
                
                <div className="text-center login-footer">
                  <p className="mb-0 footer-text">
                    Don't have an account?{' '}
                    <Link to="/register" className="register-link">
                      Create one here
                    </Link>
                  </p>
                </div>

                <div className="divider-wrapper">
                  <div className="divider">
                    <span className="divider-text">OR</span>
                  </div>
                </div>

                <div className="social-login">
                  <button className="btn btn-outline-secondary w-100 mb-2 social-btn google-btn">
                    <i className="fab fa-google me-2"></i>
                    Continue with Google
                  </button>
                  <button className="btn btn-outline-secondary w-100 social-btn linkedin-btn">
                    <i className="fab fa-linkedin me-2"></i>
                    Continue with LinkedIn
                  </button>
                </div>

                {/* Demo Credentials */}
                <div className="mt-4 p-3 bg-light rounded">
                  <h6 className="text-muted">Demo Credentials:</h6>
                  <small className="text-muted">
                    Admin: admin@gigconnect.com / admin123<br/>
                    Or use any email/password combination
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> 
    </div>
  );
};

export default Login;
