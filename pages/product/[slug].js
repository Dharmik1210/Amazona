import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import { toast } from 'react-toastify';
import Layout from '../../components/Layout';
import Product from '../../models/Product';
import db from '../../utils/db';
import { Store } from '../../utils/Store';

export default function ProductScreen(props) {
  const { product } = props;
  const { state, dispatch } = useContext(Store);
  const router = useRouter();
  if (!product) {
    return <Layout title="Produt Not Found">Produt Not Found</Layout>;
  }

  const addToCartHandler = async () => {
    const existItem = state.cart.cartItems.find((x) => x.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);

    if (data.countInStock < quantity) {
      return toast.error('Sorry. Product is out of stock');
    }

    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
    router.push('/cart');
  };

  return (
    <Layout title={product.name}>
      <div className="py-2 ">
        <Link href="/"> back to products</Link>
      </div>
      <div className="grid md:grid-cols-4 md:gap-3">
        <div className="md:col-span-2">
          <Image
            src={product.image}
            alt={product.name}
            width={640}
            height={640}
            layout="responsive"
          ></Image>
        </div>
        <div>
          <ul>
            <li>
              <h1 className="text-lg">{product.name}</h1>
            </li>
            <li>Category: {product.category}</li>
            <li>Brand: {product.brand}</li>
            <li>
              <div className="flex items-center">
                <svg
                  aria-hidden="true"
                  className="w-5 h-5 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>Rating star</title>
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                <p className="ml-2 text-sm font-bold text-gray-900 dark:text-white">
                  {product.rating}
                </p>
                <span className="w-1 h-1 mx-1.5 bg-gray-500 rounded-full dark:bg-gray-400"></span>
                <a
                  // href="#"
                  className="text-sm font-medium text-gray-900   dark:text-white"
                >
                  {product.numReviews} reviews
                </a>
              </div>
            </li>
            <li>Description: {product.description}</li>
          </ul>
        </div>
        <div>
          <div className="card p-5">
            <div className="mb-2 flex justify-between">
              <div>Price</div>
              <div>₹{product.price}</div>
            </div>
            <div className="mb-2 flex justify-between">
              <div>Status</div>
              <div>{product.countInStock > 0 ? 'In stock' : 'Unavailable'}</div>
            </div>
            <button
              className="primary-button w-full"
              onClick={addToCartHandler}
            >
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const { params } = context;
  const { slug } = params;

  await db.connect();
  const product = await Product.findOne({ slug }).lean();
  await db.disconnect();
  return {
    props: {
      product: product ? db.convertDocToObj(product) : null,
    },
  };
}
