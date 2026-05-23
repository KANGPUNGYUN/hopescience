import React from "react";
import "./Home.css";
import {
  Header,
  Footer,
  AdPopup,
  HomeFaq,
  MainBanner,
  HomeEducationPrograms,
  HomeTrustedSystem,
  HomeWhyHopeScience,
  HomeCertificateShowcase,
  HomeSimpleProcess,
  HomeUserReviews,
  HomeEducationOperations,
  HomeCtaBanner,
  HomeContact,
} from "../../components";
import ad02Image from "../../images/ad-02.png";
import { useState, useEffect } from "react";

const ads = [
  {
    id: 1,
    title: "광고 1",
    imageUrl: ad02Image,
    url: "http://lknike.com/crim1/",
  },
];

export const Home = () => {
  const [visibleAds, setVisibleAds] = useState([]);

  useEffect(() => {
    const filteredAds = ads.filter((ad) => {
      const hideUntil = localStorage.getItem(`hideAd_${ad.id}`);
      return !hideUntil || new Date(hideUntil) < new Date();
    });
    setVisibleAds(filteredAds);
  }, []);

  const closeAd = (adId) => {
    setVisibleAds(visibleAds.filter((ad) => ad.id !== adId));
  };

  const hideAdForWeek = (adId) => {
    const hideUntil = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000);
    localStorage.setItem(`hideAd_${adId}`, hideUntil.toISOString());
    closeAd(adId);
  };

  return (
    <>
      {visibleAds.map((ad) => (
        <AdPopup
          key={ad.id}
          ad={ad}
          position={ad.id}
          onClose={() => closeAd(ad.id)}
          onHideForWeek={() => hideAdForWeek(ad.id)}
          url={ad.url}
        />
      ))}
      <Header variant="light" />
      <MainBanner />
      <HomeEducationPrograms />
      <HomeTrustedSystem />
      <HomeWhyHopeScience />
      <HomeCertificateShowcase />
      <HomeSimpleProcess />
      <HomeUserReviews />
      <HomeFaq />
      <HomeEducationOperations />
      <HomeCtaBanner />
      <HomeContact />
      <Footer variant="light" />
    </>
  );
};
