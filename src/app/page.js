"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { signIn, getSession } from "next-auth/react";
import Image from "next/image";
import logo from "../../public/full-logo-dark.png";
import { FaApple, FaGoogle } from "react-icons/fa";
import Link from "next/link";
import toast from "react-hot-toast";
import validator from "validator";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import OtpInput from "react-otp-input";

export default function page() {
  const { data: session, status } = useSession();
  // console.log("session data :", session?.user);

  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgetEmail, setForgetEmail] = useState("");
  const [otp, setOtp] = useState(0);
  const [sendingStatus, setSendingStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPassModal, setShowPassModal] = useState(false);
  const [pass, setPass] = useState("");
  const [confirm, setConfirm] = useState("");

  const validated = async () => {
    if (!email) {
      toast.error("please provide proper email");
      return false;
    } else if (!validator.isEmail(email)) {
      toast.error("please provide proper email");
      return false;
    } else if (!password) {
      toast.error("please provide a password");
      return false;
    } else {
      return true;
    }
  };

  const SERVER_API_URL = process.env.NEXT_PUBLIC_APP_SERVER_API;

  // const sendEmailtoAdmin = async (username, useremail) => {
  //   await axios
  //     .post(SERVER_API_URL + "/api/email/sendemail", {
  //       name: username,
  //       email: useremail,
  //     })
  //     .then(function (response) {
  //       console.log(response);
  //     })
  //     .catch(function (error) {
  //       console.log(error);
  //     });
  // };

  const sendOtptoEmail = async () => {
    // if (!forgetEmail) {
    //   toast.error("please provide proper email");
    //   return;
    // }

    if (!validator.isEmail(forgetEmail)) {
      toast.error("please provide proper email");
    } else {
      setShowEmailModal(false);
      setLoading(!loading);
      console.log("Otp Email sending in process");
      await axios
        .post(SERVER_API_URL + "/api/auth/send-otp-email", {
          email: forgetEmail,
        })
        .then(function (response) {
          setLoading(false);
          console.log(response);
          toast.success("Please check your email for otp");
          setSendingStatus(true);
          setShowEmailModal(true);
        })
        .catch(function (error) {
          setLoading(false);
          console.log(error);
          toast.error("Oops! Something went wrong!");
        });
    }
  };

  const handleOtpVerification = async () => {
    console.log("Otp verification started");
    setLoading(!loading);
    // console.log("email otp ", email, otp);
    await axios
      .post(SERVER_API_URL + "/api/auth/verify", {
        email: forgetEmail,
        otp: otp,
      })
      .then(function (response) {
        setLoading(false);
        console.log(response);
        if (response.data?.status == 200) {
          toast.success("Verified Successfully!");
          setShowEmailModal(false);
          setShowPassModal(true);
        } else {
          toast.error(response.data?.message);
        }
      })
      .catch(function (error) {
        setLoading(false);
        console.log(error);
        toast.error("Oops! Something went wrong!");
      });
  };

  const changePass = async () => {
    setLoading(!loading);
    if (!(pass === confirm)) {
      setLoading(false);
      toast.error("Password mismatch");
    } else {
      await axios
        .post(SERVER_API_URL + "/api/auth/change-password", {
          email: forgetEmail,
          password: pass,
        })
        .then(function (response) {
          setLoading(false);
          setShowPassModal(false);
          console.log(response);
          if (response.data?.status == 200) {
            toast.success(response.data.message);
          } else {
            toast.error(response.data?.message);
          }
        })
        .catch(function (error) {
          setLoading(false);
          setShowPassModal(false);
          console.log(error);
          toast.error("Oops! Something went wrong!");
        });
    }
  };

  const handleLogin = async (e, loginProvider) => {
    e.preventDefault();
    console.log("login handle value : ", loginProvider);

    let res;
    if (loginProvider && loginProvider === "apple") {
      res = await signIn("apple", {
        redirect: true,
        callbackUrl: "/user",
      });
    } else if (loginProvider && loginProvider === "google") {
      res = await signIn("google", {
        redirect: true,
        callbackUrl: "/user",
      });
      console.log("google rep : ", res);
    } else if (loginProvider && loginProvider === "credentials") {
      if (await validated()) {
        setLoading(!loading);
        res = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });
      }
      setLoading(false);
      console.log("login response", res);
      if (!res) {
        toast.error("Please provide crendentials");
      } else if (res?.error) {
        // Invalid Crendentials // not found // not verified
        toast.error(res.error);
      } else {
        // Handle Successful Login
        toast.success("login successful!");
        const session = await getSession();
        console.log("session on login :", session);
        // console.log("session.user :", session?.user);
        // console.log("session.user.name :", session?.user?.name);
        // await sendEmailtoAdmin(session?.user?.name, session?.user?.email);
        session?.user?.role === "admin"
          ? router.replace("/admin")
          : router.replace("/user");
      }
    }
  };

  if (status === "authenticated") {
    session?.user?.role === "admin"
      ? router.replace("/admin")
      : router.replace("/user");
  }

  return (
    <>
      <div className="container">
        <div className="row justify-content-center">
          <div className="mt-3 px-3">
            <div className="mt-3 text-center">
              <Link href="https://myqubator.com">
                <Image src={logo} alt="dark-logo" width={240} />
              </Link>
              {/* <div className="fs-10">
                you're one step closer to infinite possibilities
              </div> */}
              <div className="mt-3">
                <div className="f-npb fs-32">
                  a step towards infinite possibilities.
                </div>
                <div className="fs-24">
                  join us in our mission to revolutionize the start-up
                  ecosystem.
                </div>
              </div>
            </div>

            <div className="row justify-content-center">
              <div className="col-md-12 col-lg-6">
                <div className="mt-5">
                  <div className="row justify-content-center g-3">
                    <div className="col-md-6">
                      <div className="text-center">
                        <button
                          className="btn btn-pill w-100"
                          role="button"
                          onClick={(e) => handleLogin(e, "apple")}
                        >
                          <div className="">
                            <span className="me-3">
                              <FaApple
                                size={25}
                                style={{ marginBottom: "7px" }}
                              />
                            </span>
                            <span className="fs-16">Continue with Apple</span>
                          </div>
                        </button>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="text-center">
                        <button
                          className="btn btn-pill w-100"
                          role="button"
                          onClick={(e) => handleLogin(e, "google")}
                        >
                          <div className="">
                            <span className="me-3">
                              <FaGoogle
                                size={22}
                                style={{ marginBottom: "4px" }}
                              />
                            </span>
                            <span className="fs-16">Continue with Google</span>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-3 text-center">
                  <div className="d-center">
                    <div className="line"></div>
                    <div className="text-green mx-2">
                      <b>or</b>
                    </div>
                    <div className="line"></div>
                  </div>
                </div>

                <div className="mt-2">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="text-start">
                        <div className="ms-2 fs-16">email</div>
                        <input
                          className="input-one"
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="text-start">
                        <div className="ms-2 fs-16">password</div>
                        <input
                          className="input-one"
                          type="password"
                          style={{ fontFamily: "cursive" }}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <div
                          className="ms-1 my-1 fs-16 link-one"
                          role="button"
                          onClick={() => setShowEmailModal(!showEmailModal)}
                        >
                          Forgot Password?
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* <div className="mt-3">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value=""
                      onChange={(e) => setCondition(!condition)}
                    />
                    <div className="text-start form-check-label">
                      i agree to the{" "}
                      <span className="text-green">
                        NDA terms and conditions
                      </span>
                    </div>
                  </div>
                </div> */}
                  <div className="mt-4 text-center">
                    <div className="">
                      <button
                        className="btn btn-beta w-100"
                        onClick={(e) => handleLogin(e, "credentials")}
                      >
                        Login
                      </button>
                    </div>
                    <div className="mt-2">
                      <div className="">
                        Don't have an account?{" "}
                        <Link className="tdn" href="/registration">
                          <b className="link-one">SignUp</b>.
                        </Link>{" "}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* EMAIL MODAL */}
      <Modal
        show={showEmailModal}
        centered
        onHide={() => {
          setShowEmailModal(false);
          setSendingStatus(false);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title className="">
            <h3>Forget Password</h3>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {sendingStatus ? (
            <div className="p-3 text-center">
              <p>
                Please enter the OTP, we have send to your email to verify
                yourself. Thank You!
              </p>
              <div className="d-center">
                <OtpInput
                  value={otp}
                  onChange={setOtp}
                  numInputs={6}
                  inputStyle="otp-input mx-1"
                  renderInput={(props) => <input {...props} />}
                />
              </div>
              <div className="my-3">
                <button
                  className="btn btn-pill"
                  onClick={handleOtpVerification}
                >
                  submit
                </button>
              </div>
            </div>
          ) : (
            <div className="p-3 text-center">
              <p>Please provide your email to verify yourself.</p>
              <input
                className="input-one"
                onChange={(e) => setForgetEmail(e.target.value)}
              />
              <div className="my-3">
                <button className="btn btn-pill" onClick={sendOtptoEmail}>
                  Sumbit
                </button>
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>
      {/* LOADER MODAL */}
      <Modal show={loading} centered backdrop="static" size="sm">
        <Modal.Body>
          <div className="text-center">
            <span className="loader"></span>
            <p>please wait...</p>
          </div>
        </Modal.Body>
      </Modal>
      {/* RESET PASS MODAL */}
      <Modal
        show={showPassModal}
        centered
        onHide={() => {
          setShowPassModal(false);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title className="">
            <h3>Reset Password</h3>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="p-3">
            <div className="my-2">
              <div>Enter Password</div>
              <input
                className="input-one"
                type="password"
                style={{ fontFamily: "cursive" }}
                onChange={(e) => setPass(e.target.value)}
              />
            </div>
            <div className="my-2">
              <div>Confirm Password</div>
              <input
                className="input-one"
                type="password"
                style={{ fontFamily: "cursive" }}
                onChange={(e) => setConfirm(e.target.value)}
              />
            </div>
            <div className="my-3 text-center">
              <button className="btn btn-pill" onClick={changePass}>
                Sumbit
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
