import React from "react";

const News = () => {
  const hardcodedNews = [
    {
      title: "Climate Change and Its Impact on Global Agriculture",
      description:
        "As temperatures rise and weather patterns shift, global agriculture is facing unprecedented challenges.",
      url: "https://en.wikipedia.org/wiki/Effects_of_climate_change_on_agriculture",
      urlToImage:
        "https://khetigaadi.com/blog/wp-content/uploads/2018/07/Effect-of-Climate-Change-on-Agriculture.jpg",
    },
    {
      title: "New Discovery in Renewable Energy",
      description:
        "Renewable energy (or green energy) is energy from renewable natural resources that are replenished on a human timescale.",
      url: "https://en.wikipedia.org/wiki/Renewable_energy",
      urlToImage:
        "https://cisp.cachefly.net/assets/articles/images/resized/0001085446_resized_windturbinewithsolarpanelsandsunset1022.jpg"
    },
    {
      title: "India's Push for Sustainable Development",
      description:
        "Sustainable development is an approach to growth and human development that aims to meet the needs of the present without compromising the ability of future generations to meet their own needs.",
      url: "https://en.wikipedia.org/wiki/Sustainable_development",
      urlToImage:
        "https://reportyak.com/wp-content/uploads/2024/05/Sustainable-Development-Index-Report-Yak-Blog.webp",
    },
    {
      title: "Oceans Are Heating Up at an Alarming Rate",
      description:
        "Recent studies show that the world's oceans are absorbing heat faster than expected, leading to ecological changes.",
      url: "https://www.unesco.org/en/articles/new-unesco-report-rate-ocean-warming-doubled-20-years-rate-sea-level-rise-doubled-30-years",
      urlToImage:
        "https://www.unesco.org/sites/default/files/styles/best_image/article/2024-07/shutterstock_2285640349%20%281%29.jpg?itok=PA7PoR7Z",
    },
    {
      title: "The Future of Blockchain Technology",
      description:
        "Blockchain is undoubtedly one of the biggest inventions of the 21st century. More than just a buzzword, this technology has proven to be of practical significance with custom blockchain development taking center stage across various industries. ",
      url: "https://crustlab.com/blog/what-is-the-future-of-blockchain/",
      urlToImage:
        "https://blogs.iadb.org/caribbean-dev-trends/wp-content/uploads/sites/34/2017/12/Blockchain1.jpg",
    },
    {
      title: "The Future of Electric Vehicles in India",
      description:
        "Electric vehicles are becoming more popular in India, and the government is making moves to support their adoption.",
      url: "https://www.investindia.gov.in/team-india-blogs/indias-ev-economy-future-automotive-transportation",
      urlToImage:
        "https://poonawallafincorp.com/pfca/assets/blog_banner/blog_banner-electric-vehicle-in-india-desktop.jpg",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-white">Latest News</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hardcodedNews.map((article, index) => (
          <div
            key={index}
            className="bg-[#2c2f32] rounded-lg overflow-hidden shadow-md"
          >
            {article.urlToImage && (
              <img
                src={article.urlToImage}
                alt="Article"
                className="w-full h-40 object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="text-lg text-green-300 font-semibold mb-2">
                {article.title}
              </h3>
              <p className="text-sm text-white mb-4">{article.description}</p>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-400 hover:underline"
              >
                Read more
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default News;
