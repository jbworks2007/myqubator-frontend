"use client";
import React, { useState, useEffect } from "react";
import { useSession, signOut, signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import logo from "../../../public/dark-logo.png";
import { RxDashboard } from "react-icons/rx";
import { RiLogoutCircleLine, RiMenuLine } from "react-icons/ri";
import { FaUserTie } from "react-icons/fa";
import DashboardIcon from "../../assets/icons/dashboard-icon-01.png";
import LogoutIcon from "../../assets/icons/logout-icon-01.png";

export default function UserLayout({ children }) {
  const { data: session, status } = useSession();
  // console.log("session data on layout:", session?.user);

  const [show, setShow] = useState(false);

  const handleResize = () => {
    console.log("handle resize call", show);
    console.log("window innerwidth", window.innerWidth);
    if (window.innerWidth < 850) {
      setShow(false);
    } else {
      setShow(true);
    }
  };

  // useEffect(() => {
  //   console.log("onload call", show);
  //   handleResize();
  //   window.addEventListener("resize", handleResize);
  //   return () => window.removeEventListener("resize", handleResize);
  // }, []);

  return (
    <>
      <div className="topbar">
        <div className="ps-1 pe-4" style={{ lineHeight: "58px" }}>
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-center">
              <div className="m-2" onClick={() => setShow(!show)}>
                <RiMenuLine size={25} />
              </div>
              <div className="">
                <Link href="https://myqubator.com">
                  <Image src={logo} alt="dark-logo" width={200} />
                </Link>
              </div>
            </div>
            <div className="d-flex align-items-center">
              <div className="barname mx-2 d-none d-md-block">
                {<span>Hello {session?.user.name}</span>}
              </div>
              <div className="round-placeholder">
                {session?.user.image ? (
                  <Image
                    src={session?.user.image}
                    alt="user picture"
                    width={50}
                    height={50}
                  />
                ) : (
                  <FaUserTie size={30} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`sidebar ${show ? "sidebar-visible" : ""}`}
        style={{ position: "fixed" }}
      >
        <div className="ps-4 pt-5">
          <div className="">
            <div className="btn btn-sidebar" role="button">
              <Image
                src={DashboardIcon}
                alt="icon"
                width={25}
                className="mb-1"
              />
              {/* <RxDashboard size={20} className="mb-1" /> */}
              <span className="ps-3 fs-16">Dashboard</span>
            </div>
          </div>
        </div>
        <div className="ps-4 pt-4">
          <div className="">
            <div
              className="btn btn-sidebar"
              role="button"
              onClick={() => signOut()}
            >
              <Image src={LogoutIcon} alt="icon" width={25} className="mb-1" />
              {/* <RiLogoutCircleLine size={20} className="mb-1" /> */}
              <span className="ps-3 fs-16">Logout</span>
            </div>
          </div>
        </div>
      </div>

      <section
        className="workspace"
        style={{
          marginLeft: show ? "18rem" : "0.5rem",
          width: show ? "77vw" : "96vw",
        }}
      >
        {children}
      </section>
    </>
  );
}
