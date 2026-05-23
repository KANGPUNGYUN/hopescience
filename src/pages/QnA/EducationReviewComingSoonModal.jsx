import React from "react";
import PropTypes from "prop-types";
import { AppModalAlert } from "../../modules/AppModal";
import { EDUCATION_REVIEW_COMING_SOON_MODAL } from "./educationReviewBoardConfig";

export const EducationReviewComingSoonModal = ({ isOpen, onClose }) => (
  <AppModalAlert
    title={EDUCATION_REVIEW_COMING_SOON_MODAL.title}
    message={EDUCATION_REVIEW_COMING_SOON_MODAL.message}
    isOpen={isOpen}
    onClose={onClose}
  />
);

EducationReviewComingSoonModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
