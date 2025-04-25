import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, selectUserError, selectUserLoading } from '../store/slices/userSlice';
import { AppDispatch } from '../store';

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
    // Update local error state when redux state changes
    if (loginError) {
      setGeneralError(loginError);
    }
  }, [loginError]);

  const validateEmail = (email: string): boolean => {
    if (!email.trim()) {
      setEmailError('Email is required');
      return false;
    }
    
    if (!email.includes('@')) {
      setEmailError(`Please include an '@' in the email address. '${email}' is missing an '@'.`);
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
    setEmailError('');
    setPasswordError('');

    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    try {
      await dispatch(loginUser({ email, password })).unwrap();

      if (rememberMe) {
        localStorage.setItem('rememberedUser', JSON.stringify({ email, password }));
      } else {
        localStorage.removeItem('rememberedUser');
      }
      navigate('/feed');
    } catch (err) {
      setGeneralError(err as string || 'Login failed');
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
                  {generalError && <div className="alert alert-danger" role="alert">{generalError}</div>}
                  <form className="_social_login_form" onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                        <div className="_social_login_form_input _mar_b14">
                          <div className="d-flex justify-content-between align-items-center">
                            <label className="_social_login_label _mar_b8" htmlFor="email">Email</label>
                            {emailError && <span className="text-danger small">{emailError}</span>}
                          </div>
                          <div className="position-relative">
                            <input
                              id="email"
                              type="text"
                              value={email}
                              onChange={handleEmailChange}
                              onBlur={() => validateEmail(email)}
                              className={`form-control _social_login_input ${emailError ? 'is-invalid' : ''}`}
                            />
                            {emailError && (
                              <div className="invalid-tooltip" style={{ display: 'block', position: 'absolute', top: '100%', zIndex: 5 }}>
                                {emailError}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                        <div className="_social_login_form_input _mar_b14">
                          <div className="d-flex justify-content-between align-items-center">
                            <label className="_social_login_label _mar_b8" htmlFor="password">Password</label>
                            {passwordError && <span className="text-danger small">{passwordError}</span>}
                          </div>
                          <div className="position-relative">
                            <input
                              id="password"
                              type="password"
                              value={password}
                              onChange={handlePasswordChange}
                              onBlur={() => validatePassword(password)}
                              className={`form-control _social_login_input ${passwordError ? 'is-invalid' : ''}`}
                            />
                            {passwordError && (
                              <div className="invalid-tooltip" style={{ display: 'block', position: 'absolute', top: '100%', zIndex: 5 }}>
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