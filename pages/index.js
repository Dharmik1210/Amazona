import axios from 'axios';
import SearchIcon from '@mui/icons-material/Search';
import { Router } from 'next/router';
//import Signin from '../components/Signin';
import { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
//import { useSession } from 'next-auth/react';
import Layout from '../components/Layout';
import ProductItem from '../components/Productitem';
import WithSpinner from '../components/Spinner/WithSpinner';
import Product from '../models/Product';
import db from '../utils/db';
import { Store } from '../utils/Store';

export default function Home({ products }) {
  const [keyword, setKeyword] = useState('');

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(keyword) ||
      product.category.toLowerCase().includes(keyword) ||
      product.brand.toLowerCase().includes(keyword)
  );

  const onInputChange = (e) => {
    e.preventDefault();
    setKeyword(e.target.value.toLowerCase());
  };
  const { state, dispatch } = useContext(Store);
  const { cart } = state;

  const addToCartHandler = async (product) => {
    const existItem = cart.cartItems.find((x) => x.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);

    if (data.countInStock < quantity) {
      return toast.error('Sorry. Product is out of stock');
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });

    toast.success('Product added to the cart');
  };

  const [isLoading, setLoading] = useState(false);
  const startLoading = () => setLoading(true);
  const stopLoading = () => setLoading(false);

  useEffect(() => {
    //After the component is mounted set router event handlers
    Router.events.on('routeChangeStart', startLoading);
    Router.events.on('routeChangeComplete', stopLoading);

    return () => {
      Router.events.off('routeChangeStart', startLoading);
      Router.events.off('routeChangeComplete', stopLoading);
    };
  }, []);

  let content = null;
  if (isLoading)
    content = (
      <div>
        <WithSpinner />
      </div>
    );
  else {
    //Generating posts list
    content = (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {filteredProducts.map((product) => (
          <ProductItem
            product={product}
            key={product.slug}
            addToCartHandler={addToCartHandler}
          ></ProductItem>
        ))}
      </div>
    );
  }

  // const { data: session } = useSession();
  // if (!session) return <Signin />;

  return (
    <Layout title="Home Page" products={products}>
      <div className="mb-2 flex justify-end">
        <div className=" border-blue-400 border-2 rounded-md">
          <label>
            <SearchIcon color="inherit" />
            {/* <span className="text-lg">Search: </span> */}

            <input
              type="text"
              placeholder="Search Product"
              onChange={onInputChange}
              className="focus:ring-0 focus:ring-offset-0 w-56 border-none"
            ></input>
          </label>
        </div>
      </div>

      {content}
    </Layout>
  );
}

export async function getServerSideProps() {
  await db.connect();
  const products = await Product.find().lean();
  return {
    props: {
      products: products.map(db.convertDocToObj),
    },
  };
}
