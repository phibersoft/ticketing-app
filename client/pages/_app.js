import "bootstrap/dist/css/bootstrap.min.css";
import buildClient from "../api/build-client";
import Header from "../components/header";

export default function MyApp({ Component, pageProps, currentUser }) {
  return (
    <div>
      <Header currentUser={currentUser} />
      <div className={"container"}>
        <Component currentUser={currentUser} {...pageProps} />
      </div>
    </div>
  );
}

MyApp.getInitialProps = async (context) => {
  const client = buildClient(context.ctx);
  const { data } = await client.get("/api/users/currentuser");
  let pageProps;

  if (context.Component.getInitialProps) {
    pageProps = await context.Component.getInitialProps(
      context.ctx,
      client,
      data.currentUser
    );
  }

  return {
    pageProps,
    currentUser: data.currentUser,
  };
};
