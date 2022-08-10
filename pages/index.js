//import Head from 'next/head';
import data from '../utils/data';
import Layout from '../components/Layout';
import Productitem from '../components/Productitem';
// import Image from 'next/image';
//import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <Layout title="home page">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {data.products.map((product) => (
          <Productitem product={product} key={product.slug}></Productitem>
        ))}
      </div>
    </Layout>
  );
}
