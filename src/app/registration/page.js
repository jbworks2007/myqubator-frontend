"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn, getSession } from "next-auth/react";
import Image from "next/image";
import logo from "../../../public/full-logo-dark.png";
import { FaApple, FaGoogle } from "react-icons/fa";
import Link from "next/link";
import toast from "react-hot-toast";
import validator from "validator";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import OtpInput from "react-otp-input";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
import Nondisclosure from "../non-disclosure/page";

export default function Home() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [otp, setOtp] = useState("");
  const [condition, setCondition] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showNDA, setShowNDA] = useState(false);

  const validated = async () => {
    if (!name) {
      toast.error("please provide proper name");
      return false;
    } else if (!surname) {
      toast.error("please provide proper last name");
      return false;
    } else if (!email) {
      toast.error("please provide proper email");
      return false;
    } else if (!validator.isEmail(email)) {
      toast.error("invalid email");
      return false;
    } else if (!phone) {
      toast.error("please provide proper phone");
      return false;
    } else if (phone.length < 10) {
      toast.error("invalid phone number");
      return false;
    } else if (!password) {
      toast.error("please provide a password");
      return false;
    } else if (!condition) {
      toast.error("please accept terms & condition");
      return false;
    } else if (!(password === confirm)) {
      toast.error("password mismatch");
      return false;
    } else {
      return true;
    }
  };

  useEffect(() => {
    console.log("condition : ", condition);
  }, [condition]);

  const SERVER_API_URL = process.env.NEXT_PUBLIC_APP_SERVER_API;
  // process.env.NEXT_PUBLIC_APP_SERVER_API || "http://localhost:4000";

  const sendEmailtoAdmin = (c_name, c_email) => {
    console.log("Email sending to Admin in process");
    console.log("name email : ", c_name, c_email);
    axios
      .post(SERVER_API_URL + "/api/email/sendemail", {
        customer_name: c_name,
        customer_email: c_email,
      })
      .then(function (response) {
        if (response?.data.status == 200) console.log(response?.data.message);
        else {
          console.log(response?.data);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleSignUp = async () => {
    // e.preventDefault();
    if (await validated()) {
      console.log("SignUp called");
      setLoading(!loading);
      //Registering the user
      await axios
        .post(SERVER_API_URL + "/api/auth/signup", {
          name: name + " " + surname,
          email: email,
          phone: phone,
          pass: password,
          role: "user",
        })
        .then(function (response) {
          console.log(response);
          setLoading(false);
          if (response?.data.status == 200) {
            // send otp to user
            sendOtptoEmail();
            toast.success("Registration sucessful!");
            sendEmailtoAdmin(
              response?.data.user.name,
              response?.data.user.email
            );
          } else {
            // else resp status 400
            toast.error(response?.data.message);
            // setCondition(false);
          }
        })
        .catch(function (error) {
          setLoading(false);
          console.log(error);
          toast.error("Oops! Something went wrong!");
        });
    }
  };

  const sendOtptoEmail = async () => {
    setLoading(!loading);
    console.log("Email sending in process");
    await axios
      .post(SERVER_API_URL + "/api/auth/send-otp-email", {
        email: email,
      })
      .then(function (response) {
        setLoading(false);
        console.log(response);
        toast.success("Please check your email for otp");
        setShowModal(!showModal);
      })
      .catch(function (error) {
        setLoading(false);
        console.log(error);
        toast.error("Oops! Something went wrong!");
      });
  };

  // const handleOauthRegistration = async (e, loginProvider) => {
  //   e.preventDefault();
  //   console.log("login handle value : ", loginProvider);

  //   let res;
  //   if (loginProvider && loginProvider === "apple") {
  //     console.log("apple provider called");
  //   } else if (loginProvider && loginProvider === "google") {
  //     res = await signIn("google");
  //     console.log("google resp : ", rep);
  //   } else {
  //     console.log("loginProvider not found", loginProvider);
  //   }

  //   console.log("login response", res);
  //   if (res?.error) {
  //     // Invalid Crendentials
  //     alert(res.error);
  //   } else {
  //     // Handle Registration of Oauth
  //     console.log("session on login :", session);
  //     console.log("session.user :", session?.user);
  //     console.log("session.user.role :", session?.user?.role);
  //     console.log("final resp ; ", res);
  //   }
  // };

  const handleOtpVerification = async () => {
    console.log("Otp verification started");
    setLoading(!loading);
    // console.log("email otp ", email, otp);
    await axios
      .post(SERVER_API_URL + "/api/auth/verify", {
        email: email,
        otp: otp,
      })
      .then(function (response) {
        setLoading(false);
        console.log(response);
        if (response.data?.status == 200) {
          toast.success("Verified Successfully!");
          setShowModal(false);
          router.replace("/");
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

  // useEffect(() => {
  //   console.log("otp : ", otp);
  // }, [otp]);

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="">
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
                {/* <div className="mt-5">
                    <div className="d-center gap-5">
                      <div className="">
                        <button className="btn btn-pill" role="button">
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
                      <div className="">
                        <button
                          className="btn btn-pill"
                          role="button"
                          onClick={(e) => handleOauthRegistration(e, "google")}
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

                  <div className="mt-2 text-center">
                    <div className="text-green">
                      <b>or</b>
                    </div>
                  </div> */}

                <div className="mt-3">
                  <div className="row g-4">
                    <div className="col-md-6">
                      <div className="text-start">
                        <div className="ms-2 fs-16">first name</div>
                        <input
                          className="input-one"
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="text-start">
                        <div className="ms-2 fs-16">last name</div>
                        <input
                          className="input-one"
                          onChange={(e) => setSurname(e.target.value)}
                        />
                      </div>
                    </div>
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
                        <div className="ms-2 fs-16">phone</div>
                        <PhoneInput
                          className="phone-input"
                          country={"ae"}
                          enableSearch={true}
                          value={phone}
                          onChange={(phone) => setPhone(phone)}
                        />
                        {/* <input
                          className="input-one"
                          onChange={(e) => setPhone(e.target.value)}
                        /> */}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="text-start">
                        <div className="ms-2 fs-16">password</div>
                        <input
                          type="password"
                          className="input-one"
                          style={{ fontFamily: "cursive" }}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="text-start">
                        <div className="ms-2 fs-16">confirm password</div>
                        <input
                          type="password"
                          className="input-one"
                          style={{ fontFamily: "cursive" }}
                          onChange={(e) => setConfirm(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value=""
                        onClick={(e) => setCondition(!condition)}
                      />
                      <div className="text-start form-check-label">
                        I agree to the{" "}
                        <span
                          className="text-green"
                          role="button"
                          onClick={() => setShowNDA(!showNDA)}
                        >
                          NDA terms and conditions
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 text-center">
                    <div className="">
                      <button
                        className="btn btn-beta w-100"
                        onClick={handleSignUp}
                      >
                        Create an account
                      </button>
                    </div>
                    <div className="mt-2">
                      <div className="">
                        already have an account?{" "}
                        <Link className="tdn" href="/">
                          <b className="link-one">login</b>.
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
      {/* VERIFICATION & OTP MODAL */}
      <Modal show={loading} centered backdrop="static" size="sm">
        <Modal.Body>
          <div className="text-center">
            <span className="loader"></span>
            <p>please wait...</p>
          </div>
        </Modal.Body>
      </Modal>
      <Modal show={showModal} centered onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <div className="fs-22">User Verification</div>
        </Modal.Header>
        <Modal.Body>
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
                // renderSeparator={<span>  </span>}
                renderInput={(props) => <input {...props} />}
              />
            </div>
            {/* <input
            className="input-one"
            onChange={(e) => setEmail(e.target.value)}
          /> */}
            {/* <input
              className="input-one"
              type="number"
              maxlength="6"
              onChange={(e) => setOtp(e.target.value)}
            /> */}
            <div className="my-3">
              <button className="btn btn-pill" onClick={handleOtpVerification}>
                submit
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      {/* NDA MODAL */}
      <Modal show={showNDA} fullscreen onHide={() => setShowNDA(false)}>
        <Modal.Header closeButton>
          <Modal.Title className="px-5" style={{ width: "100%" }}>
            <div className="row align-items-center g-2">
              <div className="col-md-6 col-lg-4">
                <div className="mob-adj">
                  <Link href="https://myqubator.com">
                    <Image src={logo} alt="dark-logo" width={200} />
                  </Link>
                </div>
              </div>
              <div className="col-md-6 col-lg-4">
                <div className="text-center">NON-DISCLOSURE AGREEMENT</div>
              </div>
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Nondisclosure />
        </Modal.Body>
      </Modal>
    </>
  );
}
