import { GetServerSideProps } from 'next';
import { ProductCard } from '../components/ProductCard';
import { SearchBar } from '../components/SearchBar';
import { API_BASE, Product } from '../services/api';
import * as Sentry from '@sentry/nextjs';

const categoryTiles = [
  ['Ethnic Wear', 'https://images.unsplash.com/photo-1610189020846-0302d496e6a5?auto=format&fit=crop&w=400&q=80'],
  ['Western', 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&q=80'],
  ['Menswear', 'https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=400&q=80'],
  ['Footwear', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80'],
  ['Home Decor', 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=400&q=80'],
  ['Beauty', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=400&q=80'],
  ['Bags', 'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=400&q=80'],
  ['Grocery', 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80']
];

export default function Home({ products }: { products: Product[] }) {
  return (
    <>
      <section className="hero">
        <div className="sale-copy">
          <p className="eyebrow">First Sunday</p>
          <h1>Maha Lab Sale</h1>
          <strong>3rd May</strong>
        </div>
        <div className="sale-offer">
          <p>Up to</p>
          <strong>70% OFF</strong>
          <span>on your first mock order</span>
        </div>
        <div className="sale-cta">
          <h2>Smart Shopping<br />Trusted by Millions</h2>
          <button>Shop Now</button>
        </div>
      </section>
      <section className="deal-strip">
        <span>↩ 7 Days Easy Return</span>
        <span>💵 Cash on Delivery</span>
        <span>🏷 Lowest Prices</span>
      </section>
      <section className="category-tiles" aria-label="Shop by category">
        {categoryTiles.map(([name, image]) => (
          <a href="#fresh-arrivals" key={name} className="category-tile">
            <img src={image} alt="" />
            <span>{name}</span>
          </a>
        ))}
      </section>
      <SearchBar />
      <div className="section-title">
        <h2 id="fresh-arrivals">Products For You</h2>
        <span>Sort by: Relevance</span>
      </div>
      <section className="product-grid">
        {products.map((product) => <ProductCard key={product.id} product={product} />)}
      </section>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const products = await fetch(`${API_BASE}/api/v1/products?page=0&limit=12`).then((res) => res.json());
    return { props: { products } };
  } catch (error) {
    Sentry.captureException(error);
    return { props: { products: [] } };
  }
};
