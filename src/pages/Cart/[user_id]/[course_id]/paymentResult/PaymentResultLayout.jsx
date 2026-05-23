import React from "react";
import PropTypes from "prop-types";
import { Header, Footer } from "../../../../../components";
import "./paymentResult.css";

export const PaymentResultLayout = ({
  icon,
  title,
  subtitle,
  variant = "success",
  children,
  actions,
}) => (
  <>
    <Header variant="solid" />
    <main className="payment-result-page">
      <div className="payment-result-page__inner">
        <section className="payment-result-card" aria-labelledby="payment-result-title">
          <header
            className={`payment-result-card__header${
              variant === "fail" ? " payment-result-card__header--fail" : ""
            }`}
          >
            {icon}
            <h1 id="payment-result-title" className="payment-result-card__title">
              {title}
            </h1>
            {subtitle ? (
              <p className="payment-result-card__subtitle">{subtitle}</p>
            ) : null}
          </header>

          {children ? (
            <div className="payment-result-card__body">{children}</div>
          ) : null}

          {actions ? (
            <div className="payment-result-card__actions">{actions}</div>
          ) : null}
        </section>
      </div>
    </main>
    <Footer />
  </>
);

PaymentResultLayout.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  variant: PropTypes.oneOf(["success", "fail"]),
  children: PropTypes.node,
  actions: PropTypes.node,
};

export const PaymentResultDetails = ({ items }) => (
  <dl className="payment-result-details">
    {items.map(({ label, value, highlight }) => (
      <div
        key={label}
        className={`payment-result-details__row${
          highlight ? " payment-result-details__row--amount" : ""
        }`}
      >
        <dt>{label}</dt>
        <dd>{value ?? "-"}</dd>
      </div>
    ))}
  </dl>
);

PaymentResultDetails.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      highlight: PropTypes.bool,
    })
  ).isRequired,
};
