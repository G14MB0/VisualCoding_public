import { useContext, useEffect, useState } from "react";
import fetchApi from "../utils/request/requests.js";
import { AppContext } from "../provider/appProvider";

export default function SignInForm({ setOpenLogin }) {
  const { localServerUrl, localServerPort, setIsLogged, setToken } =
    useContext(AppContext);
  //error message
  const [message, setMessage] = useState("");

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setMessage("");
    }, 3000); // set a 5-second delay before calling setMessage('')

    return () => {
      clearTimeout(timeoutId); // clear the timeout on cleanup
    };
  }, [message]);

  function handleSubmit(e) {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    const data = {
      email: email,
      password: password,
    };

    fetchApi(
      "POST",
      localServerUrl,
      localServerPort,
      "/login/signin",
      data
    ).then(async (result) => {
      if (result.status !== 200) {
        try {
          setIsLogged(false);
          const jsonResult = await result.json();
          setMessage(jsonResult.detail);
        } catch (error) {
          setIsLogged(false);
          console.error("Error parsing JSON:", error);
          alert("error");
        }
      } else {
        const jsonResult = await result.json();
        localStorage.setItem(
          "myToken",
          JSON.stringify(jsonResult.access_token)
        );
        setToken(jsonResult.access_token);
        setTimeout(() => {
          setIsLogged(true);
        }, 200);
        setOpenLogin(false);
        setMessage("");
      }
    });
  }

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-10 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={(e) => handleSubmit(e)}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
                <div className="text-sm">
                  <p
                    href="#"
                    className="font-semibold text-indigo-600 hover:text-indigo-500"
                  >
                    Forgot password?
                  </p>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Log In
              </button>
            </div>
          </form>

          <div className="mt-10 text-center text-sm text-red-900">
            <div>{message}</div>
          </div>
        </div>
      </div>
    </>
  );
}
