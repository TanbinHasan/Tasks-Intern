import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import conf from "../conf/conf";

// Password criteria interface
interface PasswordCriteria {
  length: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
}

// Touched fields interface
interface TouchedFields {
  name: boolean;
  email: boolean;
  password: boolean;
  confirmPassword: boolean;
  terms: boolean;
}

const Register: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [passwordCriteria, setPasswordCriteria] = useState<PasswordCriteria>({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
  });
  const [isPasswordMatched, setIsPasswordMatched] = useState<boolean>(false);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [touched, setTouched] = useState<TouchedFields>({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
    terms: false,
  });

  const navigate = useNavigate();

  const validatePassword = (password: string): void => {
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

  useEffect(() => {
    setIsFormValid(
      Boolean(name) &&
      Boolean(email) && 
      Boolean(password) && 
      Boolean(confirmPassword) && 
      isPasswordMatched && 
      passwordCriteria.length && 
      passwordCriteria.uppercase && 
      passwordCriteria.lowercase && 
      passwordCriteria.number && 
      termsAccepted
    );
  }, [
    name, 
    email, 
    password, 
    confirmPassword, 
    isPasswordMatched, 
    passwordCriteria.length,
    passwordCriteria.uppercase,
    passwordCriteria.lowercase,
    passwordCriteria.number,
    termsAccepted
  ]);

  const validateForm = (): string => {
    if (!name) {
      return "Name is required.";
    }
    
    if (!email) {
      return "Email is required.";
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

  const registerNewUser = async (name: string, email: string, password: string) => {
    const payload = {
      name,
      email,
      password,
    }
    try {
      const response = await fetch(`${conf.apiUrl}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload)
      });
      
      return response.json();
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  }

  const loginAfterRegistration = async (email: string, password: string) => {
    const payload = {
      email,
      password,
    }
    try {
      const response = await fetch(`${conf.apiUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload)
      });
      
      return response.json();
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  const handleSubmit = async(e: FormEvent): Promise<void> => {
    e.preventDefault();
  
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
      terms: true,
    });
  
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      alert(validationError);
      return;
    }

    setIsLoading(true);

    try {
      await registerNewUser(name, email, password);

      try {
        await loginAfterRegistration(email, password);
        alert("Registration successful!");
        navigate("/");
      } catch(loginError) {
        alert("Registration successful! Please try to log in again");
        navigate("/");
      } 
    }  catch (registerError: any) {
      // Registration failed
      setError(registerError.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleNameChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setName(value);
    setTouched({ ...touched, name: true });
    
    if (!value) {
      setError("Name is required.");
    } else {
      setError("");
    }
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setEmail(value);
    setTouched({ ...touched, email: true });
    setError("");
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setPassword(value);
    setTouched({ ...touched, password: true });
    validatePassword(value);
  };

  const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setConfirmPassword(e.target.value);
    setTouched({ ...touched, confirmPassword: true });
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setTermsAccepted(e.target.checked);
    setTouched({ ...touched, terms: true });
    
    if (!e.target.checked && touched.terms) {
      setError("You must accept the terms and conditions to register.");
    } else {
      setError("");
    }
  };

  const handleNameBlur = (): void => {
    setTouched({ ...touched, name: true });
    if (!name) {
      setError("Name is required.");
    }
  };

  const handleEmailBlur = (): void => {
    setTouched({ ...touched, email: true });
    if (!email) {
      setError("Email is required.");
    }
  };

  const handlePasswordBlur = (): void => {
    setTouched({ ...touched, password: true });
    if (!password) {
      setError("Password is required.");
    } else if (!passwordCriteria.length || !passwordCriteria.uppercase || 
      !passwordCriteria.lowercase || !passwordCriteria.number) {
      setError("Password must meet all the required criteria.");
    }
  };

  const handleConfirmPasswordBlur = (): void => {
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
                      {/* Name field */}
                      <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                        <div className="_social_registration_form_input _mar_b14">
                          <label
                            className="_social_registration_label _mar_b8"
                            htmlFor="name"
                          >
                            Name
                          </label>
                          <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={handleNameChange}
                            onBlur={handleNameBlur}
                            className={`form-control _social_registration_input ${touched.name && !name ? "is-invalid" : ""}`}
                            required
                          />
                          {touched.name && !name && (
                            <div className="invalid-feedback" style={{ display: "block", color: "#dc3545" }}>
                              Name is required
                            </div>
                          )}
                        </div>
                      </div>
                      
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
                          Already have an account? <a href="#0" onClick={() => navigate("/")}>Login here</a>
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