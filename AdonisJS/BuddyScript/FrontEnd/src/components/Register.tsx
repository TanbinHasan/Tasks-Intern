import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import conf from "../conf/conf";
import Swal from "sweetalert2";

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
  const [emailError, setEmailError] = useState<string>("");
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
    termsAccepted,
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

    if (
      !passwordCriteria.length ||
      !passwordCriteria.uppercase ||
      !passwordCriteria.lowercase ||
      !passwordCriteria.number
    ) {
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

  const registerNewUser = async (
    name: string,
    email: string,
    password: string
  ) => {
    const payload = {
      name,
      email,
      password,
    };
    try {
      const response = await fetch(`${conf.apiUrl}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();

        // Check for email already exists error
        if (
          errorData.message &&
          errorData.message.toLowerCase().includes("email") &&
          errorData.message.toLowerCase().includes("exist")
        ) {
          setEmailError(
            "Email already exists. Please use a different email address."
          );
          throw new Error(errorData.message);
        }

        throw new Error(errorData.message || "Registration failed");
      }

      return response.json();
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const loginAfterRegistration = async (email: string, password: string) => {
    const payload = {
      email,
      password,
    };
    try {
      const response = await fetch(`${conf.apiUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      return response.json();
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const handleSubmit = async (e: FormEvent): Promise<void> => {
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

      // Show validation error with SweetAlert
      Swal.fire({
        title: "Validation Error",
        text: validationError,
        icon: "warning",
        confirmButtonText: "OK",
        confirmButtonColor: "#f8bb86",
      });
      return;
    }

    setIsLoading(true);

    try {
      await registerNewUser(name, email, password);

      try {
        await loginAfterRegistration(email, password);

        // Show success message with SweetAlert
        Swal.fire({
          title: "Registration Successful",
          text: "Welcome to our platform!",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          navigate("/feed");
        });
      } catch (loginError) {
        // Show login error but successful registration
        Swal.fire({
          title: "Registration Successful",
          text: "Your account has been created, but we couldn't log you in automatically. Please log in manually.",
          icon: "success",
          confirmButtonText: "Go to Login",
          confirmButtonColor: "#28a745",
        }).then(() => {
          navigate("/");
        });
      }
    } catch (registerError: any) {
      // Registration failed
      if (emailError) {
        // Email already exists error is displayed inline - don't show SweetAlert
        // We just set the loading state to false and let the inline error show
      } else {
        // For other errors, show SweetAlert
        const errorMessage =
          registerError.message || "Registration failed. Please try again.";
        setError(errorMessage);

        Swal.fire({
          title: "Registration Failed",
          text: errorMessage,
          icon: "error",
          confirmButtonText: "Try Again",
          confirmButtonColor: "#d33",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value.replace(/^\s+|(\s)\s+/g, '$1');
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

    // Clear email-specific error when changing the value
    setEmailError("");
    setError("");
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setPassword(value);
    setTouched({ ...touched, password: true });
    validatePassword(value);
  };

  const handleConfirmPasswordChange = (
    e: ChangeEvent<HTMLInputElement>
  ): void => {
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
    } else if (
      !passwordCriteria.length ||
      !passwordCriteria.uppercase ||
      !passwordCriteria.lowercase ||
      !passwordCriteria.number
    ) {
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

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  // Toggle functions to switch visibility
  const togglePasswordVisibility = (): void => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = (): void => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <>
      <section className="_social_registration_wrapper _layout_main_wrapper">
        <div className="_shape_one">
          <img src="assets/images/shape1.svg" alt="" className="_shape_img" />
          <img
            src="assets/images/dark_shape.svg"
            alt=""
            className="_dark_shape"
          />
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
                    <img
                      src="assets/images/logo.svg"
                      alt="Logo"
                      className="_right_logo"
                    />
                  </div>
                  <p className="_social_registration_content_para _mar_b8">
                    Get Started Now
                  </p>
                  <h4 className="_social_registration_content_title _titl4 _mar_b50">
                    Registration
                  </h4>
                  <button
                    type="button"
                    className="_social_registration_content_btn _mar_b40"
                  >
                    <img
                      src="assets/images/google.svg"
                      alt="Google Icon"
                      className="_google_img"
                    />{" "}
                    <span>Register with google</span>
                  </button>
                  <div className="_social_registration_content_bottom_txt _mar_b40">
                    <span>Or</span>
                  </div>

                  {/* Error message display now handled by SweetAlert */}

                  <form
                    className="_social_registration_form"
                    onSubmit={handleSubmit}
                  >
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
                            className={`form-control _social_registration_input ${
                              touched.name && !name ? "border-warning" : ""
                            }`}
                            required
                          />
                          {touched.name && !name && (
                            <div
                              className="text-warning"
                              style={{
                                fontSize: "0.8rem",
                                marginTop: "0.25rem",
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="bi bi-exclamation-triangle-fill me-1"
                                viewBox="0 0 16 16"
                              >
                                <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                              </svg>
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
                            className={`form-control _social_registration_input ${
                              (touched.email && !email) || emailError
                                ? "border-warning"
                                : ""
                            }`}
                            required
                          />
                          {touched.email && !email && (
                            <div
                              className="text-warning"
                              style={{
                                fontSize: "0.8rem",
                                marginTop: "0.25rem",
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="bi bi-exclamation-triangle-fill me-1"
                                viewBox="0 0 16 16"
                              >
                                <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                              </svg>
                              Email is required
                            </div>
                          )}
                          {emailError && (
                            <div
                              className="text-warning"
                              style={{
                                fontSize: "0.8rem",
                                marginTop: "0.25rem",
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="bi bi-exclamation-triangle-fill me-1"
                                viewBox="0 0 16 16"
                              >
                                <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                              </svg>
                              {emailError}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="_social_registration_form_input _mar_b14">
                        <label
                          className="_social_registration_label _mar_b8"
                          htmlFor="password"
                        >
                          Password
                        </label>
                        <div className="position-relative">
                          <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={handlePasswordChange}
                            onBlur={handlePasswordBlur}
                            className={`form-control _social_registration_input ${
                              touched.password && !password
                                ? "border-warning"
                                : ""
                            }`}
                            required
                          />
                          <button
                            type="button"
                            className="btn position-absolute end-0 top-0 bg-transparent border-0"
                            onClick={togglePasswordVisibility}
                            style={{ height: "100%", padding: "0 10px" }}
                            aria-label={
                              showPassword ? "Hide password" : "Show password"
                            }
                          >
                            {showPassword ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="bi bi-eye-slash"
                                viewBox="0 0 16 16"
                              >
                                <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z" />
                                <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z" />
                                <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z" />
                              </svg>
                            ) : (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="bi bi-eye"
                                viewBox="0 0 16 16"
                              >
                                <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                                <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
                              </svg>
                            )}
                          </button>
                        </div>
                        {touched.password && !password && (
                          <div
                            className="text-warning"
                            style={{
                              fontSize: "0.8rem",
                              marginTop: "0.25rem",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-exclamation-triangle-fill me-1"
                              viewBox="0 0 16 16"
                            >
                              <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                            </svg>
                            Password is required
                          </div>
                        )}
                      </div>

                      {/* Password criteria section - improved styling */}
                      <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                        <div className="password-criteria _mar_b14">
                          <div className="criteria-item d-flex align-items-center mb-1">
                            <div
                              className={
                                passwordCriteria.length
                                  ? "text-success me-2"
                                  : "text-warning me-2"
                              }
                            >
                              {passwordCriteria.length ? (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  fill="currentColor"
                                  className="bi bi-check-circle-fill"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                                </svg>
                              ) : (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  fill="currentColor"
                                  className="bi bi-exclamation-circle"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                  <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z" />
                                </svg>
                              )}
                            </div>
                            <span
                              className={
                                passwordCriteria.length
                                  ? "text-success"
                                  : "text-warning"
                              }
                            >
                              At least 8 characters long
                            </span>
                          </div>
                          <div className="criteria-item d-flex align-items-center mb-1">
                            <div
                              className={
                                passwordCriteria.uppercase
                                  ? "text-success me-2"
                                  : "text-warning me-2"
                              }
                            >
                              {passwordCriteria.uppercase ? (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  fill="currentColor"
                                  className="bi bi-check-circle-fill"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                                </svg>
                              ) : (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  fill="currentColor"
                                  className="bi bi-exclamation-circle"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                  <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z" />
                                </svg>
                              )}
                            </div>
                            <span
                              className={
                                passwordCriteria.uppercase
                                  ? "text-success"
                                  : "text-warning"
                              }
                            >
                              At least one uppercase letter
                            </span>
                          </div>
                          <div className="criteria-item d-flex align-items-center mb-1">
                            <div
                              className={
                                passwordCriteria.lowercase
                                  ? "text-success me-2"
                                  : "text-warning me-2"
                              }
                            >
                              {passwordCriteria.lowercase ? (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  fill="currentColor"
                                  className="bi bi-check-circle-fill"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                                </svg>
                              ) : (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  fill="currentColor"
                                  className="bi bi-exclamation-circle"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                  <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z" />
                                </svg>
                              )}
                            </div>
                            <span
                              className={
                                passwordCriteria.lowercase
                                  ? "text-success"
                                  : "text-warning"
                              }
                            >
                              At least one lowercase letter
                            </span>
                          </div>
                          <div className="criteria-item d-flex align-items-center">
                            <div
                              className={
                                passwordCriteria.number
                                  ? "text-success me-2"
                                  : "text-warning me-2"
                              }
                            >
                              {passwordCriteria.number ? (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  fill="currentColor"
                                  className="bi bi-check-circle-fill"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                                </svg>
                              ) : (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  fill="currentColor"
                                  className="bi bi-exclamation-circle"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                  <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z" />
                                </svg>
                              )}
                            </div>
                            <span
                              className={
                                passwordCriteria.number
                                  ? "text-success"
                                  : "text-warning"
                              }
                            >
                              At least one number
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="_social_registration_form_input _mar_b14">
                        <label
                          className="_social_registration_label _mar_b8"
                          htmlFor="repeatPassword"
                        >
                          Repeat Password
                        </label>
                        <div className="position-relative">
                          <input
                            id="repeatPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            onBlur={handleConfirmPasswordBlur}
                            className={`form-control _social_registration_input ${
                              touched.confirmPassword &&
                              (!confirmPassword ||
                                (password &&
                                  confirmPassword &&
                                  !isPasswordMatched))
                                ? "border-warning"
                                : ""
                            }`}
                            required
                          />
                          <button
                            type="button"
                            className="btn position-absolute end-0 top-0 bg-transparent border-0"
                            onClick={toggleConfirmPasswordVisibility}
                            style={{ height: "100%", padding: "0 10px" }}
                            aria-label={
                              showConfirmPassword
                                ? "Hide password"
                                : "Show password"
                            }
                          >
                            {showConfirmPassword ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="bi bi-eye-slash"
                                viewBox="0 0 16 16"
                              >
                                <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z" />
                                <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z" />
                                <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z" />
                              </svg>
                            ) : (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="bi bi-eye"
                                viewBox="0 0 16 16"
                              >
                                <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                                <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
                              </svg>
                            )}
                          </button>
                        </div>
                        {touched.confirmPassword && !confirmPassword && (
                          <div
                            className="text-warning"
                            style={{
                              fontSize: "0.8rem",
                              marginTop: "0.25rem",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-exclamation-triangle-fill me-1"
                              viewBox="0 0 16 16"
                            >
                              <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                            </svg>
                            Please confirm your password
                          </div>
                        )}
                      </div>

                      {password && confirmPassword && (
                        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 _mar_b14">
                          <div
                            className={
                              isPasswordMatched
                                ? "text-success d-flex align-items-center"
                                : "text-warning d-flex align-items-center"
                            }
                          >
                            {isPasswordMatched ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="bi bi-check-circle-fill me-1"
                                viewBox="0 0 16 16"
                              >
                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                              </svg>
                            ) : (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="bi bi-exclamation-triangle-fill me-1"
                                viewBox="0 0 16 16"
                              >
                                <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                              </svg>
                            )}
                            <span>
                              {isPasswordMatched
                                ? "Passwords match."
                                : "Passwords do not match."}
                            </span>
                          </div>
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
                            <div
                              className="text-warning"
                              style={{
                                fontSize: "0.8rem",
                                marginTop: "0.25rem",
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="bi bi-exclamation-triangle-fill me-1"
                                viewBox="0 0 16 16"
                              >
                                <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                              </svg>
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
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <>
                                <span
                                  className="spinner-border spinner-border-sm me-2"
                                  role="status"
                                  aria-hidden="true"
                                ></span>
                                Registering...
                              </>
                            ) : (
                              "Register now"
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                  <div className="row">
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                      <div className="_social_registration_bottom_txt">
                        <p className="_social_registration_bottom_txt_para">
                          Already have an account?{" "}
                          <a href="#0" onClick={() => navigate("/")}>
                            Login here
                          </a>
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