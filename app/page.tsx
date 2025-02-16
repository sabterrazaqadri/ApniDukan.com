import client from "@/sanity/lib/client";
import { groq } from "next-sanity";
import Hero from "./Components/Hero";
import FeaturedCategories from "./Components/FeaturedCategories";
import NewArrivals from "./Components/NewArrivals";

export default async function Home() {

  const products = await client.fetch(groq`*[_type=="product"]`, { caches: 'no-store' }) 
  console.log(products);
  
  return (
    <div className="min-h-screen">
      <Hero />
      {/* <Card/> */}
      <FeaturedCategories/>
      <NewArrivals />
    </div>
  );
}
