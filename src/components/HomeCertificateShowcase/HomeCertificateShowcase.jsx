import React from "react";
import "./HomeCertificateShowcase.css";
import bannerBg from "../../images/v2/banner.png";
import { CertificateMarqueeRow } from "./CertificateMarqueeRow";
import {
  HOME_CERTIFICATE_SECTION,
  HOME_CERTIFICATE_ROW_TOP,
  HOME_CERTIFICATE_ROW_BOTTOM,
} from "./homeCertificateConfig";

export const HomeCertificateShowcase = () => {
  const { label, titleLines, description } = HOME_CERTIFICATE_SECTION;

  return (
    <section className="home-cert-showcase" aria-labelledby="home-cert-showcase-title">
      <img
        className="home-cert-showcase__bg"
        src={bannerBg}
        alt=""
        aria-hidden
      />
      <div className="home-cert-showcase__inner">
        <header className="home-cert-showcase__header">
          <p className="home-cert-showcase__label">{label}</p>
          <h2 id="home-cert-showcase-title" className="home-cert-showcase__title">
            {titleLines.map((line, index) => (
              <React.Fragment key={line}>
                {line}
                {index < titleLines.length - 1 && <br />}
              </React.Fragment>
            ))}
          </h2>
          <p className="home-cert-showcase__desc">{description}</p>
        </header>

        <div className="home-cert-showcase__marquee">
          <CertificateMarqueeRow
            items={HOME_CERTIFICATE_ROW_TOP}
            direction="right"
            row="top"
          />
          <CertificateMarqueeRow
            items={HOME_CERTIFICATE_ROW_BOTTOM}
            direction="left"
            row="bottom"
          />
        </div>
      </div>
      <div className="home-cert-showcase__fade" aria-hidden />
    </section>
  );
};
