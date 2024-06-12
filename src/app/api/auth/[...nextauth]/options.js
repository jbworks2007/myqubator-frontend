import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import AppleProvider from "next-auth/providers/apple";
import axios from "axios";
import sha256 from "sha256";

export const options = {
  session: {
    strategy: "jwt",
  },
  providers: [
    AppleProvider({
      clientId: process.env.APPLE_ID,
      clientSecret: process.env.APPLE_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {},
      async authorize(credentials, req) {
        let { email, password } = credentials;
        password = sha256(password);
        console.log("credentisla :", email, password);

        //This is where you need to retrieve the userdata from database
        // to verify its crendentials
        const SERVER_API_URL = process.env.NEXT_PUBLIC_APP_SERVER_API;

        let user;
        await axios
          .post(SERVER_API_URL + "/api/auth/signin", {
            email: email,
          })
          .then(function (response) {
            console.log(response?.data);
            if (response?.status == 200) {
              user = response.data?.user;
              user.token = response.data?.token;
            } else {
              return response?.message;
            }
          })
          .catch(function (error) {
            console.log(error);
            return error;
          });

        console.log("user :", user);
        if (user) {
          if (email === user.email && password === user.pass) {
            return user;
          } else {
            throw new Error("Invalid Credentials");
            // return null
          }
        } else {
          throw new Error("User not found/not verified");
        }
      },
    }),
  ],
  callbacks: {
    jwt(params, user) {
      // console.log("params : ", params);
      // console.log("user : ", user);
      //update token with role value
      if (params.user?.role) {
        params.token.role = params.user.role;
      } else {
        params.token.role = "user";
      }
      if (params.account?.provider) {
        params.token.provider = params.account.provider;
      }
      //return new token with user role value
      return params.token;
    },
    session({ session, token }) {
      // console.log("seesion : ", session);
      if (session.user) {
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.role = token.role;
        session.user.provider = token.provider;
      }
      return session;
    },
  },
  pages: {
    signIn: "/", //Need to define custom login page (if using)
    signOut: "/",
    error: "/",
  },
};
