import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const bannedUsernames = ["meta", "google", "facebook", "twitter"];

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState("");
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
  });
  const [isPasswordMatched, setIsPasswordMatched] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  // Add touched state to track which fields have been interacted with
  const [touched, setTouched] = useState({
    email: false,
    password: false,
    confirmPassword: false,
    terms: false,
  });

  const navigate = useNavigate();

  const validatePassword = (password) => {
    setPasswordCriteria({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
    });
  };

  useEffect(() => {
    if (password && confirmPassword) {
      setIsPasswordMatched(password === confirmPassword);
    } else {
      setIsPasswordMatched(false);
    }
  }, [password, confirmPassword]);

  // Check form validity
  useEffect(() => {
    setIsFormValid(
      email && 
      password && 
      confirmPassword && 
      isPasswordMatched && 
      passwordCriteria.length && 
      passwordCriteria.uppercase && 
      passwordCriteria.lowercase && 
      passwordCriteria.number && 
      termsAccepted
    );
  }, [email, password, confirmPassword, isPasswordMatched, passwordCriteria, termsAccepted]);

  // Validate all form fields and return specific errors
  const validateForm = () => {
    if (!email) {
      return "Email is required.";
    }
    
    if (localStorage.getItem(email) !== null) {
      return "Email already exists. Please choose another.";
    }
    
    if (!password) {
      return "Password is required.";
    }
    
    if (!passwordCriteria.length || !passwordCriteria.uppercase || 
        !passwordCriteria.lowercase || !passwordCriteria.number) {
      return "Password must meet all the required criteria.";
    }
    
    if (!confirmPassword) {
      return "Please confirm your password.";
    }
    
    if (password !== confirmPassword) {
      return "Passwords do not match. Please re-enter.";
    }
    
    if (!termsAccepted) {
      return "You must accept the terms and conditions to register.";
    }
    
    return "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Mark all fields as touched when form is submitted
    setTouched({
      email: true,
      password: true,
      confirmPassword: true,
      terms: true,
    });

    // Validate the form
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      // Display alert for better visibility
      alert(validationError);
      return;
    }

    const userData = { email, password };
    localStorage.setItem(email, JSON.stringify(userData));
    alert("Registration successful!");
    setError("");
    navigate("/");
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setTouched({ ...touched, email: true });

    if (value && localStorage.getItem(value) !== null) {
      setError("Email already exists. Please choose another.");
    } else {
      setError("");
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setTouched({ ...touched, password: true });
    validatePassword(value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setTouched({ ...touched, confirmPassword: true });
  };

  const handleCheckboxChange = (e) => {
    setTermsAccepted(e.target.checked);
    setTouched({ ...touched, terms: true });
    
    if (!e.target.checked && touched.terms) {
      setError("You must accept the terms and conditions to register.");
    } else {
      setError("");
    }
  };

  // Validate on blur handlers
  const handleEmailBlur = () => {
    setTouched({ ...touched, email: true });
    if (!email) {
      setError("Email is required.");
    }
  };

  const handlePasswordBlur = () => {
    setTouched({ ...touched, password: true });
    if (!password) {
      setError("Password is required.");
    } else if (!passwordCriteria.length || !passwordCriteria.uppercase || 
               !passwordCriteria.lowercase || !passwordCriteria.number) {
      setError("Password must meet all the required criteria.");
    }
  };

  const handleConfirmPasswordBlur = () => {
    setTouched({ ...touched, confirmPassword: true });
    if (!confirmPassword) {
      setError("Please confirm your password.");
    } else if (password !== confirmPassword) {
      setError("Passwords do not match.");
    }
  };

  return (
    <>
      <section className="_social_registration_wrapper _layout_main_wrapper">
        <div className="_shape_one">
          <img src="assets/images/shape1.svg" alt="" className="_shape_img" />
          <img src="assets/images/dark_shape.svg" alt="" className="_dark_shape" />
        </div>
        <div className="_shape_two">
          <img src="assets/images/shape2.svg" alt="" className="_shape_img" />
          <img
            src="assets/images/dark_shape1.svg"
            alt=""
            className="_dark_shape _dark_shape_opacity"
          />
        </div>
        <div className="_shape_three">
          <img src="assets/images/shape3.svg" alt="" className="_shape_img" />
          <img
            src="assets/images/dark_shape2.svg"
            alt=""
            className="_dark_shape _dark_shape_opacity"
          />
        </div>
        <div className="_social_registration_wrap">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-xl-8 col-lg-8 col-md-12 col-sm-12">
                <div className="_social_registration_right">
                  <div className="_social_registration_right_image">
                    <img src="assets/images/registration.png" alt="Image" />
                  </div>
                  <div className="_social_registration_right_image_dark">
                    <img src="assets/images/registration1.png" alt="Image" />
                  </div>
                </div>
              </div>
              <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12">
                <div className="_social_registration_content">
                  <div className="_social_registration_right_logo _mar_b28">
                    <img src="assets/images/logo.svg" alt="Logo" className="_right_logo" />
                  </div>
                  <p className="_social_registration_content_para _mar_b8">Get Started Now</p>
                  <h4 className="_social_registration_content_title _titl4 _mar_b50">Registration</h4>
                  <button type="button" className="_social_registration_content_btn _mar_b40">
                    <img src="assets/images/google.svg" alt="Google Icon" className="_google_img" />{" "}
                    <span>Register with google</span>
                  </button>
                  <div className="_social_registration_content_bottom_txt _mar_b40">
                    <span>Or</span>
                  </div>
                  
                  {/* Error message display with better styling */}
                  {error && (
                    <div 
                      style={{ 
                        color: "white", 
                        backgroundColor: "#dc3545", 
                        padding: "10px", 
                        borderRadius: "5px",
                        marginBottom: "15px" 
                      }}
                    >
                      {error}
                    </div>
                  )}
                  
                  <form className="_social_registration_form" onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                        <div className="_social_registration_form_input _mar_b14">
                          <label
                            className="_social_registration_label _mar_b8"
                            htmlFor="email"
                          >
                            Email
                          </label>
                          <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={handleEmailChange}
                            onBlur={handleEmailBlur}
                            className={`form-control _social_registration_input ${touched.email && !email ? "is-invalid" : ""}`}
                            required
                          />
                          {touched.email && !email && (
                            <div className="invalid-feedback" style={{ display: "block", color: "#dc3545" }}>
                              Email is required
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                        <div className="_social_registration_form_input _mar_b14">
                          <label
                            className="_social_registration_label _mar_b8"
                            htmlFor="password"
                          >
                            Password
                          </label>
                          <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={handlePasswordChange}
                            onBlur={handlePasswordBlur}
                            className={`form-control _social_registration_input ${touched.password && !password ? "is-invalid" : ""}`}
                            required
                          />
                          {touched.password && !password && (
                            <div className="invalid-feedback" style={{ display: "block", color: "#dc3545" }}>
                              Password is required
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Password criteria section (from second file) */}
                      <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                        <div className="password-criteria _mar_b14">
                          <div className="criteria-item">
                            <input
                              type="checkbox"
                              checked={passwordCriteria.length}
                              disabled
                              className="mr-2"
                            />
                            <span className={passwordCriteria.length ? "text-success" : "text-danger"}>
                              At least 8 characters long
                            </span>
                          </div>
                          <div className="criteria-item">
                            <input
                              type="checkbox"
                              checked={passwordCriteria.uppercase}
                              disabled
                              className="mr-2"
                            />
                            <span className={passwordCriteria.uppercase ? "text-success" : "text-danger"}>
                              At least one uppercase letter
                            </span>
                          </div>
                          <div className="criteria-item">
                            <input
                              type="checkbox"
                              checked={passwordCriteria.lowercase}
                              disabled
                              className="mr-2"
                            />
                            <span className={passwordCriteria.lowercase ? "text-success" : "text-danger"}>
                              At least one lowercase letter
                            </span>
                          </div>
                          <div className="criteria-item">
                            <input
                              type="checkbox"
                              checked={passwordCriteria.number}
                              disabled
                              className="mr-2"
                            />
                            <span className={passwordCriteria.number ? "text-success" : "text-danger"}>
                              At least one number
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                        <div className="_social_registration_form_input _mar_b14">
                          <label
                            className="_social_registration_label _mar_b8"
                            htmlFor="repeatPassword"
                          >
                            Repeat Password
                          </label>
                          <input
                            id="repeatPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            onBlur={handleConfirmPasswordBlur}
                            className={`form-control _social_registration_input ${touched.confirmPassword && !confirmPassword ? "is-invalid" : ""}`}
                            required
                          />
                          {touched.confirmPassword && !confirmPassword && (
                            <div className="invalid-feedback" style={{ display: "block", color: "#dc3545" }}>
                              Please confirm your password
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {password && confirmPassword && (
                        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 _mar_b14">
                          <p className={isPasswordMatched ? "text-success" : "text-danger"}>
                            {isPasswordMatched ? "Passwords match." : "Passwords do not match."}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="row">
                      <div className="col-lg-12 col-xl-12 col-md-12 col-sm-12">
                        <div className="form-check _social_registration_form_check">
                          <input
                            className="form-check-input _social_registration_form_check_input"
                            type="checkbox"
                            name="termsConditions"
                            id="flexCheckDefault"
                            checked={termsAccepted}
                            onChange={handleCheckboxChange}
                            required
                          />
                          <label
                            className="form-check-label _social_registration_form_check_label"
                            htmlFor="flexCheckDefault"
                          >
                            I agree to terms & conditions
                          </label>
                          {touched.terms && !termsAccepted && (
                            <div className="invalid-feedback" style={{ display: "block", color: "#dc3545" }}>
                              You must accept the terms and conditions
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-12 col-md-12 col-xl-12 col-sm-12">
                        <div className="_social_registration_form_btn _mar_t40 _mar_b60">
                          <button 
                            type="submit" 
                            className="_social_registration_form_btn_link _btn1"
                          >
                            Register now
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                  <div className="row">
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                      <div className="_social_registration_bottom_txt">
                        <p className="_social_registration_bottom_txt_para">
                          Already have an account? <a href="#0" onClick={(e) => navigate("/")}>Login here</a>
                        </p>
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

export default Register;