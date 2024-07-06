import Banner from "./Banner/banner";
import AllProducts from "./Product/allproducts";
import CategoryNav from "./navbar";

const Home = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Banner />
      <div className="container md:contain-none">
        {" "}
        <CategoryNav />
      </div>

      <main className="container mx-auto min-h-full px-4 py-8">
        <section>
          <AllProducts />
        </section>
      </main>
    </div>
  );
};

export default Home;
