import React from "react";

export const CertificateMarqueeRow = ({
  items,
  direction = "right",
  row = "top",
}) => {
  const directionClass =
    direction === "left"
      ? "home-cert-showcase__rail--left"
      : "home-cert-showcase__rail--right";
  const viewportClass =
    row === "bottom"
      ? "home-cert-showcase__viewport home-cert-showcase__viewport--bottom"
      : "home-cert-showcase__viewport home-cert-showcase__viewport--top";

  return (
    <div className={viewportClass} aria-hidden>
      <div className={`home-cert-showcase__rail ${directionClass}`}>
        {items.map((item) => (
          <figure key={item.id} className="home-cert-showcase__card">
            <img
              className="home-cert-showcase__card-image"
              src={item.image}
              alt=""
            />
            <figcaption className="home-cert-showcase__card-title">
              {item.title}
            </figcaption>
          </figure>
        ))}
        {items.map((item) => (
          <figure
            key={`${item.id}-duplicate`}
            className="home-cert-showcase__card"
            aria-hidden
          >
            <img
              className="home-cert-showcase__card-image"
              src={item.image}
              alt=""
            />
            <figcaption className="home-cert-showcase__card-title">
              {item.title}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
};
