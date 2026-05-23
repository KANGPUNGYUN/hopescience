import React, { useState } from "react";
import "./HomeContact.css";
import contactBg from "../../images/v2/banner06.png";
import { useCounselingStore } from "../../store";
import {
  HOME_CONTACT_FORM,
  HOME_CONTACT_INFO,
} from "./homeContactConfig";
import {
  ContactCheckIcon,
  ContactInfoIcon,
} from "./HomeContactIcons";

export const HomeContact = () => {
  const counseling = useCounselingStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [content, setContent] = useState("");
  const [privacyAgreed, setPrivacyAgreed] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name.trim()) {
      alert("이름을 입력해주세요.");
      return;
    }
    if (!phone.trim()) {
      alert("연락처를 입력해주세요.");
      return;
    }
    if (!content.trim()) {
      alert("문의 내용을 입력해주세요.");
      return;
    }
    if (!privacyAgreed) {
      alert("개인정보 수집 및 이용에 동의해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      const success = await counseling.createCounseling(
        name.trim(),
        "",
        phone.trim(),
        content.trim()
      );

      if (success) {
        alert("상담문의가 정상적으로 접수되었습니다.");
        setName("");
        setPhone("");
        setContent("");
        setPrivacyAgreed(false);
      } else {
        alert("상담문의 등록에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("상담문의 등록 실패:", error);
      alert("상담문의 등록 중 오류가 발생했습니다. 다시 시도해주세요.");
    }

    setIsSubmitting(false);
  };

  const { label, title, description, items } = HOME_CONTACT_INFO;
  const { title: formTitle, privacyLabel, submitLabel, submittingLabel } =
    HOME_CONTACT_FORM;

  return (
    <section className="home-contact" aria-labelledby="home-contact-form-title">
      <div className="home-contact__info">
        <img className="home-contact__info-bg" src={contactBg} alt="" aria-hidden />
        <div className="home-contact__info-inner">
          <p className="home-contact__label">{label}</p>
          <h2 className="home-contact__info-title">{title}</h2>
          <p className="home-contact__info-desc">{description}</p>
          <ul className="home-contact__info-list">
            {items.map((item) => (
              <li key={item.id} className="home-contact__info-item">
                <div className="home-contact__info-item-head">
                  <ContactInfoIcon
                    type={item.id}
                    className="home-contact__info-icon"
                  />
                  <span className="home-contact__info-item-label">
                    {item.label}
                  </span>
                </div>
                {item.href ? (
                  <a className="home-contact__info-value" href={item.href}>
                    {item.value}
                  </a>
                ) : (
                  <p className="home-contact__info-value">{item.value}</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="home-contact__form-panel">
        <form className="home-contact__form" onSubmit={handleSubmit} noValidate>
          <h2 id="home-contact-form-title" className="home-contact__form-title">
            {formTitle}
          </h2>

          <div className="home-contact__form-row">
            <label className="home-contact__field">
              <span className="home-contact__field-label">이름*</span>
              <input
                type="text"
                className="home-contact__input"
                placeholder="이름*"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                required
              />
            </label>
            <label className="home-contact__field">
              <span className="home-contact__field-label">연락처*</span>
              <input
                type="tel"
                className="home-contact__input"
                placeholder="연락처*"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoComplete="tel"
                required
              />
            </label>
          </div>

          <label className="home-contact__field home-contact__field--message">
            <span className="home-contact__field-label">문의 내용*</span>
            <textarea
              className="home-contact__textarea"
              placeholder="문의 내용*"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              required
            />
          </label>

          <label className="home-contact__privacy">
            <input
              type="checkbox"
              className="home-contact__privacy-input"
              checked={privacyAgreed}
              onChange={(e) => setPrivacyAgreed(e.target.checked)}
            />
            <span className="home-contact__privacy-box" aria-hidden>
              <ContactCheckIcon className="home-contact__privacy-check" />
            </span>
            <span className="home-contact__privacy-text">{privacyLabel}</span>
          </label>

          <button
            type="submit"
            className="home-contact__submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? submittingLabel : submitLabel}
          </button>
        </form>
      </div>
    </section>
  );
};
