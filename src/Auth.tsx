import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("jitunayak715@gmail.com");
  const [password, setPassword] = useState("Jitu@715");

  const handleEdgeFunction = async () => {
    try {
      const response = await fetch("/api/v1/create-account", {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${
            (
              await supabase.auth.getSession()
            ).data.session?.access_token
          }`,
        },
        method: "POST",
        body: JSON.stringify({
          email: "shikha@gmail.com",
          password: "Jitu@715",
        }),
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      console.log({ response });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  const handleLogin = async (event: any) => {
    event.preventDefault();

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: "Jitu@715",
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Check your email for the login link!");
    }
    setLoading(false);
  };

  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        // console.log(session);
      } else {
        console.log("not logged in");
      }
    });
  }, []);

  return (
    <div className="row flex flex-center">
      <div className="col-6 form-widget">
        <h1 className="header">Supabase + React</h1>
        <p className="description">
          Sign in via magic link with your email below
        </p>
        <form className="form-widget" onSubmit={handleLogin}>
          <div>
            <Input
              className="inputField"
              type="email"
              placeholder="Your email"
              value={email}
              required={true}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Your password"
              value={password}
              required={true}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <Button className={"button block"} disabled={loading}>
              {loading ? <span>Loading</span> : <span>Login</span>}
            </Button>
          </div>
        </form>

        <button className="button block" onClick={() => handleEdgeFunction()}>
          Edge function
        </button>
      </div>
    </div>
  );
}
