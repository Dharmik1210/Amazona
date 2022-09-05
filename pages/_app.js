import '../styles/globals.css';
import { SessionProvider, useSession } from 'next-auth/react';
import { StoreProvider } from '../utils/Store';
import { useRouter } from 'next/router';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
//import WithSpinner from '../components/Spinner/WithSpinner';
//import { useEffect, useState } from 'react';
//import ProductItem from '../components/Productitem';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  //const [isLoading, setLoading] = useState(false);
  // const startLoading = () => setLoading(true);
  // const stopLoading = () => setLoading(false);

  // useEffect(() => {
  //   //After the component is mounted set router event handlers
  //   Router.events.on('routeChangeStart', startLoading);
  //   Router.events.on('routeChangeComplete', stopLoading);

  //   return () => {
  //     Router.events.off('routeChangeStart', startLoading);
  //     Router.events.off('routeChangeComplete', stopLoading);
  //   };
  // }, []);

  // let content = null;
  // if (isLoading)
  //   content = (
  //     <div>
  //       <WithSpinner />
  //     </div>
  //   );
  // else {
  //   //Generating posts list
  //   content = (

  //   );
  // }

  return (
    <SessionProvider session={session}>
      <StoreProvider>
        <PayPalScriptProvider deferLoading={true}>
          {Component.auth ? (
            <Auth>
              <Component {...pageProps} />
            </Auth>
          ) : (
            <Component {...pageProps} />
          )}
        </PayPalScriptProvider>
      </StoreProvider>
    </SessionProvider>
  );
}

function Auth({ children }) {
  const router = useRouter();
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/unauthorized?message=login required');
    },
  });
  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return children;
}

export default MyApp;
