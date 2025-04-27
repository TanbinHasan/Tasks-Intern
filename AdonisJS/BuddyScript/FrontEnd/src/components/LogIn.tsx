import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, selectUserError, selectUserLoading } from '../store/slices/userSlice';
import { AppDispatch } from '../store';
import Swal from 'sweetalert2';

const LogIn: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [generalError, setGeneralError] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const isLoading = useSelector(selectUserLoading);
  const loginError = useSelector(selectUserError);
  const navigate = useNavigate();

  useEffect(() => {
    const rememberedUser = localStorage.getItem('rememberedUser');
    if (rememberedUser) {
      try {
        const userData = JSON.parse(rememberedUser);
        setEmail(userData.email);
        setPassword(userData.password);
        setRememberMe(true);
      } catch (e) {
        console.error("Failed to parse remembered user data");
        localStorage.removeItem('rememberedUser');
      }
    }
  }, []);

  useEffect(() => {
    // Display SweetAlert for login errors instead of inline messages
    if (loginError) {
      console.log('Login error detected:', loginError);
      Swal.fire({
        title: 'Login Failed',
        text: loginError,
        icon: 'error',
        confirmButtonText: 'Try Again',
        confirmButtonColor: '#3085d6'
      });
      setGeneralError(''); // Clear general error since we're using swal
    }
  }, [loginError]);

  const validateEmail = (email: string): boolean => {
    if (!email.trim()) {
      setEmailError('Email is required');
      return false;
    }
    
    if (!email.includes('@')) {
      setEmailError(`Please include an '@' in the email address`);
      return false;
    }
    
    setEmailError('');
    return true;
  };

  const validatePassword = (password: string): boolean => {
    if (!password.trim()) {
      setPasswordError('Password is required');
      return false;
    }
    
    setPasswordError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError('');

    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    try {
      const result = await dispatch(loginUser({ email, password }));
      
      // Check for rejected status from the action
      if (result.type.endsWith('/rejected')) {
        // Display error with SweetAlert
        Swal.fire({
          title: 'Authentication Failed',
          text: result.payload as string || 'Email or password is incorrect',
          icon: 'error',
          confirmButtonText: 'Try Again',
          confirmButtonColor: '#3085d6'
        });
        return;
      }

      if (rememberMe) {
        localStorage.setItem('rememberedUser', JSON.stringify({ email, password }));
      } else {
        localStorage.removeItem('rememberedUser');
      }
      
      // Show success message before navigation
      Swal.fire({
        title: 'Login Successful',
        text: 'Welcome back!',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      }).then(() => {
        navigate('/feed');
      });
    } catch (err) {
      // Fallback error handling with SweetAlert
      console.error('Login error:', err);
      Swal.fire({
        title: 'Login Failed',
        text: typeof err === 'string' ? err : 'An unexpected error occurred. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3085d6'
      });
    }
  };

  const handleRegisterRedirect = () => {
    navigate('/register');
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRememberMe(e.target.checked);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (emailError) validateEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (passwordError) validatePassword(e.target.value);
  };

  return (
    <>
      <section className="_social_login_wrapper _layout_main_wrapper">
        <div className="_shape_one">
          <img src="assets/images/shape1.svg" alt="" className="_shape_img" />
          <img src="assets/images/dark_shape.svg" alt="" className="_dark_shape" />
        </div>
        <div className="_shape_two">
          <img src="assets/images/shape2.svg" alt="" className="_shape_img" />
          <img src="assets/images/dark_shape1.svg" alt="" className="_dark_shape _dark_shape_opacity" />
        </div>
        <div className="_shape_three">
          <img src="assets/images/shape3.svg" alt="" className="_shape_img" />
          <img src="assets/images/dark_shape2.svg" alt="" className="_dark_shape _dark_shape_opacity" />
        </div>
        <div className="_social_login_wrap">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-xl-8 col-lg-8 col-md-12 col-sm-12">
                <div className="_social_login_left">
                  <div className="_social_login_left_image">
                    <img src="assets/images/login.png" alt="Image" className="_left_img" />
                  </div>
                </div>
              </div>
              <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12">
                <div className="_social_login_content">
                  <div className="_social_login_left_logo _mar_b28">
                    <img src="assets/images/logo.svg" alt="Image" className="_left_logo" />
                  </div>
                  <p className="_social_login_content_para _mar_b8">Welcome back</p>
                  <h4 className="_social_login_content_title _titl4 _mar_b50">Login to your account</h4>
                  <button type="button" className="_social_login_content_btn _mar_b40">
                    <img src="assets/images/google.svg" alt="Image" className="_google_img" /> <span>Or sign-in with google</span>
                  </button>
                  <div className="_social_login_content_bottom_txt _mar_b40">
                    <span>Or</span>
                  </div>
                  {/* Adding a fallback for case when SweetAlert fails */}
                  {generalError && (
                    <div className="alert alert-warning mb-3" role="alert">
                      <i className="bi bi-exclamation-triangle-fill me-2"></i>
                      {generalError}
                    </div>
                  )}
                  <form className="_social_login_form" onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                        <div className="_social_login_form_input _mar_b14">
                          <label className="_social_login_label _mar_b8" htmlFor="email">Email</label>
                          <div className="position-relative">
                            <input
                              id="email"
                              type="text"
                              value={email}
                              onChange={handleEmailChange}
                              onBlur={() => validateEmail(email)}
                              className={`form-control _social_login_input ${emailError ? 'border-warning' : ''}`}
                              style={{ marginBottom: emailError ? '0' : '1rem' }}
                            />
                            {emailError && (
                              <div className="text-warning" style={{ 
                                fontSize: '0.8rem', 
                                marginTop: '0.25rem', 
                                marginBottom: '1rem',
                                display: 'flex',
                                alignItems: 'center'
                              }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-exclamation-triangle-fill me-1" viewBox="0 0 16 16">
                                  <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                                </svg>
                                {emailError}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                        <div className="_social_login_form_input _mar_b14">
                          <label className="_social_login_label _mar_b8" htmlFor="password">Password</label>
                          <div className="position-relative">
                            <input
                              id="password"
                              type="password"
                              value={password}
                              onChange={handlePasswordChange}
                              onBlur={() => validatePassword(password)}
                              className={`form-control _social_login_input ${passwordError ? 'border-warning' : ''}`}
                              style={{ marginBottom: passwordError ? '0' : '1rem' }}
                            />
                            {passwordError && (
                              <div className="text-warning" style={{ 
                                fontSize: '0.8rem', 
                                marginTop: '0.25rem', 
                                marginBottom: '1rem',
                                display: 'flex',
                                alignItems: 'center'
                              }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-exclamation-triangle-fill me-1" viewBox="0 0 16 16">
                                  <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                                </svg>
                                {passwordError}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12">
                        <div className="form-check _social_login_form_check">
                          <input
                            className="form-check-input _social_login_form_check_input"
                            type="checkbox"
                            id="rememberMe"
                            checked={rememberMe}
                            onChange={handleCheckboxChange}
                          />
                          <label className="form-check-label _social_login_form_check_label" htmlFor="rememberMe">Remember me</label>
                        </div>
                      </div>
                      <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12">
                        <div className="_social_login_form_left">
                          <p className="_social_login_form_left_para">Forgot password?</p>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-12 col-md-12 col-xl-12 col-sm-12">
                        <div className="_social_login_form_btn _mar_t40 _mar_b60">
                          <button 
                            type="submit" 
                            className="_social_login_form_btn_link _btn1"
                            disabled={isLoading}
                          >
                            {isLoading ? 'Logging in...' : 'Login now'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                  <div className="row">
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                      <div className="_social_login_bottom_txt">
                        <p className="_social_login_bottom_txt_para">Don't have an account? <a href="#0" onClick={handleRegisterRedirect}>Create New Account</a></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default LogIn;